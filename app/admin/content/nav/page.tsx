'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, Typography, Button, Input } from '@/components/ui';
import { Menu, Plus, Trash2, Save, GripVertical, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface NavItem {
  id?: string;
  label: string;
  href: string;
  location: string;
  group: string | null;
  sortOrder: number;
  isActive: boolean;
  isExternal: boolean;
}

export default function AdminNavPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/content/navigation');
      if (res.ok) {
        const data = await res.json() as { items: NavItem[] };
        setItems((data.items || []).filter((i: NavItem) => i.location === 'header'));
      }
    } catch (err) {
      console.error('Fetch nav items error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems((prev) => [...prev, { label: '', href: '/', location: 'header', group: null, sortOrder: prev.length, isActive: true, isExternal: false }]);
  };

  const updateItem = (index: number, field: keyof NavItem, value: string | boolean | number | null) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const removeItem = async (index: number) => {
    const item = items[index];
    if (item.id) {
      try {
        await fetch(`/api/admin/content/navigation?id=${item.id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Delete nav item error:', err);
      }
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const saveItem = async (index: number) => {
    const item = items[index];
    if (!item.label || !item.href) { setError('Label and URL are required'); return; }
    setSaving(true);
    setError('');

    try {
      const method = item.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/content/navigation', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, sortOrder: index }),
      });
      if (res.ok) {
        setSuccess('Saved!');
        setTimeout(() => setSuccess(''), 2000);
        fetchItems();
      }
    } catch (err) {
      console.error('Save nav item error:', err);
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-16">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/admin/content">
          <Button variant="ghost" size="sm" className="gap-2 mb-2">
            <ArrowLeft className="w-4 h-4" />Back to Content
          </Button>
        </Link>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 border border-blue-100 p-8">
          <div className="relative flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Menu className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h1" size="3xl" weight="bold" className="mb-2">Navigation Manager</Typography>
              <Typography variant="p" size="lg" color="muted">Manage header navigation links</Typography>
            </div>
          </div>
        </div>

        {success && (
          <div className="p-3 bg-green-50 text-green-600 rounded-xl border border-green-100 flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4" />{success}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />{error}
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={addItem} className="gap-2">
            <Plus className="w-4 h-4" />Add Link
          </Button>
        </div>

        <div className="space-y-3">
          {items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Menu className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <Typography variant="p" color="muted">No navigation links. Add some to get started.</Typography>
              </CardContent>
            </Card>
          ) : (
            items.map((item, idx) => (
              <Card key={item.id || idx} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <GripVertical className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0 cursor-move" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input label="Label" value={item.label} onChange={(e) => updateItem(idx, 'label', e.target.value)} placeholder="Link text" />
                      <Input label="URL" value={item.href} onChange={(e) => updateItem(idx, 'href', e.target.value)} placeholder="/page" />
                      <div className="flex items-end gap-2">
                        <label className="flex items-center gap-2 cursor-pointer pb-2">
                          <input type="checkbox" checked={item.isActive} onChange={(e) => updateItem(idx, 'isActive', e.target.checked)} className="rounded" />
                          <span className="text-sm">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer pb-2">
                          <input type="checkbox" checked={item.isExternal} onChange={(e) => updateItem(idx, 'isExternal', e.target.checked)} className="rounded" />
                          <span className="text-sm">External</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="primary" size="sm" onClick={() => saveItem(idx)} disabled={saving}>
                        <Save className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => removeItem(idx)} className="text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
