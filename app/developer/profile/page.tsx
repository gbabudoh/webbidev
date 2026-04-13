'use client';

import { useState, useEffect } from 'react';
import DeveloperProfileForm from '@/components/features/profile/DeveloperProfileForm';
import PortfolioSection from '@/components/features/portfolio/PortfolioSection';
import { formatCurrency } from '@/lib/utils';
import { User, DollarSign, Briefcase, CheckCircle, Award, TrendingUp, AlertCircle, MapPin, Clock } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const SKILL_LABELS: Record<string, string> = {
  REACT: 'React',
  VUE_JS: 'Vue.js',
  ANGULAR: 'Angular',
  JAVASCRIPT: 'JavaScript',
  TYPESCRIPT: 'TypeScript',
  TAILWIND_CSS: 'Tailwind CSS',
  SASS: 'SASS',
  NEXT_JS: 'Next.js',
  NODE_JS: 'Node.js',
  PYTHON_DJANGO: 'Django',
  PYTHON_FLASK: 'Flask',
  PHP_LARAVEL: 'Laravel',
  RUBY_ON_RAILS: 'Rails',
  GO: 'Go',
  POSTGRESQL: 'PostgreSQL',
  MONGODB: 'MongoDB',
  FIGMA: 'Figma',
  UI_UX_DESIGN: 'UI/UX Design',
  USER_RESEARCH: 'User Research',
};

function getProfileCompleteness(profile: DeveloperProfile | null): number {
  if (!profile) return 0;
  let score = 0;
  if (profile.bioSummary?.trim()) score += 30;
  if (profile.location?.trim()) score += 20;
  if (profile.skills?.length > 0) score += 30;
  if (profile.timeZone?.trim()) score += 20;
  return score;
}

interface DeveloperProfile {
  id: string;
  userId: string;
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

function ProfileSkeleton() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-pulse">
      {/* Header skeleton */}
      <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 md:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-4 w-full">
            <div className="h-10 bg-slate-100 rounded-2xl w-64" />
            <div className="h-4 bg-slate-100 rounded-xl w-48" />
            <div className="h-16 bg-slate-100 rounded-2xl w-full max-w-xl" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-7 w-20 bg-slate-100 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-[2.5rem] bg-white border border-slate-100 p-8 h-36" />
        ))}
      </div>
      {/* Form skeleton */}
      <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 md:p-12 h-96" />
    </div>
  );
}

export default function DeveloperProfilePage() {
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/developer/profile');
      if (!response.ok) {
        if (response.status === 404) {
          setProfile(null);
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.profile);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to load profile');
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: {
    bioSummary: string;
    location: string;
    timeZone?: string;
    skills: string[];
  }) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/developer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile');
      }

      setProfile(data.profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to save profile');
      } else {
        setError('Failed to save profile');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, duration: 0.4 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120 },
    },
  };

  if (loading) return <ProfileSkeleton />;

  const displayName = profile?.user?.name || profile?.user?.email || 'Developer Profile';
  const completeness = getProfileCompleteness(profile);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto pb-12"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] border border-white/60 p-8 md:p-12 shadow-sm"
      >
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 z-10">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-white border border-white/80 flex items-center justify-center overflow-hidden shadow-sm">
              {profile?.user?.name ? (
                <span className="text-4xl md:text-5xl font-black text-slate-700">
                  {profile.user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-16 h-16 text-slate-400" />
              )}
            </div>
            {profile?.isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-2 rounded-xl shadow-lg border-4 border-white">
                <CheckCircle className="w-5 h-5 fill-white text-slate-900" />
              </div>
            )}
          </div>

          {/* Identity */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
                  {displayName}
                </h1>
                {profile?.isActive && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-white/80 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Available for work
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-600">
                {profile?.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{profile.location}</span>
                  </div>
                )}
                {profile?.timeZone && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{profile.timeZone.replace(/_/g, ' ')}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-base text-slate-700 max-w-2xl leading-relaxed">
              {profile?.bioSummary ||
                'Complete your profile to showcase your skills and start receiving project proposals from clients matched to your expertise.'}
            </p>

            {profile?.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-xl bg-white/70 border border-white/80 text-slate-700 text-xs font-semibold shadow-sm"
                  >
                    {SKILL_LABELS[skill] ?? skill.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Profile completeness */}
            <div className="pt-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Profile completeness
                </span>
                <span className={`text-xs font-black ${completeness === 100 ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {completeness}%
                </span>
              </div>
              <div className="h-1.5 w-full max-w-xs rounded-full bg-white/50 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    completeness === 100
                      ? 'bg-emerald-500'
                      : completeness >= 50
                      ? 'bg-blue-500'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${completeness}%` }}
                />
              </div>
              {completeness < 100 && (
                <p className="text-[10px] text-slate-500 font-medium">
                  {completeness === 0 && 'Fill in your bio, location, and skills to get started'}
                  {completeness > 0 && completeness < 50 && 'Keep going — a complete profile attracts more clients'}
                  {completeness >= 50 && completeness < 100 && 'Almost there — complete your profile to stand out'}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error / Success banners */}
      {error && (
        <motion.div
          variants={itemVariants}
          className="p-4 rounded-3xl bg-red-50 border border-red-100 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-red-600 font-medium text-sm">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          variants={itemVariants}
          className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-emerald-700 font-medium text-sm">Profile saved successfully!</p>
        </motion.div>
      )}

      {/* Stats Grid */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Earnings */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Earnings</p>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mt-0.5" />
                </div>
              </div>
              <p className="text-4xl font-black text-slate-900 tracking-tight">
                {formatCurrency(profile.totalEarnings)}
              </p>
            </div>
          </motion.div>

          {/* Projects */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Projects</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{profile.completedProjects} completed</p>
                </div>
              </div>
              <p className="text-4xl font-black text-slate-900 tracking-tight">
                {profile.totalProjects}
                <span className="text-lg text-slate-400 font-medium ml-2">projects</span>
              </p>
            </div>
          </motion.div>

          {/* Success Rate */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {profile.totalProjects > 0
                      ? `${profile.completedProjects} of ${profile.totalProjects} projects`
                      : 'No projects yet'}
                  </p>
                </div>
              </div>
              <p className="text-4xl font-black text-slate-900 tracking-tight">
                {profile.totalProjects > 0
                  ? Math.round((profile.completedProjects / profile.totalProjects) * 100)
                  : 0}
                <span className="text-lg text-slate-400 font-medium ml-1">%</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Portfolio */}
      <motion.div variants={itemVariants}>
        <PortfolioSection />
      </motion.div>

      {/* Profile Form */}
      <motion.div variants={itemVariants}>
        <DeveloperProfileForm
          initialData={
            profile
              ? {
                  bioSummary: profile.bioSummary,
                  location: profile.location,
                  timeZone: profile.timeZone || undefined,
                  skills: profile.skills,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isLoading={isSaving}
          className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden"
        />
      </motion.div>
    </motion.div>
  );
}
