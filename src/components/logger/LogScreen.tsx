/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useLedger } from '../../context/LedgerContext';
import {
  IntensityLevel,
  AlcoholDrinkType,
} from '../../types';
import {
  calculateActivityPoints,
  calculateConsumptionPoints,
  calculateAlcoholMetrics,
} from '../../engine/pointsEngine';
import {
  Dumbbell,
  Sparkles,
  Check,
  Plus,
  Minus,
  AlertTriangle,
  Flame,
  Activity,
  Layers,
  Wine,
} from 'lucide-react';
import { SankalpaEmblem } from '../common/SankalpaEmblem';

interface LogScreenProps {
  mode?: 'activity' | 'consumption';
  onModeChange?: (mode: 'activity' | 'consumption') => void;
}

export const LogScreen: React.FC<LogScreenProps> = ({ mode = 'activity', onModeChange }) => {
  const {
    settings,
    totalPointsBalance,
    addActivity,
    addConsumption,
  } = useLedger();

  // Mode: 'activity' | 'consumption'
  const [internalMode, setInternalMode] = useState<'activity' | 'consumption'>(mode);

  React.useEffect(() => {
    if (mode && mode !== internalMode) {
      setInternalMode(mode);
    }
  }, [mode]);

  const setMainMode = (m: 'activity' | 'consumption') => {
    setInternalMode(m);
    onModeChange?.(m);
  };
  const mainMode = internalMode;

  // Filter only enabled types
  const enabledActivities = useMemo(() => {
    return settings.activityTypes.filter((a) => a.enabled !== false);
  }, [settings.activityTypes]);

  const enabledConsumptions = useMemo(() => {
    return settings.consumptionTypes.filter((c) => c.enabled !== false);
  }, [settings.consumptionTypes]);

  // Selected Activity State
  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    enabledActivities[0]?.id || 'running'
  );
  const selectedActivityConfig = useMemo(() => {
    return (
      enabledActivities.find((a) => a.id === selectedActivityId) ||
      enabledActivities[0] ||
      settings.activityTypes[0]
    );
  }, [enabledActivities, selectedActivityId, settings.activityTypes]);

  const [duration, setDuration] = useState<number>(30);
  const [repetitions, setRepetitions] = useState<number>(20);
  const [intensity, setIntensity] = useState<IntensityLevel>('moderate');
  const [activityTime, setActivityTime] = useState<string>(
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  );
  const [activityNotes, setActivityNotes] = useState('');
  const [activityError, setActivityError] = useState<string | null>(null);

  // Selected Consumption State
  const [selectedConsumptionId, setSelectedConsumptionId] = useState<string>(
    enabledConsumptions[0]?.id || 'cigarette'
  );
  const selectedConsumptionConfig = useMemo(() => {
    return (
      enabledConsumptions.find((c) => c.id === selectedConsumptionId) ||
      enabledConsumptions[0] ||
      settings.consumptionTypes[0]
    );
  }, [enabledConsumptions, selectedConsumptionId, settings.consumptionTypes]);

  const [consumptionQuantity, setConsumptionQuantity] = useState<number>(1);
  const [consumptionTime, setConsumptionTime] = useState<string>(
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  );
  const [brandOrType, setBrandOrType] = useState('');
  const [consumptionNotes, setConsumptionNotes] = useState('');

  // Alcohol optional details
  const [drinkType, setDrinkType] = useState<AlcoholDrinkType>('beer');
  const [volumeMl, setVolumeMl] = useState<number>(330);
  const [abv, setAbv] = useState<number>(5.0);
  const [showAlcoholFields, setShowAlcoholFields] = useState(true);
  const [consumptionError, setConsumptionError] = useState<string | null>(null);

  // Live points computation for activity
  const liveActivityPoints = useMemo(() => {
    if (!selectedActivityConfig) return { basePoints: 0, durationBonus: 0, totalPoints: 0, breakdown: '' };
    return calculateActivityPoints(
      selectedActivityConfig,
      {
        durationMinutes: duration,
        repetitions,
        intensity,
      },
      settings
    );
  }, [selectedActivityConfig, duration, repetitions, intensity, settings]);

  // Live point cost computation for consumption
  const liveConsumptionCost = useMemo(() => {
    if (!selectedConsumptionConfig) return { totalCost: 0, breakdown: '' };
    return calculateConsumptionPoints(selectedConsumptionConfig, consumptionQuantity);
  }, [selectedConsumptionConfig, consumptionQuantity]);

  // Live alcohol computation if applicable
  const liveAlcoholMetrics = useMemo(() => {
    if (!selectedConsumptionConfig?.hasAlcoholDetails || !volumeMl || !abv) return null;
    return calculateAlcoholMetrics(consumptionQuantity, volumeMl, abv);
  }, [selectedConsumptionConfig, consumptionQuantity, volumeMl, abv]);

  // Handle Log Activity
  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setActivityError(null);

    const timestampISO = new Date(activityTime).toISOString();
    const result = await addActivity({
      typeId: selectedActivityConfig.id,
      durationMinutes: selectedActivityConfig.calculationMethod === 'duration' ? duration : undefined,
      repetitions: selectedActivityConfig.calculationMethod === 'repetition' ? repetitions : undefined,
      intensity: selectedActivityConfig.hasIntensityMultiplier ? intensity : undefined,
      timestamp: timestampISO,
      notes: activityNotes.trim() ? activityNotes.trim() : undefined,
    });

    if (!result.success) {
      setActivityError(result.error || 'Failed to record activity');
    } else {
      setActivityNotes('');
    }
  };

  // Handle Log Consumption
  const handleLogConsumption = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsumptionError(null);

    const timestampISO = new Date(consumptionTime).toISOString();
    const result = await addConsumption({
      typeId: selectedConsumptionConfig.id,
      quantity: consumptionQuantity,
      timestamp: timestampISO,
      drinkType: selectedConsumptionConfig.hasAlcoholDetails && showAlcoholFields ? drinkType : undefined,
      volumeMl: selectedConsumptionConfig.hasAlcoholDetails && showAlcoholFields ? volumeMl : undefined,
      abv: selectedConsumptionConfig.hasAlcoholDetails && showAlcoholFields ? abv : undefined,
      brandOrType: brandOrType.trim() ? brandOrType.trim() : undefined,
      notes: consumptionNotes.trim() ? consumptionNotes.trim() : undefined,
    });

    if (!result.success) {
      setConsumptionError(result.error || 'Failed to log consumption');
    } else {
      setConsumptionNotes('');
      setConsumptionQuantity(selectedConsumptionConfig.minQuantity || 1);
    }
  };

  const willBeNegative = totalPointsBalance - liveConsumptionCost.totalCost < 0;

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-150">
      {/* Top Dual-World Mode Selector */}
      <div className="p-1 bg-[#101014] border border-[#231e28] rounded-2xl flex items-center gap-1.5 shadow-md">
        <button
          onClick={() => setMainMode('activity')}
          className={`flex-1 min-h-[46px] flex items-center justify-center gap-2 text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition-all ${
            mainMode === 'activity'
              ? 'bg-gradient-to-r from-[#292219] to-[#1d1812] text-[#F2EBDD] border border-[#C6A45C]/50 shadow-md shadow-[#C6A45C]/10'
              : 'text-[#827d75] hover:text-[#c4baa9]'
          }`}
        >
          <SankalpaEmblem size={16} variant="virtuous" />
          <span>Virtuous Path (Earn)</span>
        </button>

        <button
          onClick={() => setMainMode('consumption')}
          className={`flex-1 min-h-[46px] flex items-center justify-center gap-2 text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition-all ${
            mainMode === 'consumption'
              ? 'bg-gradient-to-r from-[#2a141b] to-[#1c0d12] text-[#E9E0DB] border border-[#C94750]/50 shadow-md shadow-[#C94750]/15'
              : 'text-[#827d75] hover:text-[#c4baa9]'
          }`}
        >
          <Flame className="w-4 h-4 text-[#C94750]" />
          <span>Shadow Ledger (Spend)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: VIRTUOUS ACTIVITY LOGGER (IVORY, GOLD, PARCHMENT, BRONZE)       */}
      {/* ========================================================================= */}
      {mainMode === 'activity' && (
        <form onSubmit={handleLogActivity} className="space-y-4">
          {/* Live Points Preview Banner (Luminous Gold Illumination) */}
          <div className="virtuous-gradient-card rounded-2xl p-4.5 flex items-center justify-between shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#C6A45C]/10 rounded-bl-full pointer-events-none" />
            <div>
              <span className="text-[11px] font-bold text-[#C6A45C] uppercase tracking-widest flex items-center gap-1.5 font-serif">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Virtue Inscribed</span>
              </span>
              <p className="text-xs text-[#E6DAC3] mt-0.5">
                {liveActivityPoints.breakdown}
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-[#F2EBDD] font-mono tabular-nums">
                +{liveActivityPoints.totalPoints}
              </span>
              <span className="text-xs text-[#C6A45C] block font-serif tracking-wider">points</span>
            </div>
          </div>

          {/* Activity Type Selection Grid */}
          <div className="virtuous-gradient-card rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider">
                Select Discipline
              </label>
              <span className="text-[11px] text-[#A69B89] capitalize">
                Method: {selectedActivityConfig?.calculationMethod || 'duration'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {enabledActivities.map((type) => {
                const isSelected = selectedActivityId === type.id;
                let methodBadge = '';
                if (type.calculationMethod === 'duration') {
                  methodBadge = `${type.pointsPerDurationInterval} pts / ${type.durationIntervalMinutes}m`;
                } else if (type.calculationMethod === 'repetition') {
                  methodBadge = `${type.pointsPerRepetitionInterval} pts / ${type.repetitionIntervalCount} reps`;
                } else {
                  methodBadge = `${type.fixedPoints} pts flat`;
                }

                return (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => setSelectedActivityId(type.id)}
                    className={`min-h-[52px] p-2.5 text-xs rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#292117] border-[#C6A45C]/60 text-[#F2EBDD] shadow-[0_0_12px_rgba(198,164,92,0.15)]'
                        : 'bg-[#181512] border-[#2c241c] text-[#a49a8d] hover:text-[#F2EBDD]'
                    }`}
                  >
                    <div className="font-semibold truncate font-serif">{type.name}</div>
                    <div className="text-[10px] text-[#C6A45C] mt-0.5">{methodBadge}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC FIELD 1: DURATION-BASED FIELDS */}
          {selectedActivityConfig?.calculationMethod === 'duration' && (
            <div className="virtuous-gradient-card rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider block">
                    Duration (Minutes)
                  </label>
                  <p className="text-[10px] text-[#A69B89]">
                    Interval: {selectedActivityConfig.durationIntervalMinutes}m ({selectedActivityConfig.pointsPerDurationInterval} pts)
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDuration(mins)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                        duration === mins
                          ? 'bg-[#C6A45C] border-[#F2EBDD] text-[#1a1612] font-bold shadow'
                          : 'bg-[#1a1612] border-[#2e261d] text-[#c4baa9] hover:bg-[#231d16]'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDuration((prev) => Math.max(5, prev - 5))}
                  className="w-11 h-11 rounded-xl bg-[#201a14] border border-[#3b3024] flex items-center justify-center text-[#c4baa9] hover:text-[#F2EBDD] active:scale-95 transition"
                  aria-label="Minus 5 minutes"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex-1">
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full h-11 bg-[#13110e] border border-[#332a1e] rounded-xl px-4 text-center font-mono text-xl font-bold text-[#F2EBDD] focus:outline-none focus:border-[#C6A45C]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setDuration((prev) => prev + 5)}
                  className="w-11 h-11 rounded-xl bg-[#201a14] border border-[#3b3024] flex items-center justify-center text-[#c4baa9] hover:text-[#F2EBDD] active:scale-95 transition"
                  aria-label="Plus 5 minutes"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Intensity multiplier (if configured) */}
              {selectedActivityConfig.hasIntensityMultiplier && (
                <div className="pt-2 border-t border-[#292219]">
                  <label className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider block mb-2">
                    Intensity Level
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['low', 'moderate', 'high', 'vigorous'] as IntensityLevel[]).map((lvl) => {
                      const mult = settings.intensityMultipliers[lvl];
                      const isSelected = intensity === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setIntensity(lvl)}
                          className={`py-2 text-center rounded-xl border capitalize text-xs transition ${
                            isSelected
                              ? 'bg-[#2b2217] border-[#C6A45C] text-[#F2EBDD] font-bold shadow'
                              : 'bg-[#181410] border-[#292117] text-[#8e8578]'
                          }`}
                        >
                          <div>{lvl}</div>
                          <div className="text-[10px] text-[#C6A45C]">{mult}x</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC FIELD 2: REPETITION-BASED FIELDS */}
          {selectedActivityConfig?.calculationMethod === 'repetition' && (
            <div className="virtuous-gradient-card rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider block">
                    Repetitions Completed
                  </label>
                  <p className="text-[10px] text-[#A69B89]">
                    Rule: {selectedActivityConfig.pointsPerRepetitionInterval} pts per {selectedActivityConfig.repetitionIntervalCount} reps
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {[10, 20, 30, 50].map((reps) => (
                    <button
                      key={reps}
                      type="button"
                      onClick={() => setRepetitions(reps)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                        repetitions === reps
                          ? 'bg-[#C6A45C] border-[#F2EBDD] text-[#1a1612] font-bold shadow'
                          : 'bg-[#1a1612] border-[#2e261d] text-[#c4baa9] hover:bg-[#231d16]'
                      }`}
                    >
                      {reps}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRepetitions((prev) => Math.max(1, prev - 5))}
                  className="w-11 h-11 rounded-xl bg-[#201a14] border border-[#3b3024] flex items-center justify-center text-[#c4baa9] hover:text-[#F2EBDD] active:scale-95 transition"
                  aria-label="Minus 5 repetitions"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={repetitions}
                    onChange={(e) => setRepetitions(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full h-11 bg-[#13110e] border border-[#332a1e] rounded-xl px-4 text-center font-mono text-xl font-bold text-[#F2EBDD] focus:outline-none focus:border-[#C6A45C]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setRepetitions((prev) => prev + 5)}
                  className="w-11 h-11 rounded-xl bg-[#201a14] border border-[#3b3024] flex items-center justify-center text-[#c4baa9] hover:text-[#F2EBDD] active:scale-95 transition"
                  aria-label="Plus 5 repetitions"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* DYNAMIC FIELD 3: FIXED-REWARD NOTICE */}
          {selectedActivityConfig?.calculationMethod === 'fixed' && (
            <div className="virtuous-gradient-card rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#292218] border border-[#C6A45C]/40 text-[#C6A45C] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#F2EBDD] font-serif">{selectedActivityConfig.name}</p>
                <p className="text-[#A69B89] mt-0.5">
                  Fixed reward activity. Neither duration nor repetitions are required — logging will award a flat{' '}
                  <strong className="text-[#C6A45C] font-semibold">{selectedActivityConfig.fixedPoints} points</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Date, Time & Notes */}
          <div className="virtuous-gradient-card rounded-2xl p-4 space-y-3">
            <div>
              <label className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider block mb-1">
                Date &amp; Time
              </label>
              <input
                type="datetime-local"
                value={activityTime}
                onChange={(e) => setActivityTime(e.target.value)}
                className="w-full h-11 bg-[#13110e] border border-[#332a1e] rounded-xl px-3 text-xs text-[#E6DAC3] focus:outline-none focus:border-[#C6A45C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider block mb-1">
                Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Morning focus session, resolute tempo"
                value={activityNotes}
                onChange={(e) => setActivityNotes(e.target.value)}
                className="w-full h-11 bg-[#13110e] border border-[#332a1e] rounded-xl px-3 text-xs text-[#E6DAC3] placeholder:text-[#6e655a] focus:outline-none focus:border-[#C6A45C]"
              />
            </div>
          </div>

          {activityError && (
            <p className="text-xs text-[#C94750] bg-[#27151a] p-3 rounded-xl border border-[#C94750]/30 font-medium">
              {activityError}
            </p>
          )}

          <button
            type="submit"
            className="w-full min-h-[52px] bg-gradient-to-r from-[#C6A45C] via-[#b5924b] to-[#82683A] hover:brightness-110 active:scale-[0.98] text-[#14120f] font-serif font-bold tracking-wider text-sm rounded-2xl shadow-lg shadow-[#C6A45C]/20 flex items-center justify-center gap-2 transition-all uppercase"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Inscribe Virtuous Act (+{liveActivityPoints.totalPoints} pts)</span>
          </button>
        </form>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: SHADOW CONSUMPTION LOGGER (OBSIDIAN, BURGUNDY, CRIMSON, EMBER)  */}
      {/* ========================================================================= */}
      {mainMode === 'consumption' && (
        <form onSubmit={handleLogConsumption} className="space-y-4">
          {/* Live Point Cost Preview Banner (Crimson Ember Aura) */}
          <div className="shadow-gradient-card rounded-2xl p-4.5 flex items-center justify-between shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#C94750]/10 rounded-bl-full pointer-events-none" />
            <div>
              <span className="text-[11px] font-bold text-[#E77A56] uppercase tracking-widest flex items-center gap-1.5 font-serif">
                <Flame className="w-3.5 h-3.5 text-[#C94750]" />
                <span>Temptation Cost</span>
              </span>
              <p className="text-xs text-[#E9E0DB] mt-0.5">
                {liveConsumptionCost.breakdown}
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-[#C94750] font-mono tabular-nums">
                -{liveConsumptionCost.totalCost}
              </span>
              <span className="text-xs text-[#E77A56] block font-serif tracking-wider">points</span>
            </div>
          </div>

          {/* Negative Balance Honest Notice */}
          {willBeNegative && (
            <div className="bg-[#291319] border border-[#C94750]/35 rounded-xl p-3 flex items-start gap-2.5 text-xs text-[#E9E0DB]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#E77A56]" />
              <div>
                <p className="font-bold text-[#E77A56] font-serif uppercase tracking-wider text-[11px]">
                  Negative Balance Notice
                </p>
                <p className="text-[#c4b5bb] text-[11px] mt-0.5 leading-normal">
                  Your current balance ({totalPointsBalance} pts) will transition to negative ({totalPointsBalance - liveConsumptionCost.totalCost} pts). This will be inscribed honestly in your ledger.
                </p>
              </div>
            </div>
          )}

          {/* Consumption Type Selector */}
          <div className="shadow-gradient-card rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#E9E0DB] font-serif uppercase tracking-wider">
                Select Temptation Category
              </label>
              <span className="text-[11px] text-[#9a858d]">
                Unit: {selectedConsumptionConfig?.unitName}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {enabledConsumptions.map((type) => {
                const isSelected = selectedConsumptionId === type.id;
                let rateDesc = '';
                if (type.chargingMethod === 'fixed_cost') {
                  rateDesc = `${type.fixedCost} pts flat`;
                } else if (type.chargingMethod === 'per_unit') {
                  rateDesc = `${type.pointsPerUnit} pts / ${type.unitName}`;
                } else if (type.chargingMethod === 'per_quantity') {
                  rateDesc = `${type.pointsPerQuantityInterval} pts / ${type.quantityInterval} ${type.unitName}`;
                } else {
                  rateDesc = `${type.pointsPerTimeInterval} pts / ${type.timeIntervalMinutes}m`;
                }

                return (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => {
                      setSelectedConsumptionId(type.id);
                      setConsumptionQuantity(type.minQuantity || 1);
                    }}
                    className={`min-h-[52px] p-2.5 text-xs rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#2a131b] border-[#C94750]/65 text-[#E9E0DB] shadow-[0_0_12px_rgba(201,71,80,0.18)]'
                        : 'bg-[#181014] border-[#29171f] text-[#8e7a83] hover:text-[#E9E0DB]'
                    }`}
                  >
                    <div className="font-semibold truncate font-serif">{type.name}</div>
                    <div className="text-[10px] text-[#E77A56] mt-0.5">{rateDesc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector: supports multiple units in a single entry */}
          <div className="shadow-gradient-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-[#E9E0DB] font-serif uppercase tracking-wider block">
                  Quantity ({selectedConsumptionConfig?.unitName}s)
                </label>
                <p className="text-[11px] text-[#9a858d]">
                  Record single or multiple units in one entry
                </p>
              </div>

              {/* Quick preset chips */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setConsumptionQuantity(n)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                      consumptionQuantity === n
                        ? 'bg-[#C94750] border-[#E77A56] text-white font-bold shadow'
                        : 'bg-[#1b1216] border-[#311c25] text-[#bdaab1] hover:bg-[#25181e]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setConsumptionQuantity((prev) =>
                    Math.max(selectedConsumptionConfig?.minQuantity || 1, prev - 1)
                  )
                }
                className="w-12 h-12 rounded-xl bg-[#201217] border border-[#3b1d28] flex items-center justify-center text-[#c4b2b9] hover:text-[#E9E0DB] active:scale-95 transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex-1">
                <input
                  type="number"
                  step={selectedConsumptionConfig?.allowDecimals ? '0.1' : '1'}
                  min={selectedConsumptionConfig?.minQuantity || 1}
                  max={selectedConsumptionConfig?.maxQuantity || 1000}
                  value={consumptionQuantity}
                  onChange={(e) =>
                    setConsumptionQuantity(
                      parseFloat(e.target.value) || selectedConsumptionConfig?.minQuantity || 1
                    )
                  }
                  className="w-full h-12 bg-[#120b0e] border border-[#301721] rounded-xl px-4 text-center font-mono text-2xl font-bold text-[#E9E0DB] focus:outline-none focus:border-[#C94750]"
                />
              </div>

              <button
                type="button"
                onClick={() => setConsumptionQuantity((prev) => prev + 1)}
                className="w-12 h-12 rounded-xl bg-[#201217] border border-[#3b1d28] flex items-center justify-center text-[#c4b2b9] hover:text-[#E9E0DB] active:scale-95 transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional Alcohol Fields (Only if category enables alcohol details!) */}
          {selectedConsumptionConfig?.hasAlcoholDetails && (
            <div className="shadow-gradient-card rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#E9E0DB] font-serif uppercase tracking-wider">
                  Alcohol Beverage Details (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowAlcoholFields(!showAlcoholFields)}
                  className="text-[11px] text-[#E77A56] hover:underline"
                >
                  {showAlcoholFields ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {showAlcoholFields && (
                <div className="space-y-3 pt-2 border-t border-[#291720]">
                  {/* Presets */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDrinkType('beer');
                        setVolumeMl(330);
                        setAbv(5.0);
                      }}
                      className="p-2 bg-[#1b1216] border border-[#301c26] rounded-xl text-left text-[11px]"
                    >
                      <div className="font-semibold text-[#E9E0DB]">Beer (330ml)</div>
                      <div className="text-[10px] text-[#9c868f]">5% ABV</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDrinkType('wine');
                        setVolumeMl(150);
                        setAbv(12.5);
                      }}
                      className="p-2 bg-[#1b1216] border border-[#301c26] rounded-xl text-left text-[11px]"
                    >
                      <div className="font-semibold text-[#E9E0DB]">Wine (150ml)</div>
                      <div className="text-[10px] text-[#9c868f]">12.5% ABV</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDrinkType('spirits');
                        setVolumeMl(45);
                        setAbv(40.0);
                      }}
                      className="p-2 bg-[#1b1216] border border-[#301c26] rounded-xl text-left text-[11px]"
                    >
                      <div className="font-semibold text-[#E9E0DB]">Shot (45ml)</div>
                      <div className="text-[10px] text-[#9c868f]">40% ABV</div>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-[#9c868f] block mb-1">Volume per serving (ml)</span>
                      <input
                        type="number"
                        min="1"
                        max="5000"
                        value={volumeMl}
                        onChange={(e) => setVolumeMl(parseInt(e.target.value) || 0)}
                        className="w-full h-10 bg-[#120b0e] border border-[#301721] rounded-xl px-3 font-mono text-xs text-[#E9E0DB] focus:outline-none focus:border-[#C94750]"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] text-[#9c868f] block mb-1">ABV %</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={abv}
                        onChange={(e) => setAbv(parseFloat(e.target.value) || 0)}
                        className="w-full h-10 bg-[#120b0e] border border-[#301721] rounded-xl px-3 font-mono text-xs text-[#E9E0DB] focus:outline-none focus:border-[#C94750]"
                      />
                    </div>
                  </div>

                  {liveAlcoholMetrics && (
                    <div className="text-[11px] text-[#E77A56] font-mono">
                      Calculated: {liveAlcoholMetrics.standardUnits} standard units ({liveAlcoholMetrics.pureAlcoholGrams}g pure alcohol)
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Optional Brand or Notes */}
          <div className="shadow-gradient-card rounded-2xl p-4 space-y-3">
            <div>
              <label className="text-xs font-bold text-[#E9E0DB] font-serif uppercase tracking-wider block mb-1">
                Date &amp; Time
              </label>
              <input
                type="datetime-local"
                value={consumptionTime}
                onChange={(e) => setConsumptionTime(e.target.value)}
                className="w-full h-11 bg-[#120b0e] border border-[#301721] rounded-xl px-3 text-xs text-[#E9E0DB] focus:outline-none focus:border-[#C94750]"
              />
            </div>

            {selectedConsumptionConfig?.hasBrandOrType && (
              <div>
                <label className="text-xs font-bold text-[#E9E0DB] font-serif uppercase tracking-wider block mb-1">
                  Brand or Type (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regular, Light, Single Malt"
                  value={brandOrType}
                  onChange={(e) => setBrandOrType(e.target.value)}
                  className="w-full h-11 bg-[#120b0e] border border-[#301721] rounded-xl px-3 text-xs text-[#E9E0DB] placeholder:text-[#6a535c] focus:outline-none focus:border-[#C94750]"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#E9E0DB] font-serif uppercase tracking-wider block mb-1">
                Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Evening pause, social occasion"
                value={consumptionNotes}
                onChange={(e) => setConsumptionNotes(e.target.value)}
                className="w-full h-11 bg-[#120b0e] border border-[#301721] rounded-xl px-3 text-xs text-[#E9E0DB] placeholder:text-[#6a535c] focus:outline-none focus:border-[#C94750]"
              />
            </div>
          </div>

          {consumptionError && (
            <p className="text-xs text-[#C94750] bg-[#27151a] p-3 rounded-xl border border-[#C94750]/30 font-medium">
              {consumptionError}
            </p>
          )}

          <button
            type="submit"
            className="w-full min-h-[52px] bg-gradient-to-r from-[#C94750] via-[#a8343c] to-[#6d1b22] hover:brightness-110 active:scale-[0.98] text-[#fff8ee] font-serif font-bold tracking-wider text-sm rounded-2xl shadow-lg shadow-[#C94750]/25 flex items-center justify-center gap-2 transition-all uppercase"
          >
            <Flame className="w-4 h-4" />
            <span>
              Inscribe {consumptionQuantity} {selectedConsumptionConfig?.unitName}
              {consumptionQuantity > 1 ? 's' : ''} (-{liveConsumptionCost.totalCost} pts)
            </span>
          </button>
        </form>
      )}
    </div>
  );
};
