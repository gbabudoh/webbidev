'use client';

import { useState, useEffect, use } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Typography, Badge, Button, Textarea } from '@/components/ui';
import Link from 'next/link';
import { cn, formatRelativeTime } from '@/lib/utils';
import {
  ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle,
  Eye, Save
} from 'lucide-react';

interface Dispute {
  id: string;
  status: string;
  reason: string;
  clientStatement: string | null;
  developerStatement: string | null;
  clientEvidence: string[];
  developerEvidence: string[];
  resolution: string | null;
  reviewerDecision: string | null;
  adminNotes: string | null;
  createdAt: string;
  resolvedAt: string | null;
  client: { name: string | null; email: string };
  developer: { name: string | null; email: string };
  project: { title: string; budget: number | string };
  milestone?: { order: number; title: string };
  reviewer?: { name: string | null; email: string };
}

export default function AdminDisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDispute = async () => {
      try {
        const res = await fetch(`/api/admin/disputes/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDispute(data.dispute);
          setAdminNotes(data.dispute.adminNotes || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDispute();
  }, [id]);

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/disputes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes }),
      });
      if (res.ok) {
        const data = await res.json();
        setDispute((prev) => prev ? { ...prev, ...data.dispute } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
    OPEN: { label: 'Open', color: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
    IN_REVIEW: { label: 'In Review', color: 'bg-blue-100 text-blue-700', icon: Eye },
    RESOLVED_CLIENT: { label: 'Resolved (Client)', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    RESOLVED_DEVELOPER: { label: 'Resolved (Developer)', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    CLOSED: { label: 'Closed', color: 'bg-slate-100 text-slate-700', icon: XCircle },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!dispute) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <Typography variant="h2" size="2xl" weight="bold">Dispute not found</Typography>
          <Link href="/admin/disputes"><Button variant="outline" className="mt-4">← Back to Disputes</Button></Link>
        </div>
      </DashboardLayout>
    );
  }

  const sc = statusConfig[dispute.status] || statusConfig.OPEN;
  const StatusIcon = sc.icon;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/admin/disputes">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />Back to Disputes
          </Button>
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Typography variant="h1" size="2xl" weight="bold" className="mb-2">Dispute Details</Typography>
            <div className="flex items-center gap-3">
              <span className={cn('px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1', sc.color)}>
                <StatusIcon className="w-3.5 h-3.5" />{sc.label}
              </span>
              <Typography variant="p" size="sm" color="muted">{formatRelativeTime(dispute.createdAt)}</Typography>
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <Typography variant="p" size="xs" weight="bold" color="muted" className="uppercase tracking-wider">Client</Typography>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  {(dispute.client.name || dispute.client.email)[0].toUpperCase()}
                </div>
                <div>
                  <Typography variant="p" size="sm" weight="bold">{dispute.client.name || dispute.client.email}</Typography>
                  <Typography variant="p" size="xs" color="muted">{dispute.client.email}</Typography>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Typography variant="p" size="xs" weight="bold" color="muted" className="uppercase tracking-wider">Developer</Typography>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {(dispute.developer.name || dispute.developer.email)[0].toUpperCase()}
                </div>
                <div>
                  <Typography variant="p" size="sm" weight="bold">{dispute.developer.name || dispute.developer.email}</Typography>
                  <Typography variant="p" size="xs" color="muted">{dispute.developer.email}</Typography>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Typography variant="p" size="xs" weight="bold" color="muted" className="uppercase tracking-wider">Project</Typography>
            </CardHeader>
            <CardContent>
              <Typography variant="p" size="sm" weight="bold">{dispute.project.title}</Typography>
              <Typography variant="p" size="xs" color="muted">Budget: ${Number(dispute.project.budget).toLocaleString()}</Typography>
              {dispute.milestone && (
                <Typography variant="p" size="xs" color="muted">Milestone #{dispute.milestone.order}: {dispute.milestone.title}</Typography>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reason & Statements */}
        <Card>
          <CardHeader><CardTitle>Dispute Reason</CardTitle></CardHeader>
          <CardContent>
            <Typography variant="p" size="sm" className="whitespace-pre-wrap">{dispute.reason}</Typography>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-blue-600">Client&apos;s Statement</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Typography variant="p" size="sm" className="whitespace-pre-wrap">
                {dispute.clientStatement || 'No statement provided'}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-purple-600">Developer&apos;s Statement</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Typography variant="p" size="sm" className="whitespace-pre-wrap">
                {dispute.developerStatement || 'No statement provided'}
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Evidence */}
        {(dispute.clientEvidence?.length > 0 || dispute.developerEvidence?.length > 0) && (
          <Card>
            <CardHeader><CardTitle>Evidence</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="p" size="sm" weight="bold" className="mb-3 text-blue-600">Client Evidence</Typography>
                  {dispute.clientEvidence?.length > 0 ? (
                    <div className="space-y-2">
                      {dispute.clientEvidence.map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="block p-3 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-700 hover:bg-blue-100 truncate">
                          📎 Evidence #{i + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <Typography variant="p" size="sm" color="muted">No evidence submitted</Typography>
                  )}
                </div>
                <div>
                  <Typography variant="p" size="sm" weight="bold" className="mb-3 text-purple-600">Developer Evidence</Typography>
                  {dispute.developerEvidence?.length > 0 ? (
                    <div className="space-y-2">
                      {dispute.developerEvidence.map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="block p-3 rounded-lg bg-purple-50 border border-purple-100 text-sm text-purple-700 hover:bg-purple-100 truncate">
                          📎 Evidence #{i + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <Typography variant="p" size="sm" color="muted">No evidence submitted</Typography>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resolution */}
        {dispute.resolution && (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader><CardTitle className="text-green-700">Resolution</CardTitle></CardHeader>
            <CardContent>
              <Typography variant="p" size="sm" className="whitespace-pre-wrap">{dispute.resolution}</Typography>
              {dispute.reviewerDecision && (
                <div className="mt-3">
                  <Badge variant="success" size="sm">{dispute.reviewerDecision.replace('_', ' ')}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Admin Notes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Admin Notes</CardTitle>
              <Button variant="primary" size="sm" onClick={handleSaveNotes} disabled={saving} className="gap-1">
                <Save className="w-3.5 h-3.5" />{saving ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              placeholder="Add internal notes about this dispute..."
            />
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                <div>
                  <Typography variant="p" size="sm" weight="medium">Dispute Opened</Typography>
                  <Typography variant="p" size="xs" color="muted">{new Date(dispute.createdAt).toLocaleString()}</Typography>
                </div>
              </div>
              {dispute.reviewer && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div>
                    <Typography variant="p" size="sm" weight="medium">Under Review by {dispute.reviewer.name || dispute.reviewer.email}</Typography>
                  </div>
                </div>
              )}
              {dispute.resolvedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <Typography variant="p" size="sm" weight="medium">Resolved</Typography>
                    <Typography variant="p" size="xs" color="muted">{new Date(dispute.resolvedAt).toLocaleString()}</Typography>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
