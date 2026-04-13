'use client';

import { useState, useEffect } from 'react';
import { countries } from '@/lib/countries';
import { getDocumentOption } from '@/lib/verification-config';
import { CheckCircle, XCircle, Clock, ShieldCheck, Eye, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Verification {
  id: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
  country: string;
  documentType: string;
  documentFrontUrl: string;
  documentBackUrl?: string | null;
  selfieUrl: string;
  submittedAt: string;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  developer: {
    id: string;
    isVerified: boolean;
    location: string;
    user: { id: string; name: string | null; email: string };
  };
}

const STATUS_BADGE: Record<string, string> = {
  PENDING:      'bg-amber-100 text-amber-700',
  UNDER_REVIEW: 'bg-amber-100 text-amber-700',
  VERIFIED:     'bg-emerald-100 text-emerald-700',
  REJECTED:     'bg-red-100 text-red-600',
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending', UNDER_REVIEW: 'Under Review', VERIFIED: 'Verified', REJECTED: 'Rejected',
};

const FILTER_TABS = ['ALL', 'PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED'] as const;

export default function AdminVerificationPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<typeof FILTER_TABS[number]>('PENDING');
  const [selected, setSelected] = useState<Verification | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res  = await fetch('/api/admin/verification');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVerifications(data.verifications);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!selected) return;
    if (action === 'reject' && rejectionReason.trim().length < 10) {
      setActionError('Please provide a rejection reason (min 10 characters).');
      return;
    }
    setActing(true);
    setActionError('');
    try {
      const res  = await fetch(`/api/admin/verification/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action === 'approve' ? { action } : { action, rejectionReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      setVerifications(prev => prev.map(v => v.id === selected.id ? { ...v, ...data.verification } : v));
      setSelected(null);
      setRejectionReason('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActing(false);
    }
  };

  const filtered = filter === 'ALL' ? verifications : verifications.filter(v => v.status === filter);
  const counts   = FILTER_TABS.reduce((acc, t) => ({
    ...acc,
    [t]: t === 'ALL' ? verifications.length : verifications.filter(v => v.status === t).length,
  }), {} as Record<string, number>);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] border border-white/60 p-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-white/80 flex items-center justify-center shadow-sm shrink-0">
            <ShieldCheck className="w-8 h-8 text-slate-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Identity Verification</h1>
            <p className="text-sm text-slate-600 mt-1">Review submitted identity documents and approve or reject verifications.</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-colors',
              filter === tab ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            )}>
            {tab === 'ALL' ? 'All' : STATUS_LABELS[tab]}
            <span className={cn('text-xs px-1.5 py-0.5 rounded-lg font-black',
              filter === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600')}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      <div className={cn('grid gap-6', selected ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1')}>
        {/* List */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue</p>
            <h2 className="text-lg font-black text-slate-900">
              {filter === 'ALL' ? 'All Submissions' : STATUS_LABELS[filter]}
              {filtered.length > 0 && <span className="ml-2 text-sm font-bold text-slate-400">({filtered.length})</span>}
            </h2>
          </div>

          {loading ? (
            <div className="p-8 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-8">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <ShieldCheck className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-sm font-black text-slate-900 mb-1">No submissions</p>
              <p className="text-xs text-slate-400">Nothing to review in this category.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map(v => {
                const countryLabel = countries.find(c => c.value === v.country)?.label ?? v.country;
                const docLabel     = getDocumentOption(v.documentType as Parameters<typeof getDocumentOption>[0]).label;
                const isSelected   = selected?.id === v.id;
                return (
                  <button key={v.id} onClick={() => { setSelected(isSelected ? null : v); setRejectionReason(''); setActionError(''); }}
                    className={cn(
                      'w-full flex items-center gap-4 px-8 py-4 text-left transition-colors',
                      isSelected ? 'bg-slate-50' : 'hover:bg-slate-50/50'
                    )}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center text-sm font-black text-slate-600 shrink-0">
                      {(v.developer.user.name || v.developer.user.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate">
                        {v.developer.user.name || v.developer.user.email}
                      </p>
                      <p className="text-xs text-slate-400">{countryLabel} · {docLabel}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${STATUS_BADGE[v.status]}`}>
                        {STATUS_LABELS[v.status]}
                      </span>
                      <Eye className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Review</p>
                <h2 className="text-lg font-black text-slate-900 truncate">
                  {selected.developer.user.name || selected.developer.user.email}
                </h2>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="px-8 py-6 space-y-6 overflow-y-auto max-h-[70vh]">
              {/* Developer info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Email',    value: selected.developer.user.email },
                  { label: 'Country',  value: countries.find(c => c.value === selected.country)?.label ?? selected.country },
                  { label: 'Document', value: getDocumentOption(selected.documentType as Parameters<typeof getDocumentOption>[0]).label },
                  { label: 'Submitted', value: new Date(selected.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                ].map(item => (
                  <div key={item.label} className="bg-slate-50 rounded-2xl px-4 py-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                    <p className="text-xs font-bold text-slate-900 truncate">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Document images */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documents</p>
                {[
                  { label: 'Front',  url: selected.documentFrontUrl },
                  ...(selected.documentBackUrl ? [{ label: 'Back', url: selected.documentBackUrl }] : []),
                  { label: 'Selfie', url: selected.selfieUrl },
                ].map(doc => (
                  <div key={doc.label} className="space-y-1">
                    <p className="text-xs font-bold text-slate-500">{doc.label}</p>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer"
                      className="block rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-400 transition-colors">
                      <img src={doc.url} alt={doc.label} className="w-full max-h-48 object-cover" />
                    </a>
                  </div>
                ))}
              </div>

              {/* Already reviewed */}
              {selected.status === 'VERIFIED' && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold">
                  <CheckCircle className="w-4 h-4" /> Already verified
                </div>
              )}

              {selected.status === 'REJECTED' && selected.rejectionReason && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-100 space-y-1">
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Rejection reason</p>
                  <p className="text-sm text-red-700">{selected.rejectionReason}</p>
                </div>
              )}

              {/* Actions (only for pending/under_review) */}
              {(selected.status === 'PENDING' || selected.status === 'UNDER_REVIEW') && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Rejection reason <span className="text-slate-300 normal-case">(required to reject)</span>
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={e => { setRejectionReason(e.target.value); setActionError(''); }}
                      rows={3}
                      placeholder="e.g. Document is blurry and unreadable. Please resubmit with a clearer photo."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 resize-none transition-all"
                    />
                  </div>

                  {actionError && (
                    <div className="flex items-center gap-2 text-red-600 text-xs font-semibold">
                      <AlertCircle className="w-3.5 h-3.5" />{actionError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => handleAction('approve')} disabled={acting}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
                      <CheckCircle className="w-4 h-4" />
                      {acting ? 'Processing…' : 'Approve'}
                    </button>
                    <button onClick={() => handleAction('reject')} disabled={acting}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
                      <XCircle className="w-4 h-4" />
                      {acting ? 'Processing…' : 'Reject'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
