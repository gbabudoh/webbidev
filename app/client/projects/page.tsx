'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Select, Button, Typography, Badge } from '@/components/ui';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skillType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  milestones?: Array<{
    id: string;
    title: string;
    status: string;
    paymentPercentage: number;
    order: number;
  }>;
  proposals?: Array<{
    id: string;
    status: string;
    developer?: {
      user?: {
        name: string | null;
        email: string;
      };
    };
  }>;
  _count?: {
    proposals: number;
  };
}

function ProjectsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [skillType, setSkillType] = useState(searchParams.get('skillType') || '');

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const skillTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Frontend', label: 'Frontend Development' },
    { value: 'Backend', label: 'Backend Development' },
    { value: 'Fullstack', label: 'Fullstack Development' },
    { value: 'UI/UX', label: 'UI/UX Design' },
  ];

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (skillType) params.set('skillType', skillType);

      const response = await fetch(`/api/project?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();
      let fetchedProjects = data.projects || [];

      if (search) {
        const searchLower = search.toLowerCase();
        fetchedProjects = fetchedProjects.filter(
          (project: Project) =>
            project.title.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower)
        );
      }

      setProjects(fetchedProjects);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMessage);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [search, status, skillType]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (skillType) params.set('skillType', skillType);
    router.replace(`/client/projects?${params.toString()}`);
  }, [search, status, skillType, router]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'OPEN': return 'secondary';
      case 'IN_PROGRESS': return 'primary';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
      case 'IN_PROGRESS':
        return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
      case 'COMPLETED':
        return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'CANCELLED':
        return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <Typography variant="p" size="lg" color="muted">Loading projects...</Typography>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
              My Projects
            </Typography>
            <Typography variant="p" size="lg" color="muted">
              Manage your projects and track progress
            </Typography>
          </div>
          <Link href="/client/post">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post New Project
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
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
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
              />
              <Select
                label="Skill Type"
                value={skillType}
                onChange={(e) => setSkillType(e.target.value)}
                options={skillTypeOptions}
              />
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Typography variant="p" className="text-red-600 dark:text-red-400">{error}</Typography>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects List */}
        {projects.length === 0 ? (
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <Typography variant="h3" size="2xl" weight="bold" className="mb-3">
                  No projects found
                </Typography>
                <Typography variant="p" color="muted" className="mb-8 max-w-md mx-auto">
                  {search || status || skillType
                    ? 'Try adjusting your filters to see more results'
                    : 'You haven\'t posted any projects yet. Get started by posting your first project!'}
                </Typography>
                {!search && !status && !skillType && (
                  <Link href="/client/post">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Post Your First Project
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => {
              const totalMilestones = project.milestones?.length || 0;
              const completedMilestones = project.milestones?.filter((m) => m.status === 'COMPLETED').length || 0;
              const proposalCount = project._count?.proposals || project.proposals?.length || 0;
              const acceptedProposal = project.proposals?.find((p) => p.status === 'ACCEPTED');
              const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

              return (
                <Card key={project.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <CardTitle className="text-2xl">{project.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" size="sm" className="px-3 py-1">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            {project.skillType}
                          </Badge>
                          <Badge variant={getStatusBadgeVariant(project.status)} size="sm" className="px-3 py-1">
                            {getStatusIcon(project.status)}
                            <span className="ml-1">{project.status.replace('_', ' ')}</span>
                          </Badge>
                          {proposalCount > 0 && (
                            <Badge variant="primary" size="sm" className="px-3 py-1">
                              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {proposalCount} {proposalCount === 1 ? 'Proposal' : 'Proposals'}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Progress Bar */}
                      {totalMilestones > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Typography variant="p" size="sm" color="muted">
                              Project Progress
                            </Typography>
                            <Typography variant="p" size="sm" weight="bold">
                              {Math.round(progress)}%
                            </Typography>
                          </div>
                          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Project Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <Typography variant="p" size="xs" color="muted">Budget</Typography>
                          </div>
                          <Typography variant="h3" size="xl" weight="bold">
                            {formatCurrency(project.budget)}
                          </Typography>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <Typography variant="p" size="xs" color="muted">Deadline</Typography>
                          </div>
                          <Typography variant="p" size="sm" weight="bold">
                            {formatDate(project.deadline)}
                          </Typography>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            <Typography variant="p" size="xs" color="muted">Milestones</Typography>
                          </div>
                          <Typography variant="p" size="sm" weight="bold">
                            {completedMilestones}/{totalMilestones}
                          </Typography>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <Typography variant="p" size="xs" color="muted">Posted</Typography>
                          </div>
                          <Typography variant="p" size="sm" weight="bold">
                            {formatRelativeTime(project.createdAt)}
                          </Typography>
                        </div>
                      </div>

                      {/* Developer Info */}
                      {acceptedProposal && acceptedProposal.developer && (
                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                              {(acceptedProposal.developer.user?.name || acceptedProposal.developer.user?.email || 'D')[0].toUpperCase()}
                            </div>
                            <div>
                              <Typography variant="p" size="xs" color="muted">Working with</Typography>
                              <Typography variant="p" size="sm" weight="bold">
                                {acceptedProposal.developer.user?.name || acceptedProposal.developer.user?.email || 'Developer'}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <Link href={`/client/projects/${project.id}`} className="flex-1">
                          <Button variant="primary" className="w-full">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Details
                          </Button>
                        </Link>
                        {project.status === 'OPEN' && (
                          <Link href={`/client/projects/${project.id}/edit`}>
                            <Button variant="outline">
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default function ClientProjectsPage() {
  return (
    <Suspense fallback={
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <Typography variant="p" size="lg">Loading...</Typography>
          </div>
        </div>
      </>
    }>
      <ProjectsPageContent />
    </Suspense>
  );
}
