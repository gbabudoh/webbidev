'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Briefcase,
  Target,
  MessageSquare,
  Clock,
  LayoutDashboard,
  ArrowRight,
  Inbox,
  Search,
  DollarSign,
  CalendarDays,
  ExternalLink,
} from 'lucide-react';
import { Button, Card, CardContent, Badge, Typography } from '@/components/ui';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

interface DeveloperProfile {
  totalEarnings: number;
  totalProjects: number;
  completedProjects: number;
}

interface Project {
  id: string;
  title: string;
  status: string;
  budget: number;
  deadline: string;
  client: {
    name: string | null;
    email: string;
  };
  milestones: Array<{
    id: string;
    title: string;
    status: string;
    order: number;
  }>;
}

interface Conversation {
  id: string;
  projectTitle: string;
  otherParty: {
    name: string | null;
    email: string;
  } | null;
  lastMessage: {
    content: string;
    createdAt: string;
  } | null;
  unreadCount: number;
}

const QUICK_ACTIONS = [
  {
    label: 'Task Board',
    description: 'Plan and track your work',
    icon: LayoutDashboard,
    href: '/developer/dashboard/dev-bucket/board',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: 'Messages',
    description: 'Conversations with clients',
    icon: MessageSquare,
    href: '/developer/messages',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    text: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    label: 'Earnings',
    description: 'Payments and payout history',
    icon: DollarSign,
    href: '/developer/earnings',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    label: 'Browse Jobs',
    description: 'Find new projects to bid on',
    icon: Search,
    href: '/developer/jobs',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-600 dark:text-amber-400',
  },
];

export default function DevBucket() {
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, convsRes] = await Promise.all([
          fetch('/api/developer/profile'),
          fetch('/api/project?status=IN_PROGRESS'),
          fetch('/api/messaging/conversations'),
        ]);

        if (profileRes.ok) {
          const d = await profileRes.json();
          setProfile(d.profile);
        }
        if (projectsRes.ok) {
          const d = await projectsRes.json();
          setProjects(d.projects || []);
        }
        if (convsRes.ok) {
          const d = await convsRes.json();
          setConversations((d.conversations || []).slice(0, 3));
        }
      } catch {
        // silently fail — each section will show its own empty state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const successRate =
    profile && profile.totalProjects > 0
      ? Math.round((profile.completedProjects / profile.totalProjects) * 100)
      : null;

  const hasProjects = !loading && projects.length > 0;

  const stats = [
    {
      label: 'Total Earnings',
      value: profile ? formatCurrency(profile.totalEarnings) : '$0.00',
      subtext: 'Released payments',
      icon: <CreditCard className="w-6 h-6" />,
      accent: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-100 dark:border-amber-900/30',
    },
    {
      label: 'Active Projects',
      value: loading ? '—' : String(projects.length),
      subtext: 'Currently in progress',
      icon: <Briefcase className="w-6 h-6" />,
      accent: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-100 dark:border-blue-900/30',
    },
    {
      label: 'Completion Rate',
      value: successRate !== null ? `${successRate}%` : '—',
      subtext: successRate === null ? 'No completed projects yet' : `${profile?.completedProjects} of ${profile?.totalProjects} projects`,
      icon: <Target className="w-6 h-6" />,
      accent: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-100 dark:border-emerald-900/30',
    },
  ];

  const getMilestoneCounts = (project: Project) => {
    const total = project.milestones.length;
    const done = project.milestones.filter(
      (m) => m.status === 'APPROVED' || m.status === 'COMPLETED'
    ).length;
    return { done, total };
  };

  const getMilestoneProgress = (project: Project) => {
    const { done, total } = getMilestoneCounts(project);
    if (!total) return 0;
    return Math.round((done / total) * 100);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'In Progress';
      case 'REVIEW': return 'Under Review';
      case 'COMPLETED': return 'Completed';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'REVIEW': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (diffDays < 0) return { label, urgent: true, note: 'Overdue' };
    if (diffDays <= 3) return { label, urgent: true, note: `${diffDays}d left` };
    return { label, urgent: false, note: `${diffDays}d left` };
  };

  return (
    <div className="space-y-10 pb-20">

      {/* Header */}
      <header className="relative p-10 lg:p-14 overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] shadow-2xl shadow-slate-400/20 border border-white/40">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {hasProjects && (
              <div className="flex items-center gap-3 mb-5">
                <div className="px-4 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                    {projects.length} Active {projects.length === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>
              </div>
            )}
            <Typography variant="h1" size="4xl" weight="black" className="text-slate-900 mb-2 tracking-tight lg:text-5xl">
              Project Workspace
            </Typography>
            <Typography variant="p" className="text-slate-600 font-medium max-w-lg leading-relaxed">
              Your hub for active projects, messages, and quick navigation.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4"
          >
            <Link href="/developer/dashboard/dev-bucket/board">
              <Button className="bg-slate-900 text-white hover:bg-slate-800 h-14 px-7 rounded-2xl flex items-center gap-3 font-bold shadow-xl shadow-slate-900/20 active:scale-95 transition-all border-none cursor-pointer">
                <LayoutDashboard className="w-5 h-5" />
                Open Task Board
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            whileHover={{ y: -6 }}
            className={`relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border ${stat.border} shadow-sm transition-all duration-300 overflow-hidden`}
          >
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.accent} flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <Typography variant="h3" weight="black" className="text-slate-900 dark:text-white text-3xl">
                  {stat.value}
                </Typography>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.subtext}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Quick Actions</h2>
          <p className="text-sm text-slate-400 font-medium">Jump to your most-used tools</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-900/40 transition-all"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${action.bg}`}>
                    <Icon className={`w-5 h-5 ${action.text}`} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{action.label}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{action.description}</p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Active Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-6 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Active Projects</h2>
              <p className="text-xs text-slate-400 font-medium">Projects you are currently working on</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-36 bg-slate-100 dark:bg-slate-800 rounded-[2rem] animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-12 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No active projects</h3>
              <p className="text-slate-500 text-sm font-medium mb-6 max-w-xs mx-auto">
                Browse open jobs and submit a proposal to start your first project.
              </p>
              <Link href="/developer/jobs">
                <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl px-7 py-3 font-bold cursor-pointer flex items-center gap-2 mx-auto">
                  Browse Jobs <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project, i) => {
                const progress = getMilestoneProgress(project);
                const { done: msDone, total: msTotal } = getMilestoneCounts(project);
                const deadline = project.deadline ? formatDeadline(project.deadline) : null;
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="bg-white dark:bg-slate-900 p-7 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/5 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white font-black text-xl border border-slate-100 dark:border-slate-700">
                          {project.title.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                            {project.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Client</span>
                            <span className="text-slate-700 dark:text-slate-300 font-semibold">
                              {project.client.name || project.client.email}
                            </span>
                            {deadline && (
                              <>
                                <span className="text-slate-300">·</span>
                                <span className={`flex items-center gap-1 text-[11px] font-bold ${deadline.urgent ? 'text-red-500' : 'text-slate-500'}`}>
                                  <CalendarDays className="w-3.5 h-3.5" />
                                  {deadline.label}
                                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide ${deadline.urgent ? 'bg-red-50 text-red-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                    {deadline.note}
                                  </span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-start md:self-center flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xl font-black text-slate-900 dark:text-white mb-1">
                            {formatCurrency(project.budget)}
                          </p>
                          <Badge className={`font-bold px-3 py-1 rounded-xl border-none text-xs ${getStatusColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-5">
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                        <span>
                          Milestones
                          {msTotal > 0 && (
                            <span className="ml-2 text-slate-600 dark:text-slate-300 normal-case tracking-normal font-semibold">
                              {msDone} of {msTotal} done
                            </span>
                          )}
                        </span>
                        <span className="text-slate-900 dark:text-white">{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Link href="/developer/messages">
                        <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold gap-2 text-sm rounded-xl cursor-pointer">
                          Open Messages <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Recent Messages</h2>
              <p className="text-xs text-slate-400 font-medium">Latest client conversations</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 space-y-2">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                    <Inbox className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">No messages yet</p>
                  <p className="text-slate-400 text-xs mt-1">Messages from clients will appear here</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div key={conv.id} className="flex gap-4 items-start group cursor-pointer p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg">
                        {(conv.otherParty?.name || conv.otherParty?.email || '?').charAt(0).toUpperCase()}
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center">
                          <span className="text-[8px] text-white font-black">{conv.unreadCount}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h5 className="text-sm font-black text-slate-900 dark:text-white truncate">
                          {conv.otherParty?.name || conv.otherParty?.email || 'Client'}
                        </h5>
                        {conv.lastMessage && (
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] text-slate-400 font-bold">
                              {formatRelativeTime(conv.lastMessage.createdAt)}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {conv.projectTitle}
                      </p>
                      {conv.lastMessage && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {conv.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 pb-6">
              <Link href="/developer/messages">
                <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-2xl py-4 font-bold text-sm gap-2 cursor-pointer flex items-center justify-center">
                  View All Messages <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
