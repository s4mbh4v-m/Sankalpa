/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IntensityLevel = 'low' | 'moderate' | 'high' | 'vigorous';

export type RoundingRule = 'proportional' | 'round_down' | 'round_nearest';

export type ActivityCalculationMethod = 'duration' | 'repetition' | 'fixed';

export interface ActivityTypeConfig {
  id: string;
  name: string;
  description?: string;
  iconName: string;
  category: string; // 'cardio' | 'strength' | 'flexibility' | 'mindfulness' | 'sports' | 'custom'
  enabled: boolean;
  earnsPoints: boolean;
  calculationMethod: ActivityCalculationMethod;

  // A. Duration-based:
  durationIntervalMinutes?: number; // e.g. 15 (minutes)
  pointsPerDurationInterval?: number; // e.g. 10 (points per 15 min)
  durationRounding?: RoundingRule; // proportional, round_down, round_nearest
  hasIntensityMultiplier?: boolean;

  // B. Repetition-based:
  repetitionIntervalCount?: number; // e.g. 20 (push-ups)
  pointsPerRepetitionInterval?: number; // e.g. 10 (points per 20 reps)
  repetitionRounding?: RoundingRule;

  // C. Fixed reward:
  fixedPoints?: number; // e.g. 25 points flat
}

export interface ActivityRecord {
  id: string;
  typeId: string;
  typeName: string;
  calculationMethod: ActivityCalculationMethod;
  durationMinutes?: number;
  repetitions?: number;
  intensity?: IntensityLevel;
  timestamp: string; // ISO string
  pointsEarned: number;
  notes?: string;
  transactionId: string; // Links 1-to-1 to ledger transaction
  createdAt: string;
  updatedAt: string;
}

export type ConsumptionChargingMethod =
  | 'per_unit' // e.g. 10 points per 1 cigarette
  | 'per_quantity' // e.g. 10 points per 2 cigarettes
  | 'per_interval' // e.g. 5 points per 30 minutes (gaming, screen time)
  | 'fixed_cost'; // e.g. 20 points per takeaway order

export interface ConsumptionTypeConfig {
  id: string;
  name: string;
  description?: string;
  iconName: string;
  category: string; // 'smoking' | 'alcohol' | 'food' | 'digital' | 'lifestyle' | 'custom'
  enabled: boolean;
  unitName: string; // e.g. "cigarette", "drink", "beer", "serving", "minute", "hour", "order", "gram"
  chargingMethod: ConsumptionChargingMethod;

  // Charging parameters:
  pointsPerUnit?: number; // for 'per_unit'
  quantityInterval?: number; // for 'per_quantity' (e.g. 2)
  pointsPerQuantityInterval?: number; // for 'per_quantity' (e.g. 10)
  timeIntervalMinutes?: number; // for 'per_interval' (e.g. 30)
  pointsPerTimeInterval?: number; // for 'per_interval' (e.g. 5)
  intervalRounding?: RoundingRule; // for 'per_quantity' and 'per_interval'
  fixedCost?: number; // for 'fixed_cost' (e.g. 20)

  // Input constraints:
  allowDecimals: boolean;
  minQuantity?: number;
  maxQuantity?: number;

  // Optional contextual fields:
  hasAlcoholDetails?: boolean; // beverage volume (ml) & ABV (%)
  hasBrandOrType?: boolean;

  // Personal Limits:
  dailyLimit?: number; // e.g. max 5 cigarettes/day
  weeklyLimit?: number; // e.g. max 14 units/week
}

export type AlcoholDrinkType = 'beer' | 'wine' | 'spirits' | 'cocktail' | 'other';

export interface ConsumptionRecord {
  id: string;
  typeId: string; // links to ConsumptionTypeConfig.id
  typeName: string;
  quantity: number; // count, volume, or minutes logged
  unitName: string;
  timestamp: string; // ISO string
  pointsCharged: number; // cost charged (positive number, records signed negative in ledger)
  transactionId: string; // links 1-to-1 to ledger transaction

  // Optional contextual fields:
  category?: 'cigarette' | 'alcohol' | string; // for backward compatibility
  drinkType?: AlcoholDrinkType;
  volumeMl?: number;
  abv?: number;
  pureAlcoholGrams?: number;
  standardUnits?: number;
  brandOrType?: string;
  notes?: string;

  createdAt: string;
  updatedAt?: string;
}

export type TransactionType = 'reward' | 'consumption' | 'adjustment' | 'reversal' | 'bonus';

export interface LedgerTransaction {
  id: string;
  timestamp: string; // ISO string
  type: TransactionType;
  points: number; // positive for earned (+), negative for consumption (-) or adjustments (+/-)
  description: string;
  activityId?: string; // strictly links to activity to prevent duplicate rewards
  consumptionId?: string; // strictly links to consumption to prevent duplicate deductions
  status: 'active' | 'reversed';
  reversedAt?: string;
  originalTransactionId?: string; // if this is a reversal entry
  reversalReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PointsEngineSettings {
  intensityMultipliers: Record<IntensityLevel, number>;
  activityTypes: ActivityTypeConfig[];
  consumptionTypes: ConsumptionTypeConfig[];
  bonusRules: {
    durationBonusThresholdMinutes: number; // e.g. 45 min
    durationBonusPoints: number; // e.g. 10 bonus points
    dailyStreakBonusEnabled: boolean;
    dailyStreakBonusPoints: number; // e.g. 5 points
  };
}

export interface UserPreferences {
  volumeUnit: 'ml' | 'oz';
  firstDayOfWeek: 0 | 1; // 0: Sunday, 1: Monday
  theme: 'dark';
  hasCompletedOnboarding: boolean;
  highContrast: boolean;
}

export interface AppBackupData {
  schemaVersion: 1 | 2;
  exportedAt: string;
  appName: 'Nasha Ledger';
  activities: ActivityRecord[];
  consumptions: ConsumptionRecord[];
  transactions: LedgerTransaction[];
  settings: PointsEngineSettings;
  preferences: UserPreferences;
}
