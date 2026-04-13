'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Typography, Badge, Button, Input, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  Layout, Plus, Trash2, Save, RotateCcw, CheckCircle, AlertCircle, GripVertical,
  Type, Star, Zap, Target, BarChart3, Users, Rocket, Eye, EyeOff
} from 'lucide-react';

interface SectionItem {
  id?: string;
  title: string;
  description?: string;
  iconName?: string;
  color?: string;
  value?: string;
  href?: string;
  sortOrder: number;
  isActive: boolean;
}

interface HomepageSection {
  id: string;
  sectionKey: string;
  title: string | null;
  subtitle: string | null;
  badgeText: string | null;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  items: SectionItem[];
}

const SECTION_DEFAULTS: Record<string, { label: string; icon: typeof Layout; color: string; description: string }> = {
  features: { label: 'Features Section', icon: Star, color: 'from-amber-500 to-orange-500', description: 'Feature cards displayed on the homepage' },
  howItWorks: { label: 'How It Works', icon: Zap, color: 'from-blue-500 to-cyan-500', description: 'Step-by-step process section' },
  stats: { label: 'Stats / Social Proof', icon: BarChart3, color: 'from-indigo-500 to-violet-500', description: 'Platform statistics and numbers' },
  devSection: { label: 'Developer Section', icon: Rocket, color: 'from-green-500 to-emerald-500', description: 'Developer CTA and engagement section' },
  clientSection: { label: 'Client Section', icon: Users, color: 'from-purple-500 to-pink-500', description: 'Client features and benefits' },
  finalCta: { label: 'Final CTA', icon: Target, color: 'from-rose-500 to-red-500', description: 'Bottom call-to-action section' },
};

export default function AdminContentPage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('features');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchSections(); }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/content/sections');
      if (res.ok) {
        const data = await res.json() as { sections: HomepageSection[] };
        setSections(data.sections || []);
        // Create missing sections locally
        const existingKeys = data.sections?.map((s: HomepageSection) => s.sectionKey) || [];
        const missing = Object.keys(SECTION_DEFAULTS).filter((k) => !existingKeys.includes(k));
        if (missing.length > 0) {
          const newSections = missing.map((key) => ({
            id: '',
            sectionKey: key,
            title: SECTION_DEFAULTS[key].label,
            subtitle: null,
            badgeText: null,
            description: null,
            isActive: true,
            sortOrder: 0,
            items: [] as SectionItem[],
          }));
          setSections((prev) => [...prev, ...newSections]);
        }
      }
    } catch (err) {
      console.error('Fetch sections error:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentSection = sections.find((s) => s.sectionKey === activeTab);

  const updateSection = (field: keyof HomepageSection, value: string | boolean | number | null) => {
    setSections((prev) =>
      prev.map((s) => (s.sectionKey === activeTab ? { ...s, [field]: value } : s))
    );
  };

  const addItem = () => {
    setSections((prev) =>
      prev.map((s) =>
        s.sectionKey === activeTab
          ? {
              ...s,
              items: [
                ...s.items,
                { title: 'New Item', description: '', iconName: 'Star', color: '#3B82F6', sortOrder: s.items.length, isActive: true },
              ],
            }
          : s
      )
    );
  };

  const updateItem = (index: number, field: keyof SectionItem, value: string | boolean | number | null) => {
    setSections((prev) =>
      prev.map((s) =>
        s.sectionKey === activeTab
          ? { ...s, items: s.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)) }
          : s
      )
    );
  };

  const removeItem = (index: number) => {
    setSections((prev) =>
      prev.map((s) =>
        s.sectionKey === activeTab ? { ...s, items: s.items.filter((_, i) => i !== index) } : s
      )
    );
  };

  const handleSave = async () => {
    if (!currentSection) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (currentSection.id) {
        // Update existing
        const res = await fetch(`/api/admin/content/sections/${currentSection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentSection),
        });
        if (!res.ok) throw new Error('Failed to update section');
      } else {
        // Create new
        const res = await fetch('/api/admin/content/sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentSection),
        });
        if (!res.ok) throw new Error('Failed to create section');
        const data = await res.json();
        // If we also have items, update them
        if (currentSection.items.length > 0 && data.section?.id) {
          await fetch(`/api/admin/content/sections/${data.section.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...currentSection, items: currentSection.items }),
          });
        }
      }
      setSuccess('Section saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchSections();
    } catch (err) {
      console.error('Save section error:', err);
      setError('Failed to save section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-100 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl" />
          <div className="relative flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Layout className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h1" size="3xl" weight="bold" className="mb-2">Homepage Content Manager</Typography>
              <Typography variant="p" size="lg" color="muted">Manage all sections of the homepage dynamically</Typography>
            </div>
          </div>
        </div>

        {success && (
          <div className="p-4 bg-green-50 text-green-600 rounded-xl border border-green-100 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> {success}
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Section Tabs */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Sections</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {Object.entries(SECTION_DEFAULTS).map(([key, cfg]) => {
                    const section = sections.find((s) => s.sectionKey === key);
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm',
                          activeTab === key
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 truncate font-medium">{cfg.label}</span>
                        {section?.isActive ? (
                          <Eye className="w-3 h-3 text-green-400" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section Editor */}
          <div className="lg:col-span-3 space-y-6">
            {currentSection && (
              <>
                {/* Section Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {(() => { const Ic = SECTION_DEFAULTS[activeTab]?.icon || Layout; return <Ic className="w-5 h-5" />; })()}
                        <CardTitle>{SECTION_DEFAULTS[activeTab]?.label || activeTab}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={fetchSections} className="gap-1">
                          <RotateCcw className="w-3.5 h-3.5" />Reset
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSave} disabled={saving} className="gap-1">
                          <Save className="w-3.5 h-3.5" />{saving ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentSection.isActive}
                          onChange={(e) => updateSection('isActive', e.target.checked)}
                          className="rounded border-slate-300"
                        />
                        <Typography variant="p" size="sm" weight="medium">Active</Typography>
                      </label>
                    </div>
                    <Input label="Section Title" value={currentSection.title || ''} onChange={(e) => updateSection('title', e.target.value)} placeholder="Section title..." />
                    <Input label="Subtitle" value={currentSection.subtitle || ''} onChange={(e) => updateSection('subtitle', e.target.value)} placeholder="Optional subtitle..." />
                    <Input label="Badge Text" value={currentSection.badgeText || ''} onChange={(e) => updateSection('badgeText', e.target.value)} placeholder="Optional badge label..." />
                    <Textarea label="Description" value={currentSection.description || ''} onChange={(e) => updateSection('description', e.target.value)} rows={3} placeholder="Section description..." />
                  </CardContent>
                </Card>

                {/* Section Items */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Items ({currentSection.items.length})</CardTitle>
                      <Button variant="outline" size="sm" onClick={addItem} className="gap-1">
                        <Plus className="w-3.5 h-3.5" />Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {currentSection.items.length === 0 ? (
                      <div className="text-center py-8">
                        <Type className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <Typography variant="p" color="muted">No items yet. Add items to this section.</Typography>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {currentSection.items.map((item, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-slate-400" />
                                <Badge variant="secondary" size="sm">#{idx + 1}</Badge>
                              </div>
                              <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input label="Title" value={item.title} onChange={(e) => updateItem(idx, 'title', e.target.value)} className="text-sm" />
                              <Input label="Icon Name" value={item.iconName || ''} onChange={(e) => updateItem(idx, 'iconName', e.target.value)} placeholder="e.g. Star, Zap" className="text-sm" />
                              <div className="col-span-2">
                                <Textarea label="Description" value={item.description || ''} onChange={(e) => updateItem(idx, 'description', e.target.value)} rows={2} className="text-sm" />
                              </div>
                              <Input label="Value" value={item.value || ''} onChange={(e) => updateItem(idx, 'value', e.target.value)} placeholder="e.g. 500+" className="text-sm" />
                              <Input label="Color" value={item.color || ''} onChange={(e) => updateItem(idx, 'color', e.target.value)} placeholder="e.g. #3B82F6" className="text-sm" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
