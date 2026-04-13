'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Typography, Badge, Button, Select } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, Wallet, RefreshCw, Shield } from 'lucide-react';

interface Transaction {
  id: string;
  amount: string;
  webbidevFee: string;
  developerPayout: string;
  status: string;
  stripePaymentIntentId: string | null;
  createdAt: string;
  heldAt: string | null;
  releasedAt: string | null;
  project: { id: string; title: string };
  developer: { user: { id: string; name: string | null; email: string } };
  milestone: { id: string; title: string; order: number } | null;
}

const statusConfig: Record<string, { label: string; color: string; variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' }> = {
  PENDING: { label: 'Pending', color: 'bg-slate-100 text-slate-700', variant: 'secondary' },
  HELD_IN_ESCROW: { label: 'In Escrow', color: 'bg-amber-100 text-amber-700', variant: 'warning' },
  RELEASED: { label: 'Released', color: 'bg-green-100 text-green-700', variant: 'success' },
  REFUNDED: { label: 'Refunded', color: 'bg-blue-100 text-blue-700', variant: 'primary' },
  FAILED: { label: 'Failed', color: 'bg-red-100 text-red-700', variant: 'danger' },
};

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [totals, setTotals] = useState({ escrow: 0, released: 0, fees: 0, refunded: 0 });

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      params.set('page', page.toString());

      const res = await fetch(`/api/admin/payments?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
        setPagination(data.pagination);
        setTotals(data.totals);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [statusFilter]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border border-purple-100 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
          <div className="relative flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h1" size="3xl" weight="bold" className="mb-2">Payments & Transactions</Typography>
              <Typography variant="p" size="lg" color="muted">Monitor all platform financial activity</Typography>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Held in Escrow', value: totals.escrow, icon: Shield, color: 'from-amber-500 to-orange-500', prefix: '$' },
            { label: 'Total Released', value: totals.released, icon: ArrowUpRight, color: 'from-green-500 to-emerald-500', prefix: '$' },
            { label: 'Platform Fees', value: totals.fees, icon: DollarSign, color: 'from-purple-500 to-pink-500', prefix: '$' },
            { label: 'Total Refunded', value: totals.refunded, icon: RefreshCw, color: 'from-blue-500 to-cyan-500', prefix: '$' },
          ].map((s) => (
            <Card key={s.label} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Typography variant="p" size="xs" color="muted">{s.label}</Typography>
                    <Typography variant="h3" size="lg" weight="bold">
                      {s.prefix}{s.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="max-w-xs">
              <Select
                label=""
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'HELD_IN_ESCROW', label: 'In Escrow' },
                  { value: 'RELEASED', label: 'Released' },
                  { value: 'REFUNDED', label: 'Refunded' },
                  { value: 'FAILED', label: 'Failed' },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <Typography variant="h3" size="xl" weight="bold" className="mb-2">No transactions found</Typography>
              <Typography variant="p" color="muted">Transactions will appear here once payments are processed</Typography>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-0 px-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Project</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">Developer</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">Milestone</th>
                      <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase">Amount</th>
                      <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase">Fee</th>
                      <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase">Payout</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((t) => {
                      const sc = statusConfig[t.status] || statusConfig.PENDING;
                      return (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <Typography variant="p" size="sm" weight="medium" className="truncate max-w-[200px]">
                              {t.project.title}
                            </Typography>
                          </td>
                          <td className="px-4 py-4">
                            <Typography variant="p" size="sm">{t.developer.user.name || t.developer.user.email}</Typography>
                          </td>
                          <td className="px-4 py-4">
                            <Typography variant="p" size="sm" color="muted">
                              {t.milestone ? `#${t.milestone.order} ${t.milestone.title}` : '—'}
                            </Typography>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Typography variant="p" size="sm" weight="bold">${Number(t.amount).toLocaleString()}</Typography>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Typography variant="p" size="sm" className="text-purple-600">${Number(t.webbidevFee).toLocaleString()}</Typography>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Typography variant="p" size="sm" className="text-green-600">${Number(t.developerPayout).toLocaleString()}</Typography>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Badge variant={sc.variant} size="sm">{sc.label}</Badge>
                          </td>
                          <td className="px-4 py-4">
                            <Typography variant="p" size="xs" color="muted">{formatRelativeTime(t.createdAt)}</Typography>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <Typography variant="p" size="sm" color="muted">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} transactions)
            </Typography>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => fetchPayments(pagination.page - 1)} disabled={pagination.page === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => fetchPayments(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
