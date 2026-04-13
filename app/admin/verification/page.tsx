'use client';

import { useState, useEffect } from 'react';
import { countries } from '@/lib/countries';
import { getDocumentOption, DocumentType } from '@/lib/verification-config';
import { CheckCircle, XCircle, ShieldCheck, Eye, AlertCircle, Search, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, Typography, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Image from 'next/image';

interface Verification {
  id: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
  country: string;
  documentType: DocumentType;
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

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending', 
  UNDER_REVIEW: 'Under Review', 
  VERIFIED: 'Verified', 
  REJECTED: 'Rejected',
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
      const res = await fetch('/api/admin/verification');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVerifications(data.verifications || []);
    } catch (e) {
      console.error('Error fetching verifications:', e);
    } finally {
      setLoading(false);
    }
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
      const res = await fetch(`/api/admin/verification/${selected.id}`, {
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
      const message = err instanceof Error ? err.message : 'Action failed';
      setActionError(message);
    } finally {
      setActing(false);
    }
  };

  const filtered = filter === 'ALL' ? verifications : verifications.filter(v => v.status === filter);
  const counts = FILTER_TABS.reduce((acc, t) => ({
    ...acc,
    [t]: t === 'ALL' ? verifications.length : verifications.filter(v => v.status === t).length,
  }), {} as Record<string, number>);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-white/5 p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h1" size="3xl" weight="bold" className="text-white">Identity Verification</Typography>
              <Typography variant="p" size="sm" className="text-slate-400 mt-1">Review submitted identity documents and manage developer verification status.</Typography>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap pb-2">
          {FILTER_TABS.map(tab => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={cn(
                'group flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200',
                filter === tab 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]' 
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              )}>
              {tab === 'ALL' ? 'All Submissions' : STATUS_LABELS[tab]}
              <Badge variant={filter === tab ? 'secondary' : 'default'} size="sm" className={cn(
                'ml-1',
                filter === tab ? 'bg-white/20 text-white border-0' : 'bg-slate-100 text-slate-500'
              )}>
                {counts[tab]}
              </Badge>
            </button>
          ))}
        </div>

        <div className={cn('grid gap-6', selected ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1')}>
          {/* List */}
          <Card className="rounded-[2.5rem] shadow-sm overflow-hidden border-slate-200/60">
            <CardHeader className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Queue</p>
                  <CardTitle className="text-xl">
                    {filter === 'ALL' ? 'Everything' : STATUS_LABELS[filter]}
                  </CardTitle>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>

            {loading ? (
              <div className="p-8 space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-10 h-10 text-slate-200" />
                </div>
                <Typography variant="p" weight="bold" className="text-slate-900">Queue is clear</Typography>
                <Typography variant="p" size="sm" color="muted">No {filter.toLowerCase()} submissions ready for review.</Typography>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filtered.map(v => {
                  const countryLabel = countries.find(c => c.value === v.country)?.label ?? v.country;
                  const docLabel = getDocumentOption(v.documentType).label;
                  const isSelected = selected?.id === v.id;
                  return (
                    <button key={v.id} onClick={() => { setSelected(isSelected ? null : v); setRejectionReason(''); setActionError(''); }}
                      className={cn(
                        'w-full flex items-center gap-4 px-8 py-5 text-left transition-all duration-200 group',
                        isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                      )}>
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-100 to-white border border-slate-200 flex items-center justify-center text-sm font-black text-slate-700 shrink-0 group-hover:scale-105 transition-transform">
                        {(v.developer.user.name || v.developer.user.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Typography variant="p" size="sm" weight="bold" className="text-slate-900 truncate">
                          {v.developer.user.name || v.developer.user.email}
                        </Typography>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Typography variant="p" size="xs" color="muted">{countryLabel}</Typography>
                          <span className="text-slate-300">·</span>
                          <Typography variant="p" size="xs" color="muted">{docLabel}</Typography>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant={v.status === 'VERIFIED' ? 'success' : v.status === 'REJECTED' ? 'danger' : 'warning'} size="sm">
                          {STATUS_LABELS[v.status]}
                        </Badge>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Detail panel */}
          {selected && (
            <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-slate-200/60 animate-in fade-in slide-in-from-right-4 duration-300 sticky top-4">
              <CardHeader className="px-8 py-6 border-b border-slate-100 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-lg font-black">
                      {(selected.developer.user.name || selected.developer.user.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Reviewing Applicant</p>
                      <CardTitle className="text-xl">
                        {selected.developer.user.name || selected.developer.user.email}
                      </CardTitle>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="rounded-xl w-10 h-10 p-0 text-slate-400">
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <div className="px-8 py-6 space-y-8 overflow-y-auto max-h-[75vh] custom-scrollbar">
                {/* Developer info */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Platform Email',    value: selected.developer.user.email },
                    { label: 'Issuing Country',   value: countries.find(c => c.value === selected.country)?.label ?? selected.country },
                    { label: 'Document Type',     value: getDocumentOption(selected.documentType).label },
                    { label: 'Timestamp',         value: new Date(selected.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{item.label}</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Document images */}
                <div className="space-y-4">
                  <Typography variant="p" size="xs" weight="bold" className="uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Eye className="w-3 h-3" /> Submitted Assets
                  </Typography>
                  <div className="grid gap-4">
                    {[
                      { label: 'ID Document Front',  url: selected.documentFrontUrl || '' },
                      ...(selected.documentBackUrl ? [{ label: 'ID Document Back', url: selected.documentBackUrl || '' }] : []),
                      { label: 'Live Verification Selfie', url: selected.selfieUrl || '' },
                    ].map(doc => (
                      <div key={doc.label} className="group relative">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-slate-600">{doc.label}</label>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline">View Full Size</a>
                        </div>
                        <div className="rounded-2xl overflow-hidden border-2 border-slate-100 group-hover:border-blue-200 transition-all duration-300 bg-slate-50 shadow-inner relative min-h-[200px] flex items-center justify-center">
                          <Image 
                            src={doc.url} 
                            alt={doc.label} 
                            fill
                            className="object-contain p-2"
                            unoptimized
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Specifics */}
                {selected.status === 'VERIFIED' && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold shadow-sm shadow-emerald-500/5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    Verification approved successfully
                  </div>
                )}

                {selected.status === 'REJECTED' && selected.rejectionReason && (
                  <div className="p-5 rounded-2xl bg-red-50 border border-red-100 space-y-2 shadow-sm shadow-red-500/5">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-xs font-black text-red-600 uppercase tracking-widest">Rejection context</p>
                    </div>
                    <p className="text-sm text-red-700 leading-relaxed italic">&quot;{selected.rejectionReason}&quot;</p>
                  </div>
                )}

                {/* Actions (only for pending/under_review) */}
                {(selected.status === 'PENDING' || selected.status === 'UNDER_REVIEW') && (
                  <div className="space-y-5 pt-4 border-t border-slate-100">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Feedback / Rejection Reason <span className="text-slate-300 normal-case font-medium">(min 10 chars for rejection)</span>
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={e => { setRejectionReason(e.target.value); setActionError(''); }}
                        rows={3}
                        placeholder="State clearly why the documents were rejected..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 resize-none transition-all shadow-inner"
                      />
                    </div>

                    {actionError && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold animate-in fade-in zoom-in-95">
                        <AlertCircle className="w-3.5 h-3.5" />{actionError}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button onClick={() => handleAction('approve')} disabled={acting} className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-500/20">
                        {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        {acting ? 'Processing...' : 'Approve Verify'}
                      </Button>
                      <Button variant="outline" onClick={() => handleAction('reject')} disabled={acting} className="flex-1 h-14 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold">
                        <XCircle className="w-4 h-4" />
                        Reject Application
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
