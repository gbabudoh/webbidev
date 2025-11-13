'use client';

import { useState } from 'react';
import { Button, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ApprovalButtonsProps {
  milestoneId: string;
  projectId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'READY_FOR_REVIEW' | 'APPROVED' | 'DISPUTED' | 'REJECTED';
  userRole: 'CLIENT' | 'DEVELOPER' | 'ADMIN';
  onApprove?: () => void;
  onDispute?: () => void;
  onMarkReady?: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function ApprovalButtons({
  milestoneId,
  projectId,
  status,
  userRole,
  onApprove,
  onDispute,
  onMarkReady,
  isLoading = false,
  className,
}: ApprovalButtonsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    if (!onApprove) return;
    setIsSubmitting(true);
    try {
      await onApprove();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispute = async () => {
    if (!onDispute) return;
    setIsSubmitting(true);
    try {
      await onDispute();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkReady = async () => {
    if (!onMarkReady) return;
    setIsSubmitting(true);
    try {
      await onMarkReady();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Developer actions
  if (userRole === 'DEVELOPER') {
    if (status === 'IN_PROGRESS' || status === 'PENDING') {
      return (
        <div className={cn('flex items-center gap-3', className)}>
          <Button
            variant="primary"
            onClick={handleMarkReady}
            isLoading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
          >
            Mark as Ready for Review
          </Button>
        </div>
      );
    }

    if (status === 'READY_FOR_REVIEW') {
      return (
        <div className={cn('flex items-center gap-3', className)}>
          <Typography variant="p" size="sm" color="muted">
            Waiting for client approval...
          </Typography>
        </div>
      );
    }

    if (status === 'APPROVED') {
      return (
        <div className={cn('flex items-center gap-3', className)}>
          <Typography variant="p" size="sm" className="text-green-600 dark:text-green-400">
            ✓ Milestone approved and payment released
          </Typography>
        </div>
      );
    }

    if (status === 'DISPUTED') {
      return (
        <div className={cn('flex items-center gap-3', className)}>
          <Typography variant="p" size="sm" className="text-red-600 dark:text-red-400">
            ⚠ Milestone is under dispute
          </Typography>
        </div>
      );
    }
  }

  // Client actions
  if (userRole === 'CLIENT') {
    if (status === 'READY_FOR_REVIEW') {
      return (
        <div className={cn('flex items-center gap-3', className)}>
          <Button
            variant="primary"
            onClick={handleApprove}
            isLoading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
          >
            Approve & Release Payment
          </Button>
          <Button
            variant="danger"
            onClick={handleDispute}
            isLoading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
          >
            Dispute
          </Button>
        </div>
      );
    }

    if (status === 'APPROVED') {
      return (
        <div className={cn('flex items-center gap-3', className)}>
          <Typography variant="p" size="sm" className="text-green-600 dark:text-green-400">
            ✓ Milestone approved
          </Typography>
        </div>
      );
    }

    if (status === 'DISPUTED') {
      return (
        <div className={cn('flex items-center gap-3', className)}>
          <Typography variant="p" size="sm" className="text-red-600 dark:text-red-400">
            ⚠ Dispute in progress
          </Typography>
        </div>
      );
    }
  }

  // Admin actions (can view but typically don't approve/dispute directly)
  if (userRole === 'ADMIN') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <Typography variant="p" size="sm" color="muted">
          Status: {status}
        </Typography>
      </div>
    );
  }

  return null;
}

