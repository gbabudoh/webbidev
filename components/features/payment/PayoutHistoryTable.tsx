'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge, Typography } from '@/components/ui';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

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

interface PayoutHistoryTableProps {
  transactions: Transaction[];
  className?: string;
}

export default function PayoutHistoryTable({
  transactions,
  className,
}: PayoutHistoryTableProps) {
  const getStatusBadgeVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'RELEASED':
        return 'success';
      case 'HELD_IN_ESCROW':
        return 'primary';
      case 'PENDING':
        return 'secondary';
      case 'FAILED':
        return 'danger';
      case 'REFUNDED':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: Transaction['status']) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'HELD_IN_ESCROW':
        return 'In Escrow';
      case 'RELEASED':
        return 'Released';
      case 'REFUNDED':
        return 'Refunded';
      case 'FAILED':
        return 'Failed';
      default:
        return status;
    }
  };

  const totalEarnings = transactions
    .filter((t) => t.status === 'RELEASED')
    .reduce((sum, t) => sum + Number(t.developerPayout), 0);

  const pendingEarnings = transactions
    .filter((t) => t.status === 'HELD_IN_ESCROW')
    .reduce((sum, t) => sum + Number(t.developerPayout), 0);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <Typography variant="p" size="sm" color="muted" className="mb-1">
              Total Earnings
            </Typography>
            <Typography variant="h2" size="2xl" weight="bold" className="text-green-600 dark:text-green-400">
              {formatCurrency(totalEarnings)}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Typography variant="p" size="sm" color="muted" className="mb-1">
              Pending Payouts
            </Typography>
            <Typography variant="h2" size="2xl" weight="bold" className="text-yellow-600 dark:text-yellow-400">
              {formatCurrency(pendingEarnings)}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Typography variant="p" size="sm" color="muted" className="mb-1">
              Total Transactions
            </Typography>
            <Typography variant="h2" size="2xl" weight="bold">
              {transactions.length}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="py-8 text-center">
              <Typography variant="p" color="muted">
                No transactions yet.
              </Typography>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Project
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Milestone
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      Fee
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      Payout
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                      <td className="px-4 py-3 text-sm">
                        {transaction.project?.title || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {transaction.milestone?.title || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-zinc-600 dark:text-zinc-400">
                        {formatCurrency(transaction.webbidevFee)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(transaction.developerPayout)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={getStatusBadgeVariant(transaction.status)} size="sm">
                          {getStatusLabel(transaction.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {transaction.releasedAt
                          ? formatDate(transaction.releasedAt)
                          : transaction.heldAt
                          ? formatDate(transaction.heldAt)
                          : formatDate(transaction.createdAt)}
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
  );
}

