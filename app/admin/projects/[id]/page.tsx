'use client';

import { useState, useEffect, use } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Typography, Badge, Button } from '@/components/ui';
import Link from 'next/link';
import { cn, formatRelativeTime } from '@/lib/utils';
import {
  ArrowLeft, Clock, AlertTriangle,
  DollarSign, User, FileText
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  status: string;
  skillType: string;
  budget: number | string;
  description: string;
  deadline: string;
  client: { name: string | null; email: string };
  proposals: { id: string }[];
  milestones: {
    id: string;
    order: number;
    title: string;
    paymentPercentage: number | string;
    status: string;
  }[];
  transactions: {
    id: string;
    amount: number | string;
    webbidevFee: number | string;
    developerPayout: number | string;
    status: string;
    createdAt: string;
  }[];
  disputes: {
    id: string;
    status: string;
    createdAt: string;
    client: { name: string | null; email: string };
    developer: { name: string | null; email: string };
  }[];
}

export default function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/admin/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.project);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Change project status to ${newStatus}?`)) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, previousStatus: project?.status }),
      });
      if (res.ok) {
        const data = await res.json();
        setProject((prev) => prev ? { ...prev, status: data.project.status } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <Typography variant="h2" size="2xl" weight="bold">Project not found</Typography>
          <Link href="/admin/projects"><Button variant="outline" className="mt-4">← Back to Projects</Button></Link>
        </div>
      </DashboardLayout>
    );
  }

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-700',
    OPEN: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-amber-100 text-amber-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  const milestoneStatusColors: Record<string, string> = {
    PENDING: 'bg-slate-100 text-slate-600',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    READY_FOR_REVIEW: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-green-100 text-green-700',
    DISPUTED: 'bg-red-100 text-red-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back + Header */}
        <div>
          <Link href="/admin/projects">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />Back to Projects
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <Typography variant="h1" size="2xl" weight="bold" className="mb-2">{project.title}</Typography>
              <div className="flex items-center gap-3">
                <span className={cn('px-3 py-1 rounded-full text-sm font-bold', statusColors[project.status])}>
                  {project.status.replace('_', ' ')}
                </span>
                <Typography variant="p" size="sm" color="muted">{project.skillType}</Typography>
              </div>
            </div>
            <div className="flex gap-2">
              {project.status !== 'CANCELLED' && project.status !== 'COMPLETED' && (
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleStatusChange('CANCELLED')} disabled={updating}>
                  Cancel Project
                </Button>
              )}
              {project.status === 'IN_PROGRESS' && (
                <Button variant="primary" size="sm" onClick={() => handleStatusChange('COMPLETED')} disabled={updating}>
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6 text-center">
            <DollarSign className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <Typography variant="p" size="xs" color="muted">Budget</Typography>
            <Typography variant="h3" size="lg" weight="bold">${Number(project.budget).toLocaleString()}</Typography>
          </CardContent></Card>
          <Card><CardContent className="pt-6 text-center">
            <User className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <Typography variant="p" size="xs" color="muted">Client</Typography>
            <Typography variant="p" size="sm" weight="bold">{project.client.name || project.client.email}</Typography>
          </CardContent></Card>
          <Card><CardContent className="pt-6 text-center">
            <FileText className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <Typography variant="p" size="xs" color="muted">Proposals</Typography>
            <Typography variant="h3" size="lg" weight="bold">{project.proposals.length}</Typography>
          </CardContent></Card>
          <Card><CardContent className="pt-6 text-center">
            <Clock className="w-6 h-6 text-amber-500 mx-auto mb-1" />
            <Typography variant="p" size="xs" color="muted">Deadline</Typography>
            <Typography variant="p" size="sm" weight="bold">{new Date(project.deadline).toLocaleDateString()}</Typography>
          </CardContent></Card>
        </div>

        {/* Description */}
        <Card>
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardContent>
            <Typography variant="p" size="sm" className="whitespace-pre-wrap leading-relaxed">{project.description}</Typography>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Milestones ({project.milestones.length})</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    style={{ width: `${project.milestones.length > 0 ? (project.milestones.filter((m) => m.status === 'APPROVED').length / project.milestones.length * 100) : 0}%` }} />
                </div>
                <Typography variant="p" size="xs" color="muted">
                  {project.milestones.filter((m) => m.status === 'APPROVED').length}/{project.milestones.length}
                </Typography>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {project.milestones.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                      {m.order}
                    </div>
                    <div>
                      <Typography variant="p" size="sm" weight="medium">{m.title}</Typography>
                      <Typography variant="p" size="xs" color="muted">{Number(m.paymentPercentage)}% of budget</Typography>
                    </div>
                  </div>
                  <span className={cn('px-2.5 py-1 rounded-lg text-xs font-bold', milestoneStatusColors[m.status])}>
                    {m.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
              {project.milestones.length === 0 && (
                <Typography variant="p" size="sm" color="muted" className="text-center py-4">No milestones defined</Typography>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        {project.transactions.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Transactions ({project.transactions.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Fee</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Dev Payout</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {project.transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium">${Number(t.amount).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">${Number(t.webbidevFee).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">${Number(t.developerPayout).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <Badge variant={t.status === 'RELEASED' ? 'success' : t.status === 'HELD_IN_ESCROW' ? 'warning' : 'secondary'} size="sm">
                            {t.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">{formatRelativeTime(t.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Disputes */}
        {project.disputes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Disputes ({project.disputes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.disputes.map((d) => (
                  <div key={d.id} className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={d.status === 'OPEN' ? 'warning' : d.status === 'CLOSED' ? 'secondary' : 'success'} size="sm">
                        {d.status.replace('_', ' ')}
                      </Badge>
                      <Typography variant="p" size="xs" color="muted">{formatRelativeTime(d.createdAt)}</Typography>
                    </div>
                    <Typography variant="p" size="sm">
                      {d.client.name || d.client.email} vs {d.developer.name || d.developer.email}
                    </Typography>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
