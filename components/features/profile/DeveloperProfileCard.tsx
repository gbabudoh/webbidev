'use client';

import { cn, formatCurrency } from '@/lib/utils';
import { MapPin, Clock, CheckCircle, ExternalLink, Briefcase } from 'lucide-react';

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

interface DeveloperProfileCardProps {
  profile: DeveloperProfile;
  showActions?: boolean;
  onViewProfile?: () => void;
  onHire?: () => void;
  className?: string;
}

export default function DeveloperProfileCard({
  profile,
  showActions = true,
  onViewProfile,
  onHire,
  className,
}: DeveloperProfileCardProps) {
  const displayName = profile.user?.name || profile.user?.email || 'Developer';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const visibleSkills = profile.skills.slice(0, 4);
  const extraSkills = profile.skills.length - visibleSkills.length;

  return (
    <div
      className={cn(
        'group flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 overflow-hidden',
        className
      )}
    >
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-black text-lg shadow-sm">
              {initials}
            </div>
            {profile.isActive && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            )}
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-base font-black text-slate-900 tracking-tight truncate">
                {displayName}
              </p>
              {profile.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider shrink-0">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400 font-medium">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.location}
                </span>
              )}
              {profile.timeZone && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {profile.timeZone.replace(/_/g, ' ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="px-6 pb-4">
        <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
          {profile.bioSummary || 'No bio provided.'}
        </p>
      </div>

      {/* Skills */}
      {profile.skills.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {visibleSkills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                {SKILL_LABELS[skill] ?? skill.replace(/_/g, ' ')}
              </span>
            ))}
            {extraSkills > 0 && (
              <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-xs font-semibold">
                +{extraSkills} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mx-6 mb-4 grid grid-cols-3 gap-px bg-slate-100 rounded-2xl overflow-hidden">
        <div className="bg-slate-50 px-3 py-3 text-center">
          <p className="text-sm font-black text-slate-900 leading-none mb-1">
            {formatCurrency(profile.totalEarnings)}
          </p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Earned</p>
        </div>
        <div className="bg-slate-50 px-3 py-3 text-center">
          <p className="text-sm font-black text-slate-900 leading-none mb-1">
            {profile.totalProjects}
          </p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projects</p>
        </div>
        <div className="bg-slate-50 px-3 py-3 text-center">
          <p className="text-sm font-black text-slate-900 leading-none mb-1">
            {profile.completedProjects}
          </p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Done</p>
        </div>
      </div>

      {/* Portfolio link */}
      {profile.portfolioUrl && (
        <div className="px-6 pb-4">
          <a
            href={profile.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Portfolio
          </a>
        </div>
      )}

      {/* Spacer to push actions to bottom */}
      <div className="flex-1" />

      {/* Actions */}
      {showActions && (
        <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex items-center gap-2.5">
          <button
            onClick={onViewProfile}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Briefcase className="w-4 h-4" />
            View Profile
          </button>
          {onHire && (
            <button
              onClick={onHire}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              Hire
            </button>
          )}
        </div>
      )}
    </div>
  );
}
