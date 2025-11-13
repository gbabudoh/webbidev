'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DeveloperProfileForm from '@/components/features/profile/DeveloperProfileForm';
import { Card, CardContent, CardHeader, CardTitle, Typography, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { User, DollarSign, Briefcase, CheckCircle, Award, TrendingUp, AlertCircle } from 'lucide-react';

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
  const router = useRouter();
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
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
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
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center animate-pulse">
              <User className="w-8 h-8 text-white" />
            </div>
            <Typography variant="p" size="lg" color="muted">
              Loading profile...
            </Typography>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-red-950/30 border border-purple-100 dark:border-purple-900/50 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-400/20 to-pink-400/20 rounded-full blur-3xl" />
          
          <div className="relative flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
                My Profile
              </Typography>
              <Typography variant="p" size="lg" color="muted">
                Manage your developer profile and showcase your skills
              </Typography>
              {profile?.isVerified && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <Typography variant="p" size="sm" weight="semibold" className="text-green-600 dark:text-green-400">
                    Verified Developer
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <Typography variant="p" className="text-red-600 dark:text-red-400">
                {error}
              </Typography>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <Typography variant="p" className="text-green-600 dark:text-green-400">
                Profile saved successfully!
              </Typography>
            </div>
          </div>
        )}

        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <Typography variant="h2" size="3xl" weight="bold" className="mb-1">
                  {formatCurrency(profile.totalEarnings)}
                </Typography>
                <Typography variant="p" size="sm" color="muted">
                  Total Earnings
                </Typography>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Typography variant="h2" size="3xl" weight="bold" className="mb-1">
                  {profile.totalProjects}
                </Typography>
                <Typography variant="p" size="sm" color="muted">
                  Total Projects
                </Typography>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <Typography variant="h2" size="3xl" weight="bold" className="mb-1">
                  {profile.completedProjects}
                </Typography>
                <Typography variant="p" size="sm" color="muted">
                  Completed Projects
                </Typography>
              </div>
            </div>
          </div>
        )}

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
        />
      </div>
    </DashboardLayout>
  );
}

