'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, Typography, Badge, Button, Select } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import { Activity, Clock, User, ShieldCheck, FolderOpen, Scale, Settings, Sparkles } from 'lucide-react';

interface ActivityItem {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  admin: { id: string; name: string | null; email: string };
}

const targetTypeIcons: Record<string, { icon: typeof Activity; color: string }> = {
  USER: { icon: User, color: 'bg-blue-100 text-blue-600' },
  PROJECT: { icon: FolderOpen, color: 'bg-green-100 text-green-600' },
  DISPUTE: { icon: Scale, color: 'bg-orange-100 text-orange-600' },
  VERIFICATION: { icon: ShieldCheck, color: 'bg-purple-100 text-purple-600' },
  SETTINGS: { icon: Settings, color: 'bg-slate-100 text-slate-600' },
  HOMEPAGE_SECTION: { icon: Sparkles, color: 'bg-amber-100 text-amber-600' },
};

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 30, total: 0, totalPages: 0 });
  const [targetFilter, setTargetFilter] = useState('');

  const fetchActivities = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (targetFilter) params.set('targetType', targetFilter);
      params.set('page', page.toString());

      const res = await fetch(`/api/admin/activity?${params}`);
      if (res.ok) {
        const data = await res.json() as { activities: ActivityItem[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
        setActivities(data.activities || []);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Fetch activities error:', err);
    } finally {
      setLoading(false);
    }
  }, [targetFilter]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-zinc-50 to-gray-50 border border-slate-200 p-8">
          <div className="relative flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h1" size="3xl" weight="bold" className="mb-2">Activity Log</Typography>
              <Typography variant="p" size="lg" color="muted">Track all admin actions across the platform</Typography>
            </div>
          </div>
        </div>

        {/* Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="max-w-xs">
              <Select
                label=""
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value)}
                options={[
                  { value: '', label: 'All Activities' },
                  { value: 'USER', label: 'User Actions' },
                  { value: 'PROJECT', label: 'Project Actions' },
                  { value: 'DISPUTE', label: 'Dispute Actions' },
                  { value: 'VERIFICATION', label: 'Verification Actions' },
                  { value: 'SETTINGS', label: 'Settings Changes' },
                  { value: 'HOMEPAGE_SECTION', label: 'Content Updates' },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-slate-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <Typography variant="h3" size="xl" weight="bold" className="mb-2">No activity found</Typography>
              <Typography variant="p" color="muted">Admin actions will appear here as they occur</Typography>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const config = targetTypeIcons[activity.targetType] || { icon: Activity, color: 'bg-slate-100 text-slate-600' };
              const Icon = config.icon;
              return (
                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Typography variant="p" size="sm" weight="bold">
                            {activity.action.replace(/_/g, ' ')}
                          </Typography>
                          <Badge variant="secondary" size="sm">{activity.targetType}</Badge>
                        </div>
                        {activity.description && (
                          <Typography variant="p" size="sm" color="muted" className="mb-2">{activity.description}</Typography>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {activity.admin.name || activity.admin.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(activity.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <Typography variant="p" size="sm" color="muted">
              Page {pagination.page} of {pagination.totalPages}
            </Typography>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => fetchActivities(pagination.page - 1)} disabled={pagination.page === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => fetchActivities(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
