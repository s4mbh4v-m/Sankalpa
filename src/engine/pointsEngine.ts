/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ActivityRecord,
  ActivityTypeConfig,
  ConsumptionRecord,
  ConsumptionTypeConfig,
  IntensityLevel,
  LedgerTransaction,
  PointsEngineSettings,
  RoundingRule,
} from '../types';

export const DEFAULT_ACTIVITY_TYPES: ActivityTypeConfig[] = [
  {
    id: 'running',
    name: 'Running',
    description: 'Outdoor road or trail running',
    iconName: 'Activity',
    category: 'cardio',
    enabled: true,
    earnsPoints: true,
    calculationMethod: 'duration',
    durationIntervalMinutes: 15,
    pointsPerDurationInterval: 30, // 30 pts per 15 mins (= 2 pts/min)
    durationRounding: 'proportional',
    hasIntensityMultiplier: true,
  },
  {
    id: 'walking',
    name: 'Brisk Walking',
    description: 'Paced walking outdoors or treadmill',
    iconName: 'Footprints',
    category: 'cardio',
    enabled: true,
    earnsPoints: true,
    calculationMethod: 'duration',
    durationIntervalMinutes: 30,
    pointsPerDurationInterval: 30, // 30 pts per 30 mins (= 1 pt/min)
    durationRounding: 'proportional',
    hasIntensityMultiplier: false,
  },
  {
    id: 'cycling',
    name: 'Cycling',
    description: 'Road cycling or stationary bike',
    iconName: 'Bike',
    category: 'cardio',
    enabled: true,
    earnsPoints: true,
    calculationMethod: 'duration',
    durationIntervalMinutes: 30,
    pointsPerDurationInterval: 45, // 45 pts per 30 mins (= 1.5 pts/min)
    durationRounding: 'proportional',
    hasIntensityMultiplier: true,
  },
  {
    id: 'pushups',
    name: 'Push-ups',
    description: 'Chest & core push-up sets',
    iconName: 'Dumbbell',
    category: 'strength',
    enabled: true,
    earnsPoints: true,
    calculationMethod: 'repetition',
    repetitionIntervalCount: 20,
    pointsPerRepetitionInterval: 10, // 10 pts per 20 reps
    repetitionRounding: 'proportional',
  },
  {
    id: 'squats',
    name: 'Bodyweight Squats',
    description: 'Lower body repetition sets',
    iconName: 'Flame',
    category: 'strength',
    enabled: true,
    earnsPoints: true,
    calculationMethod: 'repetition',
    repetitionIntervalCount: 25,
    pointsPerRepetitionInterval: 15, // 15 pts per 25 reps
    repetitionRounding: 'proportional',
  },
  {
    id: 'swimming',
    name: 'Swimming',
    description: 'Lap swimming in pool or open water',
    iconName: 'Waves',
    category: 'cardio',
    enabled: true,
    earnsPoints: true,
    calculationMethod: 'duration',
    durationIntervalMinutes: 15,
    pointsPerDurationInterval: 33, // 2.2 pts/min
    durationRounding: 'proportional',
    hasIntensityMultiplier: true,
  },
  {
    id: 'yoga',
    name: 'Yoga & Mobility',
    description: 'Stretching and mobility flow',
    iconName: 'Sparkles',
    category: 'flexibility',
    enabled: true,
    earnsPoints: true,
    calculationMethod: 'duration',
    durationIntervalMinutes: 20,
    pointsPerDurationInterval: 24, // 1.2 pts/min
    durationRounding: 'proportional',
    hasIntensityMultiplier: false,
  },
  {
    id: 'meditation',
    name: 'Daily Meditation',
    description: 'Mindfulness & breathwork session',
    iconName: 'Heart',
    category: 'mindfulness',
    enabled: true,
    earnsPoints: true,
    calculationMethod: 'fixed',
    fixedPoints: 15, // 15 points flat
  },
  {
    id: 'coldplunge',
    name: 'Cold Plunge / Shower',
    description: 'Deliberate cold exposure',
    iconName: 'Zap',
    category: 'mindfulness',
    enabled: true,
    earnsPoints: true,
    calculationMethod: 'fixed',
    fixedPoints: 20,
  },
];

export const DEFAULT_CONSUMPTION_TYPES: ConsumptionTypeConfig[] = [
  {
    id: 'cigarette',
    name: 'Cigarettes',
    description: 'Tobacco smoking',
    iconName: 'Cigarette',
    category: 'smoking',
    enabled: true,
    unitName: 'cigarette',
    chargingMethod: 'per_unit',
    pointsPerUnit: 10, // 10 pts per cigarette
    allowDecimals: false,
    minQuantity: 1,
    maxQuantity: 100,
    hasBrandOrType: true,
    dailyLimit: 5,
  },
  {
    id: 'alcohol',
    name: 'Alcoholic Drink',
    description: 'Beer, wine, spirits or cocktails',
    iconName: 'Wine',
    category: 'alcohol',
    enabled: true,
    unitName: 'drink',
    chargingMethod: 'per_unit',
    pointsPerUnit: 15, // 15 pts per standard drink
    allowDecimals: true,
    minQuantity: 0.5,
    maxQuantity: 20,
    hasAlcoholDetails: true,
    weeklyLimit: 14,
  },
  {
    id: 'gaming',
    name: 'Video Gaming',
    description: 'Console or PC gaming sessions',
    iconName: 'Gamepad2',
    category: 'digital',
    enabled: true,
    unitName: 'minute',
    chargingMethod: 'per_interval',
    timeIntervalMinutes: 30,
    pointsPerTimeInterval: 5, // 5 pts per 30 minutes
    intervalRounding: 'proportional',
    allowDecimals: false,
    dailyLimit: 120, // max 120 min
  },
  {
    id: 'takeaway',
    name: 'Takeaway / Fast Food',
    description: 'Fast food orders or takeout deliveries',
    iconName: 'ShoppingBag',
    category: 'food',
    enabled: true,
    unitName: 'order',
    chargingMethod: 'fixed_cost',
    fixedCost: 20, // 20 pts per order
    allowDecimals: false,
    minQuantity: 1,
    maxQuantity: 5,
    weeklyLimit: 2,
  },
];

export const DEFAULT_SETTINGS: PointsEngineSettings = {
  intensityMultipliers: {
    low: 0.8,
    moderate: 1.0,
    high: 1.3,
    vigorous: 1.6,
  },
  activityTypes: DEFAULT_ACTIVITY_TYPES,
  consumptionTypes: DEFAULT_CONSUMPTION_TYPES,
  bonusRules: {
    durationBonusThresholdMinutes: 45,
    durationBonusPoints: 10,
    dailyStreakBonusEnabled: true,
    dailyStreakBonusPoints: 5,
  },
};

/**
 * Applies rounding rules (proportional, round_down, round_nearest).
 */
export function applyRounding(value: number, rule: RoundingRule = 'proportional'): number {
  if (rule === 'round_down') {
    return Math.floor(value);
  }
  if (rule === 'round_nearest') {
    return Math.round(value);
  }
  return value; // proportional
}

/**
 * Calculates activity points based on the activity's configured calculation method.
 */
export function calculateActivityPoints(
  activityConfig: ActivityTypeConfig,
  params: {
    durationMinutes?: number;
    repetitions?: number;
    intensity?: IntensityLevel;
  },
  settings: PointsEngineSettings = DEFAULT_SETTINGS
): {
  basePoints: number;
  durationBonus: number;
  totalPoints: number;
  breakdown: string;
} {
  if (!activityConfig.earnsPoints) {
    return {
      basePoints: 0,
      durationBonus: 0,
      totalPoints: 0,
      breakdown: `${activityConfig.name} (Point earning disabled)`,
    };
  }

  // Method 1: Fixed reward
  if (activityConfig.calculationMethod === 'fixed') {
    const fixedPts = activityConfig.fixedPoints ?? 0;
    return {
      basePoints: fixedPts,
      durationBonus: 0,
      totalPoints: fixedPts,
      breakdown: `Fixed reward: ${fixedPts} pts`,
    };
  }

  // Method 2: Repetition-based
  if (activityConfig.calculationMethod === 'repetition') {
    const reps = params.repetitions ?? 0;
    if (reps <= 0) {
      return { basePoints: 0, durationBonus: 0, totalPoints: 0, breakdown: '0 repetitions' };
    }

    const intervalCount = activityConfig.repetitionIntervalCount || 1;
    const pointsPerInterval = activityConfig.pointsPerRepetitionInterval || 0;
    const intervals = reps / intervalCount;
    const effectiveIntervals = applyRounding(intervals, activityConfig.repetitionRounding || 'proportional');

    const totalPoints = Math.round(effectiveIntervals * pointsPerInterval * 10) / 10;
    const breakdown = `${reps} reps (${pointsPerInterval} pts per ${intervalCount} reps, ${activityConfig.repetitionRounding || 'proportional'})`;

    return {
      basePoints: totalPoints,
      durationBonus: 0,
      totalPoints,
      breakdown,
    };
  }

  // Method 3: Duration-based
  const duration = params.durationMinutes ?? 0;
  if (duration <= 0) {
    return { basePoints: 0, durationBonus: 0, totalPoints: 0, breakdown: '0 minutes' };
  }

  const intervalMinutes = activityConfig.durationIntervalMinutes || 1;
  const pointsPerInterval = activityConfig.pointsPerDurationInterval || 0;
  const intervals = duration / intervalMinutes;
  const effectiveIntervals = applyRounding(intervals, activityConfig.durationRounding || 'proportional');

  const intensityMultiplier =
    activityConfig.hasIntensityMultiplier && params.intensity
      ? settings.intensityMultipliers[params.intensity] ?? 1.0
      : 1.0;

  const rawBasePoints = effectiveIntervals * pointsPerInterval * intensityMultiplier;
  const basePoints = Math.round(rawBasePoints * 10) / 10;

  let durationBonus = 0;
  if (
    settings.bonusRules.durationBonusThresholdMinutes > 0 &&
    duration >= settings.bonusRules.durationBonusThresholdMinutes
  ) {
    durationBonus = settings.bonusRules.durationBonusPoints;
  }

  const totalPoints = Math.round((basePoints + durationBonus) * 10) / 10;
  const breakdown = `${duration}m (${pointsPerInterval} pts / ${intervalMinutes}m, ${activityConfig.durationRounding || 'proportional'})${
    intensityMultiplier !== 1.0 ? ` × ${intensityMultiplier}x` : ''
  }${durationBonus > 0 ? ` + ${durationBonus}pt milestone` : ''}`;

  return {
    basePoints,
    durationBonus,
    totalPoints,
    breakdown,
  };
}

/**
 * Calculates point cost for a consumption item based on its configured charging method.
 */
export function calculateConsumptionPoints(
  consumptionConfig: ConsumptionTypeConfig,
  quantity: number
): {
  totalCost: number;
  breakdown: string;
} {
  if (quantity <= 0) {
    return { totalCost: 0, breakdown: '0 quantity' };
  }

  // Charging Method 1: Fixed cost per logged event
  if (consumptionConfig.chargingMethod === 'fixed_cost') {
    const cost = consumptionConfig.fixedCost ?? 0;
    return {
      totalCost: cost,
      breakdown: `Fixed cost: ${cost} pts per entry`,
    };
  }

  // Charging Method 2: Per single item / unit
  if (consumptionConfig.chargingMethod === 'per_unit') {
    const unitRate = consumptionConfig.pointsPerUnit ?? 0;
    const cost = Math.round(quantity * unitRate * 10) / 10;
    return {
      totalCost: cost,
      breakdown: `${quantity} ${consumptionConfig.unitName}${quantity > 1 ? 's' : ''} × ${unitRate} pts`,
    };
  }

  // Charging Method 3: Per configurable quantity interval (e.g. 10 pts per 2 units)
  if (consumptionConfig.chargingMethod === 'per_quantity') {
    const qInterval = consumptionConfig.quantityInterval || 1;
    const pointsPerInterval = consumptionConfig.pointsPerQuantityInterval || 0;
    const intervals = quantity / qInterval;
    const effectiveIntervals = applyRounding(intervals, consumptionConfig.intervalRounding || 'proportional');
    const cost = Math.round(effectiveIntervals * pointsPerInterval * 10) / 10;
    return {
      totalCost: cost,
      breakdown: `${quantity} ${consumptionConfig.unitName}${quantity > 1 ? 's' : ''} (${pointsPerInterval} pts per ${qInterval} ${consumptionConfig.unitName})`,
    };
  }

  // Charging Method 4: Per time interval (e.g. 5 pts per 30 minutes)
  const tInterval = consumptionConfig.timeIntervalMinutes || 1;
  const pointsPerInterval = consumptionConfig.pointsPerTimeInterval || 0;
  const intervals = quantity / tInterval;
  const effectiveIntervals = applyRounding(intervals, consumptionConfig.intervalRounding || 'proportional');
  const cost = Math.round(effectiveIntervals * pointsPerInterval * 10) / 10;
  return {
    totalCost: cost,
    breakdown: `${quantity} min (${pointsPerInterval} pts per ${tInterval} min)`,
  };
}

/**
 * Validates dynamic activity input based on calculation method.
 */
export function validateActivityInput(
  config: ActivityTypeConfig,
  params: {
    durationMinutes?: number;
    repetitions?: number;
    timestamp: string;
  }
): { isValid: boolean; error?: string } {
  const date = new Date(params.timestamp);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Valid date and time is required.' };
  }

  if (config.calculationMethod === 'duration') {
    if (typeof params.durationMinutes !== 'number' || isNaN(params.durationMinutes) || params.durationMinutes <= 0) {
      return { isValid: false, error: 'Duration must be greater than 0 minutes.' };
    }
    if (params.durationMinutes > 1440) {
      return { isValid: false, error: 'Duration cannot exceed 24 hours.' };
    }
  } else if (config.calculationMethod === 'repetition') {
    if (typeof params.repetitions !== 'number' || isNaN(params.repetitions) || params.repetitions <= 0) {
      return { isValid: false, error: 'Repetitions count must be greater than 0.' };
    }
    if (!Number.isInteger(params.repetitions)) {
      return { isValid: false, error: 'Repetitions must be a whole number.' };
    }
  }

  return { isValid: true };
}

/**
 * Validates dynamic consumption input based on config constraints.
 */
export function validateConsumptionInput(
  config: ConsumptionTypeConfig,
  quantity: number,
  timestamp: string
): { isValid: boolean; error?: string } {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Valid date and time is required.' };
  }

  if (typeof quantity !== 'number' || isNaN(quantity) || quantity <= 0) {
    return { isValid: false, error: `Quantity must be greater than 0 ${config.unitName}.` };
  }

  if (!config.allowDecimals && !Number.isInteger(quantity)) {
    return { isValid: false, error: `${config.name} quantity must be a whole integer.` };
  }

  if (config.minQuantity !== undefined && quantity < config.minQuantity) {
    return { isValid: false, error: `Minimum quantity is ${config.minQuantity} ${config.unitName}.` };
  }

  if (config.maxQuantity !== undefined && quantity > config.maxQuantity) {
    return { isValid: false, error: `Maximum quantity is ${config.maxQuantity} ${config.unitName}.` };
  }

  return { isValid: true };
}

/**
 * Alcohol volume/ABV validation.
 */
export function validateAlcoholDetails(
  volumeMl?: number,
  abv?: number
): { isValid: boolean; error?: string } {
  if (volumeMl !== undefined && (isNaN(volumeMl) || volumeMl <= 0)) {
    return { isValid: false, error: 'Beverage volume must be greater than 0 ml.' };
  }
  if (abv !== undefined && (isNaN(abv) || abv < 0 || abv > 100)) {
    return { isValid: false, error: 'ABV must be between 0% and 100%.' };
  }
  return { isValid: true };
}

/**
 * Calculate pure alcohol grams & standard units.
 */
export function calculateAlcoholMetrics(
  quantity: number,
  volumeMl: number,
  abv: number
): { pureAlcoholGrams: number; standardUnits: number } {
  if (quantity <= 0 || volumeMl <= 0 || abv <= 0) {
    return { pureAlcoholGrams: 0, standardUnits: 0 };
  }
  const totalVolumeMl = quantity * volumeMl;
  const pureEthanolMl = totalVolumeMl * (abv / 100);
  const pureAlcoholGrams = Math.round(pureEthanolMl * 0.7892 * 10) / 10;
  const standardUnits = Math.round((pureEthanolMl / 10) * 10) / 10;

  return { pureAlcoholGrams, standardUnits };
}

/**
 * Calculates current points balance directly from all active transactions.
 * Positive transactions = points earned.
 * Negative transactions = points spent on consumption / adjustments.
 */
export function calculateLedgerBalance(transactions: LedgerTransaction[]): number {
  const sum = transactions.reduce((acc, tx) => {
    if (tx.status === 'active') {
      return acc + tx.points;
    }
    return acc;
  }, 0);
  return Math.round(sum * 10) / 10;
}

/**
 * Calculates positive points earned on a specific day.
 */
export function calculatePointsEarnedOnDay(
  transactions: LedgerTransaction[],
  dayDate: Date = new Date()
): number {
  const targetYear = dayDate.getFullYear();
  const targetMonth = dayDate.getMonth();
  const targetDay = dayDate.getDate();

  const sum = transactions.reduce((acc, tx) => {
    if (tx.status !== 'active' || tx.points <= 0) return acc;
    const txDate = new Date(tx.timestamp);
    if (
      txDate.getFullYear() === targetYear &&
      txDate.getMonth() === targetMonth &&
      txDate.getDate() === targetDay
    ) {
      return acc + tx.points;
    }
    return acc;
  }, 0);

  return Math.round(sum * 10) / 10;
}

/**
 * Calculates negative points spent on a specific day.
 */
export function calculatePointsSpentOnDay(
  transactions: LedgerTransaction[],
  dayDate: Date = new Date()
): number {
  const targetYear = dayDate.getFullYear();
  const targetMonth = dayDate.getMonth();
  const targetDay = dayDate.getDate();

  const sum = transactions.reduce((acc, tx) => {
    if (tx.status !== 'active' || tx.points >= 0) return acc;
    const txDate = new Date(tx.timestamp);
    if (
      txDate.getFullYear() === targetYear &&
      txDate.getMonth() === targetMonth &&
      txDate.getDate() === targetDay
    ) {
      return acc + Math.abs(tx.points);
    }
    return acc;
  }, 0);

  return Math.round(sum * 10) / 10;
}

/**
 * Check if an activity record is already rewarded by an active transaction.
 */
export function isActivityAlreadyRewarded(
  activityId: string,
  transactions: LedgerTransaction[]
): boolean {
  return transactions.some(
    (tx) => tx.activityId === activityId && tx.status === 'active'
  );
}

/**
 * Check if a consumption record is already charged by an active transaction.
 */
export function isConsumptionAlreadyCharged(
  consumptionId: string,
  transactions: LedgerTransaction[]
): boolean {
  return transactions.some(
    (tx) => tx.consumptionId === consumptionId && tx.status === 'active'
  );
}

/**
 * Creates an activity record paired with its unique reward transaction.
 */
export function createActivityWithTransaction(params: {
  id?: string;
  transactionId?: string;
  config: ActivityTypeConfig;
  durationMinutes?: number;
  repetitions?: number;
  intensity?: IntensityLevel;
  timestamp: string;
  notes?: string;
  settings?: PointsEngineSettings;
  existingTransactions?: LedgerTransaction[];
}): { activity: ActivityRecord; transaction: LedgerTransaction } {
  const now = new Date().toISOString();
  const activityId = params.id || `act_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const transactionId = params.transactionId || `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  // Idempotency check
  if (params.existingTransactions && isActivityAlreadyRewarded(activityId, params.existingTransactions)) {
    throw new Error(`Activity ${activityId} already has an active reward transaction.`);
  }

  const { totalPoints, breakdown } = calculateActivityPoints(
    params.config,
    {
      durationMinutes: params.durationMinutes,
      repetitions: params.repetitions,
      intensity: params.intensity,
    },
    params.settings
  );

  let desc = params.config.name;
  if (params.config.calculationMethod === 'duration') {
    desc += ` (${params.durationMinutes}m${params.intensity ? `, ${params.intensity}` : ''})`;
  } else if (params.config.calculationMethod === 'repetition') {
    desc += ` (${params.repetitions} reps)`;
  } else {
    desc += ' (Fixed reward)';
  }

  const activity: ActivityRecord = {
    id: activityId,
    typeId: params.config.id,
    typeName: params.config.name,
    calculationMethod: params.config.calculationMethod,
    durationMinutes: params.durationMinutes,
    repetitions: params.repetitions,
    intensity: params.intensity,
    timestamp: params.timestamp,
    pointsEarned: totalPoints,
    notes: params.notes,
    transactionId: transactionId,
    createdAt: now,
    updatedAt: now,
  };

  const transaction: LedgerTransaction = {
    id: transactionId,
    timestamp: params.timestamp,
    type: 'reward',
    points: totalPoints,
    description: desc,
    activityId: activityId,
    status: 'active',
    notes: breakdown,
    createdAt: now,
    updatedAt: now,
  };

  return { activity, transaction };
}

/**
 * Creates a consumption record paired with its unique signed negative transaction.
 */
export function createConsumptionWithTransaction(params: {
  id?: string;
  transactionId?: string;
  config: ConsumptionTypeConfig;
  quantity: number;
  timestamp: string;
  drinkType?: any;
  volumeMl?: number;
  abv?: number;
  pureAlcoholGrams?: number;
  standardUnits?: number;
  brandOrType?: string;
  notes?: string;
  existingTransactions?: LedgerTransaction[];
}): { consumption: ConsumptionRecord; transaction: LedgerTransaction } {
  const now = new Date().toISOString();
  const consumptionId = params.id || `cns_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const transactionId = params.transactionId || `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  // Idempotency check
  if (params.existingTransactions && isConsumptionAlreadyCharged(consumptionId, params.existingTransactions)) {
    throw new Error(`Consumption ${consumptionId} already has an active ledger transaction.`);
  }

  const { totalCost, breakdown } = calculateConsumptionPoints(params.config, params.quantity);

  const desc = `${params.config.name} (${params.quantity} ${params.config.unitName}${params.quantity > 1 ? 's' : ''})`;

  const consumption: ConsumptionRecord = {
    id: consumptionId,
    typeId: params.config.id,
    typeName: params.config.name,
    category: params.config.category,
    quantity: params.quantity,
    unitName: params.config.unitName,
    timestamp: params.timestamp,
    pointsCharged: totalCost,
    transactionId: transactionId,
    drinkType: params.drinkType,
    volumeMl: params.volumeMl,
    abv: params.abv,
    pureAlcoholGrams: params.pureAlcoholGrams,
    standardUnits: params.standardUnits,
    brandOrType: params.brandOrType,
    notes: params.notes,
    createdAt: now,
    updatedAt: now,
  };

  // Signed negative point value for consumption spent!
  const transaction: LedgerTransaction = {
    id: transactionId,
    timestamp: params.timestamp,
    type: 'consumption',
    points: -totalCost, // negative points
    description: desc,
    consumptionId: consumptionId,
    status: 'active',
    notes: breakdown,
    createdAt: now,
    updatedAt: now,
  };

  return { consumption, transaction };
}

/**
 * Reverses a transaction and returns updated records.
 */
export function reverseTransaction(
  transactionId: string,
  transactions: LedgerTransaction[],
  reason: string = 'User reversed transaction'
): { updatedTransactions: LedgerTransaction[]; reversedTx: LedgerTransaction } {
  const txIndex = transactions.findIndex((t) => t.id === transactionId);
  if (txIndex === -1) {
    throw new Error(`Transaction ${transactionId} not found.`);
  }

  const targetTx = transactions[txIndex];
  if (targetTx.status === 'reversed') {
    throw new Error('Transaction is already reversed.');
  }

  const now = new Date().toISOString();
  const updatedTx: LedgerTransaction = {
    ...targetTx,
    status: 'reversed',
    reversedAt: now,
    reversalReason: reason,
    updatedAt: now,
  };

  const updatedList = [...transactions];
  updatedList[txIndex] = updatedTx;

  return { updatedTransactions: updatedList, reversedTx: updatedTx };
}
