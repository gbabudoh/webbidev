'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicLayout from '@/components/layouts/PublicLayout';
import DeveloperProfileCard from '@/components/features/profile/DeveloperProfileCard';
import { Input, Select, Button, Typography, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Skill } from '@/types';
import { Search, Filter, Users, MapPin, DollarSign, CheckCircle, Sparkles, X } from 'lucide-react';

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
}

function TalentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    searchParams.get('skills')?.split(',').filter(Boolean) || []
  );
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minEarnings, setMinEarnings] = useState(searchParams.get('minEarnings') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true');

  // Available skills for filter
  const availableSkills: Skill[] = [
    'REACT',
    'VUE_JS',
    'ANGULAR',
    'JAVASCRIPT',
    'TYPESCRIPT',
    'NEXT_JS',
    'NODE_JS',
    'PYTHON_DJANGO',
    'PYTHON_FLASK',
    'PHP_LARAVEL',
    'RUBY_ON_RAILS',
    'UI_UX_DESIGN',
    'FIGMA',
    'ADOBE_XD',
    'SKETCH',
  ];

  // Fetch developers
  const fetchDevelopers = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedSkills.length > 0) params.set('skills', selectedSkills.join(','));
      if (location) params.set('location', location);
      if (minEarnings) params.set('minEarnings', minEarnings);
      if (verifiedOnly) params.set('verified', 'true');
      params.set('page', page.toString());
      params.set('limit', '12');

      const response = await fetch(`/api/developer?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch developers');
      }

      const data = await response.json();
      setDevelopers(data.developers || []);
      setPagination(data.pagination || { page: 1, limit: 12, total: 0, totalPages: 0 });
    } catch (err: any) {
      setError(err.message || 'Failed to load developers');
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  };

  // Update URL and fetch on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedSkills.length > 0) params.set('skills', selectedSkills.join(','));
    if (location) params.set('location', location);
    if (minEarnings) params.set('minEarnings', minEarnings);
    if (verifiedOnly) params.set('verified', 'true');

    router.replace(`/talent?${params.toString()}`);
    fetchDevelopers(1);
  }, [search, selectedSkills, location, minEarnings, verifiedOnly]);

  // Initial load
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    fetchDevelopers(page);
  }, []);

  // Handle skill toggle
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    fetchDevelopers(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Header */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-cyan-950/30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl" />
          
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 mb-6">
                <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <Typography variant="p" size="sm" weight="medium" className="text-purple-600 dark:text-purple-400">
                  Verified Developers
                </Typography>
              </div>
              <Typography variant="h1" size="4xl" weight="bold" className="mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Browse Talent
              </Typography>
              <Typography variant="p" size="xl" color="muted" className="max-w-2xl mx-auto">
                Find the perfect developer for your project from our curated talent pool
              </Typography>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search by name, skills, or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 h-14 text-lg bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-purple-500 dark:focus:border-purple-500 rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6 sticky top-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                      <Filter className="w-5 h-5 text-white" />
                    </div>
                    <Typography variant="h3" size="lg" weight="semibold">
                      Filters
                    </Typography>
                  </div>
                  {(selectedSkills.length > 0 || location || minEarnings || verifiedOnly) && (
                    <Badge variant="primary" size="sm">
                      {selectedSkills.length + (location ? 1 : 0) + (minEarnings ? 1 : 0) + (verifiedOnly ? 1 : 0)}
                    </Badge>
                  )}
                </div>

                {/* Skills Filter */}
                <div>
                  <Typography variant="h4" size="sm" weight="semibold" className="mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Skills
                  </Typography>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {availableSkills.map((skill) => (
                      <label
                        key={skill}
                        className={cn(
                          "flex items-center gap-2 cursor-pointer p-2.5 rounded-lg transition-all",
                          selectedSkills.includes(skill)
                            ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700"
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-transparent"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill)}
                          onChange={() => toggleSkill(skill)}
                          className="rounded border-zinc-300 dark:border-zinc-700 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium">
                          {skill.replace(/_/g, ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <Typography variant="h4" size="sm" weight="semibold" className="mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Location
                  </Typography>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      type="text"
                      placeholder="City, Country"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Min Earnings Filter */}
                <div>
                  <Typography variant="h4" size="sm" weight="semibold" className="mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                    Min Earnings
                  </Typography>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      type="number"
                      placeholder="0"
                      value={minEarnings}
                      onChange={(e) => setMinEarnings(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Verified Only */}
                <div>
                  <label className={cn(
                    "flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all",
                    verifiedOnly
                      ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-transparent"
                  )}>
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded border-zinc-300 dark:border-zinc-700 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium">Verified Only</span>
                    </div>
                  </label>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setSelectedSkills([]);
                    setLocation('');
                    setMinEarnings('');
                    setVerifiedOnly(false);
                  }}
                  className="w-full gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </Button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Results Header */}
              <div className="mb-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <Typography variant="p" weight="semibold">
                        {loading ? (
                          'Loading...'
                        ) : (
                          <>
                            {pagination.total} Developer{pagination.total !== 1 ? 's' : ''} Found
                          </>
                        )}
                      </Typography>
                      {!loading && pagination.total > 0 && (
                        <Typography variant="p" size="sm" color="muted">
                          Page {pagination.page} of {pagination.totalPages}
                        </Typography>
                      )}
                    </div>
                  </div>
                  {(selectedSkills.length > 0 || location || minEarnings || verifiedOnly) && (
                    <Badge variant="primary" size="sm" className="gap-1">
                      <Filter className="w-3 h-3" />
                      {selectedSkills.length + (location ? 1 : 0) + (minEarnings ? 1 : 0) + (verifiedOnly ? 1 : 0)} Active
                    </Badge>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-80 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl animate-pulse shadow-sm"
                    />
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-6 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                      <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <Typography variant="p" className="text-red-600 dark:text-red-400">
                      {error}
                    </Typography>
                  </div>
                </div>
              )}

              {/* Developers Grid */}
              {!loading && !error && (
                <>
                  {developers.length === 0 ? (
                    <div className="text-center py-20 px-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-zinc-400 dark:text-zinc-600" />
                      </div>
                      <Typography variant="h3" size="xl" weight="semibold" className="mb-3">
                        No developers found
                      </Typography>
                      <Typography variant="p" color="muted" className="mb-6 max-w-md mx-auto">
                        Try adjusting your filters or search criteria
                      </Typography>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearch('');
                          setSelectedSkills([]);
                          setLocation('');
                          setMinEarnings('');
                          setVerifiedOnly(false);
                        }}
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        Clear All Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {developers.map((developer) => (
                        <DeveloperProfileCard
                          key={developer.id}
                          profile={developer}
                          showActions={true}
                          onViewProfile={() => router.push(`/talent/${developer.id}`)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="gap-2"
                        >
                          ← Previous
                        </Button>
                        <div className="flex items-center gap-2">
                          {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={cn(
                                  "w-10 h-10 rounded-lg font-medium transition-all",
                                  pagination.page === pageNum
                                    ? "bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-md"
                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                                )}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          {pagination.totalPages > 5 && (
                            <>
                              <span className="text-zinc-400">...</span>
                              <button
                                onClick={() => handlePageChange(pagination.totalPages)}
                                className={cn(
                                  "w-10 h-10 rounded-lg font-medium transition-all",
                                  pagination.page === pagination.totalPages
                                    ? "bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-md"
                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                                )}
                              >
                                {pagination.totalPages}
                              </button>
                            </>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page >= pagination.totalPages}
                          className="gap-2"
                        >
                          Next →
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default function TalentPage() {
  return (
    <Suspense
      fallback={
        <PublicLayout>
          <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
            <Typography variant="p" size="lg">
              Loading...
            </Typography>
          </div>
        </PublicLayout>
      }
    >
      <TalentPageContent />
    </Suspense>
  );
}

