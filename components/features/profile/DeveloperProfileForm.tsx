'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Check, FileText, Clock } from 'lucide-react';

interface DeveloperProfileFormProps {
  initialData?: {
    bioSummary?: string;
    location?: string;
    timeZone?: string;
    skills?: string[];
  };
  onSubmit: (data: {
    bioSummary: string;
    location: string;
    timeZone?: string;
    skills: string[];
  }) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const TIMEZONE_GROUPS = [
  {
    group: 'Americas',
    zones: [
      { value: 'America/New_York', label: 'Eastern Time (ET) — New York' },
      { value: 'America/Chicago', label: 'Central Time (CT) — Chicago' },
      { value: 'America/Denver', label: 'Mountain Time (MT) — Denver' },
      { value: 'America/Los_Angeles', label: 'Pacific Time (PT) — Los Angeles' },
      { value: 'America/Vancouver', label: 'Pacific Time (PT) — Vancouver' },
      { value: 'America/Toronto', label: 'Eastern Time (ET) — Toronto' },
      { value: 'America/Sao_Paulo', label: 'Brasília Time (BRT) — São Paulo' },
      { value: 'America/Mexico_City', label: 'Central Time (CT) — Mexico City' },
      { value: 'America/Argentina/Buenos_Aires', label: 'Argentina Time (ART) — Buenos Aires' },
      { value: 'America/Lima', label: 'Peru Time (PET) — Lima' },
    ],
  },
  {
    group: 'Europe',
    zones: [
      { value: 'Europe/London', label: 'GMT/BST — London' },
      { value: 'Europe/Paris', label: 'Central European Time (CET) — Paris' },
      { value: 'Europe/Berlin', label: 'Central European Time (CET) — Berlin' },
      { value: 'Europe/Amsterdam', label: 'Central European Time (CET) — Amsterdam' },
      { value: 'Europe/Madrid', label: 'Central European Time (CET) — Madrid' },
      { value: 'Europe/Rome', label: 'Central European Time (CET) — Rome' },
      { value: 'Europe/Stockholm', label: 'Central European Time (CET) — Stockholm' },
      { value: 'Europe/Warsaw', label: 'Central European Time (CET) — Warsaw' },
      { value: 'Europe/Helsinki', label: 'Eastern European Time (EET) — Helsinki' },
      { value: 'Europe/Moscow', label: 'Moscow Time (MSK) — Moscow' },
      { value: 'Europe/Istanbul', label: 'Turkey Time (TRT) — Istanbul' },
    ],
  },
  {
    group: 'Africa',
    zones: [
      { value: 'Africa/Nairobi', label: 'East Africa Time (EAT) — Nairobi' },
      { value: 'Africa/Lagos', label: 'West Africa Time (WAT) — Lagos' },
      { value: 'Africa/Cairo', label: 'Eastern European Time (EET) — Cairo' },
      { value: 'Africa/Johannesburg', label: 'South Africa Standard Time (SAST) — Johannesburg' },
      { value: 'Africa/Accra', label: 'GMT — Accra' },
    ],
  },
  {
    group: 'Asia',
    zones: [
      { value: 'Asia/Riyadh', label: 'Arabia Standard Time (AST) — Riyadh' },
      { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST) — Dubai' },
      { value: 'Asia/Karachi', label: 'Pakistan Standard Time (PKT) — Karachi' },
      { value: 'Asia/Kolkata', label: 'India Standard Time (IST) — Mumbai/Kolkata' },
      { value: 'Asia/Dhaka', label: 'Bangladesh Standard Time (BST) — Dhaka' },
      { value: 'Asia/Bangkok', label: 'Indochina Time (ICT) — Bangkok' },
      { value: 'Asia/Jakarta', label: 'Western Indonesia Time (WIB) — Jakarta' },
      { value: 'Asia/Singapore', label: 'Singapore Standard Time (SST) — Singapore' },
      { value: 'Asia/Hong_Kong', label: 'Hong Kong Time (HKT) — Hong Kong' },
      { value: 'Asia/Shanghai', label: 'China Standard Time (CST) — Shanghai' },
      { value: 'Asia/Manila', label: 'Philippine Time (PHT) — Manila' },
      { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST) — Tokyo' },
      { value: 'Asia/Seoul', label: 'Korea Standard Time (KST) — Seoul' },
    ],
  },
  {
    group: 'Pacific',
    zones: [
      { value: 'Australia/Perth', label: 'Australian Western Time (AWST) — Perth' },
      { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST) — Sydney' },
      { value: 'Australia/Melbourne', label: 'Australian Eastern Time (AEST) — Melbourne' },
      { value: 'Pacific/Auckland', label: 'New Zealand Standard Time (NZST) — Auckland' },
      { value: 'Pacific/Honolulu', label: 'Hawaii Standard Time (HST) — Honolulu' },
    ],
  },
];

const AVAILABLE_SKILLS = [
  // Frontend
  { value: 'REACT', label: 'React' },
  { value: 'VUE_JS', label: 'Vue.js' },
  { value: 'ANGULAR', label: 'Angular' },
  { value: 'JAVASCRIPT', label: 'JavaScript' },
  { value: 'TYPESCRIPT', label: 'TypeScript' },
  { value: 'TAILWIND_CSS', label: 'Tailwind CSS' },
  { value: 'SASS', label: 'SASS' },
  { value: 'NEXT_JS', label: 'Next.js' },
  // Backend
  { value: 'NODE_JS', label: 'Node.js' },
  { value: 'PYTHON_DJANGO', label: 'Django' },
  { value: 'PYTHON_FLASK', label: 'Flask' },
  { value: 'PHP_LARAVEL', label: 'Laravel' },
  { value: 'RUBY_ON_RAILS', label: 'Rails' },
  { value: 'GO', label: 'Go' },
  { value: 'POSTGRESQL', label: 'PostgreSQL' },
  { value: 'MONGODB', label: 'MongoDB' },
  // UI/UX
  { value: 'FIGMA', label: 'Figma' },
  { value: 'UI_UX_DESIGN', label: 'UI/UX Design' },
  { value: 'USER_RESEARCH', label: 'User Research' },
];

export default function DeveloperProfileForm({
  initialData,
  onSubmit,
  isLoading = false,
  className,
}: DeveloperProfileFormProps) {
  const [formData, setFormData] = useState({
    bioSummary: initialData?.bioSummary || '',
    location: initialData?.location || '',
    timeZone: initialData?.timeZone || '',
    skills: initialData?.skills || [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => {
      const currentSkills = prev.skills;
      if (currentSkills.includes(skill)) {
        return { ...prev, skills: currentSkills.filter((s) => s !== skill) };
      } else {
        if (currentSkills.length >= 5) {
          setErrors((prev) => ({ ...prev, skills: 'You can only select up to 5 skills' }));
          return prev;
        }
        return { ...prev, skills: [...currentSkills, skill] };
      }
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bioSummary.trim()) {
      newErrors.bioSummary = 'Bio summary is required';
    } else if (formData.bioSummary.length > 400) {
      newErrors.bioSummary = 'Bio summary must be 400 characters or less';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      bioSummary: formData.bioSummary.trim(),
      location: formData.location.trim(),
      timeZone: formData.timeZone.trim() || undefined,
      skills: formData.skills,
    });
  };

  return (
    <div className={cn("p-8 md:p-12", className)}>
      <div className="mb-10 border-b border-slate-100 pb-8">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Profile</p>
        <p className="text-slate-500 text-sm">Update your public profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Location */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider ml-1">Location</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                disabled={isLoading}
                className={cn(
                  "w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm",
                  errors.location && "border-red-500/50 focus:ring-red-500/20"
                )}
              />
            </div>
            {errors.location && <p className="text-sm text-red-500 ml-1">{errors.location}</p>}
          </div>

          {/* Timezone */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider ml-1">
              Timezone
              <span className="ml-1.5 text-xs font-medium text-slate-400 normal-case tracking-normal">Optional</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <select
                value={formData.timeZone}
                onChange={(e) => handleChange('timeZone', e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="">Select timezone…</option>
                {TIMEZONE_GROUPS.map(({ group, zones }) => (
                  <optgroup key={group} label={group}>
                    {zones.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {/* Chevron icon */}
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Summary */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider ml-1">Professional Bio</label>
          <div className="relative group">
            <div className="absolute top-4 left-4 pointer-events-none">
              <FileText className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <textarea
              placeholder="Tell clients about your experience, key skills, and what makes you unique..."
              value={formData.bioSummary}
              onChange={(e) => handleChange('bioSummary', e.target.value)}
              disabled={isLoading}
              rows={5}
              maxLength={400}
              className={cn(
                "w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none shadow-sm leading-relaxed",
                errors.bioSummary && "border-red-500/50 focus:ring-red-500/20"
              )}
            />
          </div>
          <div className="flex justify-between ml-1 mr-1">
             {errors.bioSummary ? <p className="text-sm text-red-500">{errors.bioSummary}</p> : <span />}
             <span className="text-xs text-slate-500 font-medium">{formData.bioSummary.length}/400</span>
          </div>
        </div>

        {/* Skills Selection */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-2">
            <div>
              <label className="text-lg font-bold text-slate-900">Skills</label>
              <p className="text-slate-500 text-sm mt-1">Select up to 5 skills that best represent your expertise</p>
            </div>
            <div className="text-sm font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              <span className={cn(
                "font-bold",
                formData.skills.length === 5 ? "text-emerald-600" : "text-blue-600"
              )}>{formData.skills.length}</span>/5 Selected
            </div>
          </div>
          
          {errors.skills && (
             <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
               <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
               {errors.skills}
             </div>
          )}

          <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200">
            <div className="flex flex-wrap gap-2.5">
              {AVAILABLE_SKILLS.map((skill) => {
                const isSelected = formData.skills.includes(skill.value);
                return (
                  <button
                    key={skill.value}
                    type="button"
                    onClick={() => handleSkillToggle(skill.value)}
                    disabled={isLoading || (!isSelected && formData.skills.length >= 5)}
                    className={cn(
                      'relative group px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border',
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105 z-10'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300',
                      (!isSelected && formData.skills.length >= 5) && 'opacity-40 grayscale cursor-not-allowed'
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {skill.label}
                    </span>
                    {isSelected && (
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 opacity-100" />
                    )}
                  </button>
                );
              })}
            </div>
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
              initialData ? 'Update Profile' : 'Create Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

