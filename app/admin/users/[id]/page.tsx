'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Typography, Badge, Textarea } from '@/components/ui';
import { formatDate } from '@/lib/utils';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'CLIENT' | 'DEVELOPER' | 'ADMIN';
  isSuperAdmin: boolean;
  isSuspended: boolean;
  suspendedAt: string | null;
  suspendedBy: string | null;
  suspensionReason: string | null;
  createdAt: string;
  updatedAt: string;
  projectCount: number;
  hasDeveloperProfile: boolean;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Suspension form
  const [showSuspendForm, setShowSuspendForm] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      setUser(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!suspensionReason.trim()) {
      alert('Please provide a reason for suspension');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: suspensionReason }),
      });

      if (!response.ok) throw new Error('Failed to suspend user');
      
      await fetchUser();
      setShowSuspendForm(false);
      setSuspensionReason('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    if (!confirm('Are you sure you want to unsuspend this user?')) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/users/${userId}/unsuspend`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to unsuspend user');
      
      await fetchUser();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <Typography variant="p" size="lg" color="muted">Loading user details...</Typography>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto mt-12">
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <Typography variant="h3" size="xl" weight="bold" className="text-red-600 dark:text-red-400 mb-2">
                    {error || 'User not found'}
                  </Typography>
                  <Typography variant="p" color="muted">
                    The user you're looking for doesn't exist or you don't have permission to view it.
                  </Typography>
                </div>
                <Button variant="outline" onClick={() => router.push('/admin/users')}>
                  ← Back to Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const getRoleBadgeVariant = () => {
    if (user.isSuperAdmin) return 'danger';
    if (user.role === 'ADMIN') return 'warning';
    if (user.role === 'DEVELOPER') return 'primary';
    return 'secondary';
  };

  const getRoleIcon = () => {
    if (user.isSuperAdmin) return '👑';
    if (user.role === 'ADMIN') return '🛡️';
    if (user.role === 'DEVELOPER') return '💻';
    return '👤';
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-2xl blur-3xl"></div>
          <div className="relative">
            <Button 
              variant="outline" 
              onClick={() => router.push('/admin/users')} 
              className="mb-6 hover:scale-105 transition-transform"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Users
            </Button>
            
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-4xl shadow-lg">
                    {getRoleIcon()}
                  </div>
                  {user.isSuspended && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="space-y-3">
                  <div>
                    <Typography variant="h1" size="3xl" weight="bold" className="mb-1">
                      {user.name || 'Unnamed User'}
                    </Typography>
                    <Typography variant="p" size="lg" color="muted" className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {user.email}
                    </Typography>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={getRoleBadgeVariant()} size="lg" className="px-4 py-1.5">
                      {user.isSuperAdmin ? 'Super Admin' : user.role}
                    </Badge>
                    <Badge variant={user.isSuspended ? 'danger' : 'success'} size="lg" className="px-4 py-1.5">
                      {user.isSuspended ? '🚫 Suspended' : '✓ Active'}
                    </Badge>
                    {user.hasDeveloperProfile && (
                      <Badge variant="secondary" size="lg" className="px-4 py-1.5">
                        💼 Developer Profile
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {user.isSuspended ? (
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handleUnsuspend}
                    disabled={actionLoading}
                    className="shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Restore Access
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => setShowSuspendForm(true)}
                    disabled={actionLoading || user.isSuperAdmin}
                    className="shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Suspend Account
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Suspension Alert */}
        {user.isSuspended && user.suspensionReason && (
          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 dark:border-red-800 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <Typography variant="h3" size="lg" weight="bold" className="text-red-600 dark:text-red-400 mb-2">
                    Account Suspended
                  </Typography>
                  <Typography variant="p" size="sm" className="text-red-700 dark:text-red-300 mb-3">
                    {user.suspensionReason}
                  </Typography>
                  {user.suspendedAt && (
                    <Typography variant="p" size="xs" color="muted" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Suspended on {formatDate(user.suspendedAt)}
                    </Typography>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Suspension Form */}
        {showSuspendForm && !user.isSuspended && (
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 dark:border-amber-800 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <CardTitle>Suspend User Account</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Typography variant="p" size="sm" color="muted">
                This action will immediately revoke the user's access to the platform. Please provide a detailed reason for this suspension.
              </Typography>
              <Textarea
                label="Reason for Suspension"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="e.g., Violation of terms of service, fraudulent activity, inappropriate behavior..."
                rows={4}
                required
                className="font-medium"
              />
              <div className="flex gap-3 pt-2">
                <Button
                  variant="danger"
                  size="lg"
                  onClick={handleSuspend}
                  disabled={actionLoading || !suspensionReason.trim()}
                  className="shadow-lg hover:shadow-xl transition-all"
                >
                  {actionLoading ? 'Suspending...' : 'Confirm Suspension'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setShowSuspendForm(false);
                    setSuspensionReason('');
                  }}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="p" size="sm" color="muted" className="mb-2">Total Projects</Typography>
                  <Typography variant="h2" size="3xl" weight="bold">{user.projectCount}</Typography>
                </div>
                <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="p" size="sm" color="muted" className="mb-2">Account Age</Typography>
                  <Typography variant="h2" size="3xl" weight="bold">
                    {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}d
                  </Typography>
                </div>
                <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="p" size="sm" color="muted" className="mb-2">Profile Type</Typography>
                  <Typography variant="h2" size="xl" weight="bold" className="truncate">
                    {user.hasDeveloperProfile ? 'Developer' : user.role}
                  </Typography>
                </div>
                <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Details */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle>Account Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
                  <Typography variant="p" size="sm" color="muted">User ID</Typography>
                  <Typography variant="p" size="sm" className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded">
                    {user.id}
                  </Typography>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
                  <Typography variant="p" size="sm" color="muted">Full Name</Typography>
                  <Typography variant="p" size="sm" weight="medium">{user.name || 'Not set'}</Typography>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
                  <Typography variant="p" size="sm" color="muted">Email Address</Typography>
                  <Typography variant="p" size="sm" weight="medium">{user.email}</Typography>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
                  <Typography variant="p" size="sm" color="muted">Account Role</Typography>
                  <Badge variant={getRoleBadgeVariant()}>
                    {user.isSuperAdmin ? 'Super Admin' : user.role}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-3">
                  <Typography variant="p" size="sm" color="muted">Developer Profile</Typography>
                  <Badge variant={user.hasDeveloperProfile ? 'success' : 'secondary'}>
                    {user.hasDeveloperProfile ? 'Active' : 'None'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle>Activity Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <div className="w-0.5 h-full bg-zinc-200 dark:bg-zinc-700 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <Typography variant="p" size="sm" weight="bold" className="mb-1">Account Created</Typography>
                    <Typography variant="p" size="xs" color="muted">{formatDate(user.createdAt)}</Typography>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div className="w-0.5 h-full bg-zinc-200 dark:bg-zinc-700 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <Typography variant="p" size="sm" weight="bold" className="mb-1">Last Updated</Typography>
                    <Typography variant="p" size="xs" color="muted">{formatDate(user.updatedAt)}</Typography>
                  </div>
                </div>

                {user.isSuspended && user.suspendedAt && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Typography variant="p" size="sm" weight="bold" className="mb-1 text-red-600 dark:text-red-400">
                        Account Suspended
                      </Typography>
                      <Typography variant="p" size="xs" color="muted">{formatDate(user.suspendedAt)}</Typography>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
