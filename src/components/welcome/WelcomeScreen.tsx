/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SankalpaEmblem } from '../common/SankalpaEmblem';
import { PunyaSymbol, PapaSymbol } from '../common/SacredSymbols';
import { AtmosphericBackground } from '../common/AtmosphericBackground';
import { BookOpen, TrendingUp, Sliders, ShieldCheck, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onBegin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBegin }) => {
  return (
    <div className="min-h-screen text-[#E8E4DF] flex flex-col justify-between relative selection:bg-[#82683a] selection:text-[#fff8ee] overflow-x-hidden">
      {/* Background Atmosphere */}
      <AtmosphericBackground theme="dashboard" />

      {/* Decorative Top Radial Ambient Glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(198,164,92,0.18),transparent_70%)]"
        aria-hidden="true"
      />

      {/* Main Scrollable Viewport */}
      <div className="relative z-10 max-w-xl w-full mx-auto px-5 pt-8 pb-10 flex-1 flex flex-col">
        {/* Brand Header */}
        <header className="flex flex-col items-center text-center mb-8">
          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute w-24 h-24 rounded-full bg-[#C6A45C]/20 blur-xl animate-pulse" />
            <div className="p-2.5 rounded-2xl bg-[#1a1612]/90 border border-[#C6A45C]/40 shadow-xl relative z-10 drop-shadow-[0_0_15px_rgba(198,164,92,0.35)]">
              <SankalpaEmblem size={52} />
            </div>
          </div>

          <h1 className="text-xs font-serif font-bold text-[#C6A45C] tracking-[0.3em] uppercase mb-2">
            SANKALPA
          </h1>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F2EBDD] tracking-tight mb-3">
            Every choice leaves a mark.
          </h2>

          <p className="text-xs sm:text-sm text-[#b8ad9f] leading-relaxed max-w-md font-sans">
            SANKALPA helps you keep track of the choices you make, the habits you build, and the consequences you want to understand.
          </p>
        </header>

        {/* Feature Cards Grid */}
        <section className="space-y-3 mb-6" aria-label="Core Features">
          {/* 1. Punya */}
          <div className="group bg-gradient-to-br from-[#1c1712]/90 to-[#120f0d]/90 border border-[#C6A45C]/35 rounded-2xl p-4 shadow-lg shadow-black/40 backdrop-blur-md flex items-start gap-3.5 transition-all">
            <div className="p-2.5 rounded-xl bg-[#282117] text-[#C6A45C] border border-[#C6A45C]/40 shrink-0 shadow-sm">
              <PunyaSymbol size={22} color="#C6A45C" />
            </div>
            <div>
              <h3 className="text-xs font-serif font-bold text-[#F2EBDD] uppercase tracking-wider mb-1 flex items-center gap-2">
                <span>Punya</span>
                <span className="text-[10px] text-[#C6A45C] font-mono normal-case tracking-normal">
                  + Earn
                </span>
              </h3>
              <p className="text-xs text-[#a89d8e] leading-relaxed font-sans">
                Record activities and habits that earn points according to your personal rules.
              </p>
            </div>
          </div>

          {/* 2. Papa */}
          <div className="group bg-gradient-to-br from-[#221219]/90 to-[#150a10]/90 border border-[#C94750]/35 rounded-2xl p-4 shadow-lg shadow-black/40 backdrop-blur-md flex items-start gap-3.5 transition-all">
            <div className="p-2.5 rounded-xl bg-[#2e141f] text-[#C94750] border border-[#C94750]/40 shrink-0 shadow-sm">
              <PapaSymbol size={22} color="#C94750" />
            </div>
            <div>
              <h3 className="text-xs font-serif font-bold text-[#F2EBDD] uppercase tracking-wider mb-1 flex items-center gap-2">
                <span>Papa</span>
                <span className="text-[10px] text-[#C94750] font-mono normal-case tracking-normal">
                  - Deduct
                </span>
              </h3>
              <p className="text-xs text-[#a9949d] leading-relaxed font-sans">
                Track consumption and other choices you want to monitor, with point deductions defined by your rules.
              </p>
            </div>
          </div>

          {/* 3. Your Ledger */}
          <div className="group bg-gradient-to-br from-[#17151c]/90 to-[#0e0c12]/90 border border-[#3b3445]/60 rounded-2xl p-4 shadow-lg shadow-black/40 backdrop-blur-md flex items-start gap-3.5 transition-all">
            <div className="p-2.5 rounded-xl bg-[#221d2b] text-[#C6A45C] border border-[#C6A45C]/25 shrink-0 shadow-sm">
              <BookOpen className="w-5 h-5 text-[#C6A45C]" />
            </div>
            <div>
              <h3 className="text-xs font-serif font-bold text-[#F2EBDD] uppercase tracking-wider mb-1">
                Your Ledger
              </h3>
              <p className="text-xs text-[#a39cae] leading-relaxed font-sans">
                Review your recorded choices and see how your points change over time.
              </p>
            </div>
          </div>

          {/* 4. Insights */}
          <div className="group bg-gradient-to-br from-[#131620]/90 to-[#0c0e16]/90 border border-[#272d42]/60 rounded-2xl p-4 shadow-lg shadow-black/40 backdrop-blur-md flex items-start gap-3.5 transition-all">
            <div className="p-2.5 rounded-xl bg-[#1b2133] text-[#93c5fd] border border-[#93c5fd]/25 shrink-0 shadow-sm">
              <TrendingUp className="w-5 h-5 text-[#93c5fd]" />
            </div>
            <div>
              <h3 className="text-xs font-serif font-bold text-[#F2EBDD] uppercase tracking-wider mb-1">
                Insights
              </h3>
              <p className="text-xs text-[#9aa2b8] leading-relaxed font-sans">
                Explore your activity, consumption, and personal trends through your recorded data.
              </p>
            </div>
          </div>

          {/* 5. Make it yours */}
          <div className="group bg-gradient-to-br from-[#16141a]/90 to-[#0f0e13]/90 border border-[#383344]/60 rounded-2xl p-4 shadow-lg shadow-black/40 backdrop-blur-md flex items-start gap-3.5 transition-all">
            <div className="p-2.5 rounded-xl bg-[#221e2a] text-[#C6A45C] border border-[#C6A45C]/25 shrink-0 shadow-sm">
              <Sliders className="w-5 h-5 text-[#C6A45C]" />
            </div>
            <div>
              <h3 className="text-xs font-serif font-bold text-[#F2EBDD] uppercase tracking-wider mb-1">
                Make it yours
              </h3>
              <p className="text-xs text-[#a29cae] leading-relaxed font-sans">
                Configure activity types, consumption types, point rules, and personal limits to match your goals.
              </p>
            </div>
          </div>
        </section>

        {/* Short Note Callout */}
        <div className="bg-[#171412]/85 border border-[#82683A]/35 rounded-2xl p-4 flex items-start gap-3 mb-6 shadow-md backdrop-blur-md">
          <div className="p-1.5 rounded-lg bg-[#241e17] text-[#C6A45C] shrink-0 mt-0.5 border border-[#82683A]/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <p className="text-xs text-[#c4baa9] leading-relaxed font-serif">
            Your records are yours. Start with a clean ledger and build your history one entry at a time.
          </p>
        </div>

        {/* Bottom Prominent Primary Button */}
        <div className="mt-auto pt-2 space-y-3">
          <button
            onClick={onBegin}
            className="w-full min-h-[52px] bg-gradient-to-r from-[#D4AF37] via-[#C6A45C] to-[#82683A] hover:brightness-110 active:scale-[0.98] text-[#0d0c0a] font-serif font-bold text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-[#C6A45C]/25 transition-all focus:outline-none focus:ring-2 focus:ring-[#C6A45C]/50"
          >
            <span>Begin</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <p className="text-[11px] text-center text-[#7e7467] font-mono tracking-wider">
            100% On-Device · Private · No Cloud Account Required
          </p>
        </div>
      </div>
    </div>
  );
};
