/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLedger } from '../../context/LedgerContext';
import {
  ActivityTypeConfig,
  ConsumptionTypeConfig,
  IntensityLevel,
  RoundingRule,
  ActivityCalculationMethod,
  ConsumptionChargingMethod,
} from '../../types';
import {
  Sliders,
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle,
  HelpCircle,
  Check,
  Play,
  Plus,
  Edit2,
  Flame,
  Dumbbell,
  Target,
  Shield,
  X,
  Power,
  ChevronRight,
} from 'lucide-react';
import {
  calculateActivityPoints,
  calculateConsumptionPoints,
  calculateLedgerBalance,
  createActivityWithTransaction,
  createConsumptionWithTransaction,
  reverseTransaction,
  DEFAULT_SETTINGS,
} from '../../engine/pointsEngine';
import { PunyaSymbol, PapaSymbol } from '../common/SacredSymbols';

export type SettingsSection = 'activities' | 'consumptions' | 'rules' | 'limits' | 'data';

interface SettingsScreenProps {
  onOpenInstallModal: () => void;
  activeSection?: SettingsSection;
  onSectionChange?: (section: SettingsSection) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onOpenInstallModal,
  activeSection: propActiveSection,
  onSectionChange,
}) => {
  const {
    settings,
    updateSettings,
    addActivityType,
    updateActivityType,
    deleteActivityType,
    toggleActivityTypeEnabled,
    addConsumptionType,
    updateConsumptionType,
    deleteConsumptionType,
    toggleConsumptionTypeEnabled,
    exportBackupJSON,
    importBackupJSON,
    loadSampleDataset,
    clearAllData,
    showToast,
  } = useLedger();

  // Navigation tab within Settings (persisted across refreshes)
  const [internalSection, setInternalSection] = useState<SettingsSection>(() => {
    try {
      return (localStorage.getItem('sankalpa_altar_section') as SettingsSection) || 'activities';
    } catch {
      return 'activities';
    }
  });

  const activeSection = propActiveSection ?? internalSection;

  const handleSelectSection = (sec: SettingsSection) => {
    setInternalSection(sec);
    try {
      localStorage.setItem('sankalpa_altar_section', sec);
    } catch {
      // ignore
    }
    onSectionChange?.(sec);
  };

  React.useEffect(() => {
    if (propActiveSection && propActiveSection !== internalSection) {
      setInternalSection(propActiveSection);
    }
  }, [propActiveSection]);

  // Activity Type Modal (Add / Edit)
  const [editingActivity, setEditingActivity] = useState<ActivityTypeConfig | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [actName, setActName] = useState('');
  const [actCategory, setActCategory] = useState('cardio');
  const [actMethod, setActMethod] = useState<ActivityCalculationMethod>('duration');
  const [actDurationInterval, setActDurationInterval] = useState(15);
  const [actPointsPerDuration, setActPointsPerDuration] = useState(30);
  const [actDurationRounding, setActDurationRounding] = useState<RoundingRule>('proportional');
  const [actHasIntensity, setActHasIntensity] = useState(true);
  const [actRepetitionInterval, setActRepetitionInterval] = useState(20);
  const [actPointsPerRepetition, setActPointsPerRepetition] = useState(10);
  const [actRepetitionRounding, setActRepetitionRounding] = useState<RoundingRule>('proportional');
  const [actFixedPoints, setActFixedPoints] = useState(20);
  const [actEarnsPoints, setActEarnsPoints] = useState(true);

  // Consumption Type Modal (Add / Edit)
  const [editingConsumption, setEditingConsumption] = useState<ConsumptionTypeConfig | null>(null);
  const [isConsumptionModalOpen, setIsConsumptionModalOpen] = useState(false);
  const [cnsName, setCnsName] = useState('');
  const [cnsCategory, setCnsCategory] = useState('smoking');
  const [cnsUnitName, setCnsUnitName] = useState('unit');
  const [cnsMethod, setCnsMethod] = useState<ConsumptionChargingMethod>('per_unit');
  const [cnsPointsPerUnit, setCnsPointsPerUnit] = useState(10);
  const [cnsQuantityInterval, setCnsQuantityInterval] = useState(2);
  const [cnsPointsPerQuantity, setCnsPointsPerQuantity] = useState(10);
  const [cnsTimeIntervalMinutes, setCnsTimeIntervalMinutes] = useState(30);
  const [cnsPointsPerTimeInterval, setCnsPointsPerTimeInterval] = useState(5);
  const [cnsIntervalRounding, setCnsIntervalRounding] = useState<RoundingRule>('proportional');
  const [cnsFixedCost, setCnsFixedCost] = useState(20);
  const [cnsAllowDecimals, setCnsAllowDecimals] = useState(false);
  const [cnsMinQuantity, setCnsMinQuantity] = useState(1);
  const [cnsMaxQuantity, setCnsMaxQuantity] = useState(100);
  const [cnsHasAlcohol, setCnsHasAlcohol] = useState(false);
  const [cnsHasBrand, setCnsHasBrand] = useState(false);
  const [cnsDailyLimit, setCnsDailyLimit] = useState<number | undefined>(undefined);
  const [cnsWeeklyLimit, setCnsWeeklyLimit] = useState<number | undefined>(undefined);

  // Global Rules Local State
  const [localMultipliers, setLocalMultipliers] = useState(settings.intensityMultipliers);
  const [localBonusThreshold, setLocalBonusThreshold] = useState(
    settings.bonusRules.durationBonusThresholdMinutes
  );
  const [localBonusPoints, setLocalBonusPoints] = useState(settings.bonusRules.durationBonusPoints);

  // Import / Clear Modal States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [importPreview, setImportPreview] = useState<any | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Test suite results
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    logs: string[];
  } | null>(null);

  // Open Activity Modal
  const openNewActivityModal = () => {
    setEditingActivity(null);
    setActName('');
    setActCategory('cardio');
    setActMethod('duration');
    setActDurationInterval(15);
    setActPointsPerDuration(30);
    setActDurationRounding('proportional');
    setActHasIntensity(true);
    setActRepetitionInterval(20);
    setActPointsPerRepetition(10);
    setActRepetitionRounding('proportional');
    setActFixedPoints(20);
    setActEarnsPoints(true);
    setIsActivityModalOpen(true);
  };

  const openEditActivityModal = (act: ActivityTypeConfig) => {
    setEditingActivity(act);
    setActName(act.name);
    setActCategory(act.category || 'cardio');
    setActMethod(act.calculationMethod || 'duration');
    setActDurationInterval(act.durationIntervalMinutes || 15);
    setActPointsPerDuration(act.pointsPerDurationInterval || 30);
    setActDurationRounding(act.durationRounding || 'proportional');
    setActHasIntensity(act.hasIntensityMultiplier ?? true);
    setActRepetitionInterval(act.repetitionIntervalCount || 20);
    setActPointsPerRepetition(act.pointsPerRepetitionInterval || 10);
    setActRepetitionRounding(act.repetitionRounding || 'proportional');
    setActFixedPoints(act.fixedPoints || 20);
    setActEarnsPoints(act.earnsPoints !== false);
    setIsActivityModalOpen(true);
  };

  // Save Activity Form
  const handleSaveActivityType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actName.trim()) return;

    const payload: Omit<ActivityTypeConfig, 'id'> = {
      name: actName.trim(),
      category: actCategory,
      iconName: 'Activity',
      enabled: editingActivity ? editingActivity.enabled : true,
      earnsPoints: actEarnsPoints,
      calculationMethod: actMethod,
      durationIntervalMinutes: actMethod === 'duration' ? actDurationInterval : undefined,
      pointsPerDurationInterval: actMethod === 'duration' ? actPointsPerDuration : undefined,
      durationRounding: actMethod === 'duration' ? actDurationRounding : undefined,
      hasIntensityMultiplier: actMethod === 'duration' ? actHasIntensity : undefined,
      repetitionIntervalCount: actMethod === 'repetition' ? actRepetitionInterval : undefined,
      pointsPerRepetitionInterval: actMethod === 'repetition' ? actPointsPerRepetition : undefined,
      repetitionRounding: actMethod === 'repetition' ? actRepetitionRounding : undefined,
      fixedPoints: actMethod === 'fixed' ? actFixedPoints : undefined,
    };

    if (editingActivity) {
      await updateActivityType(editingActivity.id, payload);
    } else {
      await addActivityType(payload);
    }
    setIsActivityModalOpen(false);
  };

  // Open Consumption Modal
  const openNewConsumptionModal = () => {
    setEditingConsumption(null);
    setCnsName('');
    setCnsCategory('custom');
    setCnsUnitName('unit');
    setCnsMethod('per_unit');
    setCnsPointsPerUnit(10);
    setCnsQuantityInterval(2);
    setCnsPointsPerQuantity(10);
    setCnsTimeIntervalMinutes(30);
    setCnsPointsPerTimeInterval(5);
    setCnsIntervalRounding('proportional');
    setCnsFixedCost(20);
    setCnsAllowDecimals(false);
    setCnsMinQuantity(1);
    setCnsMaxQuantity(100);
    setCnsHasAlcohol(false);
    setCnsHasBrand(false);
    setCnsDailyLimit(undefined);
    setCnsWeeklyLimit(undefined);
    setIsConsumptionModalOpen(true);
  };

  const openEditConsumptionModal = (cns: ConsumptionTypeConfig) => {
    setEditingConsumption(cns);
    setCnsName(cns.name);
    setCnsCategory(cns.category || 'custom');
    setCnsUnitName(cns.unitName || 'unit');
    setCnsMethod(cns.chargingMethod || 'per_unit');
    setCnsPointsPerUnit(cns.pointsPerUnit || 10);
    setCnsQuantityInterval(cns.quantityInterval || 2);
    setCnsPointsPerQuantity(cns.pointsPerQuantityInterval || 10);
    setCnsTimeIntervalMinutes(cns.timeIntervalMinutes || 30);
    setCnsPointsPerTimeInterval(cns.pointsPerTimeInterval || 5);
    setCnsIntervalRounding(cns.intervalRounding || 'proportional');
    setCnsFixedCost(cns.fixedCost || 20);
    setCnsAllowDecimals(cns.allowDecimals || false);
    setCnsMinQuantity(cns.minQuantity || 1);
    setCnsMaxQuantity(cns.maxQuantity || 100);
    setCnsHasAlcohol(cns.hasAlcoholDetails || false);
    setCnsHasBrand(cns.hasBrandOrType || false);
    setCnsDailyLimit(cns.dailyLimit);
    setCnsWeeklyLimit(cns.weeklyLimit);
    setIsConsumptionModalOpen(true);
  };

  // Save Consumption Form
  const handleSaveConsumptionType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnsName.trim()) return;

    const payload: Omit<ConsumptionTypeConfig, 'id'> = {
      name: cnsName.trim(),
      category: cnsCategory,
      iconName: 'Flame',
      enabled: editingConsumption ? editingConsumption.enabled : true,
      unitName: cnsUnitName.trim() || 'unit',
      chargingMethod: cnsMethod,
      pointsPerUnit: cnsMethod === 'per_unit' ? cnsPointsPerUnit : undefined,
      quantityInterval: cnsMethod === 'per_quantity' ? cnsQuantityInterval : undefined,
      pointsPerQuantityInterval: cnsMethod === 'per_quantity' ? cnsPointsPerQuantity : undefined,
      timeIntervalMinutes: cnsMethod === 'per_interval' ? cnsTimeIntervalMinutes : undefined,
      pointsPerTimeInterval: cnsMethod === 'per_interval' ? cnsPointsPerTimeInterval : undefined,
      intervalRounding:
        cnsMethod === 'per_quantity' || cnsMethod === 'per_interval' ? cnsIntervalRounding : undefined,
      fixedCost: cnsMethod === 'fixed_cost' ? cnsFixedCost : undefined,
      allowDecimals: cnsAllowDecimals,
      minQuantity: cnsMinQuantity,
      maxQuantity: cnsMaxQuantity,
      hasAlcoholDetails: cnsHasAlcohol,
      hasBrandOrType: cnsHasBrand,
      dailyLimit: cnsDailyLimit ? Number(cnsDailyLimit) : undefined,
      weeklyLimit: cnsWeeklyLimit ? Number(cnsWeeklyLimit) : undefined,
    };

    if (editingConsumption) {
      await updateConsumptionType(editingConsumption.id, payload);
    } else {
      await addConsumptionType(payload);
    }
    setIsConsumptionModalOpen(false);
  };

  // Save Global Rules
  const handleSaveGlobalRules = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...settings,
      intensityMultipliers: localMultipliers,
      bonusRules: {
        ...settings.bonusRules,
        durationBonusThresholdMinutes: localBonusThreshold,
        durationBonusPoints: localBonusPoints,
      },
    };
    await updateSettings(updated);
    showToast('Saved point calculation rules');
  };

  // In-browser test runner
  const handleRunInAppTests = () => {
    const logs: string[] = [];
    let passed = 0;
    let failed = 0;

    const tAssert = (cond: boolean, desc: string) => {
      if (cond) {
        logs.push(`✓ ${desc}`);
        passed++;
      } else {
        logs.push(`✗ ${desc}`);
        failed++;
      }
    };

    try {
      // 1. Duration calculation
      const c1: ActivityTypeConfig = {
        id: 't_act1',
        name: 'Running',
        iconName: 'Activity',
        category: 'cardio',
        enabled: true,
        earnsPoints: true,
        calculationMethod: 'duration',
        durationIntervalMinutes: 15,
        pointsPerDurationInterval: 30,
        durationRounding: 'proportional',
      };
      const p1 = calculateActivityPoints(c1, { durationMinutes: 30 }, settings);
      tAssert(p1.basePoints === 60, 'Duration 30m @ 30pts/15m = 60 base pts');

      // 2. Repetition calculation
      const c2: ActivityTypeConfig = {
        id: 't_act2',
        name: 'Pushups',
        iconName: 'Dumbbell',
        category: 'strength',
        enabled: true,
        earnsPoints: true,
        calculationMethod: 'repetition',
        repetitionIntervalCount: 20,
        pointsPerRepetitionInterval: 10,
        repetitionRounding: 'proportional',
      };
      const p2 = calculateActivityPoints(c2, { repetitions: 40 }, settings);
      tAssert(p2.totalPoints === 20, 'Repetitions 40 reps @ 10pts/20 reps = 20 pts');

      // 3. Fixed reward
      const c3: ActivityTypeConfig = {
        id: 't_act3',
        name: 'Meditation',
        iconName: 'Heart',
        category: 'mindfulness',
        enabled: true,
        earnsPoints: true,
        calculationMethod: 'fixed',
        fixedPoints: 25,
      };
      const p3 = calculateActivityPoints(c3, {}, settings);
      tAssert(p3.totalPoints === 25, 'Fixed reward = 25 pts flat');

      // 4. Consumption calculation
      const cc1: ConsumptionTypeConfig = {
        id: 't_cns1',
        name: 'Cigarettes',
        iconName: 'Cigarette',
        category: 'smoking',
        enabled: true,
        unitName: 'cigarette',
        chargingMethod: 'per_unit',
        pointsPerUnit: 10,
        allowDecimals: false,
      };
      const cp1 = calculateConsumptionPoints(cc1, 3);
      tAssert(cp1.totalCost === 30, 'Consumption 3 units @ 10 pts = 30 pts cost');

      // 5. Signed ledger balance
      const pair = createActivityWithTransaction({
        config: c1,
        durationMinutes: 15,
        timestamp: new Date().toISOString(),
      });
      const cPair = createConsumptionWithTransaction({
        config: cc1,
        quantity: 1,
        timestamp: new Date().toISOString(),
      });
      const bal = calculateLedgerBalance([pair.transaction, cPair.transaction]);
      tAssert(bal === 20, 'Signed balance: +30 reward -10 consumption = 20 pts net');
    } catch (e: any) {
      logs.push(`Error: ${e.message}`);
      failed++;
    }

    setTestResults({ total: passed + failed, passed, failed, logs });
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-150">
      <div>
        <h2 className="text-base font-bold text-[#F2EBDD] font-serif uppercase tracking-wider">
          SANKALPA Altar of Will
        </h2>
        <p className="text-xs text-[#8e8578]">
          Configurable Disciplines, Temptation Costs, Calculation Rules &amp; Local Vault
        </p>
      </div>

      {/* Horizontal configuration navigation ribbon with styled scrollbar */}
      <div className="p-1 rounded-2xl bg-[#120f16]/90 border border-[#2b2433] backdrop-blur-md shadow-lg">
        <div
          role="tablist"
          aria-label="Altar configuration sections"
          tabIndex={0}
          className={`flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 px-1 text-xs altar-ribbon-scroll ${
            activeSection === 'consumptions' ? 'theme-papa' : ''
          }`}
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x',
          }}
        >
          {/* Section 1: Activity Types */}
          <button
            role="tab"
            aria-selected={activeSection === 'activities'}
            onClick={() => handleSelectSection('activities')}
            className={`min-h-[42px] px-3.5 py-1.5 rounded-xl border text-xs whitespace-nowrap transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A45C] shrink-0 ${
              activeSection === 'activities'
                ? 'bg-gradient-to-r from-[#2a2218] to-[#1e1912] border-[#C6A45C]/80 text-[#F2EBDD] font-serif font-bold shadow-[0_0_12px_rgba(198,164,92,0.22)]'
                : 'bg-[#15131a]/60 border-transparent text-[#9a9184] hover:text-[#F2EBDD] hover:bg-[#1c1922]'
            }`}
          >
            <PunyaSymbol size={14} color={activeSection === 'activities' ? '#C6A45C' : '#8a8276'} />
            <span>Activity Types ({settings.activityTypes.length})</span>
          </button>

          {/* Section 2: Consumption Types */}
          <button
            role="tab"
            aria-selected={activeSection === 'consumptions'}
            onClick={() => handleSelectSection('consumptions')}
            className={`min-h-[42px] px-3.5 py-1.5 rounded-xl border text-xs whitespace-nowrap transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C94750] shrink-0 ${
              activeSection === 'consumptions'
                ? 'bg-gradient-to-r from-[#2e141d] to-[#200e15] border-[#C94750]/80 text-[#E9E0DB] font-serif font-bold shadow-[0_0_12px_rgba(201,71,80,0.25)]'
                : 'bg-[#15131a]/60 border-transparent text-[#9a8c90] hover:text-[#E9E0DB] hover:bg-[#1c1922]'
            }`}
          >
            <PapaSymbol size={14} color={activeSection === 'consumptions' ? '#C94750' : '#8a7d81'} />
            <span>Consumption Types ({settings.consumptionTypes.length})</span>
          </button>

          {/* Section 3: Point Rules */}
          <button
            role="tab"
            aria-selected={activeSection === 'rules'}
            onClick={() => handleSelectSection('rules')}
            className={`min-h-[42px] px-3.5 py-1.5 rounded-xl border text-xs whitespace-nowrap transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A45C] shrink-0 ${
              activeSection === 'rules'
                ? 'bg-gradient-to-r from-[#242122] to-[#1a181b] border-[#C6A45C]/60 text-[#F2EBDD] font-serif font-bold shadow-[0_0_10px_rgba(198,164,92,0.18)]'
                : 'bg-[#15131a]/60 border-transparent text-[#9a9184] hover:text-[#F2EBDD] hover:bg-[#1c1922]'
            }`}
          >
            <Sliders className={`w-3.5 h-3.5 ${activeSection === 'rules' ? 'text-[#C6A45C]' : 'text-[#8a8276]'}`} />
            <span>Point Rules</span>
          </button>

          {/* Section 4: Personal Limits */}
          <button
            role="tab"
            aria-selected={activeSection === 'limits'}
            onClick={() => handleSelectSection('limits')}
            className={`min-h-[42px] px-3.5 py-1.5 rounded-xl border text-xs whitespace-nowrap transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9CA3AF] shrink-0 ${
              activeSection === 'limits'
                ? 'bg-gradient-to-r from-[#1c1e28] to-[#14151e] border-[#9CA3AF]/60 text-[#F2EBDD] font-serif font-bold shadow-[0_0_10px_rgba(156,163,175,0.18)]'
                : 'bg-[#15131a]/60 border-transparent text-[#9a9184] hover:text-[#F2EBDD] hover:bg-[#1c1922]'
            }`}
          >
            <Shield className={`w-3.5 h-3.5 ${activeSection === 'limits' ? 'text-[#9CA3AF]' : 'text-[#8a8276]'}`} />
            <span>Personal Limits</span>
          </button>

          {/* Section 5: Data & Backup */}
          <button
            role="tab"
            aria-selected={activeSection === 'data'}
            onClick={() => handleSelectSection('data')}
            className={`min-h-[42px] px-3.5 py-1.5 rounded-xl border text-xs whitespace-nowrap transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A45C] shrink-0 ${
              activeSection === 'data'
                ? 'bg-gradient-to-r from-[#1b2029] to-[#11161d] border-[#C6A45C]/60 text-[#F2EBDD] font-serif font-bold shadow-[0_0_10px_rgba(198,164,92,0.18)]'
                : 'bg-[#15131a]/60 border-transparent text-[#9a9184] hover:text-[#F2EBDD] hover:bg-[#1c1922]'
            }`}
          >
            <Database className={`w-3.5 h-3.5 ${activeSection === 'data' ? 'text-[#C6A45C]' : 'text-[#8a8276]'}`} />
            <span>Data &amp; Backup</span>
          </button>

          {/* End spacing element so the last tab is never clipped on mobile */}
          <div className="w-2 shrink-0" aria-hidden="true" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: ACTIVITY TYPES */}
      {/* ========================================================================= */}
      {activeSection === 'activities' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Configure point calculation methods for each activity independently.
            </span>
            <button
              onClick={openNewActivityModal}
              className="px-3 py-1.5 bg-gradient-to-r from-[#C6A45C] to-[#82683A] text-[#12100d] rounded-xl text-xs font-serif font-bold tracking-wide flex items-center gap-1 shadow-md shadow-[#C6A45C]/20 transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Discipline</span>
            </button>
          </div>

          <div className="space-y-2">
            {settings.activityTypes.map((type) => {
              let methodSummary = '';
              if (type.calculationMethod === 'duration') {
                methodSummary = `${type.pointsPerDurationInterval} pts / ${type.durationIntervalMinutes}m (${type.durationRounding || 'proportional'})`;
              } else if (type.calculationMethod === 'repetition') {
                methodSummary = `${type.pointsPerRepetitionInterval} pts / ${type.repetitionIntervalCount} reps (${type.repetitionRounding || 'proportional'})`;
              } else {
                methodSummary = `Fixed ${type.fixedPoints} pts`;
              }

              return (
                <div
                  key={type.id}
                  className={`border rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-colors ${
                    type.enabled !== false
                      ? 'virtuous-gradient-card'
                      : 'bg-[#151210]/60 border-[#2a2218] opacity-60'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F2EBDD] font-serif text-xs">{type.name}</span>
                      <span className="text-[10px] uppercase font-bold text-[#A69B89] font-sans">
                        {type.calculationMethod}
                      </span>
                      {type.enabled === false && (
                        <span className="text-[10px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/30">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#C6A45C] font-mono mt-0.5 font-medium">{methodSummary}</p>
                    {type.description && (
                      <p className="text-[10px] text-slate-400 mt-0.5">{type.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleActivityTypeEnabled(type.id)}
                      className={`p-2 rounded-lg border text-xs transition ${
                        type.enabled !== false
                          ? 'bg-[#16251e] border-[#22362b] text-emerald-400'
                          : 'bg-[#16251e] border-[#22362b] text-slate-500'
                      }`}
                      title={type.enabled !== false ? 'Disable activity' : 'Enable activity'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => openEditActivityModal(type)}
                      className="p-2 bg-[#16251e] hover:bg-[#1d3026] border border-[#22362b] rounded-lg text-slate-300 hover:text-white transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteActivityType(type.id)}
                      className="p-2 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/30 rounded-lg text-rose-400 hover:text-rose-300 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: CONSUMPTION TYPES (POINT COSTS) */}
      {/* ========================================================================= */}
      {activeSection === 'consumptions' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Configure point cost categories (smoking, alcohol, gaming, food, etc.).
            </span>
            <button
              onClick={openNewConsumptionModal}
              className="px-3 py-1.5 bg-gradient-to-r from-[#C94750] to-[#8f242d] text-white rounded-xl text-xs font-serif font-bold tracking-wide flex items-center gap-1 shadow-md shadow-[#C94750]/20 transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Temptation Type</span>
            </button>
          </div>

          <div className="space-y-2">
            {settings.consumptionTypes.map((cns) => {
              let rateDesc = '';
              if (cns.chargingMethod === 'fixed_cost') {
                rateDesc = `Fixed cost: ${cns.fixedCost} pts per entry`;
              } else if (cns.chargingMethod === 'per_unit') {
                rateDesc = `${cns.pointsPerUnit} pts per ${cns.unitName}`;
              } else if (cns.chargingMethod === 'per_quantity') {
                rateDesc = `${cns.pointsPerQuantityInterval} pts per ${cns.quantityInterval} ${cns.unitName}s`;
              } else {
                rateDesc = `${cns.pointsPerTimeInterval} pts per ${cns.timeIntervalMinutes}m`;
              }

              return (
                <div
                  key={cns.id}
                  className={`border rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-colors ${
                    cns.enabled !== false
                      ? 'shadow-gradient-card'
                      : 'bg-[#160f14]/60 border-[#28161f] opacity-60'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#E9E0DB] font-serif text-xs">{cns.name}</span>
                      <span className="text-[10px] uppercase font-bold text-[#E77A56] font-sans">
                        {cns.chargingMethod.replace('_', ' ')}
                      </span>
                      {cns.enabled === false && (
                        <span className="text-[10px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/30">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#E77A56] font-mono mt-0.5 font-medium">{rateDesc}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Unit: {cns.unitName}
                      {cns.dailyLimit ? ` · Daily limit: ${cns.dailyLimit}` : ''}
                      {cns.weeklyLimit ? ` · Weekly limit: ${cns.weeklyLimit}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleConsumptionTypeEnabled(cns.id)}
                      className={`p-2 rounded-lg border text-xs transition ${
                        cns.enabled !== false
                          ? 'bg-[#16251e] border-[#22362b] text-amber-400'
                          : 'bg-[#16251e] border-[#22362b] text-slate-500'
                      }`}
                      title={cns.enabled !== false ? 'Disable' : 'Enable'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => openEditConsumptionModal(cns)}
                      className="p-2 bg-[#27151e] hover:bg-[#341b28] border border-[#3f1f2e] rounded-lg text-[#E9E0DB] hover:text-white transition"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#E77A56]" />
                    </button>

                    <button
                      onClick={() => deleteConsumptionType(cns.id)}
                      className="p-2 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/30 rounded-lg text-rose-400 hover:text-rose-300 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: POINT RULES & BONUSES */}
      {/* ========================================================================= */}
      {activeSection === 'rules' && (
        <form onSubmit={handleSaveGlobalRules} className="bg-[#151419]/90 border border-[#30293b] rounded-3xl p-5 space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 border-b border-[#292233]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C6A45C]" />
              <h3 className="text-xs font-serif font-bold text-[#F2EBDD] uppercase tracking-wider">
                Global Intensity &amp; Milestone Rules
              </h3>
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#C6A45C] to-[#82683A] text-[#12100d] text-xs font-serif font-bold rounded-xl shadow-md hover:brightness-110 active:scale-95 transition"
            >
              Save Rules
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-serif font-semibold text-[#c4baa9] block">Intensity Multipliers</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['low', 'moderate', 'high', 'vigorous'] as IntensityLevel[]).map((lvl) => (
                <div key={lvl} className="p-2.5 bg-[#1a1820] border border-[#2e2638] rounded-xl text-center">
                  <span className="font-serif font-semibold text-[#c4baa9] capitalize text-xs block mb-1">{lvl}</span>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="10"
                    value={localMultipliers[lvl]}
                    onChange={(e) =>
                      setLocalMultipliers((prev) => ({
                        ...prev,
                        [lvl]: parseFloat(e.target.value) || 1,
                      }))
                    }
                    className="w-full h-8 bg-[#100f13] border border-[#30283a] rounded-lg text-center font-mono text-[#F2EBDD] font-bold focus:outline-none focus:border-[#C6A45C]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#292233] space-y-2">
            <label className="text-xs font-serif font-bold text-[#F2EBDD] uppercase tracking-wider block">Duration Milestone Bonus</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-[#9a9184] block mb-1">Duration Threshold (minutes)</span>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={localBonusThreshold}
                  onChange={(e) => setLocalBonusThreshold(parseInt(e.target.value) || 0)}
                  className="w-full h-9 bg-[#100f13] border border-[#30283a] rounded-xl px-3 font-mono text-xs text-[#F2EBDD] focus:outline-none focus:border-[#C6A45C]"
                />
              </div>
              <div>
                <span className="text-[11px] text-[#9a9184] block mb-1">Bonus Points Awarded</span>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={localBonusPoints}
                  onChange={(e) => setLocalBonusPoints(parseInt(e.target.value) || 0)}
                  className="w-full h-9 bg-[#100f13] border border-[#30283a] rounded-xl px-3 font-mono text-xs text-[#C6A45C] font-bold focus:outline-none focus:border-[#C6A45C]"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: PERSONAL LIMITS */}
      {/* ========================================================================= */}
      {activeSection === 'limits' && (
        <div className="bg-[#13141d]/90 border border-[#272b3d] rounded-3xl p-5 space-y-3 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 pb-2 border-b border-[#232738]">
            <Shield className="w-4 h-4 text-[#9CA3AF]" />
            <h3 className="text-xs font-serif font-bold text-[#F2EBDD] uppercase tracking-wider">Personal Consumption Limits</h3>
          </div>

          <p className="text-xs text-[#9a9ba8] leading-relaxed">
            Set voluntary daily and weekly limits on any consumption category to monitor balance.
          </p>

          <div className="space-y-2.5">
            {settings.consumptionTypes.map((cns) => (
              <div
                key={cns.id}
                className="p-3 bg-[#191b26] border border-[#272b3d] rounded-2xl flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-serif font-semibold text-[#F2EBDD]">{cns.name}</span>
                  <div className="text-[11px] text-[#9a9ba8] mt-0.5 font-mono">
                    {cns.dailyLimit ? `Daily: ${cns.dailyLimit} ${cns.unitName}s` : 'No daily limit'} ·{' '}
                    {cns.weeklyLimit ? `Weekly: ${cns.weeklyLimit} ${cns.unitName}s` : 'No weekly limit'}
                  </div>
                </div>

                <button
                  onClick={() => openEditConsumptionModal(cns)}
                  className="px-3 py-1.5 text-xs text-[#F2EBDD] bg-[#222536] hover:bg-[#2b2f45] border border-[#393f5a] rounded-xl font-serif font-medium transition"
                >
                  Adjust Limit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: DATA, BACKUP & TESTS */}
      {/* ========================================================================= */}
      {activeSection === 'data' && (
        <div className="space-y-4">
          {/* Backup Box with Technology-Inspired Styling */}
          <div className="bg-[#0e1118]/90 border border-[#202738] rounded-3xl p-5 space-y-4 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1c2333]">
              <Database className="w-4 h-4 text-[#C6A45C]" />
              <h3 className="text-xs font-serif font-bold text-[#F2EBDD] uppercase tracking-wider">JSON Backup &amp; Recovery</h3>
            </div>

            <p className="text-xs text-[#8e95a5]">
              Export a full JSON backup including your custom activities, consumption types, point rules, and ledger transactions.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  const jsonStr = exportBackupJSON();
                  const blob = new Blob([jsonStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `sankalpa-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  showToast('Exported complete backup JSON');
                }}
                className="min-h-[44px] p-2.5 bg-[#151a24] hover:bg-[#1c2330] border border-[#273248] rounded-xl flex items-center justify-center gap-2 text-xs font-serif font-semibold text-[#F2EBDD] transition shadow-sm"
              >
                <Download className="w-4 h-4 text-[#C6A45C]" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => setIsImportModalOpen(true)}
                className="min-h-[44px] p-2.5 bg-[#151a24] hover:bg-[#1c2330] border border-[#273248] rounded-xl flex items-center justify-center gap-2 text-xs font-serif font-semibold text-[#F2EBDD] transition shadow-sm"
              >
                <Upload className="w-4 h-4 text-[#C6A45C]" />
                <span>Import JSON</span>
              </button>
            </div>

            <div className="pt-2 border-t border-[#1c2333] flex items-center justify-between">
              <button
                onClick={loadSampleDataset}
                className="text-xs text-[#8e95a5] hover:text-[#F2EBDD] flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#C6A45C]" />
                <span>Reload Sample Data</span>
              </button>

              <button
                onClick={() => setIsClearConfirmOpen(true)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>

          {/* Automated Tests Runner */}
          <div className="bg-[#0e1118]/90 border border-[#202738] rounded-3xl p-5 space-y-3 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c2333]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#C6A45C]" />
                <h3 className="text-xs font-serif font-bold text-[#F2EBDD] uppercase tracking-wider">System Integrity &amp; Tests</h3>
              </div>
              <button
                onClick={handleRunInAppTests}
                className="px-2.5 py-1 bg-[#151a24] hover:bg-[#1c2330] border border-[#273248] rounded-lg text-xs font-serif font-medium text-[#C6A45C] flex items-center gap-1 transition"
              >
                <Play className="w-3 h-3" />
                <span>Run In-App Tests</span>
              </button>
            </div>

            <p className="text-xs text-[#8e95a5]">
              Verifies duration/repetition/fixed calculations, consumption charging, and signed balance integrity.
            </p>

            {testResults && (
              <div className="bg-[#090b10] p-3 rounded-xl border border-[#1c2333] text-xs font-mono space-y-1">
                <div className="flex items-center justify-between text-[#C6A45C] font-bold mb-1">
                  <span>Automated Verification</span>
                  <span>
                    {testResults.passed}/{testResults.total} Passed
                  </span>
                </div>
                {testResults.logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={log.startsWith('✓') ? 'text-emerald-400/90' : 'text-rose-400'}
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACTIVITY MODAL (CREATE / EDIT) */}
      {/* ========================================================================= */}
      {isActivityModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md bg-[#121c17] border border-[#21352a] rounded-3xl p-5 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c2e24]">
              <h3 className="text-sm font-semibold text-slate-100">
                {editingActivity ? `Edit ${editingActivity.name}` : 'Create New Activity Type'}
              </h3>
              <button onClick={() => setIsActivityModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveActivityType} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-200 block mb-1">Activity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pull-ups, Jump Rope, Trail Run"
                  value={actName}
                  onChange={(e) => setActName(e.target.value)}
                  className="w-full h-10 bg-[#0e1712] border border-[#1d3025] rounded-xl px-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Category</label>
                <select
                  value={actCategory}
                  onChange={(e) => setActCategory(e.target.value)}
                  className="w-full h-10 bg-[#0e1712] border border-[#1d3025] rounded-xl px-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="mindfulness">Mindfulness</option>
                  <option value="sports">Sports</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Point Calculation Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['duration', 'repetition', 'fixed'] as ActivityCalculationMethod[]).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setActMethod(m)}
                      className={`py-2 text-center rounded-xl border capitalize transition ${
                        actMethod === m
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-200 font-semibold'
                          : 'bg-[#15231c] border-[#22372b] text-slate-400'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* DURATION CONFIG */}
              {actMethod === 'duration' && (
                <div className="p-3 bg-[#15241c] rounded-2xl border border-[#22382c] space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Points Awarded</span>
                      <input
                        type="number"
                        min="1"
                        value={actPointsPerDuration}
                        onChange={(e) => setActPointsPerDuration(parseInt(e.target.value) || 1)}
                        className="w-full h-9 bg-[#0c1410] border border-[#233b2e] rounded-lg px-2 font-mono text-emerald-300 font-bold text-center"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Per Time Interval (mins)</span>
                      <input
                        type="number"
                        min="1"
                        value={actDurationInterval}
                        onChange={(e) => setActDurationInterval(parseInt(e.target.value) || 1)}
                        className="w-full h-9 bg-[#0c1410] border border-[#233b2e] rounded-lg px-2 font-mono text-white text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Partial Interval Rounding</span>
                    <select
                      value={actDurationRounding}
                      onChange={(e) => setActDurationRounding(e.target.value as RoundingRule)}
                      className="w-full h-8 bg-[#0c1410] border border-[#233b2e] rounded-lg px-2 text-slate-200"
                    >
                      <option value="proportional">Proportional (exact fraction)</option>
                      <option value="round_down">Round Down (completed intervals only)</option>
                      <option value="round_nearest">Round to Nearest Interval</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={actHasIntensity}
                      onChange={(e) => setActHasIntensity(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-slate-300">Enable workout intensity multiplier</span>
                  </label>
                </div>
              )}

              {/* REPETITION CONFIG */}
              {actMethod === 'repetition' && (
                <div className="p-3 bg-[#15241c] rounded-2xl border border-[#22382c] space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Points Awarded</span>
                      <input
                        type="number"
                        min="1"
                        value={actPointsPerRepetition}
                        onChange={(e) => setActPointsPerRepetition(parseInt(e.target.value) || 1)}
                        className="w-full h-9 bg-[#0c1410] border border-[#233b2e] rounded-lg px-2 font-mono text-emerald-300 font-bold text-center"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Per Number of Reps</span>
                      <input
                        type="number"
                        min="1"
                        value={actRepetitionInterval}
                        onChange={(e) => setActRepetitionInterval(parseInt(e.target.value) || 1)}
                        className="w-full h-9 bg-[#0c1410] border border-[#233b2e] rounded-lg px-2 font-mono text-white text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Partial Repetitions Rounding</span>
                    <select
                      value={actRepetitionRounding}
                      onChange={(e) => setActRepetitionRounding(e.target.value as RoundingRule)}
                      className="w-full h-8 bg-[#0c1410] border border-[#233b2e] rounded-lg px-2 text-slate-200"
                    >
                      <option value="proportional">Proportional</option>
                      <option value="round_down">Round Down</option>
                      <option value="round_nearest">Round to Nearest</option>
                    </select>
                  </div>
                </div>
              )}

              {/* FIXED REWARD CONFIG */}
              {actMethod === 'fixed' && (
                <div className="p-3 bg-[#15241c] rounded-2xl border border-[#22382c] space-y-2">
                  <span className="text-[11px] text-slate-400 block">Fixed Reward Points</span>
                  <input
                    type="number"
                    min="1"
                    value={actFixedPoints}
                    onChange={(e) => setActFixedPoints(parseInt(e.target.value) || 1)}
                    className="w-full h-9 bg-[#0c1410] border border-[#233b2e] rounded-lg px-2 font-mono text-emerald-300 font-bold text-center"
                  />
                  <p className="text-[10px] text-slate-400">
                    Awarded flat each time this activity is logged without requiring duration or repetitions.
                  </p>
                </div>
              )}

              <p className="text-[10px] text-slate-400 italic pt-1">
                Note: Updating settings applies to future activity logs. Historical transactions retain their original values.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="flex-1 h-10 bg-[#17251f] hover:bg-[#1d3026] text-slate-300 font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl"
                >
                  Save Activity Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONSUMPTION MODAL (CREATE / EDIT) */}
      {/* ========================================================================= */}
      {isConsumptionModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md bg-[#121c17] border border-[#21352a] rounded-3xl p-5 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c2e24]">
              <h3 className="text-sm font-semibold text-slate-100">
                {editingConsumption ? `Edit ${editingConsumption.name}` : 'Create Consumption Type'}
              </h3>
              <button onClick={() => setIsConsumptionModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConsumptionType} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-200 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cigarettes, Craft Beer, Gaming, Takeaway"
                  value={cnsName}
                  onChange={(e) => setCnsName(e.target.value)}
                  className="w-full h-10 bg-[#0e1712] border border-[#1d3025] rounded-xl px-3 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Unit of Consumption</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. cigarette, drink, hour, order"
                    value={cnsUnitName}
                    onChange={(e) => setCnsUnitName(e.target.value)}
                    className="w-full h-9 bg-[#0e1712] border border-[#1d3025] rounded-xl px-3 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-200 block mb-1">Category Group</label>
                  <select
                    value={cnsCategory}
                    onChange={(e) => setCnsCategory(e.target.value)}
                    className="w-full h-9 bg-[#0e1712] border border-[#1d3025] rounded-xl px-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="smoking">Smoking</option>
                    <option value="alcohol">Alcohol</option>
                    <option value="digital">Digital / Screen</option>
                    <option value="food">Food &amp; Dining</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">Charging Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'per_unit' as ConsumptionChargingMethod, label: 'Per Unit' },
                    { id: 'per_quantity' as ConsumptionChargingMethod, label: 'Per Quantity Interval' },
                    { id: 'per_interval' as ConsumptionChargingMethod, label: 'Per Time Interval' },
                    { id: 'fixed_cost' as ConsumptionChargingMethod, label: 'Fixed Cost' },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setCnsMethod(m.id)}
                      className={`py-2 text-center rounded-xl border text-[11px] transition ${
                        cnsMethod === m.id
                          ? 'bg-amber-950/70 border-amber-500 text-amber-200 font-semibold'
                          : 'bg-[#15231c] border-[#22372b] text-slate-400'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Method Pricing Fields */}
              {cnsMethod === 'per_unit' && (
                <div className="p-3 bg-[#17241d] rounded-2xl border border-[#233b2e] space-y-2">
                  <span className="text-[11px] text-slate-400 block">Points Charged Per Single {cnsUnitName}</span>
                  <input
                    type="number"
                    min="1"
                    value={cnsPointsPerUnit}
                    onChange={(e) => setCnsPointsPerUnit(parseInt(e.target.value) || 1)}
                    className="w-full h-9 bg-[#0c1410] border border-[#233b2e] rounded-lg px-2 font-mono text-amber-300 font-bold text-center"
                  />
                </div>
              )}

              {cnsMethod === 'per_quantity' && (
                <div className="p-3 bg-[#17241d] rounded-2xl border border-[#233b2e] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Points Charged</span>
                      <input
                        type="number"
                        min="1"
                        value={cnsPointsPerQuantity}
                        onChange={(e) => setCnsPointsPerQuantity(parseInt(e.target.value) || 1)}
                        className="w-full h-9 bg-[#0c1410] border border-[#233b2e] rounded-lg px-2 font-mono text-amber-300 font-bold text-center"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Per Quantity</span>
                      <input
                        type="number"
                        min="1"
                        value={cnsQuantityInterval}
                        onChange={(e) => setCnsQuantityInterval(parseInt(e.target.value) || 1)}
                        className="w-full h-9 bg-[#0c1410] border border-[#233b2e] rounded-lg px-2 font-mono text-white text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {cnsMethod === 'per_interval' && (
                <div className="p-3 bg-[#17241d] rounded-2xl border border-[#233b2e] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Points Charged</span>
                      <input
                        type="number"
                        min="1"
                        value={cnsPointsPerTimeInterval}
                        onChange={(e) => setCnsPointsPerTimeInterval(parseInt(e.target.value) || 1)}
                        className="w-full h-9 bg-[#0c1410] border border-[#233b2e] rounded-lg px-2 font-mono text-amber-300 font-bold text-center"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Per Time Interval (mins)</span>
                      <input
                        type="number"
                        min="1"
                        value={cnsTimeIntervalMinutes}
                        onChange={(e) => setCnsTimeIntervalMinutes(parseInt(e.target.value) || 1)}
                        className="w-full h-9 bg-[#0c1410] border border-[#233b2e] rounded-lg px-2 font-mono text-white text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {cnsMethod === 'fixed_cost' && (
                <div className="p-3 bg-[#17241d] rounded-2xl border border-[#233b2e] space-y-2">
                  <span className="text-[11px] text-slate-400 block">Fixed Cost Points per Entry</span>
                  <input
                    type="number"
                    min="1"
                    value={cnsFixedCost}
                    onChange={(e) => setCnsFixedCost(parseInt(e.target.value) || 1)}
                    className="w-full h-9 bg-[#0c1410] border border-[#233b2e] rounded-lg px-2 font-mono text-amber-300 font-bold text-center"
                  />
                </div>
              )}

              {/* Personal Limits */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1c2e24]">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Daily Limit (Optional)</span>
                  <input
                    type="number"
                    placeholder="None"
                    value={cnsDailyLimit || ''}
                    onChange={(e) => setCnsDailyLimit(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full h-9 bg-[#0c1410] border border-[#1d3025] rounded-xl px-2 font-mono text-xs text-white"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Weekly Limit (Optional)</span>
                  <input
                    type="number"
                    placeholder="None"
                    value={cnsWeeklyLimit || ''}
                    onChange={(e) => setCnsWeeklyLimit(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full h-9 bg-[#0c1410] border border-[#1d3025] rounded-xl px-2 font-mono text-xs text-white"
                  />
                </div>
              </div>

              {/* Additional Context Flags */}
              <div className="space-y-1.5 pt-1 border-t border-[#1c2e24]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cnsAllowDecimals}
                    onChange={(e) => setCnsAllowDecimals(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span className="text-slate-300">Allow decimal entries (e.g. 1.5 drinks)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cnsHasAlcohol}
                    onChange={(e) => setCnsHasAlcohol(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span className="text-slate-300">Enable optional beverage volume (ml) &amp; ABV (%) fields</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cnsHasBrand}
                    onChange={(e) => setCnsHasBrand(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span className="text-slate-300">Enable brand / blend name field</span>
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConsumptionModalOpen(false)}
                  className="flex-1 h-10 bg-[#17251f] hover:bg-[#1d3026] text-slate-300 font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl"
                >
                  Save Consumption Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT BACKUP MODAL */}
      {isImportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md bg-[#121c17] border border-[#21352a] rounded-3xl p-5 shadow-2xl text-slate-100 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">Safe Backup Recovery</h3>

            <input
              type="file"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const r = new FileReader();
                r.onload = (ev) => {
                  const txt = ev.target?.result as string;
                  setImportJsonText(txt);
                  try {
                    const parsed = JSON.parse(txt);
                    setImportPreview({
                      acts: parsed.activities?.length || 0,
                      cons: parsed.consumptions?.length || 0,
                      txs: parsed.transactions?.length || 0,
                    });
                  } catch {
                    setImportError('Invalid JSON');
                  }
                };
                r.readAsText(file);
              }}
              className="w-full text-xs text-slate-400"
            />

            {importPreview && (
              <div className="p-3 bg-[#17251f] rounded-xl text-xs space-y-1">
                <p>· Activities: {importPreview.acts}</p>
                <p>· Consumptions: {importPreview.cons}</p>
                <p>· Transactions: {importPreview.txs}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setImportMode('merge')}
                className={`p-2.5 rounded-xl border text-left ${
                  importMode === 'merge'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-200 font-semibold'
                    : 'bg-[#15231c] border-[#22372b] text-slate-400'
                }`}
              >
                Merge (Add missing only)
              </button>
              <button
                type="button"
                onClick={() => setImportMode('replace')}
                className={`p-2.5 rounded-xl border text-left ${
                  importMode === 'replace'
                    ? 'bg-amber-950 border-amber-500 text-amber-200 font-semibold'
                    : 'bg-[#15231c] border-[#22372b] text-slate-400'
                }`}
              >
                Replace (Clean restore)
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="flex-1 h-10 bg-[#17251f] text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!importPreview}
                onClick={async () => {
                  const res = await importBackupJSON(importJsonText, importMode);
                  if (res.success) {
                    setIsImportModalOpen(false);
                    showToast(res.message);
                  } else {
                    setImportError(res.message);
                  }
                }}
                className={`flex-1 h-10 rounded-xl text-xs font-semibold ${
                  importPreview ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'
                }`}
              >
                Confirm Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR CONFIRM MODAL */}
      {isClearConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-sm bg-[#121c17] border border-[#21352a] rounded-2xl p-5 shadow-2xl text-slate-100 space-y-4">
            <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4" />
              <span>Clear All Data?</span>
            </h3>
            <p className="text-xs text-slate-300">
              Permanently clears all activity records, consumption entries, and transactions from local storage.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="flex-1 h-10 bg-[#17251f] text-slate-300 text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await clearAllData();
                  setIsClearConfirmOpen(false);
                }}
                className="flex-1 h-10 bg-rose-600 text-white text-xs font-semibold rounded-xl"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
