'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Input, Textarea, Button, Typography, Badge } from '@/components/ui';
import { Save, RotateCcw, CheckCircle, AlertCircle, Plus, Trash2, Layout, Type } from 'lucide-react';
import { getHeroData, updateHeroText, upsertFloatingAsset, deleteFloatingAsset } from '@/app/actions/hero';
import { cn } from '@/lib/utils';

interface HeroContent {
  badgeText: string;
  headingPart1: string;
  headingPart2: string;
  description: string;
}

interface FloatingAsset {
  id?: string;
  type: "IMAGE" | "ICON";
  src?: string;
  iconName?: string;
  alt?: string;
  color?: string;
  size: number;
  posX: string;
  posY: string;
  duration: number;
  isActive: boolean;
}

export default function AdminHeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [heroText, setHeroText] = useState<HeroContent>({
    badgeText: '',
    headingPart1: '',
    headingPart2: '',
    description: '',
  });

  const [assets, setAssets] = useState<FloatingAsset[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getHeroData();
      if (data.content) {
        setHeroText({
          badgeText: data.content.badgeText,
          headingPart1: data.content.headingPart1,
          headingPart2: data.content.headingPart2,
          description: data.content.description,
        });
      }
      setAssets(data.assets || []);
    } catch (err: any) {
      setError('Failed to fetch hero data');
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (field: string, value: string) => {
    setHeroText(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveText = async () => {
    setSaving(true);
    try {
      await updateHeroText(heroText);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save text');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAsset = () => {
    const newAsset: FloatingAsset = {
      type: 'ICON',
      iconName: 'Code2',
      color: '#F3C36C',
      size: 40,
      posX: '50%',
      posY: '50%',
      duration: 12,
      isActive: true,
    };
    setAssets(prev => [...prev, newAsset]);
  };

  const handleAssetChange = (index: number, field: keyof FloatingAsset, value: string | number | boolean) => {
    const newAssets = [...assets];
    newAssets[index] = { ...newAssets[index], [field]: value } as FloatingAsset;
    setAssets(newAssets);
  };

  const handleSaveAsset = async (index: number) => {
    setSaving(true);
    try {
      const asset = assets[index];
      await upsertFloatingAsset(asset);
      await fetchData();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save asset');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAsset = async (id: string | undefined, index: number) => {
    if (!id) {
      const newAssets = [...assets];
      newAssets.splice(index, 1);
      setAssets(newAssets);
      return;
    }
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      await deleteFloatingAsset(id);
      await fetchData();
    } catch (err) {
      setError('Failed to delete asset');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-zinc-500">Loading hero data...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div>
            <Typography variant="h1" size="2xl" weight="bold">Hero Content Manager</Typography>
            <Typography variant="p" color="muted">Manage landing page headlines and floating assets</Typography>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" onClick={fetchData} className="gap-2">
                <RotateCcw className="w-4 h-4" /> Reset
             </Button>
             <Button onClick={handleSaveText} disabled={saving} className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800">
                <Save className="w-4 h-4" /> Save Headlines
             </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 text-green-600 rounded-xl border border-green-100 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Changes saved successfully!
          </div>
        )}

        {/* Text Section */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-zinc-500" />
              <CardTitle>Main Headlines</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Badge Text"
              value={heroText.badgeText}
              onChange={(e) => handleTextChange('badgeText', e.target.value)}
              placeholder="e.g. The Next-Gen Developer Ecosystem"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Heading Part 1"
                value={heroText.headingPart1}
                onChange={(e) => handleTextChange('headingPart1', e.target.value)}
                placeholder="e.g. Think."
              />
              <Input
                label="Heading Part 2"
                value={heroText.headingPart2}
                onChange={(e) => handleTextChange('headingPart2', e.target.value)}
                placeholder="e.g. Build. Scale."
              />
            </div>
            <Textarea
              label="Description"
              value={heroText.description}
              onChange={(e) => handleTextChange('description', e.target.value)}
              rows={3}
              placeholder="Enter main hero description..."
            />
          </CardContent>
        </Card>

        {/* Assets Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-zinc-500" />
              <Typography variant="h3" weight="bold">Floating Assets</Typography>
            </div>
            <Button onClick={handleAddAsset} variant="outline" className="gap-2 border-zinc-300">
              <Plus className="w-4 h-4" /> Add Asset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map((asset, idx) => (
              <Card key={asset.id || `new-${idx}`} className="border-zinc-200 dark:border-zinc-800">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={asset.type === 'IMAGE' ? 'primary' : 'success'}>
                      {asset.type}
                    </Badge>
                    <button 
                      onClick={() => handleDeleteAsset(asset.id, idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Type</label>
                      <select 
                        className="w-full mt-1 p-2 rounded-lg border border-zinc-200 dark:bg-zinc-800 text-sm"
                        value={asset.type}
                        onChange={(e) => handleAssetChange(idx, 'type', e.target.value)}
                      >
                        <option value="ICON">Lucide Icon</option>
                        <option value="IMAGE">Image Logo</option>
                      </select>
                    </div>

                    {asset.type === 'ICON' ? (
                      <>
                        <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase">Icon Name</label>
                          <Input 
                            value={asset.iconName || ''}
                            onChange={(e) => handleAssetChange(idx, 'iconName', e.target.value)}
                            placeholder="e.g. Code2"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase">Color</label>
                          <Input 
                            type="color"
                            value={asset.color || '#000000'}
                            onChange={(e) => handleAssetChange(idx, 'color', e.target.value)}
                            className="h-9 p-1"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Image Path</label>
                        <Input 
                          value={asset.src || ''}
                          onChange={(e) => handleAssetChange(idx, 'src', e.target.value)}
                          placeholder="/images/logos/react.png"
                          className="h-9 text-sm"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase">Size (px)</label>
                      <Input 
                        type="number"
                        value={asset.size}
                        onChange={(e) => handleAssetChange(idx, 'size', parseInt(e.target.value))}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase">Duration (s)</label>
                      <Input 
                        type="number"
                        value={asset.duration}
                        onChange={(e) => handleAssetChange(idx, 'duration', parseInt(e.target.value))}
                        className="h-9 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase">X Position (%)</label>
                      <Input 
                        value={asset.posX}
                        onChange={(e) => handleAssetChange(idx, 'posX', e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase">Y Position (%)</label>
                      <Input 
                        value={asset.posY}
                        onChange={(e) => handleAssetChange(idx, 'posY', e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSaveAsset(idx)} 
                    disabled={saving}
                    className="w-full mt-2 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border-none"
                    size="sm"
                  >
                    Save Asset
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
