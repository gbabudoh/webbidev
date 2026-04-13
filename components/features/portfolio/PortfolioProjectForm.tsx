'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Plus, Globe, Star, AlertCircle, Upload, ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortfolioProject {
  id?: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  imageUrl: string;
  featured: boolean;
}

interface PortfolioProjectFormProps {
  initial?: PortfolioProject;
  onSave: (data: Omit<PortfolioProject, 'id'>) => Promise<void>;
  onClose: () => void;
}

const SUGGESTED_TECH = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Vue.js', 'Angular', 'Tailwind CSS',
  'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'GraphQL', 'REST API',
  'Python', 'Django', 'Flask', 'FastAPI', 'Go', 'PHP', 'Laravel', 'Ruby on Rails',
  'AWS', 'Vercel', 'Docker', 'Kubernetes', 'Figma', 'Stripe', 'Firebase', 'Supabase',
];

export default function PortfolioProjectForm({ initial, onSave, onClose }: PortfolioProjectFormProps) {
  const [form, setForm] = useState<Omit<PortfolioProject, 'id'>>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    techStack: initial?.techStack ?? [],
    liveUrl: initial?.liveUrl ?? '',
    imageUrl: initial?.imageUrl ?? '',
    featured: initial?.featured ?? false,
  });
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const techRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setErrors((p) => ({ ...p, imageUrl: '' }));
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'portfolio');

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setForm((p) => ({ ...p, imageUrl: data.url }));
    } catch (err) {
      setErrors((p) => ({ ...p, imageUrl: err instanceof Error ? err.message : 'Upload failed' }));
    } finally {
      setImageUploading(false);
      // reset so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Close on backdrop click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const filteredSuggestions = techInput.trim()
    ? SUGGESTED_TECH.filter(
        (t) =>
          t.toLowerCase().includes(techInput.toLowerCase()) &&
          !form.techStack.includes(t)
      )
    : SUGGESTED_TECH.filter((t) => !form.techStack.includes(t)).slice(0, 12);

  const addTech = (tech: string) => {
    const trimmed = tech.trim();
    if (!trimmed || form.techStack.includes(trimmed) || form.techStack.length >= 15) return;
    setForm((prev) => ({ ...prev, techStack: [...prev.techStack, trimmed] }));
    setTechInput('');
    setErrors((prev) => ({ ...prev, techStack: '' }));
  };

  const removeTech = (tech: string) => {
    setForm((prev) => ({ ...prev, techStack: prev.techStack.filter((t) => t !== tech) }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.length > 100) e.title = 'Max 100 characters';
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.length < 10) e.description = 'At least 10 characters';
    else if (form.description.length > 1000) e.description = 'Max 1000 characters';
    if (form.techStack.length === 0) e.techStack = 'Add at least one technology';
    if (form.liveUrl && !/^https?:\/\/.+/.test(form.liveUrl)) e.liveUrl = 'Must start with http:// or https://';
    if (form.imageUrl && !/^https?:\/\/.+/.test(form.imageUrl)) e.imageUrl = 'Must start with http:// or https://';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      setErrors({ submit: 'Failed to save. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const fieldBase =
    'w-full px-4 py-3 rounded-2xl bg-slate-50 border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all';
  const fieldNormal = 'border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5';
  const fieldError = 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-500/10';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 shrink-0">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
              {initial ? 'Edit' : 'Add'} Project
            </p>
            <h2 className="text-lg font-black text-slate-900">
              {initial ? 'Update portfolio project' : 'Add a portfolio project'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.submit}
            </div>
          )}

          {/* Title + Featured */}
          <div className="flex gap-3 items-start">
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Project Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  setForm((p) => ({ ...p, title: e.target.value }));
                  setErrors((p) => ({ ...p, title: '' }));
                }}
                placeholder="e.g. E-commerce Platform Redesign"
                maxLength={100}
                className={cn(fieldBase, errors.title ? fieldError : fieldNormal)}
              />
              {errors.title && <FieldError message={errors.title} />}
            </div>

            {/* Featured toggle */}
            <div className="pt-7 shrink-0">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, featured: !p.featured }))}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all',
                  form.featured
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                )}
                title="Mark as featured"
              >
                <Star className={cn('w-3.5 h-3.5', form.featured && 'fill-amber-500 text-amber-500')} />
                Featured
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => {
                setForm((p) => ({ ...p, description: e.target.value }));
                setErrors((p) => ({ ...p, description: '' }));
              }}
              placeholder="What did you build, what problem did it solve, what was your role?"
              rows={4}
              maxLength={1000}
              className={cn('resize-none', fieldBase, errors.description ? fieldError : fieldNormal)}
            />
            <div className="flex justify-between">
              {errors.description ? <FieldError message={errors.description} /> : <span />}
              <span className="text-[10px] text-slate-400 font-medium">{form.description.length}/1000</span>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Tech Stack <span className="text-red-400">*</span>
            </label>

            {/* Selected tags */}
            {form.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input */}
            {form.techStack.length < 15 && (
              <div className="relative">
                <input
                  ref={techRef}
                  type="text"
                  value={techInput}
                  onChange={(e) => { setTechInput(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); addTech(techInput); }
                    if (e.key === 'Escape') setShowSuggestions(false);
                  }}
                  placeholder="Type a technology and press Enter…"
                  className={cn(fieldBase, errors.techStack ? fieldError : fieldNormal)}
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1.5 bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
                    <div className="flex flex-wrap gap-1.5 p-3">
                      {filteredSuggestions.map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onMouseDown={() => addTech(tech)}
                          className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                        >
                          <Plus className="w-2.5 h-2.5 inline mr-0.5" />
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {errors.techStack && <FieldError message={errors.techStack} />}
          </div>

          {/* Links row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> Live URL
              </label>
              <input
                type="url"
                value={form.liveUrl}
                onChange={(e) => {
                  setForm((p) => ({ ...p, liveUrl: e.target.value }));
                  setErrors((p) => ({ ...p, liveUrl: '' }));
                }}
                placeholder="https://myproject.com"
                className={cn(fieldBase, errors.liveUrl ? fieldError : fieldNormal)}
              />
              {errors.liveUrl && <FieldError message={errors.liveUrl} />}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <ImageIcon className="w-3 h-3" /> Cover Image
              </label>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageUpload}
              />

              {form.imageUrl ? (
                /* Preview */
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-28">
                  <img
                    src={form.imageUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, imageUrl: '' }))}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold hover:bg-black/80 transition-colors"
                  >
                    <Upload className="w-3 h-3" /> Replace
                  </button>
                </div>
              ) : (
                /* Drop zone */
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  className={cn(
                    'w-full h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors disabled:opacity-60',
                    errors.imageUrl
                      ? 'border-red-300 bg-red-50'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                  )}
                >
                  {imageUploading ? (
                    <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 text-slate-400" />
                  )}
                  <span className="text-[10px] font-semibold text-slate-500">
                    {imageUploading ? 'Uploading…' : 'Click to upload (JPEG, PNG, WebP · max 5 MB)'}
                  </span>
                </button>
              )}

              {errors.imageUrl && <FieldError message={errors.imageUrl} />}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 shrink-0 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="portfolio-form"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-8 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              initial ? 'Update Project' : 'Add Project'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1 text-xs font-semibold text-red-500 mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}
