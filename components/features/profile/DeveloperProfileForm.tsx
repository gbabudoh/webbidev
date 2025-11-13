'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Textarea, Button, Select, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

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
  { value: 'ACCESSIBILITY_A11Y', label: 'Accessibility (A11y)' },
  { value: 'NEXT_JS', label: 'Next.js' },
  { value: 'HTML_CSS', label: 'HTML/CSS' },
  // Backend
  { value: 'NODE_JS', label: 'Node.js' },
  { value: 'PYTHON_DJANGO', label: 'Python (Django)' },
  { value: 'PYTHON_FLASK', label: 'Python (Flask)' },
  { value: 'PHP_LARAVEL', label: 'PHP (Laravel)' },
  { value: 'RUBY_ON_RAILS', label: 'Ruby on Rails' },
  { value: 'GO', label: 'Go' },
  { value: 'POSTGRESQL', label: 'PostgreSQL' },
  { value: 'MYSQL', label: 'MySQL' },
  { value: 'MONGODB', label: 'MongoDB' },
  { value: 'AWS', label: 'AWS' },
  { value: 'AZURE', label: 'Azure' },
  { value: 'RESTFUL_APIS', label: 'RESTful APIs' },
  { value: 'GRAPHQL', label: 'GraphQL' },
  // UI/UX
  { value: 'FIGMA', label: 'Figma' },
  { value: 'SKETCH', label: 'Sketch' },
  { value: 'ADOBE_XD', label: 'Adobe XD' },
  { value: 'PROTOTYPING', label: 'Prototyping' },
  { value: 'USER_RESEARCH', label: 'User Research' },
  { value: 'WIREFRAMING', label: 'Wireframing' },
  { value: 'DESIGN_SYSTEMS', label: 'Design Systems' },
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
      newErrors.skills = 'You must select exactly 5 skills';
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
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>Developer Profile</CardTitle>
        <CardDescription>
          Complete your profile to start receiving project proposals. All fields are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Portfolio URL */}
          <Input
            label="Portfolio URL"
            type="url"
            placeholder="https://yourportfolio.com"
            value={formData.portfolioUrl}
            onChange={(e) => handleChange('portfolioUrl', e.target.value)}
            error={errors.portfolioUrl}
            required
            disabled={isLoading}
            helperText="Link to your portfolio website or GitHub profile"
          />

          {/* Bio Summary */}
          <Textarea
            label="Bio Summary"
            placeholder="Brief description of your capabilities and experience..."
            value={formData.bioSummary}
            onChange={(e) => handleChange('bioSummary', e.target.value)}
            error={errors.bioSummary}
            required
            disabled={isLoading}
            rows={4}
            maxLength={400}
            helperText={`${formData.bioSummary.length}/400 characters`}
          />

          {/* Location */}
          <Input
            label="Location"
            type="text"
            placeholder="City, Country"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            error={errors.location}
            required
            disabled={isLoading}
            helperText="Your location (e.g., 'New York, USA' or 'London, UK')"
          />

          {/* Time Zone (Optional) */}
          <Input
            label="Time Zone (Optional)"
            type="text"
            placeholder="UTC-5, EST, PST, etc."
            value={formData.timeZone}
            onChange={(e) => handleChange('timeZone', e.target.value)}
            disabled={isLoading}
            helperText="Your time zone for better collaboration"
          />

          {/* Skills Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select 5 Skills <span className="text-red-500">*</span>
            </label>
            {errors.skills && (
              <p className="mb-2 text-sm text-red-600 dark:text-red-400">{errors.skills}</p>
            )}
            <div className="rounded-lg border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
              <div className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                Selected: {formData.skills.length}/5
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SKILLS.map((skill) => {
                  const isSelected = formData.skills.includes(skill.value);
                  return (
                    <button
                      key={skill.value}
                      type="button"
                      onClick={() => handleSkillToggle(skill.value)}
                      disabled={isLoading || (!isSelected && formData.skills.length >= 5)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                        isSelected
                          ? 'bg-foreground text-background'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700',
                        (!isSelected && formData.skills.length >= 5) && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {skill.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {initialData ? 'Update Profile' : 'Create Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

