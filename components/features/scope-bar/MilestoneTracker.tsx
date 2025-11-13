'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Typography, Button } from '@/components/ui';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface Milestone {
  id: string;
  title: string;
  definitionOfDone: string;
  paymentPercentage: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'READY_FOR_REVIEW' | 'APPROVED' | 'DISPUTED' | 'REJECTED';
  order: number;
  completedAt?: string | null;
  approvedAt?: string | null;
  disputedAt?: string | null;
  transactions?: Array<{
    id: string;
    status: string;
    amount: number;
    developerPayout: number;
  }>;
}

interface MilestoneTrackerProps {
  milestones: Milestone[];
  projectBudget: number;
  userRole: 'CLIENT' | 'DEVELOPER' | 'ADMIN';
  onStatusChange?: (milestoneId: string, status: string) => void;
  className?: string;
}

export default function MilestoneTracker({
  milestones,
  projectBudget,
  userRole,
  onStatusChange,
  className,
}: MilestoneTrackerProps) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

  const getStatusBadgeVariant = (status: Milestone['status']) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'READY_FOR_REVIEW':
        return 'primary';
      case 'IN_PROGRESS':
        return 'primary';
      case 'DISPUTED':
        return 'danger';
      case 'REJECTED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: Milestone['status']) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'READY_FOR_REVIEW':
        return 'Ready for Review';
      case 'APPROVED':
        return 'Approved';
      case 'DISPUTED':
        return 'Disputed';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  };

  const calculateMilestoneAmount = (percentage: number) => {
    return (projectBudget * percentage) / 100;
  };

  return (
    <div className={cn('space-y-4', className)}>
      <Typography variant="h2" size="xl" weight="bold" className="mb-6">
        Project Milestones (Scope Bar)
      </Typography>

      {milestones.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Typography variant="p" color="muted">
              No milestones defined for this project.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        milestones.map((milestone) => {
          const milestoneAmount = calculateMilestoneAmount(Number(milestone.paymentPercentage));
          const transaction = milestone.transactions?.[0];
          const isExpanded = expandedMilestone === milestone.id;

          return (
            <Card key={milestone.id} className="overflow-hidden">
              <CardHeader className="cursor-pointer" onClick={() => setExpandedMilestone(isExpanded ? null : milestone.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Typography variant="h3" size="lg" weight="semibold">
                        Milestone {milestone.order}: {milestone.title}
                      </Typography>
                      <Badge variant={getStatusBadgeVariant(milestone.status)} size="md">
                        {getStatusLabel(milestone.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <span>
                        Payment: {milestone.paymentPercentage}% ({formatCurrency(milestoneAmount)})
                      </span>
                      {milestone.completedAt && (
                        <span>Completed: {formatDate(milestone.completedAt)}</span>
                      )}
                      {milestone.approvedAt && (
                        <span>Approved: {formatDate(milestone.approvedAt)}</span>
                      )}
                    </div>
                  </div>
                  <svg
                    className={cn(
                      'h-5 w-5 text-zinc-500 transition-transform',
                      isExpanded && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-4">
                  <div>
                    <Typography variant="h4" size="sm" weight="semibold" className="mb-2">
                      Definition of Done
                    </Typography>
                    <Typography variant="p" color="muted" className="whitespace-pre-wrap">
                      {milestone.definitionOfDone}
                    </Typography>
                  </div>

                  {transaction && (
                    <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                      <Typography variant="h4" size="sm" weight="semibold" className="mb-2">
                        Payment Status
                      </Typography>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-zinc-600 dark:text-zinc-400">Amount:</span>
                          <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600 dark:text-zinc-400">Status:</span>
                          <Badge variant={transaction.status === 'RELEASED' ? 'success' : 'secondary'} size="sm">
                            {transaction.status}
                          </Badge>
                        </div>
                        {transaction.status === 'RELEASED' && (
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Payout:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {formatCurrency(transaction.developerPayout)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {milestone.disputedAt && (
                    <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                      <Typography variant="p" size="sm" className="text-red-600 dark:text-red-400">
                        This milestone is under dispute. Disputed on {formatDate(milestone.disputedAt)}.
                      </Typography>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })
      )}

      <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <Typography variant="p" size="sm" color="muted">
            Total Project Budget
          </Typography>
          <Typography variant="h3" size="lg" weight="bold">
            {formatCurrency(projectBudget)}
          </Typography>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Typography variant="p" size="sm" color="muted">
            Milestone Payments
          </Typography>
          <Typography variant="p" size="sm" weight="medium">
            {milestones.reduce((sum, m) => sum + Number(m.paymentPercentage), 0)}%
          </Typography>
        </div>
      </div>
    </div>
  );
}

