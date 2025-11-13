'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Textarea, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

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
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>Client Profile</CardTitle>
        <CardDescription>
          Update your profile information to help developers understand your needs better.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <Input
            label="Full Name"
            type="text"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
            disabled={isLoading}
            helperText="Your display name on the platform"
          />

          {/* Company */}
          <Input
            label="Company (Optional)"
            type="text"
            placeholder="Your company name"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            error={errors.company}
            disabled={isLoading}
            helperText="Your company or organization name"
          />

          {/* Location */}
          <Input
            label="Location (Optional)"
            type="text"
            placeholder="City, Country"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            error={errors.location}
            disabled={isLoading}
            helperText="Your location (e.g., 'New York, USA' or 'London, UK')"
          />

          {/* Bio */}
          <Textarea
            label="Bio (Optional)"
            placeholder="Tell developers about yourself and your projects..."
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            error={errors.bio}
            disabled={isLoading}
            rows={4}
            maxLength={500}
            helperText={`${formData.bio.length}/500 characters`}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {initialData ? 'Update Profile' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

