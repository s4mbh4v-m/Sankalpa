/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import {
  Sparkles,
  Cigarette,
  Wine,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { NavTab } from '../common/BottomNav';
import { SankalpaEmblem } from '../common/SankalpaEmblem';
import { PunyaSymbol, PapaSymbol } from '../common/SacredSymbols';

interface DashboardScreenProps {
  onNavigate: (tab: NavTab, mode?: 'activity' | 'consumption') => void;
  onQuickLogCigarette: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onQuickLogCigarette,
}) => {
  const {
    totalPointsBalance,
    pointsEarnedToday,
    pointsSpentToday,
    todayActivityDuration,
    todayCigarettesCount,
    todayAlcoholUnits,
    settings,
    consumptions,
    transactions,
  } = useLedger();

  // Recent 4 transactions
  const recentTransactions = transactions.slice(0, 4);
  // Recent 4 consumptions
  const recentConsumptions = consumptions.slice(0, 4);

  // Top enabled consumption categories
  const enabledConsumptions = settings.consumptionTypes.filter((c) => c.enabled !== false);
  const firstConsumption = enabledConsumptions[0];
  const secondConsumption = enabledConsumptions[1];

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatDate = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-150">
      {/* ======================================================== */}
      {/* HERO SECTION: SANKALPA EQUILIBRIUM BALANCE              */}
      {/* ======================================================== */}
      <section
        aria-labelledby="balance-heading"
        className="relative overflow-hidden rounded-3xl p-6 equilibrium-card shadow-2xl transition-all"
      >
        {/* Subtle Sacred Geometry Watermark Background */}
        <div className="absolute -right-8 -bottom-8 pointer-events-none opacity-10">
          <SankalpaEmblem size={220} />
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between text-xs font-medium mb-3">
          <span className="flex items-center gap-2 text-[#C6A45C]">
            <SankalpaEmblem size={16} />
            <span className="tracking-[0.18em] font-serif uppercase font-semibold text-[11px]">
              Equilibrium Ledger
            </span>
          </span>
          <span className="text-[#a49a8d] text-[11px] font-sans">
            {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Central Balance Display */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
          <div>
            <div className="flex items-baseline gap-2">
              <h1
                id="balance-heading"
                className={`text-5xl sm:text-6xl font-extrabold tracking-tight font-mono tabular-nums leading-none ${
                  totalPointsBalance < 0
                    ? 'text-[#C94750]'
                    : totalPointsBalance === 0
                    ? 'text-[#F2EBDD]'
                    : 'text-[#F2EBDD]'
                }`}
              >
                {totalPointsBalance > 0 ? `+${totalPointsBalance.toLocaleString()}` : totalPointsBalance.toLocaleString()}
              </h1>
              <span className="text-xs uppercase font-serif tracking-widest text-[#C6A45C] font-semibold">
                Willpower
              </span>
            </div>
            <p className="text-xs text-[#9a9184] mt-2 font-medium flex items-center gap-1.5">
              <span>Earned Discipline minus Temptation Costs</span>
            </p>
          </div>

          {/* Today's Dual Forces (Ascension vs Gravity) */}
          <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2b2520]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#241e17] border border-[#C6A45C]/30 text-[#C6A45C] font-mono text-xs font-bold tabular-nums">
              <TrendingUp className="w-3.5 h-3.5 text-[#C6A45C]" />
              <span>+{pointsEarnedToday} earned</span>
            </div>
            {pointsSpentToday > 0 ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#27151a] border border-[#C94750]/30 text-[#E77A56] font-mono text-xs font-bold tabular-nums">
                <TrendingDown className="w-3.5 h-3.5 text-[#C94750]" />
                <span>-{pointsSpentToday} spent</span>
              </div>
            ) : (
              <div className="text-[10px] text-[#7a7266] uppercase tracking-wider font-medium">
                No temptations spent
              </div>
            )}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-5 pt-3.5 border-t border-[#231e1a] flex items-center justify-between text-[11px] text-[#8e8578]">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#C6A45C]" />
            <span>100% Private · On-Device IndexedDB</span>
          </span>
          <span className="text-[#C6A45C] font-serif tracking-wider uppercase text-[10px] font-semibold">
            Zero Cloud
          </span>
        </div>
      </section>

      {/* ======================================================== */}
      {/* QUICK LOG BUTTONS (Thumb Reach)                         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Punya Action: Record Discipline */}
        <button
          onClick={() => onNavigate('log', 'activity')}
          className="min-h-[56px] p-2.5 bg-gradient-to-b from-[#282119]/80 to-[#191512]/85 hover:from-[#31271d] hover:to-[#221c17] border border-[#C6A45C]/40 rounded-2xl flex flex-col items-center justify-center text-center transition-all active:scale-[0.97] shadow-md group backdrop-blur-sm"
        >
          <div className="flex items-center gap-1.5 text-[#C6A45C] text-xs font-bold group-hover:text-[#F2EBDD] transition-colors">
            <PunyaSymbol size={15} color="#C6A45C" />
            <span className="font-serif tracking-wide">Punya</span>
          </div>
          <span className="text-[10px] text-[#A69B89] mt-0.5 tracking-tight font-medium">
            Earn Points
          </span>
        </button>

        {/* Papa Action 1: Quick Temptation (First configured or smoke) */}
        {firstConsumption ? (
          <button
            onClick={() => {
              if (firstConsumption.id === 'cigarette') {
                onQuickLogCigarette();
              } else {
                onNavigate('log', 'consumption');
              }
            }}
            className="min-h-[56px] p-2.5 bg-gradient-to-b from-[#2d1620]/80 to-[#1b0d13]/85 hover:from-[#3a1d29] hover:to-[#26121b] border border-[#C94750]/40 rounded-2xl flex flex-col items-center justify-center text-center transition-all active:scale-[0.97] shadow-md group backdrop-blur-sm"
          >
            <div className="flex items-center gap-1.5 text-[#E77A56] text-xs font-bold truncate max-w-full group-hover:text-[#F2EBDD] transition-colors">
              <PapaSymbol size={15} color="#C94750" />
              <span className="truncate font-serif">{firstConsumption.name}</span>
            </div>
            <span className="text-[10px] text-[#b8959c] mt-0.5 tracking-tight font-medium">
              1-Tap Log
            </span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('log', 'consumption')}
            className="min-h-[56px] p-2.5 bg-gradient-to-b from-[#2d1620]/80 to-[#1b0d13]/85 hover:from-[#3a1d29] hover:to-[#26121b] border border-[#C94750]/40 rounded-2xl flex flex-col items-center justify-center text-center transition-all active:scale-[0.97] shadow-md group backdrop-blur-sm"
          >
            <div className="flex items-center gap-1.5 text-[#E77A56] text-xs font-bold group-hover:text-[#F2EBDD]">
              <PapaSymbol size={15} color="#C94750" />
              <span className="font-serif">+1 Smoke</span>
            </div>
            <span className="text-[10px] text-[#b8959c] mt-0.5 font-medium">1-Tap Log</span>
          </button>
        )}

        {/* Papa Action 2: Libation / Custom Cost */}
        <button
          onClick={() => onNavigate('log', 'consumption')}
          className="min-h-[56px] p-2.5 bg-gradient-to-b from-[#281521]/80 to-[#190d15]/85 hover:from-[#341b2b] hover:to-[#22121d] border border-[#C94750]/35 rounded-2xl flex flex-col items-center justify-center text-center transition-all active:scale-[0.97] shadow-md group backdrop-blur-sm"
        >
          <div className="flex items-center gap-1.5 text-[#C94750] text-xs font-bold truncate max-w-full group-hover:text-[#F2EBDD]">
            <Wine className="w-3.5 h-3.5 shrink-0 text-[#E77A56]" />
            <span className="truncate font-serif">
              {secondConsumption ? secondConsumption.name : 'Libation'}
            </span>
          </div>
          <span className="text-[10px] text-[#a88d94] mt-0.5 font-medium">Log Cost</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* THE TWO WORLDS: PUNYA VS PAPA DUAL PANELS                */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* WORLD 1: PUNYA (Ascension & Discipline) */}
        <div className="virtuous-gradient-card rounded-2xl p-4.5 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C6A45C]/5 rounded-bl-full pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-[#C6A45C] text-xs font-bold uppercase tracking-wider font-serif">
              <PunyaSymbol size={18} color="#C6A45C" />
              <span>Punya</span>
            </div>
            <button
              onClick={() => onNavigate('log', 'activity')}
              className="text-[11px] text-[#E6DAC3] hover:text-[#C6A45C] flex items-center gap-0.5 transition-colors font-medium"
            >
              <span>Record</span>
              <ArrowUpRight className="w-3 h-3 text-[#C6A45C]" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <p className="text-2xl font-bold text-[#F2EBDD] font-mono tabular-nums">
                {todayActivityDuration}
                <span className="text-xs text-[#C6A45C] font-serif ml-1">min</span>
              </p>
              <p className="text-[11px] text-[#A69B89] mt-0.5 font-medium">Today&apos;s Motion</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#C6A45C] font-mono tabular-nums">
                +{pointsEarnedToday}
                <span className="text-xs text-[#82683A] font-serif ml-1">pts</span>
              </p>
              <p className="text-[11px] text-[#A69B89] mt-0.5 font-medium">Punya Earned</p>
            </div>
          </div>
        </div>

        {/* WORLD 2: PAPA (Gravity & Temptation) */}
        <div className="shadow-gradient-card rounded-2xl p-4.5 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C94750]/5 rounded-bl-full pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-[#E77A56] text-xs font-bold uppercase tracking-wider font-serif">
              <PapaSymbol size={18} color="#C94750" />
              <span>Papa</span>
            </div>
            <button
              onClick={() => onNavigate('log', 'consumption')}
              className="text-[11px] text-[#E9E0DB] hover:text-[#E77A56] flex items-center gap-0.5 transition-colors font-medium"
            >
              <span>Record</span>
              <ArrowUpRight className="w-3 h-3 text-[#C94750]" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <p className="text-2xl font-bold text-[#E9E0DB] font-mono tabular-nums">
                {todayCigarettesCount}
                <span className="text-xs text-[#C94750] font-sans ml-1">
                  {todayAlcoholUnits > 0 ? `+ ${todayAlcoholUnits} alc` : 'sticks'}
                </span>
              </p>
              <p className="text-[11px] text-[#a48e94] mt-0.5 font-medium">
                {todayAlcoholUnits > 0 ? 'Indulgences' : 'Cigarettes'}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#C94750] font-mono tabular-nums">
                -{pointsSpentToday}
                <span className="text-xs text-[#E77A56] font-serif ml-1">pts</span>
              </p>
              <p className="text-[11px] text-[#a48e94] mt-0.5 font-medium">Papa Incurred</p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RECENT SANKALPA TRANSACTIONS                             */}
      {/* ======================================================== */}
      <div className="virtuous-gradient-card rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#C6A45C]/20">
          <h2 className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[#C6A45C]" />
            <span>Recent Willpower Transactions</span>
          </h2>
          <button
            onClick={() => onNavigate('ledger')}
            className="text-[11px] text-[#C6A45C] hover:text-[#F2EBDD] flex items-center gap-0.5 font-medium transition-colors"
          >
            <span>Ledger ({transactions.length})</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <p className="text-xs text-[#7d7770] py-4 text-center italic">
            No entries inscribed in your ledger yet.
          </p>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2 px-2.5 rounded-xl bg-[#1e1913]/60 hover:bg-[#251f17] transition-colors border border-transparent hover:border-[#C6A45C]/25"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-xs text-[#E8E4DF]">{tx.description}</span>
                  <span className="text-[10px] text-[#827d75] mt-0.5">
                    {formatDate(tx.timestamp)} · {formatTime(tx.timestamp)}
                    {tx.status === 'reversed' && ' · [Reversed Void]'}
                  </span>
                </div>
                <span
                  className={`font-mono font-bold tabular-nums text-xs px-2 py-0.5 rounded ${
                    tx.status === 'reversed'
                      ? 'line-through text-[#666059] bg-[#1a1917]'
                      : tx.points > 0
                      ? 'text-[#C6A45C] bg-[#221c16] border border-[#C6A45C]/30'
                      : 'text-[#C94750] bg-[#241318] border border-[#C94750]/30'
                  }`}
                >
                  {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* RECENT TEMPTATIONS / PAPA RECORDS                        */}
      {/* ======================================================== */}
      <div className="shadow-gradient-card rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#C94750]/20">
          <h2 className="text-xs font-bold text-[#E9E0DB] font-serif uppercase tracking-wider flex items-center gap-2">
            <PapaSymbol size={15} color="#C94750" />
            <span>Recent Papa Records</span>
          </h2>
          <button
            onClick={() => onNavigate('analytics')}
            className="text-[11px] text-[#C94750] hover:text-[#E77A56] flex items-center gap-0.5 font-medium transition-colors"
          >
            <span>Insights</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {recentConsumptions.length === 0 ? (
          <p className="text-xs text-[#786b72] py-4 text-center italic">
            Zero temptations recorded. Purity preserved.
          </p>
        ) : (
          <div className="space-y-2">
            {recentConsumptions.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between py-2 px-2.5 rounded-xl bg-[#1b151d]/60 hover:bg-[#201924] transition-colors border border-transparent hover:border-[#332230]"
              >
                <div className="flex items-center gap-2.5">
                  <PapaSymbol size={15} color="#C94750" />
                  <div className="flex flex-col">
                    <span className="font-medium text-xs text-[#E9E0DB]">
                      {c.typeName} ({c.quantity} {c.unitName}{c.quantity > 1 ? 's' : ''})
                    </span>
                    <span className="text-[10px] text-[#8e7f87] mt-0.5">
                      {formatDate(c.timestamp)} · {formatTime(c.timestamp)}
                      {c.notes ? ` · ${c.notes}` : ''}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#C94750] font-mono tabular-nums font-bold px-2 py-0.5 rounded bg-[#27141b] border border-[#C94750]/30">
                  -{c.pointsCharged} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
