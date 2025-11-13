'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Typography, Button, Input, Textarea, Select } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Milestone {
  title: string;
  definitionOfDone: string;
  paymentPercentage: number;
  order: number;
}

type SkillType = 'Frontend' | 'Backend' | 'Fullstack' | 'UI/UX';

export default function PostProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const developerId = searchParams.get('developerId');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    skillType: 'Frontend' as SkillType,
  });

  const [milestones, setMilestones] = useState<Milestone[]>([
    { title: '', definitionOfDone: '', paymentPercentage: 33.33, order: 1 },
    { title: '', definitionOfDone: '', paymentPercentage: 33.33, order: 2 },
    { title: '', definitionOfDone: '', paymentPercentage: 33.34, order: 3 },
  ]);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string | number) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
    setError('');
  };

  const addMilestone = () => {
    if (milestones.length >= 5) {
      setError('Maximum 5 milestones allowed');
      return;
    }
    const currentTotal = calculateTotalPercentage();
    const remaining = 100 - currentTotal;
    const newPercentage = remaining > 0 ? remaining : 0;
    
    setMilestones([
      ...milestones,
      { title: '', definitionOfDone: '', paymentPercentage: newPercentage, order: milestones.length + 1 },
    ]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length <= 3) {
      setError('At least 3 milestones are required');
      return;
    }
    const removedPercentage = milestones[index].paymentPercentage;
    const updated = milestones.filter((_, i) => i !== index);
    updated.forEach((m, i) => {
      m.order = i + 1;
    });
    if (updated.length > 0) {
      updated[0].paymentPercentage += removedPercentage;
    }
    setMilestones(updated);
  };

  const calculateTotalPercentage = () => {
    return milestones.reduce((sum, m) => sum + (m.paymentPercentage || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Project description is required');
      return;
    }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      setError('Valid budget is required');
      return;
    }

    if (!formData.deadline) {
      setError('Deadline is required');
      return;
    }

    const totalPercentage = calculateTotalPercentage();
    if (Math.abs(totalPercentage - 100) > 0.01) {
      setError(`Milestone percentages must sum to 100% (currently ${totalPercentage.toFixed(2)}%)`);
      return;
    }

    for (let i = 0; i < milestones.length; i++) {
      const m = milestones[i];
      if (!m.title.trim()) {
        setError(`Milestone ${i + 1} title is required`);
        return;
      }
      if (!m.definitionOfDone.trim()) {
        setError(`Milestone ${i + 1} definition of done is required`);
        return;
      }
      if (m.paymentPercentage <= 0 || m.paymentPercentage > 100) {
        setError(`Milestone ${i + 1} payment percentage must be between 0 and 100`);
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          budget: parseFloat(formData.budget),
          deadline: new Date(formData.deadline).toISOString(),
          skillType: formData.skillType,
          milestones: milestones.map((m) => ({
            title: m.title,
            definitionOfDone: m.definitionOfDone,
            paymentPercentage: m.paymentPercentage,
            order: m.order,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create project');
        setIsLoading(false);
        return;
      }

      router.push(`/client/projects/${data.project.id}`);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const totalPercentage = calculateTotalPercentage();
  const isValidPercentage = Math.abs(totalPercentage - 100) < 0.01;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
              Post a New Project
            </Typography>
            <Typography variant="p" size="lg" color="muted">
              Create a project with clear milestones and find the perfect developer
            </Typography>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Project Details */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <CardTitle>Project Details</CardTitle>
                  <Typography variant="p" size="sm" color="muted">
                    Describe your project requirements
                  </Typography>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Project Title"
                type="text"
                name="title"
                placeholder="e.g., Build a React E-commerce Website"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isLoading}
              />

              <Textarea
                label="Project Description"
                name="description"
                placeholder="Describe your project in detail, including key features, technical requirements, and any specific preferences..."
                value={formData.description}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows={6}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Budget ($)"
                  type="number"
                  name="budget"
                  placeholder="5000.00"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  min="0"
                  step="0.01"
                />

                <Input
                  label="Deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  min={new Date().toISOString().split('T')[0]}
                />

                <Select
                  label="Skill Type"
                  name="skillType"
                  value={formData.skillType}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  options={[
                    { value: 'Frontend', label: 'Frontend Development' },
                    { value: 'Backend', label: 'Backend Development' },
                    { value: 'Fullstack', label: 'Fullstack Development' },
                    { value: 'UI/UX', label: 'UI/UX Design' },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Milestones (Scope Bar) */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle>Scope Bar Milestones</CardTitle>
                    <Typography variant="p" size="sm" color="muted">
                      Break down your project into 3-5 measurable milestones
                    </Typography>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMilestone}
                  disabled={isLoading || milestones.length >= 5}
                  className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Milestone
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.map((milestone, index) => (
                <Card key={index} className="border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
                  <CardHeader className="bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {index + 1}
                        </div>
                        <CardTitle size="md">Milestone {index + 1}</CardTitle>
                      </div>
                      {milestones.length > 3 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMilestone(index)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <Input
                      label="Milestone Title"
                      type="text"
                      placeholder="e.g., User Authentication System"
                      value={milestone.title}
                      onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                      required
                      disabled={isLoading}
                    />

                    <Textarea
                      label="Definition of Done"
                      placeholder="Be specific and measurable (e.g., 'All login tests pass with 100% coverage', 'API endpoints return proper status codes', 'UI matches Figma designs')"
                      value={milestone.definitionOfDone}
                      onChange={(e) => handleMilestoneChange(index, 'definitionOfDone', e.target.value)}
                      required
                      disabled={isLoading}
                      rows={3}
                      helperText="Objective, measurable criteria for completion"
                    />

                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <Input
                          label="Payment Percentage (%)"
                          type="number"
                          placeholder="33.33"
                          value={milestone.paymentPercentage || ''}
                          onChange={(e) =>
                            handleMilestoneChange(index, 'paymentPercentage', parseFloat(e.target.value) || 0)
                          }
                          required
                          disabled={isLoading}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                      <div className="pb-2">
                        <Typography variant="p" size="sm" color="muted">
                          = ${formData.budget ? ((parseFloat(formData.budget) * (milestone.paymentPercentage || 0)) / 100).toFixed(2) : '0.00'}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Total Percentage Display */}
              <Card className={cn(
                "border-2 transition-colors",
                isValidPercentage 
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20" 
                  : "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20"
              )}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isValidPercentage ? (
                        <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                      <Typography variant="p" size="sm" weight="semibold">
                        Total Payment Percentage:
                      </Typography>
                    </div>
                    <Typography
                      variant="h3"
                      size="2xl"
                      weight="bold"
                      className={cn(
                        isValidPercentage
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-orange-600 dark:text-orange-400'
                      )}
                    >
                      {totalPercentage.toFixed(2)}%
                    </Typography>
                  </div>
                  {!isValidPercentage && (
                    <Typography variant="p" size="xs" color="muted" className="mt-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Milestone percentages must sum to exactly 100%
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              isLoading={isLoading}
              disabled={isLoading || !isValidPercentage}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Project...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Project
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
