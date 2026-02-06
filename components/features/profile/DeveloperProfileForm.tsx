'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Globe, MapPin, Check, Sparkles, FileText } from 'lucide-react';

interface DeveloperProfileFormProps {
  initialData?: {
    portfolioUrl?: string;
    bioSummary?: string;
    location?: string;
    timeZone?: string;
    skills?: string[];
  };
  onSubmit: (data: {
    portfolioUrl: string;
    bioSummary: string;
    location: string;
    timeZone?: string;
    skills: string[];
  }) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

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
    portfolioUrl: initialData?.portfolioUrl || '',
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

    if (!formData.portfolioUrl.trim()) {
      newErrors.portfolioUrl = 'Portfolio URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.portfolioUrl)) {
      newErrors.portfolioUrl = 'Please enter a valid URL (starting with http:// or https://)';
    }

    if (!formData.bioSummary.trim()) {
      newErrors.bioSummary = 'Bio summary is required';
    } else if (formData.bioSummary.length > 400) {
      newErrors.bioSummary = 'Bio summary must be 400 characters or less';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.skills.length !== 5) {
      newErrors.skills = 'Please select exactly 5 skills to showcase your best expertise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      portfolioUrl: formData.portfolioUrl.trim(),
      bioSummary: formData.bioSummary.trim(),
      location: formData.location.trim(),
      timeZone: formData.timeZone.trim() || undefined,
      skills: formData.skills,
    });
  };

  return (
    <div className={cn("p-8 md:p-12 bg-white/50", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Details</h2>
          <p className="text-slate-500">Update your public profile information</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>Professional Profile</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Portfolio URL */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider ml-1">Portfolio Link</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="url"
                placeholder="https://your-portfolio.com"
                value={formData.portfolioUrl}
                onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                disabled={isLoading}
                className={cn(
                  "w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm",
                  errors.portfolioUrl && "border-red-500/50 focus:ring-red-500/20"
                )}
              />
            </div>
            {errors.portfolioUrl && <p className="text-sm text-red-500 ml-1">{errors.portfolioUrl}</p>}
          </div>

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
              <label className="text-lg font-bold text-slate-900">Top 5 Skills</label>
              <p className="text-slate-500 text-sm mt-1">Select exactly 5 skills that best represent your expertise</p>
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

        {/* Action Buttons */}
        <div className="pt-6 flex justify-end">
           <Button
             type="submit"
             disabled={isLoading}
             className={cn(
               "relative px-10 py-6 rounded-2xl text-base font-bold tracking-wide transition-all duration-300 overflow-hidden group",
               "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/20 border border-blue-400/20"
             )}
           >
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
             <span className="relative flex items-center gap-2">
               {isLoading ? (
                 <>
                   <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Updating Profile...
                 </>
               ) : (
                 <>
                   {initialData ? 'Update Profile' : 'Create Profile'}
                   <Sparkles className="w-4 h-4 ml-1" />
                 </>
               )}
             </span>
           </Button>
        </div>
      </form>
    </div>
  );
}

