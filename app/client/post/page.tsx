'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  FileText,
  Target,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  DollarSign,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface Milestone {
  title: string;
  definitionOfDone: string;
  paymentPercentage: number;
  order: number;
}

type SkillType = 'Frontend' | 'Backend' | 'Fullstack' | 'UI/UX';

const SKILL_OPTIONS: { value: SkillType; label: string }[] = [
  { value: 'Frontend',  label: 'Frontend Development' },
  { value: 'Backend',   label: 'Backend Development' },
  { value: 'Fullstack', label: 'Fullstack Development' },
  { value: 'UI/UX',     label: 'UI/UX Design' },
];

const INPUT_BASE =
  'w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all disabled:opacity-50';

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{children}</p>
  );
}

export default function PostProjectPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title:       '',
    description: '',
    budget:      '',
    deadline:    '',
    skillType:   'Frontend' as SkillType,
  });

  const [milestones, setMilestones] = useState<Milestone[]>([
    { title: '', definitionOfDone: '', paymentPercentage: 33.33, order: 1 },
    { title: '', definitionOfDone: '', paymentPercentage: 33.33, order: 2 },
    { title: '', definitionOfDone: '', paymentPercentage: 33.34, order: 3 },
  ]);

  const [error,     setError]     = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string | number) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
    setError('');
  };

  const addMilestone = () => {
    if (milestones.length >= 5) { setError('Maximum 5 milestones allowed'); return; }
    const remaining = 100 - calculateTotal();
    setMilestones([...milestones, { title: '', definitionOfDone: '', paymentPercentage: remaining > 0 ? remaining : 0, order: milestones.length + 1 }]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length <= 3) { setError('At least 3 milestones are required'); return; }
    const removedPct = milestones[index].paymentPercentage;
    const updated    = milestones.filter((_, i) => i !== index).map((m, i) => ({ ...m, order: i + 1 }));
    if (updated.length > 0) updated[0].paymentPercentage += removedPct;
    setMilestones(updated);
  };

  const calculateTotal = () => milestones.reduce((s, m) => s + (m.paymentPercentage || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim())                          { setError('Project title is required'); return; }
    if (!formData.description.trim())                    { setError('Project description is required'); return; }
    if (!formData.budget || parseFloat(formData.budget) <= 0) { setError('Valid budget is required'); return; }
    if (!formData.deadline)                              { setError('Deadline is required'); return; }

    const total = calculateTotal();
    if (Math.abs(total - 100) > 0.01) {
      setError(`Milestone percentages must sum to 100% (currently ${total.toFixed(2)}%)`);
      return;
    }

    for (let i = 0; i < milestones.length; i++) {
      if (!milestones[i].title.trim())           { setError(`Milestone ${i + 1} title is required`); return; }
      if (!milestones[i].definitionOfDone.trim()) { setError(`Milestone ${i + 1} definition of done is required`); return; }
      if (milestones[i].paymentPercentage <= 0)  { setError(`Milestone ${i + 1} percentage must be greater than 0`); return; }
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/project', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          title:       formData.title,
          description: formData.description,
          budget:      parseFloat(formData.budget),
          deadline:    new Date(formData.deadline).toISOString(),
          skillType:   formData.skillType,
          milestones:  milestones.map(m => ({
            title:             m.title,
            definitionOfDone:  m.definitionOfDone,
            paymentPercentage: m.paymentPercentage,
            order:             m.order,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to create project'); setIsLoading(false); return; }
      router.push(`/client/projects/${data.project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const total            = calculateTotal();
  const isValidTotal     = Math.abs(total - 100) < 0.01;
  const budgetNum        = parseFloat(formData.budget) || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">

      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
        <button onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </motion.div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#C0C0C0] via-[#DCDCDC] to-[#F0F0F0] p-8 md:p-12 shadow-2xl shadow-slate-400/20 border border-white/40"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-400/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
        </div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-white/80 flex items-center justify-center shadow-sm shrink-0">
            <FileText className="w-8 h-8 text-slate-600" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Post a Project</h1>
            <p className="text-sm text-slate-600 mt-1">Define your scope with clear milestones and find the perfect developer.</p>
          </div>
        </div>
      </motion.header>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm font-medium text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Project Details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step 1</p>
              <h2 className="text-lg font-black text-slate-900">Project Details</h2>
            </div>
          </div>

          <div className="px-8 py-7 space-y-6">
            <div>
              <Label>Project Title</Label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Build a React E-commerce Website"
                value={formData.title}
                onChange={handleChange}
                disabled={isLoading}
                className={INPUT_BASE}
              />
            </div>

            <div>
              <Label>Project Description</Label>
              <textarea
                name="description"
                placeholder="Describe your project in detail — key features, technical requirements, and any specific preferences..."
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
                rows={5}
                className={cn(INPUT_BASE, 'resize-none')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Budget ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="number"
                    name="budget"
                    placeholder="5000.00"
                    value={formData.budget}
                    onChange={handleChange}
                    disabled={isLoading}
                    min="0"
                    step="0.01"
                    className={cn(INPUT_BASE, 'pl-9')}
                  />
                </div>
              </div>

              <div>
                <Label>Deadline</Label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    disabled={isLoading}
                    min={new Date().toISOString().split('T')[0]}
                    className={cn(INPUT_BASE, 'pl-9')}
                  />
                </div>
              </div>

              <div>
                <Label>Skill Type</Label>
                <div className="relative">
                  <select
                    name="skillType"
                    value={formData.skillType}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={cn(INPUT_BASE, 'appearance-none pr-9 cursor-pointer')}
                  >
                    {SKILL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step 2</p>
                <h2 className="text-lg font-black text-slate-900">Scope Bar Milestones</h2>
              </div>
            </div>
            <button
              type="button"
              onClick={addMilestone}
              disabled={isLoading || milestones.length >= 5}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <Plus className="w-4 h-4" /> Add Milestone
            </button>
          </div>

          <div className="px-8 py-7 space-y-4">
            <p className="text-xs text-slate-500 font-medium -mt-2 mb-2">
              Break down your project into 3–5 measurable milestones. Percentages must total 100%.
            </p>

            {milestones.map((ms, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden"
              >
                {/* Milestone header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                      {index + 1}
                    </div>
                    <p className="font-black text-sm text-slate-900">Milestone {index + 1}</p>
                  </div>
                  {milestones.length > 3 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                {/* Milestone fields */}
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <Label>Milestone Title</Label>
                    <input
                      type="text"
                      placeholder="e.g., User Authentication System"
                      value={ms.title}
                      onChange={e => handleMilestoneChange(index, 'title', e.target.value)}
                      disabled={isLoading}
                      className={INPUT_BASE}
                    />
                  </div>

                  <div>
                    <Label>Definition of Done</Label>
                    <textarea
                      placeholder="Objective, measurable criteria for completion (e.g., 'All login tests pass with 100% coverage')"
                      value={ms.definitionOfDone}
                      onChange={e => handleMilestoneChange(index, 'definitionOfDone', e.target.value)}
                      disabled={isLoading}
                      rows={3}
                      className={cn(INPUT_BASE, 'resize-none')}
                    />
                  </div>

                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <Label>Payment Percentage (%)</Label>
                      <input
                        type="number"
                        placeholder="33.33"
                        value={ms.paymentPercentage || ''}
                        onChange={e => handleMilestoneChange(index, 'paymentPercentage', parseFloat(e.target.value) || 0)}
                        disabled={isLoading}
                        min="0"
                        max="100"
                        step="0.01"
                        className={INPUT_BASE}
                      />
                    </div>
                    {budgetNum > 0 && (
                      <div className="pb-1 shrink-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                        <p className="text-sm font-black text-slate-900">
                          ${((budgetNum * (ms.paymentPercentage || 0)) / 100).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Percentage total */}
            <div className={cn(
              'flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-colors',
              isValidTotal
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
            )}>
              <div className="flex items-center gap-2">
                {isValidTotal
                  ? <CheckCircle className="w-5 h-5 text-emerald-600" />
                  : <AlertCircle className="w-5 h-5 text-amber-600" />
                }
                <p className={cn('text-sm font-bold', isValidTotal ? 'text-emerald-700' : 'text-amber-700')}>
                  {isValidTotal ? 'Percentages sum to 100% — ready to submit' : 'Milestone percentages must sum to exactly 100%'}
                </p>
              </div>
              <p className={cn('text-2xl font-black', isValidTotal ? 'text-emerald-700' : 'text-amber-700')}>
                {total.toFixed(2)}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* Review info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100"
        >
          <Layers className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Your project will be created as a <span className="font-bold text-slate-700">Draft</span> and only visible to developers once you publish it. You can review and edit all details before publishing from your Projects page.
          </p>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !isValidTotal}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:pointer-events-none shadow-xl shadow-slate-900/10"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating Project…</>
            ) : (
              <><FileText className="w-4 h-4" /> Create Project</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
