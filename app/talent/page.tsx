'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PublicLayout from '@/components/layouts/PublicLayout';
import DeveloperProfileCard from '@/components/features/profile/DeveloperProfileCard';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Users, MapPin, DollarSign, CheckCircle, Sparkles, X, 
  Code2, Palette, Server, Globe, Zap, ChevronDown, ChevronUp,
  SlidersHorizontal
} from 'lucide-react';

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

// Skill categories for organized display
const skillCategories = [
  {
    name: 'Frontend',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    skills: ['REACT', 'VUE_JS', 'ANGULAR', 'JAVASCRIPT', 'TYPESCRIPT', 'NEXT_JS']
  },
  {
    name: 'Backend',
    icon: Server,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    skills: ['NODE_JS', 'PYTHON_DJANGO', 'PYTHON_FLASK', 'PHP_LARAVEL', 'RUBY_ON_RAILS']
  },
  {
    name: 'Design',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    textColor: 'text-purple-600 dark:text-purple-400',
    skills: ['UI_UX_DESIGN', 'FIGMA', 'ADOBE_XD', 'SKETCH']
  }
];

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
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Frontend']);

  // Fetch developers
  const fetchDevelopers = useCallback(async (page: number = 1) => {
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load developers';
      setError(errorMessage);
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedSkills, location, minEarnings, verifiedOnly]);

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
  }, [search, selectedSkills, location, minEarnings, verifiedOnly, router, fetchDevelopers]);

  // Initial load
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    fetchDevelopers(page);
  }, [searchParams, fetchDevelopers]);

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

  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  // Count active filters
  const activeFilterCount = selectedSkills.length + (location ? 1 : 0) + (minEarnings ? 1 : 0) + (verifiedOnly ? 1 : 0);

  // Clear all filters
  const clearAllFilters = () => {
    setSearch('');
    setSelectedSkills([]);
    setLocation('');
    setMinEarnings('');
    setVerifiedOnly(false);
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
            <motion.div 
              className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                x: [0, 20, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.15, 1],
                x: [0, -20, 0],
                y: [0, 20, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg shadow-slate-200/20 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-slate-700">
                  {pagination.total}+ Verified Developers Online
                </span>
              </motion.div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                <span className="text-slate-900">Find Your Perfect </span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Developer
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                Browse our curated network of world-class developers, designers, and engineers ready to bring your vision to life.
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
                {[
                  { icon: Users, label: 'Active Developers', value: '500+' },
                  { icon: Globe, label: 'Countries', value: '40+' },
                  { icon: Zap, label: 'Projects Delivered', value: '2,000+' },
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-sm text-slate-500">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                  <Search className="absolute left-5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, skills, or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-14 pr-4 py-5 text-lg bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-slate-400"
                  />
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3 mr-2 rounded-xl font-semibold transition-all cursor-pointer",
                      showFilters || activeFilterCount > 0
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Filter Pills - Active Filters */}
              <AnimatePresence>
                {activeFilterCount > 0 && (
                  <motion.div 
                    className="flex flex-wrap items-center gap-2 mt-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {selectedSkills.map(skill => (
                      <motion.button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        {skill.replace(/_/g, ' ')}
                        <X className="w-3.5 h-3.5" />
                      </motion.button>
                    ))}
                    {location && (
                      <motion.button
                        onClick={() => setLocation('')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium hover:bg-emerald-200 transition-colors cursor-pointer"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        {location}
                        <X className="w-3.5 h-3.5" />
                      </motion.button>
                    )}
                    {verifiedOnly && (
                      <motion.button
                        onClick={() => setVerifiedOnly(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition-colors cursor-pointer"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verified Only
                        <X className="w-3.5 h-3.5" />
                      </motion.button>
                    )}
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-slate-500 hover:text-red-500 font-medium transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-slate-200 bg-white/80 backdrop-blur-sm"
            >
              <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Skills by Category */}
                  <div className="lg:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      Skills
                    </h3>
                    <div className="space-y-3">
                      {skillCategories.map(category => (
                        <div key={category.name} className="bg-slate-50 rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleCategory(category.name)}
                            className="w-full flex items-center justify-between p-3 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br", category.color)}>
                                <category.icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-medium text-slate-700">{category.name}</span>
                              {selectedSkills.filter(s => category.skills.includes(s)).length > 0 && (
                                <Badge variant="primary" size="sm">
                                  {selectedSkills.filter(s => category.skills.includes(s)).length}
                                </Badge>
                              )}
                            </div>
                            {expandedCategories.includes(category.name) ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                          <AnimatePresence>
                            {expandedCategories.includes(category.name) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-3 pb-3"
                              >
                                <div className="flex flex-wrap gap-2">
                                  {category.skills.map(skill => (
                                    <button
                                      key={skill}
                                      onClick={() => toggleSkill(skill)}
                                      className={cn(
                                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer",
                                        selectedSkills.includes(skill)
                                          ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                      )}
                                    >
                                      {skill.replace(/_/g, ' ')}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      Location
                    </h3>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Any location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-amber-500" />
                        Min Earnings
                      </h3>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="number"
                          placeholder="Any amount"
                          value={minEarnings}
                          onChange={(e) => setMinEarnings(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <label className={cn(
                      "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all",
                      verifiedOnly
                        ? "bg-green-50 border-2 border-green-500"
                        : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"
                    )}>
                      <input
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="rounded border-slate-300 text-green-600 focus:ring-green-500"
                      />
                      <CheckCircle className={cn("w-5 h-5", verifiedOnly ? "text-green-600" : "text-slate-400")} />
                      <span className={cn("font-medium", verifiedOnly ? "text-green-700" : "text-slate-600")}>
                        Verified Only
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {loading ? 'Loading...' : `${pagination.total} Developer${pagination.total !== 1 ? 's' : ''}`}
                </h2>
                {!loading && pagination.total > 0 && (
                  <p className="text-slate-500">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-80 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-300" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-300 rounded w-3/4" />
                        <div className="h-3 bg-slate-300 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-300 rounded" />
                      <div className="h-3 bg-slate-300 rounded w-5/6" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-slate-300 rounded-full" />
                      <div className="h-6 w-20 bg-slate-300 rounded-full" />
                      <div className="h-6 w-14 bg-slate-300 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div 
              className="p-8 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">Something went wrong</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Developers Grid */}
          {!loading && !error && (
            <>
              {developers.length === 0 ? (
                <motion.div 
                  className="text-center py-20 px-8 bg-white rounded-3xl border border-slate-200 shadow-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    No developers found
                  </h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    Try adjusting your filters or search criteria to find more results
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {developers.map((developer, index) => (
                    <motion.div
                      key={developer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <DeveloperProfileCard
                        profile={developer}
                        showActions={true}
                        onViewProfile={() => router.push(`/talent/${developer.id}`)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div 
                  className="mt-12 flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 rounded-xl font-medium cursor-pointer"
                  >
                    ← Previous
                  </Button>

                  <div className="flex items-center gap-1 mx-4">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={cn(
                            "w-10 h-10 rounded-xl font-semibold transition-all cursor-pointer",
                            pagination.page === pageNum
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {pagination.totalPages > 5 && (
                      <>
                        <span className="text-slate-400 px-2">...</span>
                        <button
                          onClick={() => handlePageChange(pagination.totalPages)}
                          className={cn(
                            "w-10 h-10 rounded-xl font-semibold transition-all cursor-pointer",
                            pagination.page === pagination.totalPages
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                          )}
                        >
                          {pagination.totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-4 py-2 rounded-xl font-medium cursor-pointer"
                  >
                    Next →
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </section>
      </div>
    </PublicLayout>
  );
}

export default function TalentPage() {
  return (
    <Suspense
      fallback={
        <PublicLayout>
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <motion.div 
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center animate-pulse">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-slate-600 font-medium">Loading talent...</p>
            </motion.div>
          </div>
        </PublicLayout>
      }
    >
      <TalentPageContent />
    </Suspense>
  );
}
