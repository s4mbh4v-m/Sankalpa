/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useLedger } from '../../context/LedgerContext';
import {
  TrendingUp,
  Dumbbell,
  Cigarette,
  Wine,
  Calendar,
  Award,
  Sparkles,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { SankalpaEmblem } from '../common/SankalpaEmblem';

type TimeRange = '7d' | '14d' | '30d';

export const AnalyticsScreen: React.FC = () => {
  const { activities, consumptions, transactions } = useLedger();
  const [range, setRange] = useState<TimeRange>('7d');

  const daysCount = range === '7d' ? 7 : range === '14d' ? 14 : 30;

  // Generate date buckets for the last N days
  const dateBuckets = useMemo(() => {
    const list: { key: string; label: string; date: Date }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString([], { weekday: 'narrow', month: 'numeric', day: 'numeric' });
      list.push({ key, label, date: d });
    }
    return list;
  }, [daysCount]);

  // Aggregate stats per day bucket
  const aggregatedData = useMemo(() => {
    const map = new Map<
      string,
      {
        points: number;
        durationMinutes: number;
        cigarettes: number;
        alcoholUnits: number;
        alcoholVolume: number;
      }
    >();

    dateBuckets.forEach((b) => {
      map.set(b.key, {
        points: 0,
        durationMinutes: 0,
        cigarettes: 0,
        alcoholUnits: 0,
        alcoholVolume: 0,
      });
    });

    // Activities & Transactions
    transactions.forEach((tx) => {
      if (tx.status === 'active' && tx.points > 0) {
        const key = tx.timestamp.slice(0, 10);
        const existing = map.get(key);
        if (existing) {
          existing.points += tx.points;
        }
      }
    });

    activities.forEach((act) => {
      const key = act.timestamp.slice(0, 10);
      const existing = map.get(key);
      if (existing && act.durationMinutes) {
        existing.durationMinutes += act.durationMinutes;
      }
    });

    // Consumptions
    consumptions.forEach((c) => {
      const key = c.timestamp.slice(0, 10);
      const existing = map.get(key);
      if (existing) {
        if (c.typeId === 'cigarette' || c.category === 'cigarette') {
          existing.cigarettes += c.quantity;
        } else if (c.typeId === 'alcohol' || c.category === 'alcohol') {
          existing.alcoholUnits += c.standardUnits || 0;
          existing.alcoholVolume += (c.volumeMl || 330) * c.quantity;
        }
      }
    });

    return dateBuckets.map((b) => {
      const val = map.get(b.key) || {
        points: 0,
        durationMinutes: 0,
        cigarettes: 0,
        alcoholUnits: 0,
        alcoholVolume: 0,
      };
      return {
        ...b,
        ...val,
      };
    });
  }, [dateBuckets, transactions, activities, consumptions]);

  // Totals & Averages for selected timeframe
  const metrics = useMemo(() => {
    let totalPoints = 0;
    let totalMinutes = 0;
    let totalCigs = 0;
    let totalUnits = 0;
    let totalVol = 0;
    let smokeFreeDays = 0;
    let alcoholFreeDays = 0;
    let activeDays = 0;

    aggregatedData.forEach((d) => {
      totalPoints += d.points;
      totalMinutes += d.durationMinutes;
      totalCigs += d.cigarettes;
      totalUnits += d.alcoholUnits;
      totalVol += d.alcoholVolume;

      if (d.cigarettes === 0) smokeFreeDays++;
      if (d.alcoholUnits === 0) alcoholFreeDays++;
      if (d.durationMinutes > 0) activeDays++;
    });

    return {
      totalPoints,
      totalMinutes,
      totalHours: (totalMinutes / 60).toFixed(1),
      totalCigs,
      avgCigsPerDay: (totalCigs / daysCount).toFixed(1),
      totalUnits: totalUnits.toFixed(1),
      totalVol,
      smokeFreeDays,
      alcoholFreeDays,
      activeDays,
    };
  }, [aggregatedData, daysCount]);

  // Activity breakdown by type
  const activityDistribution = useMemo(() => {
    const dist = new Map<string, { name: string; count: number; points: number; mins: number }>();
    activities.forEach((a) => {
      const existing = dist.get(a.typeName) || { name: a.typeName, count: 0, points: 0, mins: 0 };
      existing.count++;
      existing.points += a.pointsEarned;
      existing.mins += a.durationMinutes || 0;
      dist.set(a.typeName, existing);
    });
    return Array.from(dist.values()).sort((a, b) => b.points - a.points);
  }, [activities]);

  // Consumption breakdown by category
  const consumptionDistribution = useMemo(() => {
    const dist = new Map<string, { name: string; count: number; quantity: number; unitName: string; pointsSpent: number }>();
    consumptions.forEach((c) => {
      const name = c.typeName || (c.category === 'cigarette' ? 'Cigarettes' : 'Alcohol');
      const existing = dist.get(name) || {
        name,
        count: 0,
        quantity: 0,
        unitName: c.unitName || (c.category === 'cigarette' ? 'cigarette' : 'drink'),
        pointsSpent: 0,
      };
      existing.count++;
      existing.quantity += c.quantity;
      existing.pointsSpent += c.pointsCharged || 0;
      dist.set(name, existing);
    });
    return Array.from(dist.values()).sort((a, b) => b.pointsSpent - a.pointsSpent);
  }, [consumptions]);

  // Max points for bar scaling
  const maxDayPoints = Math.max(1, ...aggregatedData.map((d) => d.points));
  const maxDayCigs = Math.max(1, ...aggregatedData.map((d) => d.cigarettes));
  const maxDayUnits = Math.max(1, ...aggregatedData.map((d) => d.alcoholUnits));

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-150">
      {/* Header & Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#F2EBDD] font-serif uppercase tracking-wider">
            Sankalpa Insights
          </h2>
          <p className="text-xs text-[#8e8578]">Discipline Momentum &amp; Temptation Analytics</p>
        </div>

        <div className="flex items-center p-1 bg-[#141218] border border-[#26202c] rounded-xl text-xs">
          {(['7d', '14d', '30d'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-lg font-serif tracking-wider text-xs font-semibold transition-colors ${
                range === r
                  ? 'bg-[#C6A45C] text-[#14120f] shadow-sm'
                  : 'text-[#8e8578] hover:text-[#F2EBDD]'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Headline Badges */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Virtuous Points Metric */}
        <div className="virtuous-gradient-card rounded-2xl p-3 text-center shadow-md">
          <p className="text-[11px] text-[#C6A45C] font-bold uppercase tracking-wider font-serif flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Virtue</span>
          </p>
          <p className="text-xl font-bold text-[#F2EBDD] font-mono tabular-nums mt-1">
            +{metrics.totalPoints}
          </p>
          <p className="text-[10px] text-[#A69B89] mt-0.5">{metrics.activeDays} active days</p>
        </div>

        {/* Smoke-Free Days */}
        <div className="shadow-gradient-card rounded-2xl p-3 text-center shadow-md">
          <p className="text-[11px] text-[#E77A56] font-bold uppercase tracking-wider font-serif flex items-center justify-center gap-1">
            <Cigarette className="w-3.5 h-3.5 text-[#C94750]" />
            <span>Purity</span>
          </p>
          <p className="text-xl font-bold text-[#E9E0DB] font-mono tabular-nums mt-1">
            {metrics.smokeFreeDays}/{daysCount}
          </p>
          <p className="text-[10px] text-[#9a858d] mt-0.5">{metrics.avgCigsPerDay}/day avg</p>
        </div>

        {/* Libation-Free Days */}
        <div className="shadow-gradient-card rounded-2xl p-3 text-center shadow-md">
          <p className="text-[11px] text-[#C94750] font-bold uppercase tracking-wider font-serif flex items-center justify-center gap-1">
            <Wine className="w-3.5 h-3.5 text-[#E77A56]" />
            <span>Sobriety</span>
          </p>
          <p className="text-xl font-bold text-[#E9E0DB] font-mono tabular-nums mt-1">
            {metrics.alcoholFreeDays}/{daysCount}
          </p>
          <p className="text-[10px] text-[#9a858d] mt-0.5">{metrics.totalUnits} units</p>
        </div>
      </div>

      {/* CHART 1: Virtuous Daily Willpower Earned */}
      <div className="virtuous-gradient-card rounded-3xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C6A45C]" />
            <h3 className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider">
              Daily Discipline Points
            </h3>
          </div>
          <span className="text-xs text-[#C6A45C] font-mono font-bold tabular-nums">
            {metrics.totalHours} hrs active
          </span>
        </div>

        {/* SVG/CSS Bar Chart with Gold Highlights */}
        <div className="h-36 pt-4 flex items-end gap-1.5 sm:gap-2 justify-between border-b border-[#2d251d] pb-2">
          {aggregatedData.map((d) => {
            const heightPercent = Math.max(4, Math.round((d.points / maxDayPoints) * 100));
            return (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                {/* Tooltip */}
                <div className="absolute -top-7 hidden group-hover:flex bg-[#201a14] border border-[#C6A45C]/40 text-[10px] text-[#F2EBDD] px-1.5 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap z-10 font-mono">
                  {d.points} pts ({d.durationMinutes}m)
                </div>

                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[20px] rounded-t-md transition-all ${
                    d.points > 0
                      ? 'bg-gradient-to-t from-[#82683A] to-[#C6A45C] hover:brightness-125 shadow-[0_0_8px_rgba(198,164,92,0.2)]'
                      : 'bg-[#1e1914]'
                  }`}
                />
                <span className="text-[9px] text-[#8e8578] truncate w-full text-center font-mono">
                  {d.date.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHART 2: Cigarette Consumption Trend */}
      <div className="shadow-gradient-card rounded-3xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cigarette className="w-4 h-4 text-[#C94750]" />
            <h3 className="text-xs font-bold text-[#E9E0DB] font-serif uppercase tracking-wider">
              Cigarettes Incurred
            </h3>
          </div>
          <span className="text-xs text-[#E77A56] font-mono font-bold tabular-nums">
            {metrics.totalCigs} sticks total
          </span>
        </div>

        <div className="h-28 pt-3 flex items-end gap-1.5 sm:gap-2 justify-between border-b border-[#2b1720] pb-2">
          {aggregatedData.map((d) => {
            const heightPercent =
              d.cigarettes === 0 ? 3 : Math.max(8, Math.round((d.cigarettes / maxDayCigs) * 100));
            return (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                <div className="absolute -top-7 hidden group-hover:flex bg-[#231218] border border-[#C94750]/40 text-[10px] text-[#E77A56] px-1.5 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap z-10 font-mono">
                  {d.cigarettes} sticks
                </div>

                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[20px] rounded-t-md transition-all ${
                    d.cigarettes > 0
                      ? 'bg-gradient-to-t from-[#7a1f28] to-[#C94750] hover:brightness-125 shadow-[0_0_8px_rgba(201,71,80,0.25)]'
                      : 'bg-[#1b1216]'
                  }`}
                />
                <span className="text-[9px] text-[#8e7a83] truncate w-full text-center font-mono">
                  {d.date.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHART 3: Alcohol Units Trend */}
      <div className="shadow-gradient-card rounded-3xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wine className="w-4 h-4 text-[#E77A56]" />
            <h3 className="text-xs font-bold text-[#E9E0DB] font-serif uppercase tracking-wider">
              Alcohol Standard Drinks
            </h3>
          </div>
          <span className="text-xs text-[#E77A56] font-mono font-bold tabular-nums">
            {metrics.totalUnits} units ({metrics.totalVol}ml)
          </span>
        </div>

        <div className="h-28 pt-3 flex items-end gap-1.5 sm:gap-2 justify-between border-b border-[#2b1720] pb-2">
          {aggregatedData.map((d) => {
            const heightPercent =
              d.alcoholUnits === 0 ? 3 : Math.max(8, Math.round((d.alcoholUnits / maxDayUnits) * 100));
            return (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                <div className="absolute -top-7 hidden group-hover:flex bg-[#231218] border border-[#C94750]/40 text-[10px] text-[#E77A56] px-1.5 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap z-10 font-mono">
                  {d.alcoholUnits} units ({d.alcoholVolume}ml)
                </div>

                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[20px] rounded-t-md transition-all ${
                    d.alcoholUnits > 0
                      ? 'bg-gradient-to-t from-[#6e231d] to-[#E77A56] hover:brightness-125 shadow-[0_0_8px_rgba(231,122,86,0.25)]'
                      : 'bg-[#1b1216]'
                  }`}
                />
                <span className="text-[9px] text-[#8e7a83] truncate w-full text-center font-mono">
                  {d.date.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Virtuous Disciplines Breakdown List */}
      <div className="virtuous-gradient-card rounded-2xl p-4 shadow-md">
        <h3 className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider mb-3 pb-2 border-b border-[#2d251d]">
          Willpower Earned by Discipline
        </h3>
        {activityDistribution.length === 0 ? (
          <p className="text-xs text-[#8e8578] py-3 text-center italic">No discipline sessions inscribed yet.</p>
        ) : (
          <div className="space-y-2">
            {activityDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs py-1.5 border-b border-[#231c15] last:border-0">
                <div>
                  <span className="font-semibold text-[#F2EBDD] font-serif">{item.name}</span>
                  <span className="text-[10px] text-[#8e8578] ml-2">
                    {item.count} session{item.count > 1 ? 's' : ''} · {item.mins}m
                  </span>
                </div>
                <span className="font-mono font-bold text-[#C6A45C] tabular-nums">
                  +{item.points} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shadow Categories Breakdown List */}
      <div className="shadow-gradient-card rounded-2xl p-4 shadow-md">
        <h3 className="text-xs font-bold text-[#E9E0DB] font-serif uppercase tracking-wider mb-3 pb-2 border-b border-[#2b1720]">
          Points Incurred by Indulgence
        </h3>
        {consumptionDistribution.length === 0 ? (
          <p className="text-xs text-[#8e7a83] py-3 text-center italic">No indulgences logged yet.</p>
        ) : (
          <div className="space-y-2">
            {consumptionDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs py-1.5 border-b border-[#24131a] last:border-0">
                <div>
                  <span className="font-semibold text-[#E9E0DB] font-serif">{item.name}</span>
                  <span className="text-[10px] text-[#8e7a83] ml-2">
                    {item.quantity} {item.unitName}{item.quantity > 1 ? 's' : ''} ({item.count} logs)
                  </span>
                </div>
                <span className="font-mono font-bold text-[#C94750] tabular-nums">
                  -{item.pointsSpent} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
