'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ExternalLink, CreditCard, Zap, Building2 } from 'lucide-react';

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
  const [status, setStatus] = useState({
    connected: !!accountId,
    accountId: accountId || null,
    onboardingComplete,
  });

  useEffect(() => {
    if (accountId && !onboardingComplete && onCheckStatus) {
      checkStatus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, onboardingComplete]);

  const checkStatus = async () => {
    if (!onCheckStatus) return;
    setIsChecking(true);
    try {
      setStatus(await onCheckStatus());
    } catch (error) {
      console.error('Error checking Stripe status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleStartOnboarding = async () => {
    if (!onStartOnboarding) return;
    setIsLoading(true);
    try {
      const result = await onStartOnboarding();
      window.location.href = result.onboardingUrl;
    } catch (error) {
      console.error('Error starting Stripe onboarding:', error);
      setIsLoading(false);
    }
  };

  const base = `bg-white border rounded-[2.5rem] shadow-sm overflow-hidden ${className ?? ''}`;

  // Already fully connected
  if (status.onboardingComplete) {
    return (
      <div className={`${base} border-slate-100`}>
        <div className="px-8 py-6 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Stripe Connect</p>
            <p className="text-sm font-bold text-slate-900">Account connected — ready to receive payouts</p>
          </div>
        </div>
      </div>
    );
  }

  // Connected but onboarding incomplete
  if (status.connected && !status.onboardingComplete) {
    return (
      <div className={`${base} border-amber-100`}>
        <div className="px-8 py-6 border-b border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stripe Connect</p>
          <h2 className="text-lg font-black text-slate-900">Complete your payout setup</h2>
        </div>
        <div className="px-8 py-6 space-y-5">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-amber-700">
              Your Stripe account is linked but setup isn&apos;t complete. Finish onboarding to start receiving payouts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartOnboarding}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting…
                </>
              ) : (
                <>Continue Setup <ExternalLink className="w-4 h-4" /></>
              )}
            </button>
            <button
              onClick={checkStatus}
              disabled={isChecking}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {isChecking
                ? <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                : 'Check Status'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not yet connected — setup CTA
  return (
    <div className={`${base} border-slate-100`}>
      <div className="px-8 py-6 border-b border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payout Setup</p>
        <h2 className="text-lg font-black text-slate-900">Connect Stripe to get paid</h2>
      </div>
      <div className="px-8 py-6 space-y-6">
        <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
          Link your Stripe account so we can transfer funds directly to you when project milestones are approved.
          Setup is quick and fully secure — you&apos;ll be redirected to Stripe to complete it.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Building2,  label: 'Business or personal info' },
            { icon: CreditCard, label: 'Bank account for payouts' },
            { icon: Zap,        label: 'Tax info (if required)' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <span className="text-xs font-semibold text-slate-600">{label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleStartOnboarding}
          disabled={isLoading}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Redirecting to Stripe…
            </>
          ) : (
            <>Start Stripe Setup <ExternalLink className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
