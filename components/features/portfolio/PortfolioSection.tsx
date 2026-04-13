'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Star, ExternalLink, AlertCircle, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import PortfolioProjectForm from './PortfolioProjectForm';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
}

export default function PortfolioSection() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PortfolioProject | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/developer/portfolio');
      // 404 means no developer profile yet — show empty state, not an error
      if (res.status === 404) {
        setProjects([]);
        return;
      }
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setProjects(data.projects);
    } catch {
      setError('Failed to load portfolio projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Omit<PortfolioProject, 'id' | 'displayOrder' | 'createdAt'>) => {
    if (editing) {
      const res = await fetch(`/api/developer/portfolio/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setProjects((prev) => prev.map((p) => (p.id === editing.id ? updated.project : p)));
      setEditing(null);
    } else {
      const res = await fetch('/api/developer/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, displayOrder: projects.length }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Create failed');
      }
      const created = await res.json();
      setProjects((prev) => [...prev, created.project]);
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/developer/portfolio/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Failed to delete project');
    } finally {
      setDeleting(null);
    }
  };

  const openEdit = (project: PortfolioProject) => {
    setEditing(project);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  return (
    <>
      {/* Form modal */}
      {showForm && (
        <PortfolioProjectForm
          initial={editing ? {
            id: editing.id,
            title: editing.title,
            description: editing.description,
            techStack: editing.techStack,
            liveUrl: editing.liveUrl ?? '',
            imageUrl: editing.imageUrl ?? '',
            featured: editing.featured,
          } : undefined}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Portfolio</p>
            <h2 className="text-lg font-black text-slate-900">
              Your Work
              {projects.length > 0 && (
                <span className="ml-2 text-sm font-bold text-slate-400">({projects.length}/12)</span>
              )}
            </h2>
          </div>
          {projects.length < 12 && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          )}
        </div>

        <div className="px-8 py-6">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-[1.5rem] border border-slate-100 overflow-hidden animate-pulse">
                  <div className="h-40 bg-slate-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-100 rounded-xl w-3/4" />
                    <div className="h-3 bg-slate-100 rounded-xl w-full" />
                    <div className="h-3 bg-slate-100 rounded-xl w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <FolderOpen className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-sm font-black text-slate-900 mb-1">No projects yet</p>
              <p className="text-xs text-slate-400 font-medium max-w-xs">
                Showcase your best work. Clients browse portfolios before sending proposals.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add your first project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={() => openEdit(project)}
                  onDelete={() => handleDelete(project.id)}
                  isDeleting={deleting === project.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
  isDeleting,
}: {
  project: PortfolioProject;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="group rounded-[1.5rem] border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-sm transition-all">
      {/* Cover image or placeholder */}
      <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderOpen className="w-10 h-10 text-slate-300" />
          </div>
        )}

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider">
            <Star className="w-3 h-3 fill-white" />
            Featured
          </div>
        )}

        {/* Action buttons — always visible on mobile, hover on desktop */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white shadow-sm transition-all"
            title="Edit project"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          {confirmDelete ? (
            <div className="flex gap-1">
              <button
                onClick={() => { setConfirmDelete(false); onDelete(); }}
                disabled={isDeleting}
                className="px-2.5 h-8 rounded-xl bg-red-500 text-white text-[10px] font-black hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? '…' : 'Delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:bg-white shadow-sm transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-white shadow-sm transition-all"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-1">{project.title}</h3>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              title="View live"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 mb-3">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1">
          {project.techStack.slice(0, 6).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold"
            >
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

// Need to import X for the confirm-delete inline button
function X({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}
