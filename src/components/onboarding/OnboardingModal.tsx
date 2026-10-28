/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { ShieldCheck, Dumbbell, Wine, Scale, ArrowRight, Trash2, Sparkles, Flame } from 'lucide-react';
import { SankalpaEmblem } from '../common/SankalpaEmblem';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { updatePreferences, clearAllData } = useLedger();

  if (!isOpen) return null;

  const handleFinish = async (keepSample: boolean) => {
    if (!keepSample) {
      await clearAllData();
    }
    await updatePreferences({ hasCompletedOnboarding: true });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md virtuous-gradient-card rounded-3xl p-6 shadow-2xl text-[#E8E4DF] flex flex-col max-h-[90vh] overflow-y-auto relative border border-[#C6A45C]/40">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="p-1 rounded-2xl bg-[#1d1813] border border-[#C6A45C]/40 shadow-sm flex items-center justify-center">
            <SankalpaEmblem size={44} />
          </div>
          <div>
            <h2 id="onboarding-title" className="text-xl font-bold text-[#F2EBDD] font-serif uppercase tracking-[0.15em]">
              SANKALPA
            </h2>
            <p className="text-xs text-[#C6A45C] font-serif tracking-wide">
              The Ledger of Will &amp; Temptation
            </p>
          </div>
        </div>

        <p className="text-xs text-[#b8ad9f] leading-relaxed mb-4">
          A personal operating system for self-mastery. SANKALPA unites the opposing forces of your daily life into a coherent, honest ledger.
        </p>

        <div className="space-y-3 mb-6">
          {/* Virtuous World */}
          <div className="bg-[#1f1a14]/80 border border-[#C6A45C]/30 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#282117] text-[#C6A45C] mt-0.5 shrink-0 border border-[#C6A45C]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider">
                Virtuous Path (Ascension)
              </h3>
              <p className="text-[11px] text-[#A69B89] mt-0.5 leading-normal">
                Earn willpower points for workouts, meditation, reading, and physical discipline with configurable intervals and multipliers.
              </p>
            </div>
          </div>

          {/* Shadow World */}
          <div className="bg-[#24131b]/80 border border-[#C94750]/30 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#2d141e] text-[#E77A56] mt-0.5 shrink-0 border border-[#C94750]/30">
              <Flame className="w-4 h-4 text-[#C94750]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#E9E0DB] font-serif uppercase tracking-wider">
                Shadow Ledger (Temptation)
              </h3>
              <p className="text-[11px] text-[#9c868f] mt-0.5 leading-normal">
                Track cigarettes, alcohol, and personal indulgences with honest point costs. Your consumption metrics remain independently auditable.
              </p>
            </div>
          </div>

          {/* Equilibrium */}
          <div className="bg-[#18161e]/80 border border-[#C6A45C]/25 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#231e2b] text-[#C6A45C] mt-0.5 shrink-0 border border-[#C6A45C]/25">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider">
                Sankalpa Balance Sheet
              </h3>
              <p className="text-[11px] text-[#A69B89] mt-0.5 leading-normal">
                Full transparency. Edit, reverse, or recalculate transactions anytime with automated double-check verification.
              </p>
            </div>
          </div>

          {/* Local Device Privacy */}
          <div className="bg-[#1a1714]/80 border border-[#82683A]/30 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#241e17] text-[#C6A45C] mt-0.5 shrink-0 border border-[#82683A]/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider">
                100% Local On-Device Vault
              </h3>
              <p className="text-[11px] text-[#A69B89] mt-0.5 leading-normal">
                Zero tracking, zero cloud accounts, zero ads. Your data resides exclusively in your Android browser&apos;s IndexedDB and exports to JSON anytime.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-auto">
          <button
            onClick={() => handleFinish(true)}
            className="w-full min-h-[48px] bg-gradient-to-r from-[#C6A45C] to-[#82683A] hover:brightness-110 active:scale-[0.98] text-[#14120f] font-serif font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#C6A45C]/20 transition-all"
          >
            <span>Enter SANKALPA with Sample Records</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={() => handleFinish(false)}
            className="w-full min-h-[42px] bg-[#221c17] hover:bg-[#2c241e] text-[#c4baa9] text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-[#3d3224]"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#C94750]" />
            <span>Start Clean (Clear Sample Records)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
