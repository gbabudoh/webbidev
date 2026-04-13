'use client';

import { useState, useEffect } from 'react';
import PayoutHistoryTable from '@/components/features/payment/PayoutHistoryTable';
import StripeConnectOnboarding from '@/components/features/payment/StripeConnectOnboarding';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, Clock, Briefcase, Receipt, TrendingUp, AlertCircle } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

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

interface DeveloperProfile {
  id: string;
  totalEarnings: number;
  totalProjects: number;
  completedProjects: number;
  stripeAccountId?: string | null;
  stripeOnboardingComplete: boolean;
}

function EarningsSkeleton() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-pulse">
      <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 md:p-12 shadow-sm h-52" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-[2.5rem] bg-white border border-slate-100 p-8 h-36" />
        ))}
      </div>
      <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 h-72" />
    </div>
  );
}

export default function DeveloperEarningsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [transactionsRes, profileRes] = await Promise.all([
        fetch('/api/payment'),
        fetch('/api/developer/profile'),
      ]);
      if (!transactionsRes.ok) throw new Error('Failed to fetch transactions');
      const transactionsData = await transactionsRes.json();
      setTransactions(transactionsData.transactions || []);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.profile);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <EarningsSkeleton />;

  const totalEarnings = transactions
    .filter((t) => t.status === 'RELEASED')
    .reduce((sum, t) => sum + Number(t.developerPayout), 0);

  const pendingEarnings = transactions
    .filter((t) => t.status === 'HELD_IN_ESCROW')
    .reduce((sum, t) => sum + Number(t.developerPayout), 0);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, duration: 0.4 } },
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
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] border border-white/60 p-8 md:p-12 shadow-sm"
      >
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-white border border-white/80 flex items-center justify-center shadow-sm shrink-0">
            <DollarSign className="w-16 h-16 text-slate-600" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-3">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">Earnings</h1>
            <p className="text-base text-slate-700 max-w-2xl leading-relaxed">
              Track your income, pending payouts, and full transaction history across all projects.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-1.5 pt-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">
                {formatCurrency(profile?.totalEarnings || totalEarnings)} lifetime earnings
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error banner */}
      {error && (
        <motion.div
          variants={itemVariants}
          className="p-4 rounded-3xl bg-red-50 border border-red-100 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-red-600 font-medium text-sm">{error}</p>
        </motion.div>
      )}

      {/* Stripe Connect onboarding */}
      {profile && !profile.stripeOnboardingComplete && (
        <motion.div variants={itemVariants}>
          <StripeConnectOnboarding
            accountId={profile.stripeAccountId}
            onboardingComplete={profile.stripeOnboardingComplete}
            onStartOnboarding={async () => {
              const response = await fetch('/api/stripe/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  returnUrl: `${window.location.origin}/developer/earnings`,
                  refreshUrl: `${window.location.origin}/developer/earnings`,
                }),
              });
              const data = await response.json();
              if (!response.ok) throw new Error(data.error || 'Failed to start onboarding');
              return { onboardingUrl: data.onboardingUrl };
            }}
            onCheckStatus={async () => {
              const response = await fetch('/api/stripe/connect');
              const data = await response.json();
              if (!response.ok) throw new Error(data.error || 'Failed to check status');
              return {
                connected: !!data.accountId,
                accountId: data.accountId || null,
                onboardingComplete: data.onboardingComplete || false,
              };
            }}
          />
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Earnings */}
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
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Earnings</p>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tight">
              {formatCurrency(profile?.totalEarnings || totalEarnings)}
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
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Escrow</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Pending release</p>
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tight">
              {formatCurrency(pendingEarnings)}
            </p>
          </div>
        </motion.div>

        {/* Projects */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projects</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{profile?.completedProjects || 0} completed</p>
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tight">
              {profile?.totalProjects || 0}
              <span className="text-lg text-slate-400 font-medium ml-2">total</span>
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
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transactions</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">All time</p>
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tight">
              {transactions.length}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Payout History */}
      <motion.div variants={itemVariants}>
        <PayoutHistoryTable transactions={transactions} />
      </motion.div>
    </motion.div>
  );
}
