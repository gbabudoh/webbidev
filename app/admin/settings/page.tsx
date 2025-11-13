'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Textarea, Button, Typography, Badge, Select } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Settings, DollarSign, Users, Wrench, FileText, Save, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

interface PlatformSettings {
  id: string;
  commissionRate: number;
  platformName: string;
  platformTagline: string | null;
  registrationEnabled: boolean;
  developerRegistrationEnabled: boolean;
  clientRegistrationEnabled: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  notes: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    commissionRate: 0.13,
    platformName: 'Webbidev',
    platformTagline: 'Guaranteed Scope. Simplified Development.',
    registrationEnabled: true,
    developerRegistrationEnabled: true,
    clientRegistrationEnabled: true,
    maintenanceMode: false,
    maintenanceMessage: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      setSettings(data.settings);
      
      // Populate form with current settings
      setFormData({
        commissionRate: data.settings.commissionRate || 0.13,
        platformName: data.settings.platformName || 'Webbidev',
        platformTagline: data.settings.platformTagline || 'Guaranteed Scope. Simplified Development.',
        registrationEnabled: data.settings.registrationEnabled ?? true,
        developerRegistrationEnabled: data.settings.developerRegistrationEnabled ?? true,
        clientRegistrationEnabled: data.settings.clientRegistrationEnabled ?? true,
        maintenanceMode: data.settings.maintenanceMode ?? false,
        maintenanceMessage: data.settings.maintenanceMessage || '',
        notes: data.settings.notes || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (formData.commissionRate < 0.10 || formData.commissionRate > 0.13) {
      newErrors.commissionRate = 'Commission rate must be between 10% (0.10) and 13% (0.13)';
    }

    if (!formData.platformName.trim()) {
      newErrors.platformName = 'Platform name is required';
    } else if (formData.platformName.length > 200) {
      newErrors.platformName = 'Platform name must be 200 characters or less';
    }

    if (formData.platformTagline && formData.platformTagline.length > 200) {
      newErrors.platformTagline = 'Platform tagline must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setError('Please fix the errors before saving');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commissionRate: formData.commissionRate,
          platformName: formData.platformName.trim(),
          platformTagline: formData.platformTagline.trim() || null,
          registrationEnabled: formData.registrationEnabled,
          developerRegistrationEnabled: formData.developerRegistrationEnabled,
          clientRegistrationEnabled: formData.clientRegistrationEnabled,
          maintenanceMode: formData.maintenanceMode,
          maintenanceMessage: formData.maintenanceMessage.trim() || null,
          notes: formData.notes.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      const data = await response.json();
      setSettings(data.settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center animate-pulse">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <Typography variant="p" size="lg" color="muted">
              Loading settings...
            </Typography>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 border border-purple-100 dark:border-purple-900/50 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />
          
          <div className="relative flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
                Platform Settings
              </Typography>
              <Typography variant="p" size="lg" color="muted">
                Manage platform configuration, features, and system preferences
              </Typography>
              {settings && (
                <Typography variant="p" size="sm" color="muted" className="mt-2">
                  Last updated: {new Date(settings.updatedAt).toLocaleString()}
                </Typography>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <Typography variant="p" className="text-red-600 dark:text-red-400">
                {error}
              </Typography>
            </div>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <Typography variant="p" className="text-green-600 dark:text-green-400">
                Settings saved successfully!
              </Typography>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Platform Configuration */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Typography variant="h3" size="lg" weight="semibold">
                    Platform Configuration
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    Configure platform name, tagline, and commission rate
                  </Typography>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Platform Name"
                type="text"
                placeholder="Webbidev"
                value={formData.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                error={errors.platformName}
                required
                disabled={saving}
              />

              <Input
                label="Platform Tagline"
                type="text"
                placeholder="Guaranteed Scope. Simplified Development."
                value={formData.platformTagline}
                onChange={(e) => handleChange('platformTagline', e.target.value)}
                error={errors.platformTagline}
                disabled={saving}
              />

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-zinc-500" />
                  Commission Rate
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    step="0.01"
                    min="0.10"
                    max="0.13"
                    placeholder="0.13"
                    value={formData.commissionRate}
                    onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value) || 0.13)}
                    error={errors.commissionRate}
                    required
                    disabled={saving}
                    className="w-32"
                  />
                  <div className="px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                    <Typography variant="p" weight="semibold" className="text-purple-700 dark:text-purple-400">
                      {((formData.commissionRate || 0) * 100).toFixed(1)}%
                    </Typography>
                  </div>
                </div>
                {errors.commissionRate && (
                  <Typography variant="p" size="sm" className="text-red-600 dark:text-red-400 mt-1">
                    {errors.commissionRate}
                  </Typography>
                )}
                <Typography variant="p" size="sm" color="muted" className="mt-1">
                  Must be between 10% (0.10) and 13% (0.13)
                </Typography>
              </div>
            </div>
          </div>

          {/* Registration Settings */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Typography variant="h3" size="lg" weight="semibold">
                    Registration Settings
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    Control who can register on the platform
                  </Typography>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <div>
                  <Typography variant="p" weight="semibold">
                    Enable Registration
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    Allow new users to register
                  </Typography>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.registrationEnabled}
                    onChange={(e) => handleChange('registrationEnabled', e.target.checked)}
                    disabled={saving}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <div>
                  <Typography variant="p" weight="semibold">
                    Developer Registration
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    Allow developers to register
                  </Typography>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.developerRegistrationEnabled}
                    onChange={(e) => handleChange('developerRegistrationEnabled', e.target.checked)}
                    disabled={saving || !formData.registrationEnabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <div>
                  <Typography variant="p" weight="semibold">
                    Client Registration
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    Allow clients to register
                  </Typography>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.clientRegistrationEnabled}
                    onChange={(e) => handleChange('clientRegistrationEnabled', e.target.checked)}
                    disabled={saving || !formData.registrationEnabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-cyan-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Typography variant="h3" size="lg" weight="semibold">
                    Maintenance Mode
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    Put the platform in maintenance mode
                  </Typography>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <div>
                  <Typography variant="p" weight="semibold">
                    Enable Maintenance Mode
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    Temporarily disable the platform for maintenance
                  </Typography>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                    disabled={saving}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-red-600"></div>
                </label>
              </div>

              {formData.maintenanceMode && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                  <Textarea
                    label="Maintenance Message"
                    placeholder="The platform is currently under maintenance. We'll be back soon!"
                    value={formData.maintenanceMessage}
                    onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
                    disabled={saving}
                    rows={4}
                    helperText="This message will be displayed to users during maintenance"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-700 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Typography variant="h3" size="lg" weight="semibold">
                    Admin Notes
                  </Typography>
                  <Typography variant="p" size="sm" color="muted">
                    Internal notes for platform management
                  </Typography>
                </div>
              </div>
            </div>
            <div className="p-6">
              <Textarea
                label="Notes"
                placeholder="Internal notes about platform settings..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                disabled={saving}
                rows={6}
                helperText="These notes are only visible to admins"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="p" weight="semibold" className="mb-1">
                  Save Changes
                </Typography>
                <Typography variant="p" size="sm" color="muted">
                  Apply your configuration changes to the platform
                </Typography>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchSettings()}
                  disabled={saving}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={saving}
                  disabled={saving}
                  className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

