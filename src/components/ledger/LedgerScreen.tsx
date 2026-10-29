/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useLedger } from '../../context/LedgerContext';
import { LedgerTransaction } from '../../types';
import {
  Scale,
  Search,
  Filter,
  RotateCcw,
  Edit2,
  Trash2,
  Plus,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Flame,
  Sparkles,
} from 'lucide-react';
import { putIntoStore, STORES } from '../../db/indexedDB';
import { SankalpaEmblem } from '../common/SankalpaEmblem';

export const LedgerScreen: React.FC = () => {
  const {
    transactions,
    totalPointsBalance,
    editTransaction,
    reverseTransactionAction,
    deleteTransaction,
    recalculateTransaction,
    showToast,
  } = useLedger();

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'reversed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'reward' | 'consumption' | 'adjustment'>('all');

  // Modal States
  const [editingTx, setEditingTx] = useState<LedgerTransaction | null>(null);
  const [editPoints, setEditPoints] = useState<number>(0);
  const [editDesc, setEditDesc] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  const [reversingTx, setReversingTx] = useState<LedgerTransaction | null>(null);
  const [reversalReason, setReversalReason] = useState<string>('');

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualPoints, setManualPoints] = useState<number>(10);
  const [manualDesc, setManualDesc] = useState<string>('');
  const [manualNotes, setManualNotes] = useState<string>('');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Status
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
      // Type
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesNotes = tx.notes ? tx.notes.toLowerCase().includes(query) : false;
        const matchesDate = tx.timestamp.includes(query);
        if (!matchesDesc && !matchesNotes && !matchesDate) return false;
      }
      return true;
    });
  }, [transactions, statusFilter, typeFilter, searchQuery]);

  const activeCount = transactions.filter((t) => t.status === 'active').length;
  const reversedCount = transactions.filter((t) => t.status === 'reversed').length;

  // Formatters
  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Open Edit Modal
  const openEdit = (tx: LedgerTransaction) => {
    setEditingTx(tx);
    setEditPoints(tx.points);
    setEditDesc(tx.description);
    setEditNotes(tx.notes || '');
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;

    await editTransaction(editingTx.id, {
      points: editPoints,
      description: editDesc,
      notes: editNotes,
    });
    setEditingTx(null);
  };

  // Open Reverse Modal
  const openReverse = (tx: LedgerTransaction) => {
    setReversingTx(tx);
    setReversalReason('Erroneous activity entry');
  };

  // Confirm Reverse
  const handleConfirmReverse = async () => {
    if (!reversingTx) return;
    await reverseTransactionAction(reversingTx.id, reversalReason);
    setReversingTx(null);
  };

  // Add Manual Transaction
  const handleAddManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDesc.trim()) return;

    const now = new Date().toISOString();
    const newTx: LedgerTransaction = {
      id: `tx_man_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: now,
      type: 'adjustment',
      points: manualPoints,
      description: manualDesc.trim(),
      status: 'active',
      notes: manualNotes.trim() ? manualNotes.trim() : 'Manual ledger adjustment',
      createdAt: now,
      updatedAt: now,
    };

    await putIntoStore(STORES.TRANSACTIONS, newTx);
    window.location.reload();
    setIsManualModalOpen(false);
    setManualDesc('');
    setManualNotes('');
    showToast(`Inscribed manual adjustment (${manualPoints >= 0 ? `+${manualPoints}` : manualPoints} pts)`);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-150">
      {/* Header Equilibrium Summary */}
      <div className="equilibrium-card rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#C6A45C]/5 rounded-bl-full pointer-events-none" />

        <div className="flex items-center justify-between text-xs text-[#a49a8d] mb-1">
          <span className="flex items-center gap-2 font-bold font-serif uppercase tracking-widest text-[#C6A45C] text-[11px]">
            <Scale className="w-3.5 h-3.5 text-[#C6A45C]" />
            <span>Sankalpa Balance Sheet</span>
          </span>
          <span className="font-mono tabular-nums text-[11px] text-[#8e8578]">
            {activeCount} active · {reversedCount} void
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#F2EBDD] font-mono tabular-nums">
              {totalPointsBalance > 0 ? `+${totalPointsBalance.toLocaleString()}` : totalPointsBalance.toLocaleString()}{' '}
              <span className="text-xs font-serif text-[#C6A45C] font-semibold tracking-wider uppercase ml-1">
                Net Willpower
              </span>
            </div>
            <p className="text-[11px] text-[#8e8578] mt-0.5">
              Strict audit trail · Reversible &amp; non-destructive
            </p>
          </div>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="min-h-[38px] px-3 bg-[#221c16] hover:bg-[#2c241c] border border-[#C6A45C]/40 rounded-xl text-xs font-bold text-[#F2EBDD] flex items-center gap-1.5 transition active:scale-95 shadow-sm font-serif tracking-wide uppercase"
          >
            <Plus className="w-3.5 h-3.5 text-[#C6A45C]" />
            <span>Adjust</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8a8075] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search entries, inscriptions, notes, dates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#121116] border border-[#26212b] rounded-xl pl-9 pr-3 text-xs text-[#E8E4DF] placeholder:text-[#676057] focus:outline-none focus:border-[#C6A45C]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-[#8a8075] hover:text-[#E8E4DF]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg border font-medium text-xs whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#292219] border-[#C6A45C]/60 text-[#F2EBDD] font-bold'
                : 'bg-[#151419] border-[#26222c] text-[#8e8578]'
            }`}
          >
            All Status
          </button>

          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg border font-medium text-xs whitespace-nowrap transition-colors ${
              statusFilter === 'active'
                ? 'bg-[#292219] border-[#C6A45C]/60 text-[#F2EBDD] font-bold'
                : 'bg-[#151419] border-[#26222c] text-[#8e8578]'
            }`}
          >
            Active Inscriptions ({activeCount})
          </button>

          <button
            onClick={() => setStatusFilter('reversed')}
            className={`px-3 py-1.5 rounded-lg border font-medium text-xs whitespace-nowrap transition-colors ${
              statusFilter === 'reversed'
                ? 'bg-[#2b161c] border-[#C94750]/60 text-[#E9E0DB] font-bold'
                : 'bg-[#151419] border-[#26222c] text-[#8e8578]'
            }`}
          >
            Voided / Reversed ({reversedCount})
          </button>
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-2.5 py-1 rounded-lg border font-medium text-[11px] whitespace-nowrap transition-colors ${
              typeFilter === 'all'
                ? 'bg-[#241f18] border-[#C6A45C]/50 text-[#F2EBDD]'
                : 'bg-[#151419] border-[#26222c] text-[#8e8578]'
            }`}
          >
            All Types
          </button>

          <button
            onClick={() => setTypeFilter('reward')}
            className={`px-2.5 py-1 rounded-lg border font-medium text-[11px] whitespace-nowrap transition-colors ${
              typeFilter === 'reward'
                ? 'bg-[#282117] border-[#C6A45C]/70 text-[#C6A45C] font-semibold'
                : 'bg-[#151419] border-[#26222c] text-[#8e8578]'
            }`}
          >
            Punya (+)
          </button>

          <button
            onClick={() => setTypeFilter('consumption')}
            className={`px-2.5 py-1 rounded-lg border font-medium text-[11px] whitespace-nowrap transition-colors ${
              typeFilter === 'consumption'
                ? 'bg-[#29141b] border-[#C94750]/70 text-[#E77A56] font-semibold'
                : 'bg-[#151419] border-[#26222c] text-[#8e8578]'
            }`}
          >
            Papa (-)
          </button>

          <button
            onClick={() => setTypeFilter('adjustment')}
            className={`px-2.5 py-1 rounded-lg border font-medium text-[11px] whitespace-nowrap transition-colors ${
              typeFilter === 'adjustment'
                ? 'bg-[#241f18] border-[#C6A45C]/50 text-[#F2EBDD]'
                : 'bg-[#151419] border-[#26222c] text-[#8e8578]'
            }`}
          >
            Adjustments
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="bg-[#131217] border border-[#24202b] rounded-2xl p-8 text-center text-[#7a7266] text-xs italic">
            No transactions found matching current filters.
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isReversed = tx.status === 'reversed';
            const isVirtuous = tx.points >= 0 && tx.type === 'reward';
            const isShadow = tx.points < 0 || tx.type === 'consumption';

            return (
              <div
                key={tx.id}
                className={`border rounded-2xl p-4 transition-all shadow-sm ${
                  isReversed
                    ? 'bg-[#121116]/60 border-[#231f28] opacity-60'
                    : isVirtuous
                    ? 'virtuous-gradient-card'
                    : isShadow
                    ? 'shadow-gradient-card'
                    : 'bg-[#15141a] border-[#292433]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#F2EBDD] font-serif">
                        {tx.description}
                      </span>
                      {isReversed && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C94750] bg-[#27151a] px-1.5 py-0.5 rounded border border-[#C94750]/30 font-sans">
                          Voided
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#8e8578] mt-0.5">
                      {formatDate(tx.timestamp)} at {formatTime(tx.timestamp)}
                    </p>

                    {tx.notes && (
                      <p className="text-[11px] text-[#C6A45C]/90 mt-1 font-mono">
                        {tx.notes}
                      </p>
                    )}

                    {isReversed && tx.reversalReason && (
                      <p className="text-[10px] text-[#a48e94] mt-1 italic">
                        Reason: {tx.reversalReason}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono text-base font-bold tabular-nums block ${
                        isReversed
                          ? 'line-through text-[#666059]'
                          : tx.points >= 0
                          ? 'text-[#C6A45C]'
                          : 'text-[#C94750]'
                      }`}
                    >
                      {tx.points >= 0 ? `+${tx.points}` : tx.points} pts
                    </span>
                    <span className="text-[10px] text-[#827d75] capitalize font-serif tracking-wide">
                      {tx.type}
                    </span>
                  </div>
                </div>

                {/* Row Action Buttons */}
                <div className="mt-3 pt-2.5 border-t border-[#26212b] flex items-center justify-end gap-2">
                  {!isReversed && (
                    <>
                      <button
                        onClick={() => openEdit(tx)}
                        className="px-2.5 py-1 text-[11px] font-medium text-[#c4baa9] hover:text-[#F2EBDD] bg-[#1d1b22] hover:bg-[#25222c] rounded-lg flex items-center gap-1 transition"
                      >
                        <Edit2 className="w-3 h-3 text-[#C6A45C]" />
                        <span>Edit</span>
                      </button>

                      {(tx.activityId || tx.consumptionId) && (
                        <button
                          onClick={async () => {
                            const res = await recalculateTransaction(tx.id);
                            if (res.success) {
                              showToast('Transaction points recalculated against current rules');
                            } else {
                              showToast(res.error || 'Failed to recalculate', { type: 'error' });
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-[#C6A45C] hover:text-[#F2EBDD] bg-[#221c16] hover:bg-[#2c241c] border border-[#C6A45C]/30 rounded-lg flex items-center gap-1 transition"
                          title="Recalculate points based on current activity/consumption rules"
                        >
                          <RefreshCw className="w-3 h-3 text-[#C6A45C]" />
                          <span>Recalculate</span>
                        </button>
                      )}

                      <button
                        onClick={() => openReverse(tx)}
                        className="px-2.5 py-1 text-[11px] font-medium text-[#E77A56] hover:text-[#F2EBDD] bg-[#27151a] hover:bg-[#331c23] border border-[#C94750]/30 rounded-lg flex items-center gap-1 transition"
                      >
                        <RotateCcw className="w-3 h-3 text-[#C94750]" />
                        <span>Reverse</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="px-2.5 py-1 text-[11px] font-medium text-[#C94750] hover:text-[#fff] bg-[#251319] hover:bg-[#341822] border border-[#C94750]/30 rounded-lg flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* EDIT TRANSACTION MODAL */}
      {editingTx && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-tx-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-sm bg-[#15141a] border border-[#C6A45C]/30 rounded-2xl p-5 shadow-2xl text-[#E8E4DF] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#26212b]">
              <h3 id="edit-tx-title" className="text-sm font-bold text-[#F2EBDD] font-serif uppercase tracking-wider">
                Edit Inscription
              </h3>
              <button
                onClick={() => setEditingTx(null)}
                className="text-[#8e8578] hover:text-[#F2EBDD]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full h-10 bg-[#100f14] border border-[#282330] rounded-xl px-3 text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C6A45C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider block mb-1">
                  Points Amount
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editPoints}
                  onChange={(e) => setEditPoints(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 bg-[#100f14] border border-[#282330] rounded-xl px-3 font-mono text-sm text-[#F2EBDD] focus:outline-none focus:border-[#C6A45C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider block mb-1">
                  Notes / Calculation Explanation
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full h-10 bg-[#100f14] border border-[#282330] rounded-xl px-3 text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C6A45C]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="flex-1 h-10 bg-[#201d26] hover:bg-[#282430] text-[#a49a8d] text-xs font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 bg-[#C6A45C] hover:bg-[#d8b569] text-[#14120f] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#C6A45C]/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVERSE TRANSACTION MODAL */}
      {reversingTx && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reverse-tx-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-sm bg-[#161318] border border-[#C94750]/40 rounded-2xl p-5 shadow-2xl text-[#E8E4DF] space-y-4">
            <div className="flex items-center gap-2.5 text-[#E77A56]">
              <AlertTriangle className="w-5 h-5 shrink-0 text-[#C94750]" />
              <h3 id="reverse-tx-title" className="text-sm font-bold font-serif uppercase tracking-wider text-[#F2EBDD]">
                Void &amp; Reverse Transaction
              </h3>
            </div>

            <p className="text-xs text-[#b8a9b0] leading-relaxed">
              Reversing will mark this entry as &apos;reversed&apos; and immediately adjust its{' '}
              <strong className="text-[#C6A45C] font-mono">
                {reversingTx.points} points
              </strong>{' '}
              from your willpower balance while preserving historical transparency.
            </p>

            <div>
              <label className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider block mb-1">
                Reason for reversal
              </label>
              <input
                type="text"
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                placeholder="e.g. Erroneous entry, cancelled discipline"
                className="w-full h-10 bg-[#100c12] border border-[#311c25] rounded-xl px-3 text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C94750]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReversingTx(null)}
                className="flex-1 h-10 bg-[#20151c] hover:bg-[#281b24] text-[#a49a8d] text-xs font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReverse}
                className="flex-1 h-10 bg-[#C94750] hover:bg-[#d8555e] text-white text-xs font-serif font-bold uppercase tracking-wider rounded-xl shadow-md shadow-[#C94750]/25"
              >
                Confirm Reversal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL ADJUSTMENT MODAL */}
      {isManualModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="manual-adj-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-sm bg-[#15141a] border border-[#C6A45C]/35 rounded-2xl p-5 shadow-2xl text-[#E8E4DF] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#26212b]">
              <h3 id="manual-adj-title" className="text-sm font-bold text-[#F2EBDD] font-serif uppercase tracking-wider">
                Manual Points Inscription
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-[#8e8578] hover:text-[#F2EBDD]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddManual} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Resolute Fasting / Meditation Challenge"
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  className="w-full h-10 bg-[#100f14] border border-[#282330] rounded-xl px-3 text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C6A45C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider block mb-1">
                  Points (Positive or Negative)
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={manualPoints}
                  onChange={(e) => setManualPoints(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 bg-[#100f14] border border-[#282330] rounded-xl px-3 font-mono text-sm text-[#F2EBDD] focus:outline-none focus:border-[#C6A45C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#F2EBDD] font-serif uppercase tracking-wider block mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Reason or intention context"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full h-10 bg-[#100f14] border border-[#282330] rounded-xl px-3 text-xs text-[#E8E4DF] focus:outline-none focus:border-[#C6A45C]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="flex-1 h-10 bg-[#201d26] hover:bg-[#282430] text-[#a49a8d] text-xs font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 bg-gradient-to-r from-[#C6A45C] to-[#82683A] hover:brightness-110 text-[#14120f] font-serif font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#C6A45C]/20"
                >
                  Inscribe Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
