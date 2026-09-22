'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useCatalogStore } from '@/store/useCatalogStore';

export default function AddCategory() {
  const router = useRouter();
  const categories = useCatalogStore((s) => s.categories);
  const addCategory = useCatalogStore((s) => s.addCategory);

  const [form, setForm] = useState({ id: '', name: '', image: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = form.id.trim().toLowerCase().replace(/\s+/g, '-');

    if (categories.some((c) => c.id === id)) {
      setError('Category ID already exists');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await addCategory({
        id,
        name: form.name.trim(),
        image: form.image || 'https://placehold.co/800x600/070707/FF4D00?text=Category',
      });
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold uppercase text-white">Add Category</h1>
      </div>

      <form onSubmit={handleSubmit} className="card-dark max-w-lg space-y-5 p-8">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        <Field label="Category ID (slug)" required>
          <input
            className="input-field w-full !bg-void !text-white"
            value={form.id}
            onChange={(e) => set('id', e.target.value)}
            placeholder="e.g. old-box"
            required
          />
        </Field>

        <Field label="Display name" required>
          <input className="input-field w-full !bg-void !text-white" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </Field>

        <Field label="Image URL">
          <input className="input-field w-full !bg-void !text-white" value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://..." />
        </Field>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-blaze">{saving ? 'Saving…' : 'Add category'}</button>
          <button type="button" onClick={() => router.push('/admin/dashboard')} className="btn-outline !border-white/20 !text-white">Cancel</button>
        </div>
      </form>
    </AdminLayout>
  );
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/40">
        {label}{required && ' *'}
      </label>
      {children}
    </div>
  );
}
