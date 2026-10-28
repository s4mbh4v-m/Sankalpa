/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { RotateCcw, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useLedger();

  if (!toast) return null;

  return (
    <aside
      aria-label="Notification alert"
      className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="bg-[#14201a] border border-[#233b2f] text-slate-100 shadow-xl shadow-black/40 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-200 flex-1 leading-snug">
          {toast.message}
        </p>

        {toast.undoAction && (
          <button
            onClick={() => {
              if (toast.undoAction) {
                toast.undoAction();
              }
              hideToast();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 rounded-md hover:bg-emerald-900/50 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
        )}

        <button
          onClick={hideToast}
          className="text-slate-400 hover:text-slate-200 p-1 shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
