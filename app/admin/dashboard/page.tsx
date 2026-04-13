'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Typography, Badge, Button } from '@/components/ui';
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils';
import {
  Users, FolderOpen, AlertTriangle, DollarSign, TrendingUp, TrendingDown,
  Shield, Activity, ArrowRight, CreditCard, BarChart3, Scale, Settings,
  Sparkles, ShieldCheck, MessageSquare
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalClients: number;
  totalDevelopers: number;
  totalAdmins: number;
  userGrowth: string;
  usersThisMonth: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  openProjects: number;
  projectGrowth: string;
  projectsThisMonth: number;
  openDisputes: number;
  totalDisputes: number;
  totalRevenue: number;
  revenueGrowth: string;
  revenueThisMonth: number;
  pendingVerifications: number;
}

interface AdminActivityItem {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  description: string | null;
  createdAt: string;
  admin: { name: string | null; email: string };
}

interface RecentUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

const GrowthBadge = ({ value }: { value: string }) => {
  const num = parseFloat(value);
  const isPositive = num > 0;
  return (
    <Badge variant={isPositive ? 'success' : num < 0 ? 'danger' : 'secondary'} size="sm" className="gap-1">
      {isPositive ? <TrendingUp className="w-3 h-3" /> : num < 0 ? <TrendingDown className="w-3 h-3" /> : null}
      {isPositive ? '+' : ''}{value}
    </Badge>
  );
};

const actionIcons: Record<string, { icon: typeof Users; color: string }> = {
  VERIFIED_DEVELOPER: { icon: ShieldCheck, color: 'bg-green-100 text-green-600' },
  RESOLVED_DISPUTE: { icon: Scale, color: 'bg-blue-100 text-blue-600' },
  SUSPENDED_USER: { icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  UPDATE_PROJECT_STATUS: { icon: FolderOpen, color: 'bg-purple-100 text-purple-600' },
  UPDATE_HOMEPAGE_SECTION: { icon: Sparkles, color: 'bg-amber-100 text-amber-600' },
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<AdminActivityItem[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setActivities(data.recentActivities || []);
          setRecentUsers(data.recentUsers || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <Typography variant="p" size="lg" color="muted">Loading dashboard...</Typography>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const s = stats || {} as DashboardStats;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
              Admin Dashboard
            </Typography>
            <Typography variant="p" size="lg" color="muted">
              Platform overview and key metrics
            </Typography>
          </div>
          <Badge variant="primary" size="lg" className="px-4 py-2 gap-2">
            <Shield className="w-4 h-4" />
            Admin Access
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Typography variant="h2" size="3xl" weight="bold">{s.totalUsers || 0}</Typography>
                <GrowthBadge value={s.userGrowth || '0%'} />
              </div>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                {s.totalClients || 0} clients · {s.totalDevelopers || 0} devs · {s.totalAdmins || 0} admins
              </Typography>
            </CardContent>
          </Card>

          {/* Active Projects */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Projects</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Typography variant="h2" size="3xl" weight="bold">{s.activeProjects || 0}</Typography>
                <GrowthBadge value={s.projectGrowth || '0%'} />
              </div>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                {s.totalProjects || 0} total · {s.openProjects || 0} open · {s.completedProjects || 0} done
              </Typography>
            </CardContent>
          </Card>

          {/* Open Disputes */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Open Disputes</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Typography variant="h2" size="3xl" weight="bold">{s.openDisputes || 0}</Typography>
                <Badge variant={s.openDisputes > 0 ? 'warning' : 'success'} size="sm">
                  {s.openDisputes > 0 ? 'Needs attention' : 'All clear'}
                </Badge>
              </div>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                {s.totalDisputes || 0} total disputes · {s.pendingVerifications || 0} pending verifications
              </Typography>
            </CardContent>
          </Card>

          {/* Platform Revenue */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Platform Revenue</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Typography variant="h2" size="3xl" weight="bold">
                  ${(s.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
                <GrowthBadge value={s.revenueGrowth || '0%'} />
              </div>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                ${(s.revenueThisMonth || 0).toLocaleString()} this month (commission)
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Manage Users', href: '/admin/users', icon: Users, color: 'from-blue-500 to-cyan-500' },
                  { label: 'View Projects', href: '/admin/projects', icon: FolderOpen, color: 'from-emerald-500 to-green-500' },
                  { label: 'Review Disputes', href: '/admin/disputes', icon: Scale, color: 'from-orange-500 to-red-500' },
                  { label: 'Payments', href: '/admin/payments', icon: CreditCard, color: 'from-purple-500 to-pink-500' },
                  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, color: 'from-indigo-500 to-blue-500' },
                  { label: 'Settings', href: '/admin/settings', icon: Settings, color: 'from-slate-500 to-slate-700' },
                  { label: 'Homepage CMS', href: '/admin/content', icon: Sparkles, color: 'from-amber-500 to-orange-500' },
                  { label: 'Messages', href: '/admin/messages', icon: MessageSquare, color: 'from-teal-500 to-cyan-500' },
                ].map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                      <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>Recent Activity</CardTitle>
                </div>
                <Link href="/admin/activity">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    View All <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <Typography variant="p" size="sm" color="muted">No recent activity</Typography>
                  </div>
                ) : (
                  activities.slice(0, 6).map((activity) => {
                    const config = actionIcons[activity.action] || { icon: Activity, color: 'bg-slate-100 text-slate-600' };
                    const Icon = config.icon;
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Typography variant="p" size="sm" weight="medium" className="mb-0.5 truncate">
                            {activity.description || activity.action.replace(/_/g, ' ')}
                          </Typography>
                          <Typography variant="p" size="xs" color="muted">
                            by {activity.admin.name || activity.admin.email} · {formatRelativeTime(activity.createdAt)}
                          </Typography>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Users + System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle>Recent Signups</CardTitle>
                </div>
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    View All <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <Typography variant="p" size="sm" color="muted">No recent signups</Typography>
                  </div>
                ) : (
                  recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                        {(user.name || user.email)[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Typography variant="p" size="sm" weight="medium" className="truncate">{user.name || user.email}</Typography>
                        <Typography variant="p" size="xs" color="muted">{formatRelativeTime(user.createdAt)}</Typography>
                      </div>
                      <Badge variant={user.role === 'DEVELOPER' ? 'primary' : user.role === 'CLIENT' ? 'secondary' : 'warning'} size="sm">
                        {user.role}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>System Status</CardTitle>
                </div>
                <Badge variant="success" size="sm" className="gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  All Operational
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: 'Database', desc: 'PostgreSQL', icon: '🗂️' },
                  { name: 'API', desc: 'Next.js API Routes', icon: '⚡' },
                  { name: 'Payments', desc: 'Stripe Connect', icon: '💳' },
                  { name: 'Storage', desc: 'MinIO Object Storage', icon: '📦' },
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{service.icon}</span>
                      <div>
                        <Typography variant="p" size="sm" weight="medium">{service.name}</Typography>
                        <Typography variant="p" size="xs" color="muted">{service.desc}</Typography>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">✓</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
