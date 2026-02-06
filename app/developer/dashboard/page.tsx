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
  Sparkles,
  Zap,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Star,
  Folder,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function DeveloperDashboardPage() {
  const { user, isLoading } = useAuth();

  const stats = [
    {
      name: 'Active Projects',
      value: '0',
      change: '+0%',
      icon: Briefcase,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Ongoing work'
    },
    {
      name: 'Total Earnings',
      value: '$0',
      change: '+$0',
      icon: DollarSign,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Lifetime revenue'
    },
    {
      name: 'Proposals Sent',
      value: '0',
      change: '0 active',
      icon: FileText,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600',
      description: 'Open bids'
    },
    {
      name: 'Success Rate',
      value: '100%',
      change: 'Elite',
      icon: CheckCircle,
      color: 'orange',
      gradient: 'from-orange-500 to-red-600',
      description: 'Job completion'
    }
  ];

  const quickActions = [
    {
      name: 'Profile Setup',
      description: 'Optimize for visibility',
      icon: User,
      href: '/developer/profile',
      color: 'purple',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-100 dark:border-purple-800',
      text: 'text-purple-600 dark:text-purple-400'
    },
    {
      name: 'Explore Jobs',
      description: 'Find your next match',
      icon: Search,
      href: '/developer/jobs',
      color: 'blue',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-100 dark:border-blue-800',
      text: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: 'Earnings Log',
      description: 'Track your growth',
      icon: DollarSign,
      href: '/developer/earnings',
      color: 'emerald',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-100 dark:border-emerald-800',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      name: 'Messages',
      description: 'Chat with clients',
      icon: MessageSquare,
      href: '/developer/messages',
      color: 'indigo',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-100 dark:border-indigo-800',
      text: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      name: 'devBucket',
      description: 'Project resources',
      icon: Folder,
      href: '/developer/dashboard/dev-bucket',
      color: 'amber',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-100 dark:border-amber-800',
      text: 'text-amber-600 dark:text-amber-400'
    },
    {
      name: 'devBucket Board',
      description: 'Progress tracking',
      icon: Layout,
      href: '/developer/dashboard/dev-bucket/board',
      color: 'blue',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-100 dark:border-blue-800',
      text: 'text-blue-600 dark:text-blue-400'
    }
  ];

  if (isLoading) {
    return (
      <>
        <div className="space-y-6 animate-pulse">
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-8 pb-12">
        {/* Advanced Glassmorphic Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] p-8 lg:p-12 shadow-2xl shadow-slate-400/20 border border-white/40"
        >
          {/* Animated Mesh Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/10 rounded-full blur-[120px]" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-400/10 rounded-full blur-[100px] animate-bounce" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-6"
              >
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Developer Pro</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-tight"
              >
                Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600">Future</span>, <br />
                {user?.name?.split(' ')[0] || 'Developer'}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-slate-600 max-w-xl font-medium mb-8"
              >
                You have <span className="text-slate-900 font-bold">0 active project</span> sessions. Explore high-ticket opportunities matching your expertise.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
              >
                <Link href="/developer/jobs">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl px-8 py-7 text-base font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] cursor-pointer flex items-center gap-3">
                    <Search className="w-5 h-5" />
                    Find Jobs
                  </Button>
                </Link>
                <Link href="/developer/profile">
                  <Button variant="ghost" className="text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm rounded-2xl px-8 py-7 text-base font-bold transition-all cursor-pointer">
                    Edit Profile
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Floating Visual Elements */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="relative hidden lg:block"
            >
              <div className="relative w-[340px] h-[340px]">
                {/* Main Orb */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl opacity-60" />
                
                {/* Floating Cards */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 right-0 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 z-20"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Earnings</p>
                    <p className="text-2xl font-black text-slate-900">$0.00</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-10 left-[-40px] p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 z-20"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Project Match</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-3 bg-blue-400 rounded-full" />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-blue-600 font-bold">98% Match Rating</p>
                </motion.div>

                {/* Abstract Code decorative element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-blue-500/10 rounded-full border-dashed animate-spin-slow" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid with entry animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden"
                >
                  <div className={cn(
                    "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-full -mr-16 -mt-16",
                    stat.gradient
                  )} />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500",
                        "bg-gradient-to-br", stat.gradient
                      )}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-tighter">
                        {stat.change}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.name}</p>
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                      <p className="text-xs text-slate-400 font-medium pt-2">{stat.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Active Engagements</h2>
                    <p className="text-sm text-slate-500 font-medium">Projects you&apos;re currently working on</p>
                  </div>
                </div>
                <Link href="/developer/jobs">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 rounded-xl font-bold gap-2">
                    Marketplace <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="p-12">
                <div className="text-center max-w-sm mx-auto">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                      <Briefcase className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-800 flex items-center justify-center"
                    >
                      <Sparkles className="w-3 h-3 text-blue-500 fill-blue-500" />
                    </motion.div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Gateway is Open</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                    A world of high-quality development projects is waiting. Set up your profile to stand out to premium clients.
                  </p>
                  <Link href="/developer/jobs">
                    <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl px-8 py-4 font-black hover:scale-105 transition-transform shadow-xl cursor-pointer">
                      Scale Your Career
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions & Community */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Toolkit</h2>
                <p className="text-sm text-slate-500 font-medium">Quick access to essential features</p>
              </div>
              <div className="p-6 space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.name}
                      whileHover={{ x: 8 }}
                      className="group"
                    >
                      <Link href={action.href}>
                        <div className={cn(
                          "flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer",
                          "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-transparent hover:shadow-lg group-hover:bg-slate-50 dark:group-hover:bg-slate-800/40"
                        )}>
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform", action.bg)}>
                            <Icon className={cn("w-6 h-6", action.text)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate lg:whitespace-normal">{action.name}</p>
                            <p className="text-xs text-slate-500 font-medium truncate">{action.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Achievement/Next Level card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden"
            >
              <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">Level Up Fast</h3>
                <p className="text-indigo-100 text-sm font-medium mb-6 leading-relaxed">
                  Top 5% developers on Webbidev earn 4x the market average. Complete your profile today.
                </p>
                <Link href="/developer/profile">
                  <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 rounded-2xl py-4 font-black shadow-lg">
                    Verify Expertise
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
