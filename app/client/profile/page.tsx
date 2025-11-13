'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ClientProfileForm from '@/components/features/profile/ClientProfileForm';
import { Card, CardContent, CardHeader, CardTitle, Typography, Badge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';

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
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
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
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <Typography variant="p" size="lg" color="muted">Loading profile...</Typography>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
              My Profile
            </Typography>
            <Typography variant="p" size="lg" color="muted">
              Manage your client profile and account information
            </Typography>
          </div>
          <Badge variant="primary" size="lg" className="px-4 py-2">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Client Account
          </Badge>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Typography variant="p" className="text-red-600 dark:text-red-400">
                  {error}
                </Typography>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {success && (
          <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Typography variant="p" className="text-emerald-600 dark:text-emerald-400">
                  Profile saved successfully!
                </Typography>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Statistics */}
        {profile && (
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <CardTitle>Account Statistics</CardTitle>
                  <Typography variant="p" size="sm" color="muted">
                    Your activity overview
                  </Typography>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Total Projects */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <Typography variant="p" size="xs" color="muted">Total Projects</Typography>
                  </div>
                  <Typography variant="h3" size="3xl" weight="bold">
                    {profile.totalProjects}
                  </Typography>
                </div>

                {/* Active Projects */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <Typography variant="p" size="xs" color="muted">Active Projects</Typography>
                  </div>
                  <Typography variant="h3" size="3xl" weight="bold">
                    {profile.activeProjects}
                  </Typography>
                </div>

                {/* Completed */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <Typography variant="p" size="xs" color="muted">Completed</Typography>
                  </div>
                  <Typography variant="h3" size="3xl" weight="bold">
                    {profile.completedProjects}
                  </Typography>
                </div>

                {/* Total Spent */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <Typography variant="p" size="xs" color="muted">Total Spent</Typography>
                  </div>
                  <Typography variant="h3" size="3xl" weight="bold">
                    {formatCurrency(profile.totalSpent)}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Information */}
        {profile && (
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <CardTitle>Account Information</CardTitle>
                  <Typography variant="p" size="sm" color="muted">
                    Your account details
                  </Typography>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <Typography variant="p" size="sm" color="muted" className="mb-1">Email Address</Typography>
                    <Typography variant="p" size="sm" weight="medium">{profile.email}</Typography>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <Typography variant="p" size="sm" color="muted" className="mb-1">Member Since</Typography>
                    <Typography variant="p" size="sm" weight="medium">{formatDate(profile.createdAt)}</Typography>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Form */}
        <ClientProfileForm
          initialData={profile ? {
            name: profile.name,
            company: profile.company,
            location: profile.location,
            bio: profile.bio,
          } : undefined}
          onSubmit={handleSubmit}
          isLoading={isSaving}
        />
      </div>
    </DashboardLayout>
  );
}
