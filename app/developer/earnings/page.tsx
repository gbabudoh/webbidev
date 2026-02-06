'use client';

import { useState, useEffect } from 'react';
import PayoutHistoryTable from '@/components/features/payment/PayoutHistoryTable';
import StripeConnectOnboarding from '@/components/features/payment/StripeConnectOnboarding';
import { Typography } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, Clock, Briefcase, Receipt, TrendingUp, AlertCircle } from 'lucide-react';

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
  project?: {
    id: string;
    title: string;
  };
  milestone?: {
    id: string;
    title: string;
  };
}

interface DeveloperProfile {
  id: string;
  totalEarnings: number;
  totalProjects: number;
  completedProjects: number;
  stripeAccountId?: string | null;
  stripeOnboardingComplete: boolean;
}

export default function DeveloperEarningsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch transactions and profile in parallel
      const [transactionsResponse, profileResponse] = await Promise.all([
        fetch('/api/payment'),
        fetch('/api/developer/profile'),
      ]);

      if (!transactionsResponse.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData.transactions || []);

      // Profile is optional - don't fail if it doesn't exist
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load earnings data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-pulse">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <Typography variant="p" size="lg" color="muted">
              Loading earnings...
            </Typography>
          </div>
        </div>
      </>
    );
  }

  const totalEarnings = transactions
    .filter((t) => t.status === 'RELEASED')
    .reduce((sum, t) => sum + Number(t.developerPayout), 0);

  const pendingEarnings = transactions
    .filter((t) => t.status === 'HELD_IN_ESCROW')
    .reduce((sum, t) => sum + Number(t.developerPayout), 0);

  const totalTransactions = transactions.length;

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border border-green-100 dark:border-green-900/50 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl" />
          
          <div className="relative flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
                Earnings
              </Typography>
              <Typography variant="p" size="lg" color="muted">
                Track your earnings and payout history
              </Typography>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <Typography variant="p" size="sm" weight="semibold" className="text-green-600 dark:text-green-400">
                  {formatCurrency(profile?.totalEarnings || totalEarnings)} lifetime earnings
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <Typography variant="p" className="text-red-600 dark:text-red-400">
                {error}
              </Typography>
            </div>
          </div>
        )}

        {/* Stripe Connect Onboarding */}
        {profile && !profile.stripeOnboardingComplete && (
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
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <Typography variant="h2" size="3xl" weight="bold" className="mb-1 text-green-600 dark:text-green-400">
                {formatCurrency(profile?.totalEarnings || totalEarnings)}
              </Typography>
              <Typography variant="p" size="sm" color="muted">
                Total Earnings
              </Typography>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <Typography variant="h2" size="3xl" weight="bold" className="mb-1 text-yellow-600 dark:text-yellow-400">
                {formatCurrency(pendingEarnings)}
              </Typography>
              <Typography variant="p" size="sm" color="muted">
                Pending Payouts
              </Typography>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="h2" size="3xl" weight="bold" className="mb-1">
                {profile?.totalProjects || 0}
              </Typography>
              <Typography variant="p" size="sm" color="muted">
                Total Projects ({profile?.completedProjects || 0} completed)
              </Typography>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <Typography variant="h2" size="3xl" weight="bold" className="mb-1">
                {totalTransactions}
              </Typography>
              <Typography variant="p" size="sm" color="muted">
                Total Transactions
              </Typography>
            </div>
          </div>
        </div>

        {/* Payout History */}
        <PayoutHistoryTable transactions={transactions} />
      </div>
    </>
  );
}

