'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Select, Button, Typography, Badge } from '@/components/ui';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
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
  Filter,
  TrendingUp
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

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [skillType, setSkillType] = useState(searchParams.get('skillType') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  const skillTypes = [
    { value: '', label: 'All Types' },
    { value: 'Frontend', label: 'Frontend Development' },
    { value: 'Backend', label: 'Backend Development' },
    { value: 'Fullstack', label: 'Fullstack Development' },
    { value: 'UI/UX', label: 'UI/UX Design' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'budget-high', label: 'Budget: High to Low' },
    { value: 'budget-low', label: 'Budget: Low to High' },
    { value: 'deadline', label: 'Deadline: Soonest' },
  ];

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (skillType) params.set('skillType', skillType);
      params.set('status', 'OPEN');

      const response = await fetch(`/api/project?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      let fetchedProjects = data.projects || [];

      // Client-side search filter
      if (search) {
        const searchLower = search.toLowerCase();
        fetchedProjects = fetchedProjects.filter(
          (project: Project) =>
            project.title.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower) ||
            project.client.name?.toLowerCase().includes(searchLower) ||
            project.client.email.toLowerCase().includes(searchLower)
        );
      }

      // Client-side sorting
      fetchedProjects.sort((a: Project, b: Project) => {
        switch (sortBy) {
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'budget-high':
            return b.budget - a.budget;
          case 'budget-low':
            return a.budget - b.budget;
          case 'deadline':
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

      setProjects(fetchedProjects);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMessage);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Update URL on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (skillType) params.set('skillType', skillType);
    if (sortBy) params.set('sortBy', sortBy);

    router.replace(`/developer/jobs?${params.toString()}`);
  }, [search, skillType, sortBy, router]);

  // Fetch on mount and filter changes
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillType]);

  const handleSubmitProposal = (projectId: string) => {
    router.push(`/developer/proposals/new?projectId=${projectId}`);
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <Typography variant="p" size="lg" color="muted">
              Loading projects...
            </Typography>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border border-blue-100 dark:border-blue-900/50 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-3xl" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
                  Available Jobs
                </Typography>
                <Typography variant="p" size="lg" color="muted">
                  Browse open projects and submit proposals
                </Typography>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <Typography variant="p" size="sm" weight="semibold" className="text-blue-600 dark:text-blue-400">
                    {projects.length} {projects.length === 1 ? 'project' : 'projects'} available
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              <Typography variant="h3" size="lg" weight="semibold">
                Filters
              </Typography>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <Input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                label="Skill Type"
                value={skillType}
                onChange={(e) => setSkillType(e.target.value)}
                options={skillTypes}
              />
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={sortOptions}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Typography variant="p" className="text-red-600 dark:text-red-400">
                {error}
              </Typography>
            </div>
          </div>
        )}

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="text-center py-20 px-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-zinc-400 dark:text-zinc-600" />
            </div>
            <Typography variant="h3" size="xl" weight="semibold" className="mb-3">
              No projects found
            </Typography>
            <Typography variant="p" color="muted" className="mb-6 max-w-md mx-auto">
              {search || skillType
                ? 'Try adjusting your filters to see more results'
                : 'There are no open projects at the moment. Check back later!'}
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => {
              const hasProposal = project.proposals.some((p) => p.status !== 'REJECTED');
              const totalMilestones = project.milestones.length;

              return (
                <div key={project.id} className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <Typography variant="h3" size="xl" weight="bold">
                            {project.title}
                          </Typography>
                          <Badge variant="secondary" size="sm" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {project.skillType}
                          </Badge>
                          {hasProposal && (
                            <Badge variant="success" size="sm" className="gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Proposal Sent
                            </Badge>
                          )}
                        </div>
                        <Typography variant="p" color="muted" className="line-clamp-2">
                          {project.description}
                        </Typography>
                      </div>
                    </div>
                    {/* Project Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Typography variant="p" size="xs" color="muted">
                            Budget
                          </Typography>
                          <Typography variant="p" size="sm" weight="bold">
                            {formatCurrency(project.budget)}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Typography variant="p" size="xs" color="muted">
                            Deadline
                          </Typography>
                          <Typography variant="p" size="sm" weight="bold">
                            {formatDate(project.deadline)}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Typography variant="p" size="xs" color="muted">
                            Milestones
                          </Typography>
                          <Typography variant="p" size="sm" weight="bold">
                            {totalMilestones}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Typography variant="p" size="xs" color="muted">
                            Proposals
                          </Typography>
                          <Typography variant="p" size="sm" weight="bold">
                            {project._count.proposals}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {/* Client Info & Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                      <div>
                        <Typography variant="p" size="sm" color="muted">
                          Posted by {project.client.name || project.client.email}
                        </Typography>
                        <Typography variant="p" size="xs" color="muted">
                          {formatRelativeTime(project.createdAt)}
                        </Typography>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/developer/jobs/${project.id}`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                        </Link>
                        {!hasProposal && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSubmitProposal(project.id)}
                            className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          >
                            <Send className="w-4 h-4" />
                            Submit Proposal
                          </Button>
                        )}
                        {hasProposal && (
                          <Link href={`/developer/proposals?projectId=${project.id}`}>
                            <Button variant="secondary" size="sm" className="gap-2">
                              <CheckCircle className="w-4 h-4" />
                              View Proposal
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default function DeveloperJobsPage() {
  return (
    <Suspense fallback={
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <Typography variant="p" size="lg">Loading...</Typography>
        </div>
      </>
    }>
      <JobsPageContent />
    </Suspense>
  );
}

