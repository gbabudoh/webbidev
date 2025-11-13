import { requireClient } from '@/lib/auth-server';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Typography, Badge, Button } from '@/components/ui';
import Link from 'next/link';

export default async function ClientDashboardPage() {
  const user = await requireClient();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
              Welcome back, {user.name || 'Client'}!
            </Typography>
            <Typography variant="p" size="lg" color="muted">
              Manage your projects and find the perfect developers
            </Typography>
          </div>
          <Link href="/client/post">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post New Project
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Projects */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Active Projects
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Typography variant="h2" size="3xl" weight="bold">
                  0
                </Typography>
                <Badge variant="primary" size="sm">In Progress</Badge>
              </div>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                Projects currently active
              </Typography>
            </CardContent>
          </Card>

          {/* Total Spent */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Spent
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Typography variant="h2" size="3xl" weight="bold">
                  $0
                </Typography>
              </div>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                Lifetime investment
              </Typography>
            </CardContent>
          </Card>

          {/* Open Projects */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Open Projects
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Typography variant="h2" size="3xl" weight="bold">
                  0
                </Typography>
                <Badge variant="warning" size="sm">Hiring</Badge>
              </div>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                Looking for developers
              </Typography>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Completed
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Typography variant="h2" size="3xl" weight="bold">
                  0
                </Typography>
                <Badge variant="success" size="sm">Done</Badge>
              </div>
              <Typography variant="p" size="sm" color="muted" className="mt-1">
                Successfully delivered
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects - Takes 2 columns */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <CardTitle>Recent Projects</CardTitle>
                </div>
                <Link href="/client/projects">
                  <Button variant="outline" size="sm">
                    View All
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {/* Empty State */}
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <Typography variant="h3" size="lg" weight="bold" className="mb-2">
                  No projects yet
                </Typography>
                <Typography variant="p" color="muted" className="mb-6">
                  Post your first project to find talented developers
                </Typography>
                <Link href="/client/post">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First Project
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle>Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/client/post" className="block">
                  <Button variant="outline" className="w-full justify-start group hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm">Post Project</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Find developers</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/client/projects" className="block">
                  <Button variant="outline" className="w-full justify-start group hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-500 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm">My Projects</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">View all projects</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/talent" className="block">
                  <Button variant="outline" className="w-full justify-start group hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-500 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm">Browse Talent</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Find developers</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/client/billing" className="block">
                  <Button variant="outline" className="w-full justify-start group hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-500 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm">Billing</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Payment history</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Guide */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardTitle>Getting Started</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <Typography variant="p" size="sm" weight="bold" className="mb-1">
                    Post Your Project
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    Define your project scope with 3-5 clear milestones
                  </Typography>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <Typography variant="p" size="sm" weight="bold" className="mb-1">
                    Review Proposals
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    Browse proposals from specialized developers
                  </Typography>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <Typography variant="p" size="sm" weight="bold" className="mb-1">
                    Approve Milestones
                  </Typography>
                  <Typography variant="p" size="xs" color="muted">
                    Release payments as work is completed
                  </Typography>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
