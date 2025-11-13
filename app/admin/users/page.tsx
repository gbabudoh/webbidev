'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Input, Select, Button, Typography, Badge } from '@/components/ui';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function UsersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [role, setRole] = useState(searchParams.get('role') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'CLIENT', label: 'Client' },
    { value: 'DEVELOPER', label: 'Developer' },
    { value: 'ADMIN', label: 'Admin' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
  ];

  // Fetch users
  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (role) params.set('role', role);
      if (status) params.set('status', status);
      params.set('page', page.toString());
      params.set('limit', '20');

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Update URL and fetch on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (role) params.set('role', role);
    if (status) params.set('status', status);

    router.replace(`/admin/users?${params.toString()}`);
    fetchUsers(1);
  }, [search, role, status]);

  // Initial load
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    fetchUsers(page);
  }, []);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage);
  };

  const getRoleBadgeVariant = (userRole: string, isSuperAdmin: boolean) => {
    if (isSuperAdmin) return 'danger';
    if (userRole === 'ADMIN') return 'warning';
    if (userRole === 'DEVELOPER') return 'primary';
    return 'secondary';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <Typography variant="p" size="lg" color="muted">Loading users...</Typography>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
              User Management
            </Typography>
            <Typography variant="p" size="lg" color="muted">
              Manage platform users and accounts
            </Typography>
          </div>
          <Badge variant="primary" size="lg" className="px-4 py-2">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {pagination.total} Users
          </Badge>
        </div>

        {/* Filters */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <Input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={roleOptions}
              />
              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
              />
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Typography variant="p" className="text-red-600 dark:text-red-400">
                  {error}
                </Typography>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        {users.length === 0 ? (
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-500/10 to-slate-500/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <Typography variant="h3" size="2xl" weight="bold" className="mb-3">
                  No users found
                </Typography>
                <Typography variant="p" color="muted">
                  {search || role || status
                    ? 'Try adjusting your filters to see more results'
                    : 'No users registered yet'}
                </Typography>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle>All Users ({pagination.total})</CardTitle>
                    <Typography variant="p" size="sm" color="muted">
                      Registered platform users
                    </Typography>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200 dark:border-slate-800">
                        <th className="px-4 py-3 text-left text-sm font-bold text-foreground">User</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Projects</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-foreground">Joined</th>
                        <th className="px-4 py-3 text-right text-sm font-bold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {(user.name || user.email)[0].toUpperCase()}
                              </div>
                              <div>
                                <Typography variant="p" size="sm" weight="medium">
                                  {user.name || 'No name'}
                                </Typography>
                                <Typography variant="p" size="xs" color="muted">
                                  {user.email}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-2">
                              <Badge
                                variant={getRoleBadgeVariant(user.role, user.isSuperAdmin)}
                                size="sm"
                              >
                                {user.isSuperAdmin ? '👑 Super Admin' : user.role}
                              </Badge>
                              {user.hasDeveloperProfile && (
                                <Badge variant="secondary" size="sm">
                                  💼 Developer Profile
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {user.isSuspended ? (
                              <Badge variant="danger" size="sm" className="inline-flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                Suspended
                              </Badge>
                            ) : (
                              <Badge variant="success" size="sm" className="inline-flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Active
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <Typography variant="p" size="sm" weight="medium">
                                {user.projectCount}
                              </Typography>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Typography variant="p" size="xs" color="muted">
                              {formatRelativeTime(user.createdAt)}
                            </Typography>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Link href={`/admin/users/${user.id}`}>
                              <Button variant="primary" size="sm">
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <Typography variant="p" size="sm" color="muted">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} users
                </Typography>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Typography variant="p" size="lg">Loading...</Typography>
        </div>
      </DashboardLayout>
    }>
      <UsersPageContent />
    </Suspense>
  );
}

