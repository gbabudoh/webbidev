'use client';

import { useState, useEffect } from 'react';
import { MapPin, Globe, CheckCircle, Star, ExternalLink, FolderOpen, Briefcase, Award, ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  displayOrder: number;
}

interface Developer {
  id: string;
  userId: string;
  portfolioUrl: string | null;
  bioSummary: string;
  location: string;
  skills: string[];
  totalProjects: number;
  completedProjects: number;
  isVerified: boolean;
  isActive: boolean;
  user: { id: string; name: string | null; createdAt: string };
  portfolioProjects: PortfolioProject[];
  recentProjects: { id: string; title: string; status: string }[];
}

function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8 animate-pulse">
      <div className="rounded-[2.5rem] bg-white border border-slate-100 p-10 flex gap-8">
        <div className="w-28 h-28 rounded-[1.5rem] bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-slate-100 rounded-2xl w-56" />
          <div className="h-4 bg-slate-100 rounded-xl w-36" />
          <div className="h-16 bg-slate-100 rounded-2xl w-full" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-7 w-20 bg-slate-100 rounded-xl" />)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-[1.5rem] border border-slate-100 overflow-hidden">
            <div className="h-44 bg-slate-100" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-slate-100 rounded-xl w-3/4" />
              <div className="h-3 bg-slate-100 rounded-xl w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillLabel({ skill }: { skill: string }) {
  const formatted = skill
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span className="px-3 py-1.5 rounded-xl bg-white/70 border border-white/80 text-slate-700 text-xs font-semibold shadow-sm">
      {formatted}
    </span>
  );
}

export default function PublicPortfolioPage() {
  const params = useParams();
  const developerId = params.id as string;

  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!developerId) return;
    fetch(`/api/developer/${developerId}`)
      .then((res) => {
        if (res.status === 404) { setNotFound(true); return null; }
        return res.json();
      })
      .then((data) => {
        if (data) setDeveloper(data.developer);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [developerId]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-5xl mx-auto mb-6">
        <div className="h-5 w-24 bg-slate-200 rounded-xl animate-pulse" />
      </div>
      <PageSkeleton />
    </div>
  );

  if (notFound || !developer) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
          <FolderOpen className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-lg font-black text-slate-900">Developer not found</p>
        <p className="text-sm text-slate-400 font-medium">This profile may not exist or has been deactivated.</p>
        <Link href="/" className="mt-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors">
          Back to home
        </Link>
      </div>
    );
  }

  const displayName = developer.user.name || 'Developer';
  const initial = displayName.charAt(0).toUpperCase();
  const featured = developer.portfolioProjects.filter((p) => p.featured);
  const rest = developer.portfolioProjects.filter((p) => !p.featured);
  const successRate = developer.totalProjects > 0
    ? Math.round((developer.completedProjects / developer.totalProjects) * 100)
    : null;
  const memberYear = new Date(developer.user.createdAt).getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/developer/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 font-semibold hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse developers
        </Link>

        {/* Hero card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] border border-white/60 p-8 md:p-12 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[1.5rem] bg-white border border-white/80 flex items-center justify-center shadow-sm">
                <span className="text-4xl md:text-5xl font-black text-slate-700">{initial}</span>
              </div>
              {developer.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-1.5 rounded-xl shadow-lg border-4 border-white">
                  <CheckCircle className="w-4 h-4 fill-white text-slate-900" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-1">
                  {displayName}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-600 text-sm">
                  {developer.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {developer.location}
                    </span>
                  )}
                  {developer.portfolioUrl && (
                    <a
                      href={developer.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-slate-900 underline underline-offset-2 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </a>
                  )}
                  <span className="text-slate-500 text-xs font-medium">Member since {memberYear}</span>
                </div>
              </div>

              <p className="text-base text-slate-700 leading-relaxed max-w-2xl">
                {developer.bioSummary}
              </p>

              {developer.skills.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {developer.skills.map((skill) => (
                    <SkillLabel key={skill} skill={skill} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-8 pt-6 border-t border-black/10 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900">{developer.totalProjects}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Projects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900">{developer.completedProjects}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900">
                {successRate !== null ? `${successRate}%` : '—'}
              </p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="flex justify-end mb-8">
          <Link
            href="/developer/messages"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Send a Message
          </Link>
        </div>

        {/* Portfolio projects */}
        {developer.portfolioProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-3 shadow-sm">
              <FolderOpen className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-sm font-black text-slate-900 mb-1">No portfolio projects yet</p>
            <p className="text-xs text-slate-400 font-medium">This developer hasn&apos;t added portfolio projects yet.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured */}
            {featured.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Featured Work</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {featured.map((p) => <PublicProjectCard key={p.id} project={p} />)}
                </div>
              </section>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <section>
                {featured.length > 0 && (
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-5">
                    More Projects
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {rest.map((p) => <PublicProjectCard key={p.id} project={p} />)}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Platform projects */}
        {developer.recentProjects.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-5">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Platform Projects
              </h2>
              <span className="ml-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black uppercase">Verified</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {developer.recentProjects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-slate-100"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{p.title}</p>
                    <p className={cn(
                      'text-[10px] font-bold uppercase',
                      p.status === 'COMPLETED' ? 'text-emerald-600' : 'text-slate-400'
                    )}>
                      {p.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PublicProjectCard({ project }: { project: PortfolioProject }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-white overflow-hidden hover:border-slate-200 hover:shadow-sm transition-all">
      {/* Cover */}
      <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden relative">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderOpen className="w-10 h-10 text-slate-300" />
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider">
            <Star className="w-3 h-3 fill-white" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-black text-slate-900 line-clamp-1">{project.title}</h3>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              title="View live"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 mb-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {project.techStack.slice(0, 6).map((tech) => (
            <span key={tech} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold">
              {tech}
            </span>
          ))}
          {project.techStack.length > 6 && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-400 text-[10px] font-bold">
              +{project.techStack.length - 6}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
