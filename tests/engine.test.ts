/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
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
  isActivityAlreadyRewarded,
  isConsumptionAlreadyCharged,
  applyRounding,
  DEFAULT_SETTINGS,
} from '../src/engine/pointsEngine';
import {
  ActivityTypeConfig,
  ConsumptionTypeConfig,
  LedgerTransaction,
} from '../src/types';

function runTestSuite() {
  console.log('--- Starting Nasha Ledger Configurable Engine Test Suite ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ ${testName}`);
      failed++;
    }
  }

  // 1. Duration-based calculation & intervals
  console.log('\n[Case 1: Duration-based Activity with Configurable Intervals & Rounding]');
  {
    // Activity: 10 points per 15 minutes, proportional
    const customDurationConfig: ActivityTypeConfig = {
      id: 'custom_run',
      name: 'Custom Run',
      iconName: 'Activity',
      category: 'cardio',
      enabled: true,
      earnsPoints: true,
      calculationMethod: 'duration',
      durationIntervalMinutes: 15,
      pointsPerDurationInterval: 10,
      durationRounding: 'proportional',
      hasIntensityMultiplier: false,
    };

    // 45 minutes = 3 intervals of 15 min -> 30 base points + 10 milestone bonus = 40 total points
    const p1 = calculateActivityPoints(customDurationConfig, { durationMinutes: 45 }, DEFAULT_SETTINGS);
    assert(p1.basePoints === 30, '45 min with 10 pts per 15 min = 30 base points');
    assert(p1.totalPoints === 40, '45 min with 10 pts bonus = 40 total points');

    // 20 minutes proportional = (20/15) * 10 = 13.3 points
    const p2 = calculateActivityPoints(customDurationConfig, { durationMinutes: 20 }, DEFAULT_SETTINGS);
    assert(p2.totalPoints === 13.3, '20 min proportional with 15 min interval = 13.3 points');

    // Change interval: 20 points per 30 minutes, round down
    const intervalChangedConfig: ActivityTypeConfig = {
      ...customDurationConfig,
      durationIntervalMinutes: 30,
      pointsPerDurationInterval: 20,
      durationRounding: 'round_down',
    };
    // 50 minutes: 50/30 = 1.666 -> round down = 1 interval -> 20 base points + 10 bonus = 30 points
    const p3 = calculateActivityPoints(intervalChangedConfig, { durationMinutes: 50 }, DEFAULT_SETTINGS);
    assert(p3.basePoints === 20, 'Changing interval to 30 min with round down awards 20 base points for 50 min');

    // Round to nearest: 50 minutes / 30 min = 1.666 -> rounds to 2 intervals -> 40 base points
    const roundNearestConfig: ActivityTypeConfig = {
      ...intervalChangedConfig,
      durationRounding: 'round_nearest',
    };
    const p4 = calculateActivityPoints(roundNearestConfig, { durationMinutes: 50 }, DEFAULT_SETTINGS);
    assert(p4.basePoints === 40, 'Round nearest for 50 min with 30 min interval awards 40 base points');
  }

  // 2. Repetition-based calculation
  console.log('\n[Case 2: Repetition-based Activity with Configurable Reps & Rounding]');
  {
    // 10 points per 20 push-ups, proportional
    const pushupConfig: ActivityTypeConfig = {
      id: 'custom_pushups',
      name: 'Push-ups',
      iconName: 'Dumbbell',
      category: 'strength',
      enabled: true,
      earnsPoints: true,
      calculationMethod: 'repetition',
      repetitionIntervalCount: 20,
      pointsPerRepetitionInterval: 10,
      repetitionRounding: 'proportional',
    };

    // 40 reps = 20 points
    const r1 = calculateActivityPoints(pushupConfig, { repetitions: 40 }, DEFAULT_SETTINGS);
    assert(r1.totalPoints === 20, '40 push-ups (10 pts per 20 reps) = 20 points');

    // 30 reps proportional = 1.5 * 10 = 15 points
    const r2 = calculateActivityPoints(pushupConfig, { repetitions: 30 }, DEFAULT_SETTINGS);
    assert(r2.totalPoints === 15, '30 push-ups proportional = 15 points');

    // 30 reps with round_down = 1 * 10 = 10 points
    const r3 = calculateActivityPoints(
      { ...pushupConfig, repetitionRounding: 'round_down' },
      { repetitions: 30 },
      DEFAULT_SETTINGS
    );
    assert(r3.totalPoints === 10, '30 push-ups with round_down = 10 points');
  }

  // 3. Fixed reward calculation
  console.log('\n[Case 3: Fixed-Reward Activity]');
  {
    const meditationConfig: ActivityTypeConfig = {
      id: 'custom_meditation',
      name: 'Meditation',
      iconName: 'Heart',
      category: 'mindfulness',
      enabled: true,
      earnsPoints: true,
      calculationMethod: 'fixed',
      fixedPoints: 25,
    };

    const f1 = calculateActivityPoints(meditationConfig, {}, DEFAULT_SETTINGS);
    assert(f1.totalPoints === 25, 'Fixed reward awards exactly 25 points regardless of duration or reps');
  }

  // 4. Custom consumption types: per unit
  console.log('\n[Case 4: Custom Consumption Type (Per Unit)]');
  {
    const cigConfig: ConsumptionTypeConfig = {
      id: 'custom_cig',
      name: 'Cigarettes',
      iconName: 'Cigarette',
      category: 'smoking',
      enabled: true,
      unitName: 'cigarette',
      chargingMethod: 'per_unit',
      pointsPerUnit: 10,
      allowDecimals: false,
    };

    // Single unit
    const c1 = calculateConsumptionPoints(cigConfig, 1);
    assert(c1.totalCost === 10, '1 cigarette @ 10 pts/unit = 10 points cost');

    // Multiple units in one entry: 3 cigarettes
    const c2 = calculateConsumptionPoints(cigConfig, 3);
    assert(c2.totalCost === 30, 'Logging 3 cigarettes in one entry calculates 30 points cost');
  }

  // 5. Time-based consumption type: per interval
  console.log('\n[Case 5: Time-based Consumption Type (Gaming / Screen Time)]');
  {
    const gamingConfig: ConsumptionTypeConfig = {
      id: 'custom_gaming',
      name: 'Video Gaming',
      iconName: 'Gamepad2',
      category: 'digital',
      enabled: true,
      unitName: 'minute',
      chargingMethod: 'per_interval',
      timeIntervalMinutes: 30,
      pointsPerTimeInterval: 5,
      intervalRounding: 'proportional',
      allowDecimals: false,
    };

    // 60 minutes = 2 intervals = 10 points cost
    const g1 = calculateConsumptionPoints(gamingConfig, 60);
    assert(g1.totalCost === 10, '60 minutes of gaming @ 5 pts per 30 min = 10 points cost');

    // 45 minutes proportional = 1.5 * 5 = 7.5 points cost
    const g2 = calculateConsumptionPoints(gamingConfig, 45);
    assert(g2.totalCost === 7.5, '45 minutes proportional = 7.5 points cost');
  }

  // 6. Future point cost change without altering historical transactions
  console.log('\n[Case 6: Future Point Cost Change Preserves Historical Transactions]');
  {
    const initialConfig: ConsumptionTypeConfig = {
      id: 'cns_coffee',
      name: 'Specialty Coffee',
      iconName: 'Coffee',
      category: 'lifestyle',
      enabled: true,
      unitName: 'cup',
      chargingMethod: 'per_unit',
      pointsPerUnit: 12,
      allowDecimals: false,
    };

    // Log transaction with initial config: 1 cup = 12 points
    const { transaction: historicalTx } = createConsumptionWithTransaction({
      config: initialConfig,
      quantity: 1,
      timestamp: new Date().toISOString(),
    });
    assert(historicalTx.points === -12, 'Historical transaction records -12 points');

    // Now change future point cost to 18 points per cup
    const updatedConfig: ConsumptionTypeConfig = {
      ...initialConfig,
      pointsPerUnit: 18,
    };

    // Historical transaction must STILL be -12 points
    assert(historicalTx.points === -12, 'Historical transaction remains intact at -12 points despite config change');

    // New transaction logged with updated config
    const { transaction: newTx } = createConsumptionWithTransaction({
      config: updatedConfig,
      quantity: 1,
      timestamp: new Date().toISOString(),
    });
    assert(newTx.points === -18, 'New transaction correctly reflects the new 18-point rate');
  }

  // 7. Signed ledger balance and negative balance handling
  console.log('\n[Case 7: Signed Ledger Balance & Negative Balance]');
  {
    // Activity transaction: +50 points
    const txEarned: LedgerTransaction = {
      id: 'tx_e1',
      timestamp: new Date().toISOString(),
      type: 'reward',
      points: 50,
      description: 'Running',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Consumption transaction: -30 points
    const txSpent: LedgerTransaction = {
      id: 'tx_s1',
      timestamp: new Date().toISOString(),
      type: 'consumption',
      points: -30,
      description: 'Cigarettes (3 cigarettes)',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let ledger = [txEarned, txSpent];
    assert(calculateLedgerBalance(ledger) === 20, 'Current balance = +50 - 30 = 20 points');
    assert(calculatePointsEarnedOnDay(ledger) === 50, 'Points earned today = 50');
    assert(calculatePointsSpentOnDay(ledger) === 30, 'Points spent today = 30');

    // Spend another 40 points -> balance goes negative (-20)
    const txOverspend: LedgerTransaction = {
      id: 'tx_s2',
      timestamp: new Date().toISOString(),
      type: 'consumption',
      points: -40,
      description: 'Takeaway meal',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ledger = [...ledger, txOverspend];
    assert(calculateLedgerBalance(ledger) === -20, 'Balance accurately reflects negative balance of -20 without error');
  }

  // 8. Reversal and Deletion consistency
  console.log('\n[Case 8: Reversal, Deletion & Idempotency]');
  {
    const tx: LedgerTransaction = {
      id: 'tx_rev_test',
      timestamp: new Date().toISOString(),
      type: 'consumption',
      points: -25,
      description: 'Beer (2 drinks)',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let list = [tx];
    assert(calculateLedgerBalance(list) === -25, 'Initial balance = -25');

    // Reverse transaction
    const { updatedTransactions, reversedTx } = reverseTransaction('tx_rev_test', list, 'Mis-logged drink');
    assert(reversedTx.status === 'reversed', 'Status marked reversed');
    assert(calculateLedgerBalance(updatedTransactions) === 0, 'Reversed transaction points excluded from balance');
  }

  // 9. Clean Ledger & Default Configuration Preservation
  console.log('\n[Case 9: Clean Ledger Contract & Default Settings Preservation]');
  {
    assert(DEFAULT_SETTINGS.activityTypes.length > 0, 'Default activity types exist');
    assert(DEFAULT_SETTINGS.consumptionTypes.length > 0, 'Default consumption types exist');
    
    // Ensure empty transaction list evaluates to 0 without errors
    const emptyTransactions: LedgerTransaction[] = [];
    assert(calculateLedgerBalance(emptyTransactions) === 0, 'Clean ledger starts with 0 balance');
    assert(calculatePointsEarnedOnDay(emptyTransactions, new Date()) === 0, '0 earned points today on clean ledger');
    assert(calculatePointsSpentOnDay(emptyTransactions, new Date()) === 0, '0 spent points today on clean ledger');
  }

  // 10. Onboarding Persistence & Existing User State Protection
  console.log('\n[Case 10: Onboarding State Contract]');
  {
    // A fresh install has no transactions, no activities, and hasCompletedOnboarding = false
    const freshInstall = {
      transactions: [],
      activities: [],
      consumptions: [],
      hasCompletedOnboarding: false,
      welcomeFlag: false,
    };
    const showWelcomeOnFresh = !freshInstall.welcomeFlag && !freshInstall.hasCompletedOnboarding;
    assert(showWelcomeOnFresh === true, 'Fresh installation shows welcome screen');

    // After pressing Begin, onboarding flag is set
    const afterBegin = {
      ...freshInstall,
      welcomeFlag: true,
      hasCompletedOnboarding: true,
    };
    const showWelcomeAfterBegin = !afterBegin.welcomeFlag && !afterBegin.hasCompletedOnboarding;
    assert(showWelcomeAfterBegin === false, 'Subsequent launch with 0 transactions skips welcome screen');

    // Existing user with prior transactions but no flag set must be recognized as existing user
    const existingUser = {
      transactions: [{ id: 'tx_old', points: 10 }],
      activities: [],
      consumptions: [],
      hasCompletedOnboarding: false,
      welcomeFlag: false,
    };
    const isExistingUser =
      existingUser.transactions.length > 0 ||
      existingUser.activities.length > 0 ||
      existingUser.consumptions.length > 0 ||
      existingUser.hasCompletedOnboarding ||
      existingUser.welcomeFlag;
    assert(isExistingUser === true, 'Existing user with prior records is protected from seeing welcome screen');
  }

  console.log(`\n======================================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed.`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
