'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Typography, Badge, Button, Input, Select } from '@/components/ui';
import Link from 'next/link';
import { cn, formatRelativeTime } from '@/lib/utils';
import { FolderOpen, Search, Eye, AlertTriangle, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  budget: string;
  deadline: string;
  skillType: string;
  status: string;
  createdAt: string;
  client: { id: string; name: string | null; email: string };
  milestoneProgress: number;
  totalMilestones: number;
  completedMilestones: number;
  totalPaid: number;
  proposalCount: number;
  disputeCount: number;
  selectedDeveloperId: string | null;
}

const statusConfig: Record<string, { label: string; variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'; icon: typeof Clock }> = {
  DRAFT: { label: 'Draft', variant: 'secondary', icon: Clock },
  OPEN: { label: 'Open', variant: 'primary', icon: FolderOpen },
  IN_PROGRESS: { label: 'In Progress', variant: 'warning', icon: Clock },
  COMPLETED: { label: 'Completed', variant: 'success', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', variant: 'danger', icon: XCircle },
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, totalValue: 0 });

  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      params.set('page', page.toString());
      params.set('limit', '20');

      const res = await fetch(`/api/admin/projects?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, [search, statusFilter]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30 border border-blue-100 dark:border-blue-900/50 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
          <div className="relative flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h1" size="3xl" weight="bold" className="mb-2">Projects Management</Typography>
              <Typography variant="p" size="lg" color="muted">Monitor and manage all platform projects</Typography>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Projects', value: stats.total, icon: FolderOpen, color: 'from-blue-500 to-cyan-500' },
            { label: 'Active', value: stats.active, icon: Clock, color: 'from-amber-500 to-orange-500' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
            { label: 'Total Value', value: `$${stats.totalValue.toLocaleString()}`, icon: DollarSign, color: 'from-purple-500 to-pink-500' },
          ].map((s) => (
            <Card key={s.label} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Typography variant="p" size="xs" color="muted">{s.label}</Typography>
                    <Typography variant="h3" size="xl" weight="bold">{s.value}</Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search projects by title or client..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                label=""
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'DRAFT', label: 'Draft' },
                  { value: 'OPEN', label: 'Open' },
                  { value: 'IN_PROGRESS', label: 'In Progress' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'CANCELLED', label: 'Cancelled' },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Projects Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <Typography variant="h3" size="xl" weight="bold" className="mb-2">No projects found</Typography>
              <Typography variant="p" color="muted">Try adjusting your filters</Typography>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-0 px-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Project</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">Client</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">Budget</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">Progress</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">Created</th>
                      <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.map((p) => {
                      const sc = statusConfig[p.status] || statusConfig.DRAFT;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <Typography variant="p" size="sm" weight="medium" className="mb-0.5">{p.title}</Typography>
                              <div className="flex gap-2">
                                <Badge variant="secondary" size="sm">{p.skillType}</Badge>
                                {p.disputeCount > 0 && (
                                  <Badge variant="danger" size="sm" className="gap-1">
                                    <AlertTriangle className="w-3 h-3" />{p.disputeCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Typography variant="p" size="sm">{p.client.name || p.client.email}</Typography>
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant={sc.variant} size="sm" className="gap-1">
                              <sc.icon className="w-3 h-3" />{sc.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <Typography variant="p" size="sm" weight="medium">
                              ${Number(p.budget).toLocaleString()}
                            </Typography>
                            {p.totalPaid > 0 && (
                              <Typography variant="p" size="xs" color="muted">
                                ${p.totalPaid.toLocaleString()} paid
                              </Typography>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                                  style={{ width: `${p.milestoneProgress}%` }}
                                />
                              </div>
                              <Typography variant="p" size="xs" color="muted">
                                {p.completedMilestones}/{p.totalMilestones}
                              </Typography>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Typography variant="p" size="xs" color="muted">
                              {formatRelativeTime(p.createdAt)}
                            </Typography>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Link href={`/admin/projects/${p.id}`}>
                              <Button variant="primary" size="sm" className="gap-1">
                                <Eye className="w-3.5 h-3.5" />View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <Typography variant="p" size="sm" color="muted">
              Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </Typography>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => fetchProjects(pagination.page - 1)} disabled={pagination.page === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => fetchProjects(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
