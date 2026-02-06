import { requireClient } from '@/lib/auth-server';
import { Badge, Button } from '@/components/ui';
import Link from 'next/link';
import { 
  Zap, 
  DollarSign, 
  Search, 
  CheckCircle, 
  Plus, 
  FileText, 
  ArrowRight, 
  Briefcase,
  Users,
  CreditCard,
  HelpCircle,
  Sparkles,
  Target,
  Shield,
  Clock,
  Folder,
  Layout
} from 'lucide-react';

export default async function ClientDashboardPage() {
  const user = await requireClient();

  const stats = [
    {
      name: 'Active Projects',
      value: '0',
      badge: 'In Progress',
      badgeVariant: 'primary' as const,
      description: 'Projects currently active',
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      name: 'Total Spent',
      value: '$0',
      badge: null,
      badgeVariant: null,
      description: 'Lifetime investment',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-500/10 to-green-500/10'
    },
    {
      name: 'Open Projects',
      value: '0',
      badge: 'Hiring',
      badgeVariant: 'warning' as const,
      description: 'Looking for developers',
      icon: Search,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    },
    {
      name: 'Completed',
      value: '0',
      badge: 'Done',
      badgeVariant: 'success' as const,
      description: 'Successfully delivered',
      icon: CheckCircle,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10'
    }
  ];

  const quickActions = [
    {
      name: 'Post Project',
      description: 'Find developers',
      href: '/client/post',
      icon: Plus,
      gradient: 'from-blue-500 to-cyan-500',
      hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
      hoverBorder: 'hover:border-blue-500'
    },
    {
      name: 'userBucket',
      description: 'Project resources',
      href: '/dashboard/user-bucket',
      icon: Folder,
      gradient: 'from-amber-500 to-orange-500',
      hoverBg: 'hover:bg-amber-50 dark:hover:bg-amber-900/20',
      hoverBorder: 'hover:border-amber-500'
    },
    {
      name: 'userBucket Board',
      description: 'Project board',
      href: '/dashboard/user-bucket',
      icon: Layout,
      gradient: 'from-blue-600 to-indigo-600',
      hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
      hoverBorder: 'hover:border-blue-500'
    },
    {
      name: 'My Projects',
      description: 'View all projects',
      href: '/client/projects',
      icon: Briefcase,
      gradient: 'from-purple-500 to-pink-500',
      hoverBg: 'hover:bg-purple-50 dark:hover:bg-purple-900/20',
      hoverBorder: 'hover:border-purple-500'
    },
    {
      name: 'Browse Talent',
      description: 'Find developers',
      href: '/talent',
      icon: Users,
      gradient: 'from-emerald-500 to-green-500',
      hoverBg: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
      hoverBorder: 'hover:border-emerald-500'
    },
    {
      name: 'Billing',
      description: 'Payment history',
      href: '/client/billing',
      icon: CreditCard,
      gradient: 'from-orange-500 to-red-500',
      hoverBg: 'hover:bg-orange-50 dark:hover:bg-orange-900/20',
      hoverBorder: 'hover:border-orange-500'
    }
  ];

  const gettingStartedSteps = [
    {
      step: 1,
      title: 'Post Your Project',
      description: 'Define your project scope with 3-5 clear milestones',
      color: 'bg-blue-500'
    },
    {
      step: 2,
      title: 'Review Proposals',
      description: 'Browse proposals from specialized developers',
      color: 'bg-cyan-500'
    },
    {
      step: 3,
      title: 'Approve Milestones',
      description: 'Release payments as work is completed',
      color: 'bg-purple-500'
    }
  ];

  return (
    <>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] p-8 shadow-2xl shadow-slate-400/20 border border-white/40">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.15),transparent_50%)]" />
          </div>
          
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">Client Dashboard</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                Welcome back, {user.name || 'Client'}!
              </h1>
              <p className="text-lg text-slate-600">
                Manage your projects and find the perfect developers
              </p>
            </div>
                <Link href="/client/post">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-2xl px-8 py-5 sm:py-3 text-sm font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 mx-auto border-t border-white/20">
                    <div className="bg-white/10 p-1 rounded-lg shrink-0 backdrop-blur-sm border border-white/10">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span>Post New Project</span>
                  </Button>
                </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.name}
                className="relative group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.name}
                    </span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </span>
                    {stat.badge && (
                      <Badge variant={stat.badgeVariant} size="sm">{stat.badge}</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Projects</h2>
                </div>
                <Link href="/client/projects">
                  <Button variant="outline" size="sm" className="cursor-pointer flex items-center gap-2">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="p-8">
              {/* Empty State */}
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  No projects yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                  Post your first project to find talented developers and bring your ideas to life
                </p>
                <Link href="/client/post">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-2xl px-8 py-5 sm:py-3 text-sm font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 mx-auto border-t border-white/20">
                    <div className="bg-white/10 p-1 rounded-lg shrink-0 backdrop-blur-sm border border-white/10">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span>Create Your First Project</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h2>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.name} href={action.href} className="block">
                      <div className={`flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 ${action.hoverBg} ${action.hoverBorder} transition-all cursor-pointer group`}>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">{action.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{action.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 p-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Getting Started</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Follow these steps to post your first project</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gettingStartedSteps.map((step) => (
                <div key={step.step} className="flex items-start gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl p-5 border border-white/50 dark:border-slate-700/50">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${step.color} text-white flex items-center justify-center font-bold shadow-lg`}>
                    {step.step}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                      {step.title}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Secure Escrow', description: 'Your payments are protected', gradient: 'from-emerald-500 to-green-500' },
            { icon: Clock, title: 'Fast Matching', description: 'Get proposals within 24 hours', gradient: 'from-blue-500 to-cyan-500' },
            { icon: Target, title: 'Scope Guarantee', description: 'Only pay for defined deliverables', gradient: 'from-purple-500 to-pink-500' }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
