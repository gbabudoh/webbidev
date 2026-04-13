'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  CalendarDays,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Milestone {
  id: string;
  title: string;
  status: string;
  definitionOfDone: string;
  paymentPercentage: number;
  order: number;
}

interface Project {
  id: string;
  title: string;
  status: string;
  budget: number;
  deadline: string;
  skillType: string;
  milestones: Milestone[];
  _count: { proposals: number };
}

type ColId = 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

const COLUMNS: { id: ColId; label: string; icon: React.ElementType; accent: string; bg: string; border: string; dot: string }[] = [
  {
    id:     'PENDING',
    label:  'Pending',
    icon:   Circle,
    accent: 'text-slate-500',
    bg:     'bg-slate-50',
    border: 'border-slate-200',
    dot:    'bg-slate-400',
  },
  {
    id:     'IN_PROGRESS',
    label:  'In Progress',
    icon:   Clock,
    accent: 'text-blue-600',
    bg:     'bg-blue-50',
    border: 'border-blue-200',
    dot:    'bg-blue-500',
  },
  {
    id:     'REVIEW',
    label:  'Under Review',
    icon:   AlertCircle,
    accent: 'text-amber-600',
    bg:     'bg-amber-50',
    border: 'border-amber-200',
    dot:    'bg-amber-500',
  },
  {
    id:     'COMPLETED',
    label:  'Completed',
    icon:   CheckCircle2,
    accent: 'text-emerald-600',
    bg:     'bg-emerald-50',
    border: 'border-emerald-200',
    dot:    'bg-emerald-500',
  },
];

function getMilestoneStatus(ms: Milestone): ColId {
  switch (ms.status) {
    case 'IN_PROGRESS': return 'IN_PROGRESS';
    case 'UNDER_REVIEW':
    case 'REVIEW':      return 'REVIEW';
    case 'APPROVED':
    case 'COMPLETED':   return 'COMPLETED';
    default:            return 'PENDING';
  }
}

function formatDeadline(deadline: string) {
  const date     = new Date(deadline);
  const diffDays = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const label    = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (diffDays < 0)  return { label, urgent: true,  note: 'Overdue' };
  if (diffDays <= 7) return { label, urgent: true,  note: `${diffDays}d left` };
  return              { label, urgent: false, note: `${diffDays}d left` };
}

export default function UserBucketBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState<string | null>(null); // selected project id

  useEffect(() => {
    fetch('/api/project')
      .then(r => r.ok ? r.json() : { projects: [] })
      .then(d => { setProjects(d.projects || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const activeProjects = projects.filter(p => p.status !== 'DRAFT');
  const currentProject = selected
    ? projects.find(p => p.id === selected) ?? activeProjects[0] ?? null
    : activeProjects[0] ?? null;

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = (currentProject?.milestones ?? [])
      .filter(ms => getMilestoneStatus(ms) === col.id)
      .sort((a, b) => a.order - b.order);
    return acc;
  }, {} as Record<ColId, Milestone[]>);

  const totalMilestones   = currentProject?.milestones.length ?? 0;
  const doneMilestones    = (grouped.COMPLETED ?? []).length;
  const progressPct       = totalMilestones ? Math.round((doneMilestones / totalMilestones) * 100) : 0;
  const deadline          = currentProject?.deadline ? formatDeadline(currentProject.deadline) : null;

  return (
    <DashboardLayout showFooter={false}>
      <div className="space-y-8 pb-20">

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/dashboard/user-bucket"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Workspace
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] p-8 lg:p-12 shadow-2xl shadow-slate-400/20 border border-white/40"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-6">
                <LayoutDashboard className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Milestone Board</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight">
                Project Board
              </h1>
              <p className="text-lg text-slate-600 font-medium max-w-xl">
                Track your project milestones across every stage of delivery.
              </p>
            </div>

            {currentProject && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl shrink-0 min-w-[200px]"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Progress</p>
                <p className="text-4xl font-black text-slate-900 leading-none">{progressPct}%</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{doneMilestones} of {totalMilestones} milestones done</p>
                <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {COLUMNS.map(col => (
              <div key={col.id} className="space-y-3">
                <div className="h-10 bg-slate-100 rounded-2xl animate-pulse" />
                {[1, 2].map(i => <div key={i} className="h-28 bg-slate-100 rounded-[2rem] animate-pulse" />)}
              </div>
            ))}
          </div>
        ) : activeProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[2.5rem] border border-slate-100">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <Inbox className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No projects yet</h3>
            <p className="text-slate-500 font-medium text-sm mb-6 max-w-sm mx-auto">
              Post a project to start tracking its milestones on this board.
            </p>
            <Link href="/client/post"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-8 py-3 font-bold transition-all">
              Post a Project
            </Link>
          </div>
        ) : (
          <>
            {/* Project selector (if multiple) */}
            {activeProjects.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Select Project</p>
                <div className="flex flex-wrap gap-2">
                  {activeProjects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelected(p.id)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all',
                        currentProject?.id === p.id
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      )}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      {p.title}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Project meta bar */}
            {currentProject && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm px-7 py-5 flex flex-wrap items-center gap-6"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-black text-lg shrink-0">
                    {currentProject.title.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Project</p>
                    <p className="font-black text-slate-900 truncate">{currentProject.title}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 shrink-0">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Budget</p>
                      <p className="text-sm font-black text-slate-900">{formatCurrency(currentProject.budget)}</p>
                    </div>
                  </div>
                  {deadline && (
                    <div className="flex items-center gap-2">
                      <CalendarDays className={cn('w-4 h-4 shrink-0', deadline.urgent ? 'text-red-500' : 'text-amber-500')} />
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Deadline</p>
                        <p className={cn('text-sm font-black', deadline.urgent ? 'text-red-500' : 'text-slate-900')}>
                          {deadline.label}
                          <span className={cn('ml-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide', deadline.urgent ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400')}>
                            {deadline.note}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                  <Link href="/client/messages"
                    className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors">
                    Messages <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Kanban columns */}
            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {COLUMNS.map((col, colIdx) => {
                  const ColIcon = col.icon;
                  const cards   = grouped[col.id] ?? [];
                  return (
                    <motion.div
                      key={col.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: colIdx * 0.07 }}
                      className="flex flex-col gap-3"
                    >
                      {/* Column header */}
                      <div className={cn('flex items-center justify-between px-4 py-3 rounded-2xl border', col.bg, col.border)}>
                        <div className="flex items-center gap-2">
                          <ColIcon className={cn('w-4 h-4', col.accent)} />
                          <span className={cn('text-xs font-black uppercase tracking-widest', col.accent)}>
                            {col.label}
                          </span>
                        </div>
                        <span className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white', col.dot)}>
                          {cards.length}
                        </span>
                      </div>

                      {/* Cards */}
                      <div className="flex flex-col gap-3 min-h-[120px]">
                        {cards.length === 0 ? (
                          <div className="flex-1 flex items-center justify-center py-8 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50">
                            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Empty</p>
                          </div>
                        ) : (
                          cards.map((ms, i) => (
                            <motion.div
                              key={ms.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: colIdx * 0.07 + i * 0.05 }}
                              className="bg-white rounded-[2rem] border border-slate-100 p-5 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-200 group"
                            >
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', col.dot)} />
                                <p className="flex-1 text-sm font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                                  {ms.title}
                                </p>
                              </div>
                              {ms.definitionOfDone && (
                                <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2 mb-3 pl-4">
                                  {ms.definitionOfDone}
                                </p>
                              )}
                              <div className="flex items-center justify-between pl-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  Step {ms.order}
                                </span>
                                <span className={cn(
                                  'text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg',
                                  col.id === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                                  col.id === 'REVIEW'    ? 'bg-amber-50 text-amber-600' :
                                  col.id === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' :
                                  'bg-slate-100 text-slate-500'
                                )}>
                                  {ms.paymentPercentage}% pay
                                </span>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
