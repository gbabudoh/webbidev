import { requireAdmin } from '@/lib/auth-server';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Typography, Badge } from '@/components/ui';
import Link from 'next/link';

export default async function AdminProjectsPage() {
  const user = await requireAdmin();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
              Projects Management
            </Typography>
            <Typography variant="p" size="lg" color="muted">
              Monitor and manage all platform projects
            </Typography>
          </div>
          <Badge variant="primary" size="lg" className="px-4 py-2">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Admin Access
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Projects */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Projects
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <Typography variant="h2" size="3xl" weight="bold">-</Typography>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                All platform projects
              </Typography>
            </CardContent>
          </Card>

          {/* Active Projects */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Active Projects
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <Typography variant="h2" size="3xl" weight="bold">-</Typography>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                Currently in progress
              </Typography>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Completed
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <Typography variant="h2" size="3xl" weight="bold">-</Typography>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                Successfully delivered
              </Typography>
            </CardContent>
          </Card>

          {/* Total Value */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Value
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <Typography variant="h2" size="3xl" weight="bold">$-</Typography>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                Combined project value
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <CardTitle>Projects List</CardTitle>
                <Typography variant="p" size="sm" color="muted">
                  View and manage all projects
                </Typography>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <Typography variant="h3" size="2xl" weight="bold" className="mb-3">
                Projects Management Coming Soon
              </Typography>
              <Typography variant="p" color="muted" className="max-w-md mx-auto">
                Advanced project management features including filtering, search, and detailed analytics will be available here.
              </Typography>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <CardTitle>Quick Actions</CardTitle>
                <Typography variant="p" size="sm" color="muted">
                  Common administrative tasks
                </Typography>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/users">
                <Card className="hover:shadow-lg hover:border-blue-500 transition-all duration-200 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <Typography variant="p" size="sm" weight="bold">Manage Users</Typography>
                        <Typography variant="p" size="xs" color="muted">View all users</Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/dashboard">
                <Card className="hover:shadow-lg hover:border-emerald-500 transition-all duration-200 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <Typography variant="p" size="sm" weight="bold">Dashboard</Typography>
                        <Typography variant="p" size="xs" color="muted">View analytics</Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Card className="opacity-50 cursor-not-allowed">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <Typography variant="p" size="sm" weight="bold">Disputes</Typography>
                      <Typography variant="p" size="xs" color="muted">Coming soon</Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
