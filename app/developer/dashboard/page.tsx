'use client';

import { Button, Badge } from '@/components/ui';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  DollarSign,
  FileText,
  CheckCircle,
  Search,
  User,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Star,
  Folder,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function DeveloperDashboardPage() {
  const { user, isLoading } = useAuth();

  const stats = [
    {
      name: 'Active Projects',
      value: '0',
      change: 'None yet',
      icon: Briefcase,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Projects currently in progress'
    },
    {
      name: 'Total Earnings',
      value: '$0',
      change: 'Lifetime',
      icon: DollarSign,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Total released to your account'
    },
    {
      name: 'Proposals Sent',
      value: '0',
      change: '0 pending',
      icon: FileText,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600',
      description: 'Proposals awaiting client response'
    },
    {
      name: 'Completion Rate',
      value: '—',
      change: 'No data yet',
      icon: CheckCircle,
      color: 'orange',
      gradient: 'from-orange-500 to-red-600',
      description: 'Based on completed projects'
    }
  ];

  const quickLinks = [
    {
      name: 'My Profile',
      description: 'Update skills, bio & portfolio',
      icon: User,
      href: '/developer/profile',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400'
    },
    {
      name: 'Browse Jobs',
      description: 'Find open projects to bid on',
      icon: Search,
      href: '/developer/jobs',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: 'Earnings & Payouts',
      description: 'View your payment history',
      icon: DollarSign,
      href: '/developer/earnings',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      name: 'Messages',
      description: 'View conversations with clients',
      icon: MessageSquare,
      href: '/developer/messages',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      text: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      name: 'Project Workspace',
      description: 'Manage your active project files',
      icon: Folder,
      href: '/developer/dashboard/dev-bucket',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-600 dark:text-amber-400'
    },
    {
      name: 'Task Board',
      description: 'Track your work with a Kanban board',
      icon: LayoutDashboard,
      href: '/developer/dashboard/dev-bucket/board',
      bg: 'bg-sky-50 dark:bg-sky-900/20',
      text: 'text-sky-600 dark:text-sky-400'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const firstName = user?.name?.split(' ')[0] || 'Developer';

  return (
    <div className="space-y-8 pb-12">

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] p-8 lg:p-12 shadow-2xl shadow-slate-400/20 border border-white/40"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Developer Dashboard</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight leading-tight">
              Welcome back, {firstName}
            </h1>

            <p className="text-lg text-slate-600 max-w-xl font-medium mb-8">
              You have <span className="text-slate-900 font-bold">0 active projects</span>. Browse open jobs and submit a proposal to get started.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/developer/jobs">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl px-8 py-6 text-base font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] cursor-pointer flex items-center gap-3">
                  <Search className="w-5 h-5" />
                  Browse Open Jobs
                </Button>
              </Link>
              <Link href="/developer/profile">
                <Button variant="ghost" className="text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm rounded-2xl px-8 py-6 text-base font-bold transition-all cursor-pointer">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Profile completion prompt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="hidden lg:block w-[300px] flex-shrink-0"
          >
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Complete Your Profile</p>
                  <p className="text-xs text-slate-500">Attract more clients</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">
                Developers with complete profiles — bio, skills, and portfolio — receive significantly more project proposals.
              </p>
              <Link href="/developer/profile">
                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer">
                  Set Up Profile <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="relative group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-7 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden"
              >
                <div className={cn(
                  'absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.04] group-hover:opacity-[0.08] transition-opacity rounded-full -mr-16 -mt-16',
                  stat.gradient
                )} />

                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <div className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300',
                      'bg-gradient-to-br', stat.gradient
                    )}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                      {stat.change}
                    </Badge>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.name}</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                    <p className="text-xs text-slate-400 font-medium pt-1">{stat.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Active Projects Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
        >
          <div className="p-7 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Active Projects</h2>
                <p className="text-sm text-slate-500 font-medium">Projects you are currently working on</p>
              </div>
            </div>
            <Link href="/developer/jobs">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 rounded-xl font-bold gap-2 cursor-pointer">
                Find Jobs <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="p-12">
            <div className="text-center max-w-sm mx-auto">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full" />
                <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                  <Briefcase className="w-9 h-9 text-slate-400 dark:text-slate-600" />
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No active projects yet</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed text-sm">
                Browse open jobs, submit a proposal, and once a client accepts it your project will appear here.
              </p>
              <Link href="/developer/jobs">
                <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl px-8 py-4 font-black hover:scale-105 transition-transform shadow-xl cursor-pointer">
                  Browse Open Jobs
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="p-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Quick Links</h2>
              <p className="text-sm text-slate-500 font-medium">Jump to any section of your account</p>
            </div>
            <div className="p-5 space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.div key={link.name} whileHover={{ x: 6 }} className="group">
                    <Link href={link.href}>
                      <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-transparent hover:shadow-md transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform', link.bg)}>
                          <Icon className={cn('w-5 h-5', link.text)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{link.name}</p>
                          <p className="text-xs text-slate-500 font-medium truncate">{link.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
