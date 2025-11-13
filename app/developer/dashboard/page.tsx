import { requireDeveloper } from '@/lib/auth-server';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Typography, Button } from '@/components/ui';
import Link from 'next/link';
import { 
  Briefcase, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  Code, 
  Search,
  User,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default async function DeveloperDashboardPage() {
  const user = await requireDeveloper();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/30 dark:via-red-950/30 dark:to-pink-950/30 border border-orange-100 dark:border-orange-900/50 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 to-red-400/20 rounded-full blur-3xl" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <Code className="w-8 h-8 text-white" />
              </div>
              <div>
                <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
                  Developer Dashboard
                </Typography>
                <Typography variant="p" size="lg" color="muted">
                  Welcome back, {user.name || user.email}
                </Typography>
              </div>
            </div>
            <Link href="/developer/jobs">
              <Button variant="primary" className="gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                <Search className="w-4 h-4" />
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="h2" size="3xl" weight="bold" className="mb-1">
                0
              </Typography>
              <Typography variant="p" size="sm" color="muted">
                Active Projects
              </Typography>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <Typography variant="h2" size="3xl" weight="bold" className="mb-1">
                $0
              </Typography>
              <Typography variant="p" size="sm" color="muted">
                Total Earnings
              </Typography>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <Typography variant="h2" size="3xl" weight="bold" className="mb-1">
                0
              </Typography>
              <Typography variant="p" size="sm" color="muted">
                Proposals Sent
              </Typography>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <Typography variant="h2" size="3xl" weight="bold" className="mb-1">
                0
              </Typography>
              <Typography variant="p" size="sm" color="muted">
                Completed Projects
              </Typography>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Typography variant="h3" size="lg" weight="semibold">
                    Recent Projects
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    Your active work
                  </Typography>
                </div>
              </div>
            </div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
              </div>
              <Typography variant="p" color="muted" className="mb-4">
                No active projects yet. Start by browsing available jobs.
              </Typography>
              <Link href="/developer/jobs">
                <Button variant="outline" size="sm" className="gap-2">
                  <Search className="w-4 h-4" />
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Typography variant="h3" size="lg" weight="semibold">
                    Quick Actions
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    Get started quickly
                  </Typography>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <Link href="/developer/profile">
                <div className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <Typography variant="p" size="sm" weight="semibold">
                        Complete Your Profile
                      </Typography>
                      <Typography variant="p" size="xs" color="muted">
                        Add skills and portfolio
                      </Typography>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link href="/developer/jobs">
                <div className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                      <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <Typography variant="p" size="sm" weight="semibold">
                        Browse Available Jobs
                      </Typography>
                      <Typography variant="p" size="xs" color="muted">
                        Find your next project
                      </Typography>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link href="/developer/earnings">
                <div className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-green-300 dark:hover:border-green-700 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <Typography variant="p" size="sm" weight="semibold">
                        View Earnings
                      </Typography>
                      <Typography variant="p" size="xs" color="muted">
                        Track your income
                      </Typography>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

