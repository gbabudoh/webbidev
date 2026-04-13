'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import {
  CreditCard,
  Lock,
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  AlertCircle,
  Plus,
  Receipt,
  DollarSign,
  User,
} from 'lucide-react';

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
  developer?: { id: string; user?: { name: string | null; email: string } };
}

type TxStatus = Transaction['status'];

const STATUS_CONFIG: Record<TxStatus, { label: string; icon: React.ReactNode; className: string }> = {
  RELEASED: {
    label: 'Released',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  HELD_IN_ESCROW: {
    label: 'In Escrow',
    icon: <Lock className="w-3.5 h-3.5" />,
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  PENDING: {
    label: 'Pending',
    icon: <Clock className="w-3.5 h-3.5" />,
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  FAILED: {
    label: 'Failed',
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: 'bg-red-50 text-red-700 border border-red-200',
  },
  REFUNDED: {
    label: 'Refunded',
    icon: <RotateCcw className="w-3.5 h-3.5" />,
    className: 'bg-slate-50 text-slate-600 border border-slate-200',
  },
};

function BillingSkeleton() {
  return (
    <div className="space-y-8 pb-12 animate-pulse">
      {/* Header skeleton */}
      <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-200 via-slate-100 to-white border border-white/60 p-8 md:p-12 h-52" />
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-[2.5rem] bg-white border border-slate-100 p-8 h-36" />
        ))}
      </div>
      {/* Table skeleton */}
      <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8">
        <div className="h-6 bg-slate-100 rounded-xl w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 bg-slate-100 rounded-xl flex-1" />
              <div className="h-10 bg-slate-100 rounded-xl w-32" />
              <div className="h-10 bg-slate-100 rounded-xl w-24" />
              <div className="h-10 bg-slate-100 rounded-xl w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: TxStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.className}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

export default function ClientBillingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/payment');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <BillingSkeleton />;

  const totalSpent = transactions
    .filter((t) => t.status === 'RELEASED')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const inEscrow = transactions
    .filter((t) => t.status === 'HELD_IN_ESCROW')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <motion.header
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] p-8 lg:p-12 shadow-2xl shadow-slate-400/20 border border-white/40"
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm mb-6">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Billing</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight leading-tight">
              Billing & Payments
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              View your payment history and escrow transaction details.
            </p>
          </div>

          {transactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl shrink-0"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transactions</p>
              <p className="text-4xl font-black text-slate-900 leading-none">{transactions.length}</p>
              <p className="text-sm text-slate-500 font-medium mt-1">all time</p>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Error */}
      {error && (
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 p-5 rounded-2xl bg-red-50 border border-red-200"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-sm font-medium text-red-600">{error}</p>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Spent */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Spent</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Released payments</p>
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tight">
              {formatCurrency(totalSpent)}
            </p>
          </div>
        </motion.div>

        {/* In Escrow */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Escrow</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Pending release</p>
              </div>
            </div>
            <p className="text-4xl font-black text-amber-600 tracking-tight">
              {formatCurrency(inEscrow)}
            </p>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transactions</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Total count</p>
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tight">
              {transactions.length}
              <span className="text-lg text-slate-400 font-medium ml-2">total</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
      >
        {/* Panel header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-black text-slate-900 tracking-tight">Transaction History</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">All your payment transactions</p>
            </div>
          </div>
        </div>

        {transactions.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
              <CreditCard className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-xl font-black text-slate-900 mb-2">No transactions yet</p>
            <p className="text-sm text-slate-400 font-medium max-w-sm mb-8">
              When you make payments for milestones, they will appear here.
            </p>
            <Link
              href="/client/post"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Post a Project
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Project</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Milestone</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Developer</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Fee</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((tx) => {
                  const devName = tx.developer?.user?.name || tx.developer?.user?.email;
                  const txDate = tx.releasedAt ?? tx.heldAt ?? tx.createdAt;
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Project */}
                      <td className="px-6 py-5">
                        {tx.project ? (
                          <Link
                            href={`/client/projects/${tx.project.id}`}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 transition-colors"
                          >
                            {tx.project.title}
                          </Link>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>

                      {/* Milestone */}
                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-600 font-medium">
                          {tx.milestone?.title ?? '—'}
                        </span>
                      </td>

                      {/* Developer */}
                      <td className="px-6 py-5">
                        {devName ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-xs shrink-0">
                              {devName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{devName}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-slate-400" />
                            </div>
                            <span className="text-sm text-slate-400">—</span>
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm font-black text-slate-900">
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Platform Fee */}
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm text-slate-400 font-medium">
                          {formatCurrency(tx.webbidevFee)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <StatusChip status={tx.status} />
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5">
                        <span className="text-xs text-slate-400 font-medium">
                          {formatRelativeTime(txDate)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
