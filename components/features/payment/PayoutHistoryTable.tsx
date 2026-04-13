'use client';

import { formatCurrency, formatDate } from '@/lib/utils';
import { Receipt } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  webbidevFee: number;
  developerPayout: number;
  status: 'PENDING' | 'HELD_IN_ESCROW' | 'RELEASED' | 'REFUNDED' | 'FAILED';
  heldAt?: string | null;
  releasedAt?: string | null;
  refundedAt?: string | null;
  createdAt: string;
  project?: { id: string; title: string };
  milestone?: { id: string; title: string };
}

interface PayoutHistoryTableProps {
  transactions: Transaction[];
  className?: string;
}

const STATUS_CONFIG: Record<Transaction['status'], { label: string; className: string }> = {
  RELEASED:      { label: 'Released',  className: 'bg-emerald-100 text-emerald-700' },
  HELD_IN_ESCROW:{ label: 'In Escrow', className: 'bg-amber-100 text-amber-700' },
  PENDING:       { label: 'Pending',   className: 'bg-slate-100 text-slate-600' },
  FAILED:        { label: 'Failed',    className: 'bg-red-100 text-red-600' },
  REFUNDED:      { label: 'Refunded',  className: 'bg-orange-100 text-orange-600' },
};

export default function PayoutHistoryTable({ transactions, className }: PayoutHistoryTableProps) {
  return (
    <div className={`bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden ${className ?? ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">History</p>
          <h2 className="text-lg font-black text-slate-900">
            Payout History
            {transactions.length > 0 && (
              <span className="ml-2 text-sm font-bold text-slate-400">({transactions.length})</span>
            )}
          </h2>
        </div>
      </div>

      <div className="px-8 py-6">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
              <Receipt className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-sm font-black text-slate-900 mb-1">No transactions yet</p>
            <p className="text-xs text-slate-400 font-medium max-w-xs">
              Completed milestones and project payouts will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Project</th>
                  <th className="pb-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Milestone</th>
                  <th className="pb-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="pb-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee</th>
                  <th className="pb-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout</th>
                  <th className="pb-3 pl-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="pb-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((t) => {
                  const status = STATUS_CONFIG[t.status];
                  const date = t.releasedAt ?? t.heldAt ?? t.createdAt;
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-slate-900 max-w-[180px] truncate">
                        {t.project?.title ?? <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-500 max-w-[160px] truncate">
                        {t.milestone?.title ?? <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-3.5 text-right text-slate-600">{formatCurrency(t.amount)}</td>
                      <td className="py-3.5 text-right text-slate-400">{formatCurrency(t.webbidevFee)}</td>
                      <td className="py-3.5 text-right font-black text-slate-900">{formatCurrency(t.developerPayout)}</td>
                      <td className="py-3.5 pl-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-400 whitespace-nowrap">{formatDate(date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
