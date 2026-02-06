'use client';

import { useState, useEffect } from 'react';
import DeveloperProfileForm from '@/components/features/profile/DeveloperProfileForm';
import { formatCurrency } from '@/lib/utils';
import { User, DollarSign, Briefcase, CheckCircle, Award, TrendingUp, AlertCircle, MapPin, Globe } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

interface DeveloperProfile {
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
          // Profile doesn't exist yet, that's okay
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
    portfolioUrl: string;
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile');
      }

      setProfile(data.profile);
      setSuccess(true);
      
      // Clear success message after 3 seconds
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
      transition: { 
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-8 h-8 text-blue-500/50" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 max-w-7xl mx-auto pb-12"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-slate-50 to-blue-50/50 border border-white/60 p-8 md:p-12 shadow-xl">
          {/* Animated Background Effects */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 z-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-500 rounded-[2rem] blur opacity-30 group-hover:opacity-60 transition duration-500" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                {profile?.user?.name ? (
                  <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600">
                    {profile.user.name.charAt(0)}
                  </span>
                ) : (
                  <User className="w-16 h-16 text-slate-300" />
                )}
              </div>
              {profile?.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg border-4 border-white">
                  <CheckCircle className="w-5 h-5 fill-white text-blue-600" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 mb-2">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-2 md:mb-0">
                    {profile?.user?.name || 'Developer Profile'}
                  </h1>
                  {profile?.isActive && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Available for work
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500">
                   {profile?.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">{profile.location}</span>
                    </div>
                   )}
                   {profile?.portfolioUrl && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-purple-500" />
                      <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-blue-600 transition-colors">
                        Portfolio
                      </a>
                    </div>
                   )}
                </div>
              </div>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                {profile?.bioSummary || 'Complete your profile to showcase your skills and start receiving project proposals from clients matched to your expertise.'}
              </p>

              {profile?.skills && profile.skills.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all cursor-default shadow-sm">
                      {skill.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div variants={itemVariants} className="p-4 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-red-400 font-medium">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div variants={itemVariants} className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-emerald-400 font-medium">Profile saved successfully!</p>
          </motion.div>
        )}

        {/* Stats Grid */}
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 p-8 transition-all hover:bg-slate-800/80">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
              <div className="relative space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Earnings</h3>
                    <TrendingUp className="w-4 h-4 text-emerald-500 mt-1" />
                  </div>
                </div>
                <div className="text-4xl font-black text-white tracking-tight">
                  {formatCurrency(profile.totalEarnings)}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 p-8 transition-all hover:bg-slate-800/80">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />
              <div className="relative space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Projects</h3>
                    <div className="h-4 mt-1" />
                  </div>
                </div>
                <div className="text-4xl font-black text-white tracking-tight">
                  {profile.totalProjects}
                  <span className="text-lg text-slate-500 font-medium ml-2">projects</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 p-8 transition-all hover:bg-slate-800/80">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
              <div className="relative space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Success Rate</h3>
                    <div className="h-4 mt-1" />
                  </div>
                </div>
                <div className="text-4xl font-black text-white tracking-tight">
                  {profile.totalProjects > 0 ? Math.round((profile.completedProjects / profile.totalProjects) * 100) : 0}
                  <span className="text-lg text-slate-500 font-medium ml-1">%</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <motion.div variants={itemVariants}>
          <div className="relative">
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-[3rem]" />
            <DeveloperProfileForm
              initialData={profile ? {
                portfolioUrl: profile.portfolioUrl,
                bioSummary: profile.bioSummary,
                location: profile.location,
                timeZone: profile.timeZone || undefined,
                skills: profile.skills,
              } : undefined}
              onSubmit={handleSubmit}
              isLoading={isSaving}
              className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-xl overflow-hidden"
            />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

