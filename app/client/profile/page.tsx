'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import ClientProfileForm from '@/components/features/profile/ClientProfileForm';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  User,
  Briefcase,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Mail,
  Calendar,
  Building2,
  MapPin,
  TrendingUp,
} from 'lucide-react';

interface ClientProfile {
  id: string;
  name: string | null;
  email: string;
  company?: string | null;
  location?: string | null;
  bio?: string | null;
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

function getProfileCompleteness(profile: ClientProfile | null): number {
  if (!profile) return 0;
  let score = 0;
  if (profile.name?.trim()) score += 25;
  if (profile.company?.trim()) score += 25;
  if (profile.location?.trim()) score += 25;
  if (profile.bio?.trim()) score += 25;
  return score;
}

function ProfileSkeleton() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-pulse">
      {/* Header skeleton */}
      <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 md:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-28 h-28 rounded-[2rem] bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-4 w-full">
            <div className="h-10 bg-slate-100 rounded-2xl w-56" />
            <div className="h-4 bg-slate-100 rounded-xl w-40" />
            <div className="h-16 bg-slate-100 rounded-2xl w-full max-w-xl" />
          </div>
        </div>
      </div>
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-[2.5rem] bg-white border border-slate-100 p-8 h-36" />
        ))}
      </div>
      {/* Account info skeleton */}
      <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 h-32" />
      {/* Form skeleton */}
      <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 md:p-12 h-96" />
    </div>
  );
}

export default function ClientProfilePage() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
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

      const response = await fetch('/api/client/profile');
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
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: {
    name: string | null;
    company?: string | null;
    location?: string | null;
    bio?: string | null;
  }) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/client/profile', {
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
      setError(err instanceof Error ? err.message : 'Failed to save profile');
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

  const displayName = profile?.name || profile?.email || 'Client Profile';
  const completeness = getProfileCompleteness(profile);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-5xl mx-auto pb-12"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] border border-white/60 p-8 md:p-12 shadow-sm"
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-15%] right-[-5%] w-[35%] h-[35%] bg-indigo-400/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-white border border-white/80 flex items-center justify-center overflow-hidden shadow-sm">
              {profile?.name ? (
                <span className="text-4xl md:text-5xl font-black text-slate-700">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-14 h-14 text-slate-400" />
              )}
            </div>
          </div>

          {/* Identity */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
                  {displayName}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-white/80 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                  <Briefcase className="w-3 h-3" />
                  Client Account
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-600">
                {profile?.company && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-medium">{profile.company}</span>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-base text-slate-700 max-w-2xl leading-relaxed">
              {profile?.bio ||
                'Complete your profile to help developers understand your needs and match you with the right talent for your projects.'}
            </p>

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
                  {completeness === 0 && 'Add your name, company, location, and bio to get started'}
                  {completeness > 0 && completeness < 50 && 'Keep going — a complete profile helps attract the right developers'}
                  {completeness >= 50 && completeness < 100 && 'Almost there — finish your profile to stand out'}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error banner */}
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

      {/* Success banner */}
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

      {/* Stats grid */}
      {profile && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Total Projects */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{profile.totalProjects}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">projects</p>
              </div>
            </div>
          </motion.div>

          {/* Active Projects */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</p>
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{profile.activeProjects}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">in progress</p>
              </div>
            </div>
          </motion.div>

          {/* Completed */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Done</p>
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{profile.completedProjects}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">completed</p>
              </div>
            </div>
          </motion.div>

          {/* Total Spent */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Spent</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(profile.totalSpent)}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">total</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Account information */}
      {profile && (
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm"
        >
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Account Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Email Address</p>
                <p className="text-sm font-semibold text-slate-800">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Member Since</p>
                <p className="text-sm font-semibold text-slate-800">{formatDate(profile.createdAt)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Form */}
      <motion.div variants={itemVariants}>
        <ClientProfileForm
          initialData={
            profile
              ? {
                  name: profile.name,
                  company: profile.company,
                  location: profile.location,
                  bio: profile.bio,
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
