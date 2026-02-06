'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  CreditCard, 
  Box, 
  MessageSquare, 
  Clock,
  ChevronRight,
  Sparkles,
  Zap,
  Briefcase,
  Target,
  ArrowRight
} from 'lucide-react';
import { Button, Card, CardContent, Badge, Typography } from '@/components/ui';

export default function DevBucket() {
  const stats = [
    { 
      label: "Total Earnings", 
      value: "$12,450.00", 
      icon: <CreditCard className="w-6 h-6" />, 
      color: "amber",
      gradient: "from-amber-400/20 to-orange-500/10",
      accent: "text-amber-600 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/30"
    },
    { 
      label: "Active Projects", 
      value: "4", 
      icon: <Box className="w-6 h-6" />, 
      color: "blue",
      gradient: "from-blue-400/20 to-indigo-500/10",
      accent: "text-blue-600 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-900/30"
    },
    { 
      label: "Success Rate", 
      value: "98.5%", 
      icon: <Target className="w-6 h-6" />, 
      color: "emerald",
      gradient: "from-emerald-400/20 to-teal-500/10",
      accent: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/30"
    },
  ];

  const engagements = [
    { id: 1, title: "Cloud API - Alpha Stream", client: "Webbidev_#9201", amount: "$2,500.00", status: "IN PROGRESS", progress: 65, color: "blue" },
    { id: 2, title: "Fintech Mobile App", client: "Global_Solutions", amount: "$4,800.00", status: "REVIEW", progress: 90, color: "amber" },
    { id: 3, title: "AI Image Processor", client: "Vision_Labs", amount: "$3,200.00", status: "IN PROGRESS", progress: 30, color: "indigo" },
  ];

  return (
    <>
      <div className="space-y-10 pb-20">
        {/* Advanced Glassmorphic Header */}
        <header className="relative p-10 lg:p-14 overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] shadow-2xl shadow-slate-400/20 border border-white/40">
          {/* Animated Mesh Background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 contrast-150 brightness-110" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900/50 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Workspace Active</span>
                </div>
                <div className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Top Rated Badge</span>
                </div>
              </div>
              <Typography variant="h1" size="4xl" weight="black" className="text-slate-900 mb-2 tracking-tight lg:text-5xl">
                devBucket
              </Typography>
              <Typography variant="p" className="text-slate-700 font-medium max-w-lg leading-relaxed">
                Your centralized development hub. Advanced workspace for precision engineering and high-fidelity project management.
              </Typography>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4"
            >
              <Button className="bg-slate-900 text-white hover:bg-slate-800 h-16 px-8 rounded-2xl flex items-center gap-3 font-black shadow-xl shadow-slate-900/20 active:scale-95 transition-all border-none">
                <Plus className="w-6 h-6" />
                Quick Action
              </Button>
            </motion.div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -8 }}
              className={`relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border ${stat.border} shadow-sm transition-all duration-300 group overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-full -mr-8 -mt-8 blur-2xl`} />
              <div className="relative flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center ${stat.accent} shadow-inner`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <Typography variant="h3" weight="black" className="text-slate-900 dark:text-white lg:text-3xl">
                    {stat.value}
                  </Typography>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Active Engagements List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                <Briefcase className="w-8 h-8 text-indigo-500" />
                Active Engagements
              </h2>
              <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 gap-2">
                View History <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {engagements.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    whileHover={{ scale: 1.01 }}
                    className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-[1.25rem] flex items-center justify-center text-slate-900 dark:text-white font-black text-2xl shadow-inner border border-slate-100 dark:border-slate-700">
                          {item.title.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1 tracking-tight">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                            <span className="uppercase tracking-widest text-[10px]">Client</span>
                            <span className="text-slate-900 dark:text-slate-300">{item.client}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 self-start md:self-center">
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-900 dark:text-white mb-1">{item.amount}</p>
                          <Badge variant="secondary" className={`bg-${item.color}-50 text-${item.color}-600 dark:bg-${item.color}-900/30 dark:text-${item.color}-400 font-black px-4 py-1.5 rounded-xl border-none`}>
                            {item.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all p-0">
                          <ChevronRight className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
                        <span>Sprint Progress</span>
                        <span className="text-slate-900 dark:text-white">{item.progress}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full`}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
                <MessageSquare className="w-8 h-8 text-blue-500" />
                Live Feed
              </h2>
              <Card className="border-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm">
                <CardContent className="p-8 space-y-6">
                  {[1, 2].map((msg) => (
                    <div key={msg} className="flex gap-5 items-center group cursor-pointer p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl flex items-center justify-center shadow-inner border border-slate-100 dark:border-slate-800" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h5 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">Client User {msg}</h5>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] text-slate-400 font-bold uppercase">2m ago</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate leading-relaxed">The latest update on the Cloud API integration looks solid!</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-2xl py-6 font-black text-xs uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-slate-100 dark:border-slate-800">
                    Open Messages
                  </Button>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Premium Toolkit</h2>
              <div className="grid grid-cols-1 gap-4">
                <motion.div whileHover={{ x: 10 }}>
                  <Button variant="outline" className="w-full h-24 flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm rounded-[1.75rem] group transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-black text-slate-900 dark:text-white block">Speed Test</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dev Performance</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-600 transition-colors" />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ x: 10 }}>
                  <Button variant="outline" className="w-full h-24 flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm rounded-[1.75rem] group transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Box className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-black text-slate-900 dark:text-white block">Cloud Hub</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Infra Center</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </Button>
                </motion.div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
