/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, ShieldCheck } from 'lucide-react';

interface PWAInstallBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallBannerProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md bg-[#121c17] border border-[#21352a] rounded-2xl p-5 shadow-2xl text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            NL
          </div>
          <div>
            <h3 id="pwa-install-title" className="text-base font-semibold text-slate-100">
              Install Nasha Ledger
            </h3>
            <p className="text-xs text-slate-400">Add to your Android home screen</p>
          </div>
        </div>

        {isInstalled ? (
          <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3.5 mb-4 text-xs text-emerald-200">
            Nasha Ledger is already installed on your device as a standalone app!
          </div>
        ) : (
          <div className="space-y-4 mb-5 text-sm text-slate-300">
            {isInstallable ? (
              <div>
                <p className="mb-3 text-slate-300">
                  Tap the button below to install directly to your device. You can then launch it like a native Android app without any browser address bar.
                </p>
                <button
                  onClick={async () => {
                    const result = await install();
                    if (result) onClose();
                  }}
                  className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App to Home Screen</span>
                </button>
              </div>
            ) : isIOS ? (
              <div className="space-y-2 bg-[#17251f] p-4 rounded-xl text-xs text-slate-300">
                <p className="font-semibold text-slate-200 mb-1">To install on iPhone or iPad Safari:</p>
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1. Tap the Share icon in the Safari toolbar</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <PlusSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2. Scroll down and tap &quot;Add to Home Screen&quot;</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 bg-[#17251f] p-4 rounded-xl text-xs text-slate-300">
                <p className="font-semibold text-slate-200 mb-1">Android Installation:</p>
                <p>1. Open your browser menu (tap the three dots &apos;⋮&apos; in Chrome or Edge).</p>
                <p>2. Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</p>
                <p>3. Confirm to add Nasha Ledger to your apps.</p>
              </div>
            )}

            <div className="flex items-start gap-2.5 pt-2 border-t border-[#1c2d24] text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                100% private and offline-capable. No account required. All activities and consumptions remain on your local device.
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full min-h-[44px] bg-[#1a2921] hover:bg-[#203329] text-slate-300 text-xs font-medium rounded-xl transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
