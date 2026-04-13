'use client';

import { CheckCircle, Clock, XCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { VERIFICATION_STATUS_LABELS, getDocumentOption } from '@/lib/verification-config';
import { countries } from '@/lib/countries';

interface Verification {
  id: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
  country: string;
  documentType: string;
  submittedAt: string;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
}

interface VerificationStatusProps {
  verification: Verification;
  onResubmit?: () => void;
}

const STATUS_UI = {
  PENDING:      { icon: Clock,        bg: 'bg-amber-50',   border: 'border-amber-100',   text: 'text-amber-700',  iconColor: 'text-amber-500',  badge: 'bg-amber-100 text-amber-700' },
  UNDER_REVIEW: { icon: Clock,        bg: 'bg-amber-50',   border: 'border-amber-100',   text: 'text-amber-700',  iconColor: 'text-amber-500',  badge: 'bg-amber-100 text-amber-700' },
  VERIFIED:     { icon: CheckCircle,  bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700',iconColor: 'text-emerald-500',badge: 'bg-emerald-100 text-emerald-700' },
  REJECTED:     { icon: XCircle,      bg: 'bg-red-50',     border: 'border-red-100',     text: 'text-red-700',    iconColor: 'text-red-500',    badge: 'bg-red-100 text-red-600' },
};

export default function VerificationStatus({ verification, onResubmit }: VerificationStatusProps) {
  const ui  = STATUS_UI[verification.status];
  const Icon = ui.icon;
  const countryLabel  = countries.find(c => c.value === verification.country)?.label ?? verification.country;
  const docOption     = getDocumentOption(verification.documentType as Parameters<typeof getDocumentOption>[0]);
  const submittedDate = new Date(verification.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className={`rounded-[2.5rem] border ${ui.bg} ${ui.border} p-8 space-y-6`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${ui.bg}`}>
            <Icon className={`w-5 h-5 ${ui.iconColor}`} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Identity Verification</p>
            <h3 className="text-base font-black text-slate-900">
              {verification.status === 'VERIFIED' ? 'Identity Verified' :
               verification.status === 'REJECTED' ? 'Verification Rejected' :
               'Verification Pending'}
            </h3>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${ui.badge}`}>
          {VERIFICATION_STATUS_LABELS[verification.status]}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Country',   value: countryLabel },
          { label: 'Document',  value: docOption.label },
          { label: 'Submitted', value: submittedDate },
        ].map(item => (
          <div key={item.label} className="bg-white/70 rounded-2xl px-4 py-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
            <p className="text-sm font-black text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Status messages */}
      {(verification.status === 'PENDING' || verification.status === 'UNDER_REVIEW') && (
        <p className={`text-sm font-medium ${ui.text}`}>
          Your documents are being reviewed. This typically takes 1–2 business days.
          You will be notified once a decision has been made.
        </p>
      )}

      {verification.status === 'VERIFIED' && (
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <p className="text-sm font-bold text-emerald-700">
            Your identity has been verified. A verified badge is now shown on your profile.
          </p>
        </div>
      )}

      {verification.status === 'REJECTED' && (
        <div className="space-y-4">
          {verification.rejectionReason && (
            <div className="bg-white/70 rounded-2xl p-4 space-y-1">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Reason for rejection</p>
              <p className="text-sm text-red-700 font-medium">{verification.rejectionReason}</p>
            </div>
          )}
          {onResubmit && (
            <button onClick={onResubmit}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors">
              <RefreshCw className="w-4 h-4" /> Submit New Documents
            </button>
          )}
        </div>
      )}
    </div>
  );
}
