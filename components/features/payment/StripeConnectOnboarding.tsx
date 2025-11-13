'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Typography, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StripeConnectOnboardingProps {
  accountId?: string | null;
  onboardingComplete?: boolean;
  onStartOnboarding?: () => Promise<{ onboardingUrl: string }>;
  onCheckStatus?: () => Promise<{
    connected: boolean;
    accountId: string | null;
    onboardingComplete: boolean;
  }>;
  className?: string;
}

export default function StripeConnectOnboarding({
  accountId,
  onboardingComplete = false,
  onStartOnboarding,
  onCheckStatus,
  className,
}: StripeConnectOnboardingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
  const [status, setStatus] = useState({
    connected: !!accountId,
    accountId: accountId || null,
    onboardingComplete,
  });

  useEffect(() => {
    if (accountId && !onboardingComplete && onCheckStatus) {
      checkStatus();
    }
  }, [accountId, onboardingComplete]);

  const checkStatus = async () => {
    if (!onCheckStatus) return;
    setIsChecking(true);
    try {
      const newStatus = await onCheckStatus();
      setStatus(newStatus);
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleStartOnboarding = async () => {
    if (!onStartOnboarding) return;
    setIsLoading(true);
    try {
      const result = await onStartOnboarding();
      setOnboardingUrl(result.onboardingUrl);
      // Redirect to Stripe onboarding
      window.location.href = result.onboardingUrl;
    } catch (error) {
      console.error('Error starting onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDashboard = () => {
    // This would typically open Stripe Connect dashboard
    // For now, we'll just show a message
    alert('Stripe Connect dashboard would open here. Implement the login link API call.');
  };

  if (status.onboardingComplete) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Stripe Connect
            <Badge variant="success" size="sm">
              Connected
            </Badge>
          </CardTitle>
          <CardDescription>
            Your Stripe Connect account is set up and ready to receive payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <Typography variant="p" size="sm" className="text-green-600 dark:text-green-400">
              ✓ Your account is verified and ready for payouts.
            </Typography>
          </div>
          <Button variant="outline" onClick={handleOpenDashboard}>
            Open Stripe Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status.connected && !status.onboardingComplete) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Stripe Connect
            <Badge variant="warning" size="sm">
              In Progress
            </Badge>
          </CardTitle>
          <CardDescription>
            Complete your Stripe Connect onboarding to receive payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <Typography variant="p" size="sm" className="text-yellow-600 dark:text-yellow-400">
              ⚠ Your Stripe Connect account is being set up. Please complete the onboarding process.
            </Typography>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={handleStartOnboarding}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Continue Onboarding
            </Button>
            <Button
              variant="outline"
              onClick={checkStatus}
              isLoading={isChecking}
              disabled={isChecking}
            >
              Check Status
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>Stripe Connect Setup</CardTitle>
        <CardDescription>
          Connect your Stripe account to receive payments from completed projects.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Typography variant="p" size="sm">
            To receive payments on Webbidev, you need to connect your Stripe account. This allows
            us to securely transfer funds to you when milestones are approved.
          </Typography>
          <Typography variant="p" size="sm" color="muted">
            The setup process is quick and secure. You'll be redirected to Stripe to complete the
            onboarding.
          </Typography>
        </div>
        <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
          <Typography variant="h4" size="sm" weight="semibold" className="mb-2">
            What you'll need:
          </Typography>
          <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Business or personal information</li>
            <li>Bank account details for payouts</li>
            <li>Tax information (if required)</li>
          </ul>
        </div>
        <Button
          variant="primary"
          onClick={handleStartOnboarding}
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          Start Stripe Connect Setup
        </Button>
      </CardContent>
    </Card>
  );
}

