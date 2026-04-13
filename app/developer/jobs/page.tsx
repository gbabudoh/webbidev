'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Typography, Badge } from '@/components/ui';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  Search,
  Briefcase,
  DollarSign,
  Calendar,
  Target,
  Users,
  CheckCircle,
  Eye,
  Send,
  AlertCircle,
  ChevronDown,
  X,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skillType: string;
  status: string;
  createdAt: string;
  client: {
    id: string;
    name: string | null;
    email: string;
  };
  milestones: Array<{
    id: string;
    title: string;
    paymentPercentage: number;
    order: number;
  }>;
  proposals: Array<{
    id: string;
    status: string;
  }>;
  _count: {
    proposals: number;
  };
}

const SKILL_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'Fullstack', label: 'Fullstack' },
  { value: 'UI/UX', label: 'UI/UX Design' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'budget-high', label: 'Budget: High to Low' },
  { value: 'budget-low', label: 'Budget: Low to High' },
  { value: 'deadline', label: 'Deadline: Soonest' },
];

function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-7 animate-pulse">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-3/5" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-4/5" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-2/5" />
        </div>
        <div className="w-20 h-7 rounded-xl bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="flex gap-6 mb-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        ))}
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-32" />
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function DeadlineBadge({ deadline }: { deadline: string }) {
  const date = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const label = formatDate(deadline);

  if (diffDays < 0) {
    return <span className="text-xs font-bold text-red-500">{label} · Overdue</span>;
  }
  if (diffDays <= 7) {
    return <span className="text-xs font-bold text-amber-600">{label} · {diffDays}d left</span>;
  }
  return <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>;
}

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [skillType, setSkillType] = useState(searchParams.get('skillType') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (skillType) params.set('skillType', skillType);
      params.set('status', 'OPEN');

      const response = await fetch(`/api/project?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();
      let fetched: Project[] = data.projects || [];

      if (search) {
        const q = search.toLowerCase();
        fetched = fetched.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.client.name?.toLowerCase().includes(q) ||
            p.client.email.toLowerCase().includes(q)
        );
      }

      fetched.sort((a, b) => {
        switch (sortBy) {
          case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'budget-high': return b.budget - a.budget;
          case 'budget-low': return a.budget - b.budget;
          case 'deadline': return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

      setProjects(fetched);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (skillType) params.set('skillType', skillType);
    if (sortBy) params.set('sortBy', sortBy);
    router.replace(`/developer/jobs?${params.toString()}`);
  }, [search, skillType, sortBy, router]);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillType]);

  const hasActiveFilters = !!(search || skillType);

  const clearFilters = () => {
    setSearch('');
    setSkillType('');
    setSortBy('newest');
  };

  return (
    <div className="space-y-8 pb-12">

      {/* Header — matches developer region silver gradient */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] p-8 lg:p-12 shadow-2xl shadow-slate-400/20 border border-white/40"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-6">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Browse Jobs</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight leading-tight">
              Open Projects
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Browse available projects and submit a proposal to get started.
            </p>
          </div>

          {!loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl shrink-0"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Now</p>
              <p className="text-4xl font-black text-slate-900 leading-none">
                {projects.length}
              </p>
              <p className="text-sm text-slate-500 font-medium mt-1">
                {projects.length === 1 ? 'open project' : 'open projects'}
              </p>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-5"
      >
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, description, or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 border-none outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3 items-center shrink-0">
            {/* Skill Type */}
            <div className="relative">
              <select
                value={skillType}
                onChange={(e) => setSkillType(e.target.value)}
                className="appearance-none pl-4 pr-9 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer transition-all"
              >
                {SKILL_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-9 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer transition-all"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest self-center mr-1">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold">
                &ldquo;{search}&rdquo;
                <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {skillType && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                {skillType}
                <button onClick={() => setSkillType('')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-5">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 px-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800"
        >
          <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No projects found</h3>
          <p className="text-slate-500 font-medium text-sm mb-6 max-w-md mx-auto">
            {hasActiveFilters
              ? 'Try adjusting your filters or clearing your search.'
              : 'There are no open projects right now. Check back soon.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      )}

      {/* Project Cards */}
      {!loading && projects.length > 0 && (
        <AnimatePresence>
          <div className="space-y-5">
            {projects.map((project, i) => {
              const hasProposal = project.proposals.some((p) => p.status !== 'REJECTED');
              const totalMilestones = project.milestones.length;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={cn(
                    'group bg-white dark:bg-slate-900 rounded-[2rem] border transition-all duration-300 overflow-hidden',
                    hasProposal
                      ? 'border-emerald-200 dark:border-emerald-900/40 shadow-sm hover:shadow-lg hover:shadow-emerald-500/5'
                      : 'border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5'
                  )}
                >
                  <div className="p-7">

                    {/* Card Header */}
                    <div className="flex items-start gap-4 mb-5">
                      {/* Monogram */}
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white font-black text-xl shrink-0">
                        {project.title.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            size="sm"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-none font-bold text-[10px] uppercase tracking-wide px-2.5 py-1"
                          >
                            {project.skillType}
                          </Badge>
                          {hasProposal && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wide">
                              <CheckCircle className="w-3 h-3" />
                              Proposal Sent
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Stat Row */}
                    <div className="flex flex-wrap gap-x-8 gap-y-3 mb-5 px-1">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Budget</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(project.budget)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Deadline</p>
                          <DeadlineBadge deadline={project.deadline} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-500 shrink-0" />
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Milestones</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{totalMilestones}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Proposals</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{project._count.proposals}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-slate-50 dark:border-slate-800">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {project.client.name || project.client.email}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {formatRelativeTime(project.createdAt)}
                        </p>
                      </div>

                      <div className="flex gap-2.5">
                        <Link href={`/developer/jobs/${project.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 font-bold text-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                          </Button>
                        </Link>

                        {!hasProposal ? (
                          <Button
                            size="sm"
                            onClick={() => router.push(`/developer/proposals/new?projectId=${project.id}`)}
                            className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs border-none shadow-lg shadow-blue-500/20 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Submit Proposal
                          </Button>
                        ) : (
                          <Link href={`/developer/proposals?projectId=${project.id}`}>
                            <Button
                              size="sm"
                              className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs border-none cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              View Proposal
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default function DeveloperJobsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-5 pt-4">
        {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
      </div>
    }>
      <JobsPageContent />
    </Suspense>
  );
}
