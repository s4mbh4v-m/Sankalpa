/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  ActivityRecord,
  ConsumptionRecord,
  ActivityTypeConfig,
  ConsumptionTypeConfig,
  LedgerTransaction,
  PointsEngineSettings,
  UserPreferences,
  IntensityLevel,
  AlcoholDrinkType,
  AppBackupData,
} from '../types';
import {
  DEFAULT_SETTINGS,
  DEFAULT_ACTIVITY_TYPES,
  DEFAULT_CONSUMPTION_TYPES,
  calculateActivityPoints,
  calculateConsumptionPoints,
  calculateAlcoholMetrics,
  calculateLedgerBalance,
  calculatePointsEarnedOnDay,
  calculatePointsSpentOnDay,
  createActivityWithTransaction,
  createConsumptionWithTransaction,
  reverseTransaction,
  validateActivityInput,
  validateConsumptionInput,
  validateAlcoholDetails,
} from '../engine/pointsEngine';
import {
  getAllFromStore,
  putIntoStore,
  deleteFromStore,
  bulkPutIntoStore,
  clearAllStores,
  loadSetting,
  saveSetting,
  STORES,
} from '../db/indexedDB';
import { generateSampleData } from '../data/sampleData';

interface ToastState {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  undoAction?: () => void;
}

interface LedgerContextType {
  // State
  activities: ActivityRecord[];
  consumptions: ConsumptionRecord[];
  transactions: LedgerTransaction[];
  settings: PointsEngineSettings;
  preferences: UserPreferences;
  isLoading: boolean;
  toast: ToastState | null;

  // Computed
  totalPointsBalance: number;
  pointsEarnedToday: number;
  pointsSpentToday: number;
  todayActivityDuration: number;
  todayCigarettesCount: number;
  todayAlcoholVolume: number;
  todayAlcoholUnits: number;
  todayAlcoholPureGrams: number;

  // Config Management
  addActivityType: (config: Omit<ActivityTypeConfig, 'id'>) => Promise<string>;
  updateActivityType: (id: string, updates: Partial<ActivityTypeConfig>) => Promise<void>;
  deleteActivityType: (id: string) => Promise<void>;
  toggleActivityTypeEnabled: (id: string) => Promise<void>;

  addConsumptionType: (config: Omit<ConsumptionTypeConfig, 'id'>) => Promise<string>;
  updateConsumptionType: (id: string, updates: Partial<ConsumptionTypeConfig>) => Promise<void>;
  deleteConsumptionType: (id: string) => Promise<void>;
  toggleConsumptionTypeEnabled: (id: string) => Promise<void>;

  // Activity Actions
  addActivity: (params: {
    typeId: string;
    durationMinutes?: number;
    repetitions?: number;
    intensity?: IntensityLevel;
    timestamp: string;
    notes?: string;
  }) => Promise<{ success: boolean; error?: string }>;

  updateActivity: (
    id: string,
    params: {
      typeId: string;
      durationMinutes?: number;
      repetitions?: number;
      intensity?: IntensityLevel;
      timestamp: string;
      notes?: string;
      recalculatePoints?: boolean;
    }
  ) => Promise<{ success: boolean; error?: string }>;

  deleteActivity: (id: string, reverseTransactionToo?: boolean) => Promise<void>;

  // Consumption Actions
  addConsumption: (params: {
    typeId: string;
    quantity: number;
    timestamp: string;
    drinkType?: AlcoholDrinkType;
    volumeMl?: number;
    abv?: number;
    brandOrType?: string;
    notes?: string;
  }) => Promise<{ success: boolean; error?: string; warning?: string }>;

  updateConsumption: (
    id: string,
    updated: Partial<ConsumptionRecord>,
    recalculatePoints?: boolean
  ) => Promise<{ success: boolean; error?: string }>;

  deleteConsumption: (id: string) => Promise<void>;

  // Transaction Ledger Actions
  editTransaction: (
    id: string,
    updates: { points?: number; description?: string; notes?: string }
  ) => Promise<{ success: boolean; error?: string }>;

  reverseTransactionAction: (id: string, reason?: string) => Promise<{ success: boolean; error?: string }>;

  deleteTransaction: (id: string) => Promise<void>;

  recalculateTransaction: (txId: string) => Promise<{ success: boolean; error?: string }>;

  // Settings & System
  updateSettings: (newSettings: PointsEngineSettings) => Promise<void>;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>;

  loadSampleDataset: () => Promise<void>;
  clearAllData: () => Promise<void>;
  exportBackupJSON: () => string;
  importBackupJSON: (
    rawJson: string,
    mode: 'merge' | 'replace'
  ) => Promise<{ success: boolean; message: string }>;

  showToast: (
    message: string,
    options?: { type?: 'success' | 'info' | 'warning' | 'error'; undoAction?: () => void }
  ) => void;
  hideToast: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  volumeUnit: 'ml',
  firstDayOfWeek: 1,
  theme: 'dark',
  hasCompletedOnboarding: false,
  highContrast: false,
};

const LedgerContext = createContext<LedgerContextType | null>(null);

export const LedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [consumptions, setConsumptions] = useState<ConsumptionRecord[]>([]);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [settings, setSettings] = useState<PointsEngineSettings>(DEFAULT_SETTINGS);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (
      message: string,
      options?: { type?: 'success' | 'info' | 'warning' | 'error'; undoAction?: () => void }
    ) => {
      setToast({
        id: Math.random().toString(),
        message,
        type: options?.type || 'success',
        undoAction: options?.undoAction,
      });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, toast.undoAction ? 6000 : 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Initial Data Load & Migration
  useEffect(() => {
    async function init() {
      try {
        const [loadedActs, loadedCons, loadedTxs, loadedSettings, loadedPrefs] = await Promise.all([
          getAllFromStore<ActivityRecord>(STORES.ACTIVITIES),
          getAllFromStore<ConsumptionRecord>(STORES.CONSUMPTIONS),
          getAllFromStore<LedgerTransaction>(STORES.TRANSACTIONS),
          loadSetting<PointsEngineSettings>('engine_settings', DEFAULT_SETTINGS),
          loadSetting<UserPreferences>('user_preferences', DEFAULT_PREFERENCES),
        ]);

        // Migrate Settings if consumptionTypes or custom activity calculation fields are missing
        let migratedSettings = { ...DEFAULT_SETTINGS, ...loadedSettings };
        if (!migratedSettings.consumptionTypes || migratedSettings.consumptionTypes.length === 0) {
          migratedSettings.consumptionTypes = DEFAULT_CONSUMPTION_TYPES;
        }
        // Ensure all activity types have calculationMethod
        migratedSettings.activityTypes = migratedSettings.activityTypes.map((act) => {
          if (!act.calculationMethod) {
            return {
              ...act,
              calculationMethod: 'duration',
              durationIntervalMinutes: 15,
              pointsPerDurationInterval: (act as any).basePointsPerMinute
                ? (act as any).basePointsPerMinute * 15
                : 30,
              durationRounding: 'proportional',
              enabled: true,
              earnsPoints: true,
            };
          }
          return act;
        });

        // Migrate existing activities if missing calculationMethod
        const migratedActs: ActivityRecord[] = loadedActs.map((act) => {
          if (!act.calculationMethod) {
            return {
              ...act,
              calculationMethod: 'duration',
              updatedAt: act.updatedAt || act.createdAt,
            };
          }
          return act;
        });

        // Migrate existing consumptions to include typeId and pointsCharged if old schema
        const migratedCons: ConsumptionRecord[] = loadedCons.map((con) => {
          const typeId = con.typeId || (con.category === 'cigarette' ? 'cigarette' : 'alcohol');
          const typeName =
            con.typeName || (con.category === 'cigarette' ? 'Cigarettes' : 'Alcoholic Drink');
          const unitName =
            con.unitName || (con.category === 'cigarette' ? 'cigarette' : 'drink');
          const pointsCharged =
            con.pointsCharged !== undefined
              ? con.pointsCharged
              : con.category === 'cigarette'
              ? con.quantity * 10
              : con.quantity * 15;
          const transactionId = con.transactionId || `tx_mig_${con.id}`;

          return {
            ...con,
            typeId,
            typeName,
            unitName,
            pointsCharged,
            transactionId,
          };
        });

        // If completely empty database and user hasn't completed onboarding, load sample data
        if (
          migratedActs.length === 0 &&
          migratedCons.length === 0 &&
          loadedTxs.length === 0 &&
          !loadedPrefs.hasCompletedOnboarding
        ) {
          const sample = generateSampleData();
          await Promise.all([
            bulkPutIntoStore(STORES.ACTIVITIES, sample.activities),
            bulkPutIntoStore(STORES.CONSUMPTIONS, sample.consumptions),
            bulkPutIntoStore(STORES.TRANSACTIONS, sample.transactions),
            saveSetting('engine_settings', migratedSettings),
          ]);
          setActivities(sample.activities);
          setConsumptions(sample.consumptions);
          setTransactions(sample.transactions);
        } else {
          setActivities(migratedActs);
          setConsumptions(migratedCons);
          setTransactions(loadedTxs);
        }

        setSettings(migratedSettings);
        setPreferences(loadedPrefs);
      } catch (err) {
        console.error('Failed to initialize local data', err);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  // Computed Values
  const totalPointsBalance = useMemo(() => calculateLedgerBalance(transactions), [transactions]);
  const pointsEarnedToday = useMemo(() => calculatePointsEarnedOnDay(transactions, new Date()), [transactions]);
  const pointsSpentToday = useMemo(() => calculatePointsSpentOnDay(transactions, new Date()), [transactions]);

  const { todayActivityDuration, todayCigarettesCount, todayAlcoholVolume, todayAlcoholUnits, todayAlcoholPureGrams } = useMemo(() => {
    const today = new Date();
    const tYear = today.getFullYear();
    const tMonth = today.getMonth();
    const tDate = today.getDate();

    const isToday = (ts: string) => {
      const d = new Date(ts);
      return d.getFullYear() === tYear && d.getMonth() === tMonth && d.getDate() === tDate;
    };

    let duration = 0;
    for (const a of activities) {
      if (isToday(a.timestamp) && a.durationMinutes) {
        duration += a.durationMinutes;
      }
    }

    let cigs = 0;
    let alcVol = 0;
    let alcUnits = 0;
    let alcPureGrams = 0;

    for (const c of consumptions) {
      if (isToday(c.timestamp)) {
        if (c.typeId === 'cigarette' || c.category === 'cigarette') {
          cigs += c.quantity;
        } else if (c.typeId === 'alcohol' || c.category === 'alcohol') {
          alcVol += (c.volumeMl || 330) * c.quantity;
          alcUnits += c.standardUnits || 0;
          alcPureGrams += c.pureAlcoholGrams || 0;
        }
      }
    }

    return {
      todayActivityDuration: duration,
      todayCigarettesCount: cigs,
      todayAlcoholVolume: Math.round(alcVol),
      todayAlcoholUnits: Math.round(alcUnits * 10) / 10,
      todayAlcoholPureGrams: Math.round(alcPureGrams * 10) / 10,
    };
  }, [activities, consumptions]);

  // CONFIG MANAGEMENT: Activity Types
  const addActivityType = async (config: Omit<ActivityTypeConfig, 'id'>): Promise<string> => {
    const id = `act_type_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newType: ActivityTypeConfig = { ...config, id };
    const updatedTypes = [...settings.activityTypes, newType];
    const newSettings = { ...settings, activityTypes: updatedTypes };
    await updateSettings(newSettings);
    showToast(`Created activity type "${newType.name}"`);
    return id;
  };

  const updateActivityType = async (id: string, updates: Partial<ActivityTypeConfig>) => {
    const updatedTypes = settings.activityTypes.map((t) => (t.id === id ? { ...t, ...updates } : t));
    const newSettings = { ...settings, activityTypes: updatedTypes };
    await updateSettings(newSettings);
    showToast('Activity type updated');
  };

  const deleteActivityType = async (id: string) => {
    const target = settings.activityTypes.find((t) => t.id === id);
    if (!target) return;
    // Remove or archive
    const updatedTypes = settings.activityTypes.filter((t) => t.id !== id);
    const newSettings = { ...settings, activityTypes: updatedTypes };
    await updateSettings(newSettings);
    showToast(`Deleted activity type "${target.name}"`);
  };

  const toggleActivityTypeEnabled = async (id: string) => {
    const target = settings.activityTypes.find((t) => t.id === id);
    if (!target) return;
    await updateActivityType(id, { enabled: !target.enabled });
  };

  // CONFIG MANAGEMENT: Consumption Types
  const addConsumptionType = async (config: Omit<ConsumptionTypeConfig, 'id'>): Promise<string> => {
    const id = `cns_type_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newType: ConsumptionTypeConfig = { ...config, id };
    const updatedTypes = [...settings.consumptionTypes, newType];
    const newSettings = { ...settings, consumptionTypes: updatedTypes };
    await updateSettings(newSettings);
    showToast(`Created consumption type "${newType.name}"`);
    return id;
  };

  const updateConsumptionType = async (id: string, updates: Partial<ConsumptionTypeConfig>) => {
    const updatedTypes = settings.consumptionTypes.map((t) => (t.id === id ? { ...t, ...updates } : t));
    const newSettings = { ...settings, consumptionTypes: updatedTypes };
    await updateSettings(newSettings);
    showToast('Consumption type updated');
  };

  const deleteConsumptionType = async (id: string) => {
    const target = settings.consumptionTypes.find((t) => t.id === id);
    if (!target) return;
    const updatedTypes = settings.consumptionTypes.filter((t) => t.id !== id);
    const newSettings = { ...settings, consumptionTypes: updatedTypes };
    await updateSettings(newSettings);
    showToast(`Deleted consumption type "${target.name}"`);
  };

  const toggleConsumptionTypeEnabled = async (id: string) => {
    const target = settings.consumptionTypes.find((t) => t.id === id);
    if (!target) return;
    await updateConsumptionType(id, { enabled: !target.enabled });
  };

  // ACTIVITY LOGGING & ACTIONS
  const addActivity = async (params: {
    typeId: string;
    durationMinutes?: number;
    repetitions?: number;
    intensity?: IntensityLevel;
    timestamp: string;
    notes?: string;
  }) => {
    const config = settings.activityTypes.find((a) => a.id === params.typeId);
    if (!config) {
      return { success: false, error: 'Selected activity type does not exist' };
    }

    const validation = validateActivityInput(config, params);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    try {
      const { activity, transaction } = createActivityWithTransaction({
        config,
        durationMinutes: params.durationMinutes,
        repetitions: params.repetitions,
        intensity: params.intensity,
        timestamp: params.timestamp,
        notes: params.notes,
        settings,
        existingTransactions: transactions,
      });

      await Promise.all([
        putIntoStore(STORES.ACTIVITIES, activity),
        putIntoStore(STORES.TRANSACTIONS, transaction),
      ]);

      setActivities((prev) => [activity, ...prev]);
      setTransactions((prev) => [transaction, ...prev]);

      showToast(`+${activity.pointsEarned} points awarded for ${activity.typeName}!`, {
        undoAction: () => {
          deleteActivity(activity.id, true);
        },
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save activity' };
    }
  };

  const updateActivity = async (
    id: string,
    params: {
      typeId: string;
      durationMinutes?: number;
      repetitions?: number;
      intensity?: IntensityLevel;
      timestamp: string;
      notes?: string;
      recalculatePoints?: boolean;
    }
  ) => {
    const actIndex = activities.findIndex((a) => a.id === id);
    if (actIndex === -1) return { success: false, error: 'Activity not found' };

    const oldAct = activities[actIndex];
    const config = settings.activityTypes.find((a) => a.id === params.typeId);
    if (!config) return { success: false, error: 'Activity type not found' };

    const validation = validateActivityInput(config, params);
    if (!validation.isValid) return { success: false, error: validation.error };

    const now = new Date().toISOString();
    let pointsEarned = oldAct.pointsEarned;
    let breakdown = '';

    // Only recalculate points if explicitly requested
    if (params.recalculatePoints) {
      const calc = calculateActivityPoints(
        config,
        {
          durationMinutes: params.durationMinutes,
          repetitions: params.repetitions,
          intensity: params.intensity,
        },
        settings
      );
      pointsEarned = calc.totalPoints;
      breakdown = calc.breakdown;
    }

    const updatedAct: ActivityRecord = {
      ...oldAct,
      typeId: config.id,
      typeName: config.name,
      calculationMethod: config.calculationMethod,
      durationMinutes: params.durationMinutes,
      repetitions: params.repetitions,
      intensity: params.intensity,
      timestamp: params.timestamp,
      notes: params.notes,
      pointsEarned,
      updatedAt: now,
    };

    // Update matching transaction
    const txIndex = transactions.findIndex((t) => t.id === oldAct.transactionId);
    let updatedTx: LedgerTransaction | null = null;
    if (txIndex !== -1) {
      updatedTx = {
        ...transactions[txIndex],
        timestamp: params.timestamp,
        points: pointsEarned,
        description: `${config.name} (${params.durationMinutes ? `${params.durationMinutes}m` : `${params.repetitions} reps`})`,
        notes: breakdown || transactions[txIndex].notes,
        updatedAt: now,
      };
    }

    await putIntoStore(STORES.ACTIVITIES, updatedAct);
    if (updatedTx) {
      await putIntoStore(STORES.TRANSACTIONS, updatedTx);
    }

    setActivities((prev) => {
      const copy = [...prev];
      copy[actIndex] = updatedAct;
      return copy;
    });

    if (updatedTx) {
      setTransactions((prev) => {
        const copy = [...prev];
        copy[txIndex] = updatedTx!;
        return copy;
      });
    }

    showToast('Activity record updated');
    return { success: true };
  };

  const deleteActivity = async (id: string, reverseTransactionToo: boolean = true) => {
    const act = activities.find((a) => a.id === id);
    if (!act) return;

    const previousActs = [...activities];
    const previousTxs = [...transactions];

    await deleteFromStore(STORES.ACTIVITIES, id);
    setActivities((prev) => prev.filter((a) => a.id !== id));

    if (reverseTransactionToo && act.transactionId) {
      await deleteFromStore(STORES.TRANSACTIONS, act.transactionId);
      setTransactions((prev) => prev.filter((t) => t.id !== act.transactionId));
    }

    showToast(`Deleted ${act.typeName}`, {
      undoAction: async () => {
        await Promise.all([
          bulkPutIntoStore(STORES.ACTIVITIES, previousActs),
          bulkPutIntoStore(STORES.TRANSACTIONS, previousTxs),
        ]);
        setActivities(previousActs);
        setTransactions(previousTxs);
      },
    });
  };

  // CONSUMPTION LOGGING & ACTIONS
  const addConsumption = async (params: {
    typeId: string;
    quantity: number;
    timestamp: string;
    drinkType?: AlcoholDrinkType;
    volumeMl?: number;
    abv?: number;
    brandOrType?: string;
    notes?: string;
  }) => {
    const config = settings.consumptionTypes.find((c) => c.id === params.typeId);
    if (!config) {
      return { success: false, error: 'Selected consumption type does not exist' };
    }

    const validation = validateConsumptionInput(config, params.quantity, params.timestamp);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    if (config.hasAlcoholDetails && params.volumeMl && params.abv) {
      const alcVal = validateAlcoholDetails(params.volumeMl, params.abv);
      if (!alcVal.isValid) return { success: false, error: alcVal.error };
    }

    try {
      let pureAlcoholGrams: number | undefined;
      let standardUnits: number | undefined;
      if (config.hasAlcoholDetails && params.volumeMl && params.abv) {
        const alcMetrics = calculateAlcoholMetrics(params.quantity, params.volumeMl, params.abv);
        pureAlcoholGrams = alcMetrics.pureAlcoholGrams;
        standardUnits = alcMetrics.standardUnits;
      }

      const { consumption, transaction } = createConsumptionWithTransaction({
        config,
        quantity: params.quantity,
        timestamp: params.timestamp,
        drinkType: params.drinkType,
        volumeMl: params.volumeMl,
        abv: params.abv,
        pureAlcoholGrams,
        standardUnits,
        brandOrType: params.brandOrType,
        notes: params.notes,
        existingTransactions: transactions,
      });

      await Promise.all([
        putIntoStore(STORES.CONSUMPTIONS, consumption),
        putIntoStore(STORES.TRANSACTIONS, transaction),
      ]);

      setConsumptions((prev) => [consumption, ...prev]);
      setTransactions((prev) => [transaction, ...prev]);

      // Check balance condition (honesty warning if zero or negative)
      const newBalance = totalPointsBalance - consumption.pointsCharged;
      let warning: string | undefined;
      if (newBalance <= 0) {
        warning = `Note: Point balance is now ${newBalance} pts. Record saved honestly.`;
      }

      showToast(
        warning
          ? `Logged ${consumption.quantity} ${consumption.unitName} (-${consumption.pointsCharged} pts). ${warning}`
          : `Logged ${consumption.quantity} ${consumption.unitName} (-${consumption.pointsCharged} pts)`,
        {
          type: warning ? 'warning' : 'success',
          undoAction: () => {
            deleteConsumption(consumption.id);
          },
        }
      );

      return { success: true, warning };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to log consumption' };
    }
  };

  const updateConsumption = async (
    id: string,
    updated: Partial<ConsumptionRecord>,
    recalculatePoints?: boolean
  ) => {
    const idx = consumptions.findIndex((c) => c.id === id);
    if (idx === -1) return { success: false, error: 'Record not found' };

    const existing = consumptions[idx];
    const config = settings.consumptionTypes.find((c) => c.id === (updated.typeId || existing.typeId));
    if (!config) return { success: false, error: 'Consumption type not found' };

    const newQuantity = updated.quantity ?? existing.quantity;
    const newTimestamp = updated.timestamp ?? existing.timestamp;

    const v = validateConsumptionInput(config, newQuantity, newTimestamp);
    if (!v.isValid) return { success: false, error: v.error };

    let newCost = existing.pointsCharged;
    let newBreakdown = '';
    if (recalculatePoints) {
      const calc = calculateConsumptionPoints(config, newQuantity);
      newCost = calc.totalCost;
      newBreakdown = calc.breakdown;
    }

    const now = new Date().toISOString();
    const merged: ConsumptionRecord = {
      ...existing,
      ...updated,
      typeId: config.id,
      typeName: config.name,
      unitName: config.unitName,
      quantity: newQuantity,
      pointsCharged: newCost,
      updatedAt: now,
    };

    // Update matching transaction in ledger
    const txIndex = transactions.findIndex((t) => t.id === existing.transactionId);
    let updatedTx: LedgerTransaction | null = null;
    if (txIndex !== -1) {
      updatedTx = {
        ...transactions[txIndex],
        timestamp: newTimestamp,
        points: -newCost,
        description: `${config.name} (${newQuantity} ${config.unitName}${newQuantity > 1 ? 's' : ''})`,
        notes: newBreakdown || transactions[txIndex].notes,
        updatedAt: now,
      };
    }

    await putIntoStore(STORES.CONSUMPTIONS, merged);
    if (updatedTx) {
      await putIntoStore(STORES.TRANSACTIONS, updatedTx);
    }

    setConsumptions((prev) => {
      const c = [...prev];
      c[idx] = merged;
      return c;
    });

    if (updatedTx) {
      setTransactions((prev) => {
        const copy = [...prev];
        copy[txIndex] = updatedTx!;
        return copy;
      });
    }

    showToast('Consumption record updated');
    return { success: true };
  };

  const deleteConsumption = async (id: string) => {
    const target = consumptions.find((c) => c.id === id);
    if (!target) return;

    const previousCons = [...consumptions];
    const previousTxs = [...transactions];

    await deleteFromStore(STORES.CONSUMPTIONS, id);
    setConsumptions((prev) => prev.filter((c) => c.id !== id));

    if (target.transactionId) {
      await deleteFromStore(STORES.TRANSACTIONS, target.transactionId);
      setTransactions((prev) => prev.filter((t) => t.id !== target.transactionId));
    }

    showToast(`Removed ${target.typeName} log`, {
      undoAction: async () => {
        await Promise.all([
          bulkPutIntoStore(STORES.CONSUMPTIONS, previousCons),
          bulkPutIntoStore(STORES.TRANSACTIONS, previousTxs),
        ]);
        setConsumptions(previousCons);
        setTransactions(previousTxs);
      },
    });
  };

  // TRANSACTION LEDGER ACTIONS
  const editTransaction = async (
    id: string,
    updates: { points?: number; description?: string; notes?: string }
  ) => {
    const idx = transactions.findIndex((t) => t.id === id);
    if (idx === -1) return { success: false, error: 'Transaction not found' };

    const existing = transactions[idx];
    const now = new Date().toISOString();
    const updatedTx: LedgerTransaction = {
      ...existing,
      points: updates.points !== undefined ? updates.points : existing.points,
      description: updates.description !== undefined ? updates.description : existing.description,
      notes: updates.notes !== undefined ? updates.notes : existing.notes,
      updatedAt: now,
    };

    await putIntoStore(STORES.TRANSACTIONS, updatedTx);
    setTransactions((prev) => {
      const copy = [...prev];
      copy[idx] = updatedTx;
      return copy;
    });

    showToast('Transaction edited successfully');
    return { success: true };
  };

  const reverseTransactionAction = async (id: string, reason?: string) => {
    try {
      const { updatedTransactions, reversedTx } = reverseTransaction(
        id,
        transactions,
        reason || 'Manual user reversal'
      );

      await putIntoStore(STORES.TRANSACTIONS, reversedTx);
      setTransactions(updatedTransactions);

      showToast(`Reversed: ${reversedTx.description}`, {
        undoAction: async () => {
          const restoredTx: LedgerTransaction = {
            ...reversedTx,
            status: 'active',
            reversedAt: undefined,
            reversalReason: undefined,
          };
          await putIntoStore(STORES.TRANSACTIONS, restoredTx);
          setTransactions((prev) => prev.map((t) => (t.id === id ? restoredTx : t)));
        },
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to reverse transaction' };
    }
  };

  const deleteTransaction = async (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return;

    const previousTxs = [...transactions];
    await deleteFromStore(STORES.TRANSACTIONS, id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    showToast(`Deleted transaction #${target.id.slice(0, 8)}`, {
      undoAction: async () => {
        await bulkPutIntoStore(STORES.TRANSACTIONS, previousTxs);
        setTransactions(previousTxs);
      },
    });
  };

  // Recalculates an old transaction only upon explicit request
  const recalculateTransaction = async (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return { success: false, error: 'Transaction not found' };

    if (tx.activityId) {
      const act = activities.find((a) => a.id === tx.activityId);
      if (!act) return { success: false, error: 'Linked activity not found' };
      const config = settings.activityTypes.find((a) => a.id === act.typeId);
      if (!config) return { success: false, error: 'Activity type not found' };

      const calc = calculateActivityPoints(
        config,
        {
          durationMinutes: act.durationMinutes,
          repetitions: act.repetitions,
          intensity: act.intensity,
        },
        settings
      );

      await editTransaction(txId, {
        points: calc.totalPoints,
        notes: `Recalculated: ${calc.breakdown}`,
      });
      return { success: true };
    }

    if (tx.consumptionId) {
      const con = consumptions.find((c) => c.id === tx.consumptionId);
      if (!con) return { success: false, error: 'Linked consumption not found' };
      const config = settings.consumptionTypes.find((c) => c.id === con.typeId);
      if (!config) return { success: false, error: 'Consumption type not found' };

      const calc = calculateConsumptionPoints(config, con.quantity);
      await editTransaction(txId, {
        points: -calc.totalCost,
        notes: `Recalculated: ${calc.breakdown}`,
      });
      return { success: true };
    }

    return { success: false, error: 'Transaction is not linked to an activity or consumption' };
  };

  // SETTINGS & PERSISTENCE
  const updateSettings = async (newSettings: PointsEngineSettings) => {
    setSettings(newSettings);
    await saveSetting('engine_settings', newSettings);
  };

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    await saveSetting('user_preferences', updated);
  };

  const loadSampleDataset = async () => {
    const sample = generateSampleData();
    await Promise.all([
      bulkPutIntoStore(STORES.ACTIVITIES, sample.activities),
      bulkPutIntoStore(STORES.CONSUMPTIONS, sample.consumptions),
      bulkPutIntoStore(STORES.TRANSACTIONS, sample.transactions),
    ]);
    setActivities(sample.activities);
    setConsumptions(sample.consumptions);
    setTransactions(sample.transactions);
    showToast('Sample dataset loaded');
  };

  const clearAllData = async () => {
    await clearAllStores();
    setActivities([]);
    setConsumptions([]);
    setTransactions([]);
    showToast('All activity, consumption and ledger records cleared', { type: 'info' });
  };

  // BACKUP & RESTORE
  const exportBackupJSON = (): string => {
    const payload: AppBackupData = {
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      appName: 'Nasha Ledger',
      activities,
      consumptions,
      transactions,
      settings,
      preferences,
    };
    return JSON.stringify(payload, null, 2);
  };

  const importBackupJSON = async (
    rawJson: string,
    mode: 'merge' | 'replace'
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const parsed: AppBackupData = JSON.parse(rawJson);
      if (!parsed || parsed.appName !== 'Nasha Ledger') {
        return { success: false, message: 'Invalid backup file: Unrecognized application format.' };
      }

      if (
        !Array.isArray(parsed.activities) ||
        !Array.isArray(parsed.transactions) ||
        !Array.isArray(parsed.consumptions)
      ) {
        return { success: false, message: 'Invalid backup file: Missing required record collections.' };
      }

      // Safe migration for imported data
      const importedActs = parsed.activities.map((a) => ({
        ...a,
        calculationMethod: a.calculationMethod || 'duration',
      }));

      const importedCons = parsed.consumptions.map((c) => ({
        ...c,
        typeId: c.typeId || (c.category === 'cigarette' ? 'cigarette' : 'alcohol'),
        typeName: c.typeName || (c.category === 'cigarette' ? 'Cigarettes' : 'Alcoholic Drink'),
        unitName: c.unitName || (c.category === 'cigarette' ? 'cigarette' : 'drink'),
        pointsCharged: c.pointsCharged !== undefined ? c.pointsCharged : 0,
        transactionId: c.transactionId || `tx_imp_${c.id}`,
      }));

      if (mode === 'replace') {
        await clearAllStores();
        await Promise.all([
          bulkPutIntoStore(STORES.ACTIVITIES, importedActs),
          bulkPutIntoStore(STORES.CONSUMPTIONS, importedCons),
          bulkPutIntoStore(STORES.TRANSACTIONS, parsed.transactions),
        ]);
        if (parsed.settings) await saveSetting('engine_settings', parsed.settings);
        if (parsed.preferences) await saveSetting('user_preferences', parsed.preferences);

        setActivities(importedActs);
        setConsumptions(importedCons);
        setTransactions(parsed.transactions);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.preferences) setPreferences(parsed.preferences);

        return {
          success: true,
          message: `Cleanly restored ${importedActs.length} activities, ${importedCons.length} consumptions, and ${parsed.transactions.length} transactions.`,
        };
      } else {
        // Merge mode: Add missing records without silently overwriting existing records
        const existingActIds = new Set(activities.map((a) => a.id));
        const newActivities = importedActs.filter((a) => !existingActIds.has(a.id));

        const existingConIds = new Set(consumptions.map((c) => c.id));
        const newConsumptions = importedCons.filter((c) => !existingConIds.has(c.id));

        const existingTxIds = new Set(transactions.map((t) => t.id));
        const newTransactions = parsed.transactions.filter((t) => !existingTxIds.has(t.id));

        await Promise.all([
          bulkPutIntoStore(STORES.ACTIVITIES, newActivities),
          bulkPutIntoStore(STORES.CONSUMPTIONS, newConsumptions),
          bulkPutIntoStore(STORES.TRANSACTIONS, newTransactions),
        ]);

        setActivities((prev) => [...newActivities, ...prev]);
        setConsumptions((prev) => [...newConsumptions, ...prev]);
        setTransactions((prev) => [...newTransactions, ...prev]);

        return {
          success: true,
          message: `Safely merged ${newActivities.length} activities, ${newConsumptions.length} consumptions, and ${newTransactions.length} transactions. Skipped duplicates.`,
        };
      }
    } catch (e: any) {
      return { success: false, message: `Import error: ${e.message || 'Corrupt JSON data'}` };
    }
  };

  const value = {
    activities,
    consumptions,
    transactions,
    settings,
    preferences,
    isLoading,
    toast,
    totalPointsBalance,
    pointsEarnedToday,
    pointsSpentToday,
    todayActivityDuration,
    todayCigarettesCount,
    todayAlcoholVolume,
    todayAlcoholUnits,
    todayAlcoholPureGrams,
    addActivityType,
    updateActivityType,
    deleteActivityType,
    toggleActivityTypeEnabled,
    addConsumptionType,
    updateConsumptionType,
    deleteConsumptionType,
    toggleConsumptionTypeEnabled,
    addActivity,
    updateActivity,
    deleteActivity,
    addConsumption,
    updateConsumption,
    deleteConsumption,
    editTransaction,
    reverseTransactionAction,
    deleteTransaction,
    recalculateTransaction,
    updateSettings,
    updatePreferences,
    loadSampleDataset,
    clearAllData,
    exportBackupJSON,
    importBackupJSON,
    showToast,
    hideToast,
  };

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
};

export function useLedger() {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
}
