'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicLayout from '@/components/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle, Badge, Typography, Button } from '@/components/ui';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface Developer {
  id: string;
  userId: string;
  portfolioUrl: string;
  bioSummary: string;
  location: string;
  timeZone?: string | null;
  skills: string[];
  totalEarnings: number;
  totalProjects: number;
  completedProjects: number;
  isVerified: boolean;
  isActive: boolean;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
  recentProjects?: Array<{
    id: string;
    title: string;
    status: string;
  }>;
  recentEarnings?: Array<{
    id: string;
    amount: number;
    createdAt: string;
  }>;
}

export default function DeveloperProfilePage() {
  const params = useParams();
  const router = useRouter();
  const developerId = params.developerId as string;

  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/developer/${developerId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Developer not found');
          }
          throw new Error('Failed to fetch developer');
        }

        const data = await response.json();
        setDeveloper(data.developer);
      } catch (err: any) {
        setError(err.message || 'Failed to load developer profile');
      } finally {
        setLoading(false);
      }
    };

    if (developerId) {
      fetchDeveloper();
    }
  }, [developerId]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
          <Typography variant="p" size="lg">
            Loading...
          </Typography>
        </div>
      </PublicLayout>
    );
  }

  if (error || !developer) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
          <div className="text-center">
            <Typography variant="h2" size="2xl" weight="bold" className="mb-4">
              Developer Not Found
            </Typography>
            <Typography variant="p" color="muted" className="mb-6">
              {error || 'The developer profile you are looking for does not exist.'}
            </Typography>
            <Link href="/talent">
              <Button variant="primary">Browse All Talent</Button>
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const displayName = developer.user?.name || developer.user?.email || 'Developer';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Header */}
        <section className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 rounded-full bg-foreground text-background flex items-center justify-center text-3xl font-bold">
                {initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Typography variant="h1" size="3xl" weight="bold">
                    {displayName}
                  </Typography>
                  {developer.isVerified && (
                    <Badge variant="success" size="md">
                      Verified
                    </Badge>
                  )}
                </div>
                <Typography variant="p" size="lg" color="muted" className="mb-4">
                  {developer.location}
                  {developer.timeZone && ` • ${developer.timeZone}`}
                </Typography>
                {developer.portfolioUrl && (
                  <a
                    href={developer.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline inline-flex items-center gap-2"
                  >
                    <Typography variant="p" size="sm">
                      View Portfolio →
                    </Typography>
                  </a>
                )}
              </div>
              <div className="flex gap-3">
                <Link href="/talent">
                  <Button variant="outline">Back to Browse</Button>
                </Link>
                <Link href={`/client/post?developerId=${developer.id}`}>
                  <Button variant="primary">Hire Developer</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="p" className="whitespace-pre-line">
                    {developer.bioSummary}
                  </Typography>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {developer.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" size="md">
                        {skill.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Projects */}
              {developer.recentProjects && developer.recentProjects.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {developer.recentProjects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900"
                        >
                          <div>
                            <Typography variant="h4" size="sm" weight="semibold">
                              {project.title}
                            </Typography>
                            <Badge variant="secondary" size="sm" className="mt-1">
                              {project.status.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Typography variant="h3" size="2xl" weight="bold">
                      {formatCurrency(developer.totalEarnings)}
                    </Typography>
                    <Typography variant="p" size="sm" color="muted">
                      Total Earnings
                    </Typography>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <div>
                      <Typography variant="h3" size="xl" weight="bold">
                        {developer.totalProjects}
                      </Typography>
                      <Typography variant="p" size="xs" color="muted">
                        Total Projects
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h3" size="xl" weight="bold">
                        {developer.completedProjects}
                      </Typography>
                      <Typography variant="p" size="xs" color="muted">
                        Completed
                      </Typography>
                    </div>
                  </div>
                  {developer.totalProjects > 0 && (
                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                      <Typography variant="h3" size="lg" weight="bold">
                        {Math.round((developer.completedProjects / developer.totalProjects) * 100)}%
                      </Typography>
                      <Typography variant="p" size="xs" color="muted">
                        Completion Rate
                      </Typography>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Earnings */}
              {developer.recentEarnings && developer.recentEarnings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {developer.recentEarnings.slice(0, 5).map((earning) => (
                        <div
                          key={earning.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900"
                        >
                          <div>
                            <Typography variant="p" size="sm" weight="semibold">
                              {formatCurrency(earning.amount)}
                            </Typography>
                            <Typography variant="p" size="xs" color="muted">
                              {formatDate(earning.createdAt)}
                            </Typography>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* CTA */}
              <Card className="bg-foreground text-background">
                <CardContent className="pt-6">
                  <Typography variant="h3" size="lg" weight="bold" className="mb-2">
                    Ready to work together?
                  </Typography>
                  <Typography variant="p" size="sm" className="mb-4 opacity-90">
                    Post a project and invite this developer to submit a proposal.
                  </Typography>
                  <Link href={`/client/post?developerId=${developer.id}`}>
                    <Button variant="secondary" size="sm" className="w-full">
                      Post Project
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

