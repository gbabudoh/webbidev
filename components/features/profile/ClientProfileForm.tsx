'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Building2, MapPin, FileText } from 'lucide-react';

interface ClientProfileFormProps {
  initialData?: {
    name?: string | null;
    company?: string | null;
    location?: string | null;
    bio?: string | null;
  };
  onSubmit: (data: {
    name: string | null;
    company?: string | null;
    location?: string | null;
    bio?: string | null;
  }) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const INPUT_BASE =
  'w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm disabled:opacity-50';

export default function ClientProfileForm({
  initialData,
  onSubmit,
  isLoading = false,
  className,
}: ClientProfileFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    bio: initialData?.bio || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be 100 characters or less';
    }

    if (formData.company && formData.company.length > 200) {
      newErrors.company = 'Company name must be 200 characters or less';
    }

    if (formData.location && formData.location.length > 200) {
      newErrors.location = 'Location must be 200 characters or less';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: formData.name.trim() || null,
      company: formData.company.trim() || null,
      location: formData.location.trim() || null,
      bio: formData.bio.trim() || null,
    });
  };

  return (
    <div className={cn('p-8 md:p-12', className)}>
      <div className="mb-10 border-b border-slate-100 pb-8">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Profile</p>
        <p className="text-slate-500 text-sm">Update your profile information to help developers understand your needs</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Full Name */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider ml-1">
              Full Name <span className="text-red-400 normal-case tracking-normal font-medium text-xs ml-0.5">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isLoading}
                className={cn(INPUT_BASE, errors.name && 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500')}
              />
            </div>
            {errors.name && <p className="text-sm text-red-500 ml-1">{errors.name}</p>}
          </div>

          {/* Company */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider ml-1">
              Company
              <span className="ml-1.5 text-xs font-medium text-slate-400 normal-case tracking-normal">Optional</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Your company or organization"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                disabled={isLoading}
                className={cn(INPUT_BASE, errors.company && 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500')}
              />
            </div>
            {errors.company && <p className="text-sm text-red-500 ml-1">{errors.company}</p>}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider ml-1">
            Location
            <span className="ml-1.5 text-xs font-medium text-slate-400 normal-case tracking-normal">Optional</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="City, Country  (e.g. New York, USA)"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              disabled={isLoading}
              className={cn(INPUT_BASE, errors.location && 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500')}
            />
          </div>
          {errors.location && <p className="text-sm text-red-500 ml-1">{errors.location}</p>}
        </div>

        {/* Bio */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider ml-1">
            Bio
            <span className="ml-1.5 text-xs font-medium text-slate-400 normal-case tracking-normal">Optional</span>
          </label>
          <div className="relative group">
            <div className="absolute top-4 left-4 pointer-events-none">
              <FileText className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <textarea
              placeholder="Tell developers about yourself and the kinds of projects you typically work on..."
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              disabled={isLoading}
              rows={4}
              maxLength={500}
              className={cn(
                'w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none shadow-sm leading-relaxed disabled:opacity-50',
                errors.bio && 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500'
              )}
            />
          </div>
          <div className="flex justify-between ml-1 mr-1">
            {errors.bio ? <p className="text-sm text-red-500">{errors.bio}</p> : <span />}
            <span className="text-xs text-slate-500 font-medium">{formData.bio.length}/500</span>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-10 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              initialData ? 'Update Profile' : 'Save Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
