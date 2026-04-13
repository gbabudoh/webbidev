'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  DollarSign,
  CheckCircle,
  MessageSquare,
  Clock,
  LayoutDashboard,
  ArrowRight,
  Inbox,
  Search,
  Plus,
  CalendarDays,
  ExternalLink,
  Target,
} from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  status: string;
  budget: number;
  deadline: string;
  client: { name: string | null; email: string };
  milestones: Array<{ id: string; title: string; status: string; order: number }>;
  _count: { proposals: number };
}

interface Conversation {
  id: string;
  projectTitle: string;
  otherParty: { name: string | null; email: string } | null;
  lastMessage: { content: string; createdAt: string } | null;
  unreadCount: number;
}

const QUICK_ACTIONS = [
  {
    label: 'Post a Project',
    description: 'Find the right developer',
    icon: Plus,
    href: '/client/post',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    label: 'Task Board',
    description: 'Track project progress',
    icon: LayoutDashboard,
    href: '/dashboard/user-bucket/board',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
  },
  {
    label: 'Messages',
    description: 'Chat with your developers',
    icon: MessageSquare,
    href: '/client/messages',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
  {
    label: 'Browse Talent',
    description: 'Explore developer profiles',
    icon: Search,
    href: '/talent',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
];

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'OPEN':        return 'Open';
    case 'IN_PROGRESS': return 'In Progress';
    case 'REVIEW':      return 'Under Review';
    case 'COMPLETED':   return 'Completed';
    case 'DRAFT':       return 'Draft';
    default:            return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN':        return 'bg-amber-50 text-amber-700';
    case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600';
    case 'REVIEW':      return 'bg-purple-50 text-purple-600';
    case 'COMPLETED':   return 'bg-emerald-50 text-emerald-700';
    case 'DRAFT':       return 'bg-slate-100 text-slate-500';
    default:            return 'bg-slate-50 text-slate-500';
  }
};

const getMilestoneCounts = (project: Project) => {
  const total = project.milestones.length;
  const done  = project.milestones.filter(m => m.status === 'APPROVED' || m.status === 'COMPLETED').length;
  return { done, total };
};

const getMilestoneProgress = (project: Project) => {
  const { done, total } = getMilestoneCounts(project);
  if (!total) return 0;
  return Math.round((done / total) * 100);
};

const formatDeadline = (deadline: string) => {
  const date     = new Date(deadline);
  const now      = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const label    = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (diffDays < 0)  return { label, urgent: true,  note: 'Overdue' };
  if (diffDays <= 3) return { label, urgent: true,  note: `${diffDays}d left` };
  return              { label, urgent: false, note: `${diffDays}d left` };
};

export default function UserBucket() {
  const [projects,      setProjects]      = useState<Project[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, convsRes] = await Promise.all([
          fetch('/api/project'),
          fetch('/api/messaging/conversations'),
        ]);
        if (projectsRes.ok) {
          const d = await projectsRes.json();
          setProjects(d.projects || []);
        }
        if (convsRes.ok) {
          const d = await convsRes.json();
          setConversations((d.conversations || []).slice(0, 4));
        }
      } catch {
        // silently fail — each section shows its own empty state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeProjects    = projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'REVIEW');
  const openProjects      = projects.filter(p => p.status === 'OPEN');
  const completedProjects = projects.filter(p => p.status === 'COMPLETED');
  const totalBudget       = projects.reduce((sum, p) => sum + p.budget, 0);

  const stats = [
    {
      label:   'Active Projects',
      value:   loading ? '—' : String(activeProjects.length),
      subtext: 'Currently in progress',
      icon:    Briefcase,
      accent:  'text-blue-600',
      bg:      'bg-blue-50',
      border:  'border-blue-100',
    },
    {
      label:   'Open / Hiring',
      value:   loading ? '—' : String(openProjects.length),
      subtext: 'Awaiting developer proposals',
      icon:    Target,
      accent:  'text-amber-600',
      bg:      'bg-amber-50',
      border:  'border-amber-100',
    },
    {
      label:   'Total Budget',
      value:   loading ? '—' : formatCurrency(totalBudget),
      subtext: 'Across all projects',
      icon:    DollarSign,
      accent:  'text-emerald-600',
      bg:      'bg-emerald-50',
      border:  'border-emerald-100',
    },
    {
      label:   'Completed',
      value:   loading ? '—' : String(completedProjects.length),
      subtext: 'Successfully delivered',
      icon:    CheckCircle,
      accent:  'text-purple-600',
      bg:      'bg-purple-50',
      border:  'border-purple-100',
    },
  ];

  return (
    <DashboardLayout showFooter={false}>
      <div className="space-y-10 pb-20">

        {/* Header */}
        <header className="relative p-10 lg:p-14 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] shadow-2xl shadow-slate-400/20 border border-white/40">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              {!loading && activeProjects.length > 0 && (
                <div className="flex items-center gap-3 mb-5">
                  <div className="px-4 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                      {activeProjects.length} Active {activeProjects.length === 1 ? 'Project' : 'Projects'}
                    </span>
                  </div>
                </div>
              )}
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tight">
                Project Workspace
              </h1>
              <p className="text-slate-600 font-medium max-w-lg leading-relaxed">
                Your hub for active projects, messages, and quick navigation.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Link href="/client/post"
                className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white h-14 px-7 rounded-2xl font-bold shadow-xl shadow-slate-900/20 transition-all active:scale-95">
                <Plus className="w-5 h-5" />
                Post New Project
              </Link>
            </motion.div>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -6 }}
                className={cn(
                  'relative bg-white rounded-[2.5rem] p-8 border shadow-sm transition-all duration-300 overflow-hidden',
                  stat.border
                )}
              >
                <div className="flex items-center gap-5">
                  <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center shrink-0', stat.bg)}>
                    <Icon className={cn('w-6 h-6', stat.accent)} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.subtext}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Quick Actions</h2>
            <p className="text-sm text-slate-400 font-medium">Jump to your most-used tools</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:shadow-slate-200/60 transition-all"
                  >
                    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', action.bg)}>
                      <Icon className={cn('w-5 h-5', action.text)} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{action.label}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{action.description}</p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Projects */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="p-7 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Your Projects</h2>
                    <p className="text-xs text-slate-400 font-medium">All your posted projects</p>
                  </div>
                </div>
                <Link href="/client/projects"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-36 bg-slate-100 rounded-[2rem] animate-pulse" />
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2">No projects yet</h3>
                    <p className="text-slate-500 text-sm font-medium mb-6 max-w-xs mx-auto">
                      Post your first project to start receiving proposals from developers.
                    </p>
                    <Link href="/client/post"
                      className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-7 py-3 font-bold transition-all">
                      <Plus className="w-4 h-4" /> Post a Project
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.slice(0, 5).map((project, i) => {
                      const progress  = getMilestoneProgress(project);
                      const { done: msDone, total: msTotal } = getMilestoneCounts(project);
                      const deadline  = project.deadline ? formatDeadline(project.deadline) : null;
                      return (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 * i }}
                          className="bg-white p-7 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all"
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl border border-slate-100">
                                {project.title.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-lg font-black text-slate-900 mb-1 tracking-tight">
                                  {project.title}
                                </h4>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {deadline && (
                                    <span className={cn('flex items-center gap-1 text-[11px] font-bold', deadline.urgent ? 'text-red-500' : 'text-slate-500')}>
                                      <CalendarDays className="w-3.5 h-3.5" />
                                      {deadline.label}
                                      <span className={cn('px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide', deadline.urgent ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400')}>
                                        {deadline.note}
                                      </span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 self-start md:self-center shrink-0">
                              <div className="text-right">
                                <p className="text-xl font-black text-slate-900 mb-1">
                                  {formatCurrency(project.budget)}
                                </p>
                                <span className={cn('px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider', getStatusColor(project.status))}>
                                  {getStatusLabel(project.status)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {msTotal > 0 && (
                            <div className="space-y-2 mb-5">
                              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                                <span>
                                  Milestones
                                  <span className="ml-2 text-slate-600 normal-case tracking-normal font-semibold">
                                    {msDone} of {msTotal} done
                                  </span>
                                </span>
                                <span className="text-slate-900">{progress}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  transition={{ duration: 1.2, ease: 'easeOut' }}
                                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end">
                            <Link href="/client/messages"
                              className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 font-bold text-sm rounded-xl px-4 py-2 transition-colors">
                              Messages <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="space-y-0">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="p-7 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Messages</h2>
                  <p className="text-xs text-slate-400 font-medium">Latest developer conversations</p>
                </div>
              </div>

              <div className="p-6 space-y-2">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                      <Inbox className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">No messages yet</p>
                    <p className="text-slate-400 text-xs mt-1">Messages from developers will appear here</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div key={conv.id}
                      className="flex gap-4 items-start cursor-pointer p-3 rounded-2xl hover:bg-slate-50 transition-all group">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg">
                          {(conv.otherParty?.name || conv.otherParty?.email || '?').charAt(0).toUpperCase()}
                        </div>
                        {conv.unreadCount > 0 && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                            <span className="text-[8px] text-white font-black">{conv.unreadCount}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h5 className="text-sm font-black text-slate-900 truncate">
                            {conv.otherParty?.name || conv.otherParty?.email || 'Developer'}
                          </h5>
                          {conv.lastMessage && (
                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="text-[10px] text-slate-400 font-bold">
                                {formatRelativeTime(conv.lastMessage.createdAt)}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate">{conv.projectTitle}</p>
                        {conv.lastMessage && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">{conv.lastMessage.content}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-6 pb-6">
                <Link href="/client/messages"
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-4 font-bold text-sm transition-colors">
                  View All Messages <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
