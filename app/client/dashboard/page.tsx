'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
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
  MessageSquare,
  Sparkles,
  Target,
  Shield,
  Clock,
  Folder,
  LayoutDashboard,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  {
    name: 'Active Projects',
    value: '0',
    change: 'In Progress',
    icon: Zap,
    gradient: 'from-blue-500 to-indigo-600',
    description: 'Projects currently active',
  },
  {
    name: 'Total Spent',
    value: '$0',
    change: 'Lifetime',
    icon: DollarSign,
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Total investment to date',
  },
  {
    name: 'Open Projects',
    value: '0',
    change: 'Hiring',
    icon: Search,
    gradient: 'from-purple-500 to-pink-600',
    description: 'Awaiting developer proposals',
  },
  {
    name: 'Completed',
    value: '0',
    change: 'Delivered',
    icon: CheckCircle,
    gradient: 'from-orange-500 to-red-600',
    description: 'Successfully delivered',
  },
];

const quickLinks = [
  {
    name: 'Post a Project',
    description: 'Define scope and find developers',
    icon: Plus,
    href: '/client/post',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    name: 'My Projects',
    description: 'View and manage all your projects',
    icon: Briefcase,
    href: '/client/projects',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
  {
    name: 'Browse Talent',
    description: 'Explore developer profiles',
    icon: Users,
    href: '/talent',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    name: 'Messages',
    description: 'Conversations with your developers',
    icon: MessageSquare,
    href: '/client/messages',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
  },
  {
    name: 'Project Workspace',
    description: 'Files and resources for your project',
    icon: Folder,
    href: '/dashboard/user-bucket',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
  },
  {
    name: 'Project Board',
    description: 'Track milestones with a Kanban board',
    icon: LayoutDashboard,
    href: '/dashboard/user-bucket/board',
    bg: 'bg-sky-50',
    text: 'text-sky-600',
  },
  {
    name: 'Billing',
    description: 'Payment history and invoices',
    icon: CreditCard,
    href: '/client/billing',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
  },
];

const gettingStartedSteps = [
  {
    step: 1,
    title: 'Post Your Project',
    description: 'Define your project scope with 3–5 clear milestones and a budget.',
    icon: FileText,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    step: 2,
    title: 'Review Proposals',
    description: 'Browse proposals from vetted developers and choose the best fit.',
    icon: Search,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    step: 3,
    title: 'Approve Milestones',
    description: 'Release payments as each milestone is delivered and approved.',
    icon: CheckCircle,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
];

export default function ClientDashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse pb-12">
        <div className="h-52 bg-slate-200 rounded-[2.5rem]" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-slate-200 rounded-[2rem]" />)}
        </div>
      </div>
    );
  }

  const firstName = user?.name?.split(' ')[0] || 'Client';

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
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Client Dashboard</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight leading-tight">
              Welcome back, {firstName}
            </h1>

            <p className="text-lg text-slate-600 max-w-xl font-medium mb-8">
              You have <span className="text-slate-900 font-bold">0 active projects</span>. Post a project to start finding talented developers.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/client/post"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl px-8 py-4 text-base font-bold shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5">
                <Plus className="w-5 h-5" />
                Post New Project
              </Link>
              <Link href="/client/projects"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-8 py-4 text-base font-bold shadow-sm transition-all">
                My Projects
              </Link>
            </div>
          </div>

          {/* Right: trust stats card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="hidden lg:block w-[300px] flex-shrink-0"
          >
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl space-y-4">
              {[
                { icon: Shield,  label: 'Secure Escrow',     sub: 'Payments protected until delivery', color: 'text-emerald-500' },
                { icon: Clock,   label: 'Fast Matching',     sub: 'Proposals typically within 24 hrs',  color: 'text-blue-500' },
                { icon: Target,  label: 'Scope Guarantee',   sub: 'Only pay for defined deliverables', color: 'text-purple-500' },
              ].map(({ icon: Icon, label, sub, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Icon className={cn('w-4 h-4', color)} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 leading-tight">{label}</p>
                    <p className="text-xs text-slate-500 font-medium">{sub}</p>
                  </div>
                </div>
              ))}
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
                className="relative group bg-white rounded-[2rem] border border-slate-200 p-7 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden"
              >
                <div className={cn(
                  'absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.04] group-hover:opacity-[0.08] transition-opacity rounded-full -mr-16 -mt-16',
                  stat.gradient
                )} />

                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <div className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br',
                      stat.gradient
                    )}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider">
                      {stat.change}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.name}</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                    <p className="text-xs text-slate-400 font-medium pt-1">{stat.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
        >
          <div className="p-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Projects</h2>
                <p className="text-sm text-slate-500 font-medium">Your most recently posted projects</p>
              </div>
            </div>
            <Link href="/client/projects"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-12">
            <div className="text-center max-w-sm mx-auto">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full" />
                <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <Briefcase className="w-9 h-9 text-slate-400" />
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No projects yet</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed text-sm">
                Post your first project to start receiving proposals from skilled developers.
              </p>
              <Link href="/client/post"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-8 py-4 font-black transition-all hover:scale-105 shadow-xl">
                <Plus className="w-4 h-4" /> Post Your First Project
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
        >
          <div className="p-7 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Quick Links</h2>
            <p className="text-sm text-slate-500 font-medium">Jump to any section</p>
          </div>
          <div className="p-5 space-y-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.name} whileHover={{ x: 6 }} className="group">
                  <Link href={link.href}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-transparent hover:shadow-md transition-all cursor-pointer hover:bg-slate-50">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform', link.bg)}>
                        <Icon className={cn('w-5 h-5', link.text)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-900">{link.name}</p>
                        <p className="text-xs text-slate-500 font-medium truncate">{link.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-7 border-b border-slate-100 bg-slate-50/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">How It Works</p>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Getting Started</h2>
          <p className="text-sm text-slate-500 font-medium">Three simple steps to get your project built</p>
        </div>

        <div className="p-7 grid grid-cols-1 md:grid-cols-3 gap-6">
          {gettingStartedSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.08 }}
                className="relative flex flex-col gap-4 p-6 rounded-[1.5rem] border border-slate-100 bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center', step.iconBg)}>
                    <Icon className={cn('w-5 h-5', step.iconColor)} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {step.step}</span>
                </div>
                <div>
                  <p className="font-black text-slate-900 mb-1">{step.title}</p>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.description}</p>
                </div>
                {i < gettingStartedSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}
