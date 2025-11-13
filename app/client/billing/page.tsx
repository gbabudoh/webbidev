'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Typography, Badge, Button } from '@/components/ui';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

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
  developer?: {
    id: string;
    user?: {
      name: string | null;
      email: string;
    };
  };
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
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <Typography variant="p" size="lg" color="muted">Loading billing information...</Typography>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalSpent = transactions
    .filter((t) => t.status === 'RELEASED')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const inEscrow = transactions
    .filter((t) => t.status === 'HELD_IN_ESCROW')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalTransactions = transactions.length;

  const getStatusBadgeVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'RELEASED': return 'success';
      case 'HELD_IN_ESCROW': return 'primary';
      case 'PENDING': return 'secondary';
      case 'FAILED': return 'danger';
      case 'REFUNDED': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'RELEASED':
        return <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
      case 'HELD_IN_ESCROW':
        return <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
      case 'PENDING':
        return <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'FAILED':
        return <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
      case 'REFUNDED':
        return <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
              Billing & Payments
            </Typography>
            <Typography variant="p" size="lg" color="muted">
              View your payment history and transaction details
            </Typography>
          </div>
          <Badge variant="primary" size="lg" className="px-4 py-2">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Payment History
          </Badge>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Typography variant="p" className="text-red-600 dark:text-red-400">
                  {error}
                </Typography>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Spent */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Spent
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <Typography variant="h2" size="3xl" weight="bold" className="text-foreground">
                {formatCurrency(totalSpent)}
              </Typography>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                All time payments
              </Typography>
            </CardContent>
          </Card>

          {/* In Escrow */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                In Escrow
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <Typography variant="h2" size="3xl" weight="bold" className="text-orange-600 dark:text-orange-400">
                {formatCurrency(inEscrow)}
              </Typography>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                Pending release
              </Typography>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Transactions
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <Typography variant="h2" size="3xl" weight="bold">
                {totalTransactions}
              </Typography>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                Total transactions
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <CardTitle>Transaction History</CardTitle>
                <Typography variant="p" size="sm" color="muted">
                  All your payment transactions
                </Typography>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-500/10 to-slate-500/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <Typography variant="h3" size="2xl" weight="bold" className="mb-3">
                  No transactions yet
                </Typography>
                <Typography variant="p" color="muted" className="mb-8 max-w-md mx-auto">
                  When you make payments for projects, they will appear here.
                </Typography>
                <Link href="/client/post">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Post a Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200 dark:border-slate-800">
                      <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Project</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Milestone</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Developer</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-foreground">Amount</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-foreground">Platform Fee</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <td className="px-4 py-4">
                          {transaction.project ? (
                            <Link
                              href={`/client/projects/${transaction.project.id}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                              {transaction.project.title}
                            </Link>
                          ) : (
                            <Typography variant="p" size="sm" color="muted">N/A</Typography>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Typography variant="p" size="sm" color="muted">
                            {transaction.milestone?.title || 'N/A'}
                          </Typography>
                        </td>
                        <td className="px-4 py-4">
                          {transaction.developer?.user ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                                {(transaction.developer.user.name || transaction.developer.user.email)[0].toUpperCase()}
                              </div>
                              <Typography variant="p" size="sm">
                                {transaction.developer.user.name || transaction.developer.user.email}
                              </Typography>
                            </div>
                          ) : (
                            <Typography variant="p" size="sm" color="muted">N/A</Typography>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Typography variant="p" size="sm" weight="bold">
                            {formatCurrency(transaction.amount)}
                          </Typography>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Typography variant="p" size="sm" color="muted">
                            {formatCurrency(transaction.webbidevFee)}
                          </Typography>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={getStatusBadgeVariant(transaction.status)} size="sm" className="inline-flex items-center gap-1">
                            {getStatusIcon(transaction.status)}
                            {transaction.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Typography variant="p" size="xs" color="muted">
                            {transaction.releasedAt
                              ? formatRelativeTime(transaction.releasedAt)
                              : transaction.heldAt
                              ? formatRelativeTime(transaction.heldAt)
                              : formatRelativeTime(transaction.createdAt)}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
