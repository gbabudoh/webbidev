'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  Search,
  Briefcase,
  DollarSign,
  Calendar,
  Target,
  Users,
  Eye,
  Pencil,
  Plus,
  AlertCircle,
  ChevronDown,
  X,
  CheckCircle,
  Clock,
  Zap,
  Ban,
  FileText,
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
  milestones?: Array<{ id: string; title: string; status: string; paymentPercentage: number; order: number }>;
  proposals?: Array<{ id: string; status: string; developer?: { user?: { name: string | null; email: string } } }>;
  _count?: { proposals: number };
}

const STATUS_OPTIONS = [
  { value: '',            label: 'All Status' },
  { value: 'DRAFT',       label: 'Draft' },
  { value: 'OPEN',        label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED',   label: 'Completed' },
  { value: 'CANCELLED',   label: 'Cancelled' },
];

const SKILL_OPTIONS = [
  { value: '',           label: 'All Types' },
  { value: 'Frontend',   label: 'Frontend' },
  { value: 'Backend',    label: 'Backend' },
  { value: 'Fullstack',  label: 'Fullstack' },
  { value: 'UI/UX',      label: 'UI/UX Design' },
];

const SORT_OPTIONS = [
  { value: 'newest',      label: 'Newest First' },
  { value: 'oldest',      label: 'Oldest First' },
  { value: 'budget-high', label: 'Budget: High to Low' },
  { value: 'budget-low',  label: 'Budget: Low to High' },
  { value: 'deadline',    label: 'Deadline: Soonest' },
];

const STATUS_STYLE: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  DRAFT:       { label: 'Draft',       className: 'bg-slate-100 text-slate-500',   icon: FileText   },
  OPEN:        { label: 'Open',        className: 'bg-amber-50 text-amber-700',    icon: Zap        },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-blue-50 text-blue-600',      icon: Clock      },
  COMPLETED:   { label: 'Completed',   className: 'bg-emerald-50 text-emerald-700',icon: CheckCircle},
  CANCELLED:   { label: 'Cancelled',   className: 'bg-red-50 text-red-500',        icon: Ban        },
};

function CardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-7 animate-pulse">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-100 rounded-lg w-3/5" />
          <div className="h-3 bg-slate-100 rounded-lg w-4/5" />
        </div>
        <div className="w-24 h-7 rounded-xl bg-slate-100" />
      </div>
      <div className="flex gap-4 mb-5">
        {[1,2,3,4].map(i => <div key={i} className="h-10 flex-1 bg-slate-100 rounded-xl" />)}
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
        <div className="h-3 bg-slate-100 rounded-lg w-28" />
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-slate-100 rounded-xl" />
          <div className="h-9 w-16 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function DeadlineBadge({ deadline }: { deadline: string }) {
  const date     = new Date(deadline);
  const diffDays = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const label    = formatDate(deadline);
  if (diffDays < 0)  return <span className="text-xs font-bold text-red-500">{label} · Overdue</span>;
  if (diffDays <= 7) return <span className="text-xs font-bold text-amber-600">{label} · {diffDays}d left</span>;
  return <span className="text-xs font-semibold text-slate-700">{label}</span>;
}

function ProjectsContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const [search,    setSearch]    = useState(searchParams.get('search')    || '');
  const [status,    setStatus]    = useState(searchParams.get('status')    || '');
  const [skillType, setSkillType] = useState(searchParams.get('skillType') || '');
  const [sortBy,    setSortBy]    = useState(searchParams.get('sortBy')    || 'newest');

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (status)    params.set('status',    status);
      if (skillType) params.set('skillType', skillType);

      const res = await fetch(`/api/project?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      let list: Project[] = data.projects || [];

      if (search) {
        const q = search.toLowerCase();
        list = list.filter(p =>
          p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }

      list.sort((a, b) => {
        switch (sortBy) {
          case 'oldest':      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'budget-high': return b.budget - a.budget;
          case 'budget-low':  return a.budget - b.budget;
          case 'deadline':    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          default:            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

      setProjects(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [search, status, skillType, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search)    params.set('search',    search);
    if (status)    params.set('status',    status);
    if (skillType) params.set('skillType', skillType);
    if (sortBy)    params.set('sortBy',    sortBy);
    router.replace(`/client/projects?${params.toString()}`);
  }, [search, status, skillType, sortBy, router]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const hasFilters = !!(search || status || skillType);

  const clearFilters = () => {
    setSearch(''); setStatus(''); setSkillType(''); setSortBy('newest');
  };

  return (
    <div className="space-y-8 pb-12">

      {/* Header */}
      <motion.header
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
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">My Projects</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight leading-tight">
              Your Projects
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Manage, track, and review all your posted projects.
            </p>
          </div>

          {!loading && (
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl shrink-0 text-center"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                <p className="text-4xl font-black text-slate-900 leading-none">{projects.length}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  {projects.length === 1 ? 'project' : 'projects'}
                </p>
              </motion.div>
              <Link href="/client/post"
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-6 py-3.5 text-sm font-bold shadow-xl transition-all hover:-translate-y-0.5">
                <Plus className="w-4 h-4" /> Post Project
              </Link>
            </div>
          )}
        </div>
      </motion.header>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5"
      >
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-400 border-none outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3 items-center shrink-0">
            {[
              { value: status,    onChange: setStatus,    options: STATUS_OPTIONS },
              { value: skillType, onChange: setSkillType, options: SKILL_OPTIONS },
              { value: sortBy,    onChange: setSortBy,    options: SORT_OPTIONS },
            ].map((sel, i) => (
              <div key={i} className="relative">
                <select
                  value={sel.value}
                  onChange={e => sel.onChange(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-3 rounded-xl bg-slate-50 text-sm font-semibold text-slate-700 border-none outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer transition-all"
                >
                  {sel.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            ))}

            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {hasFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest self-center mr-1">Filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold">
                &ldquo;{search}&rdquo; <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {status && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold">
                {STATUS_OPTIONS.find(o => o.value === status)?.label}
                <button onClick={() => setStatus('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {skillType && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold">
                {skillType} <button onClick={() => setSkillType('')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-5 rounded-2xl bg-red-50 border border-red-200">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      )}

      {/* Skeletons */}
      {loading && (
        <div className="space-y-5">
          {[1,2,3].map(i => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 px-8 bg-white rounded-[2.5rem] border border-slate-100"
        >
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">No projects found</h3>
          <p className="text-slate-500 font-medium text-sm mb-6 max-w-md mx-auto">
            {hasFilters
              ? 'Try adjusting your filters or clearing your search.'
              : "You haven't posted any projects yet. Post your first project to get started."}
          </p>
          {hasFilters ? (
            <button onClick={clearFilters}
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors">
              Clear Filters
            </button>
          ) : (
            <Link href="/client/post"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors">
              <Plus className="w-4 h-4" /> Post Your First Project
            </Link>
          )}
        </motion.div>
      )}

      {/* Project cards */}
      {!loading && projects.length > 0 && (
        <AnimatePresence>
          <div className="space-y-5">
            {projects.map((project, i) => {
              const totalMs     = project.milestones?.length ?? 0;
              const doneMs      = project.milestones?.filter(m => m.status === 'COMPLETED' || m.status === 'APPROVED').length ?? 0;
              const progress    = totalMs ? Math.round((doneMs / totalMs) * 100) : 0;
              const proposalCnt = project._count?.proposals ?? project.proposals?.length ?? 0;
              const accepted    = project.proposals?.find(p => p.status === 'ACCEPTED');
              const st          = STATUS_STYLE[project.status] ?? STATUS_STYLE['DRAFT'];
              const StIcon      = st.icon;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-7">

                    {/* Card header */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-black text-xl shrink-0">
                        {project.title.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h3>
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wide">
                            {project.skillType}
                          </span>
                          <span className={cn('flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide', st.className)}>
                            <StIcon className="w-3 h-3" />{st.label}
                          </span>
                          {proposalCnt > 0 && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-wide">
                              <Users className="w-3 h-3" />{proposalCnt} {proposalCnt === 1 ? 'Proposal' : 'Proposals'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {totalMs > 0 && (
                      <div className="mb-5 space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                          <span>Milestones <span className="text-slate-600 normal-case tracking-normal font-semibold">{doneMs} of {totalMs} done</span></span>
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

                    {/* Stat row */}
                    <div className="flex flex-wrap gap-x-8 gap-y-3 mb-5 px-1">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Budget</p>
                          <p className="text-sm font-black text-slate-900">{formatCurrency(project.budget)}</p>
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
                          <p className="text-sm font-black text-slate-900">{totalMs}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Posted</p>
                          <p className="text-sm font-semibold text-slate-600">{formatRelativeTime(project.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Accepted developer */}
                    {accepted?.developer?.user && (
                      <div className="flex items-center gap-3 mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                          {(accepted.developer.user.name || accepted.developer.user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Working with</p>
                          <p className="text-sm font-black text-slate-900">
                            {accepted.developer.user.name || accepted.developer.user.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {project.skillType}
                      </p>
                      <div className="flex gap-2.5">
                        <Link href={`/client/projects/${project.id}`}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors">
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </Link>
                        {project.status === 'OPEN' && (
                          <Link href={`/client/projects/${project.id}/edit`}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors">
                            <Pencil className="w-3.5 h-3.5" /> Edit
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

export default function ClientProjectsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-5 pt-4">
        {[1,2,3].map(i => <CardSkeleton key={i} />)}
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
