'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { useCatalogStore } from '@/store/useCatalogStore';
import { plyOptions } from '@/data/products';

const emptyForm = {
  id: '',
  name: '',
  category: '',
  price: '',
  stock: '',
  dimensions: '',
  material: '',
  ply: 'N/A',
  condition: 'New',
  description: '',
  imageUrl: '',
  customizable: false,
  bulkTier1Qty: '',
  bulkTier1Price: '',
  bulkTier2Qty: '',
  bulkTier2Price: '',
};

export default function AddProduct() {
  const { id: editId } = useParams();
  const router = useRouter();
  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const addProduct = useCatalogStore((s) => s.addProduct);
  const updateProduct = useCatalogStore((s) => s.updateProduct);
  const fetchCatalog = useCatalogStore((s) => s.fetchCatalog);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (products.length === 0) fetchCatalog();
  }, [products.length, fetchCatalog]);

  const existing = editId ? products.find((p) => p.id === editId) : null;

  const [form, setForm] = useState(() => {
    if (!existing) return { ...emptyForm, category: categories[0]?.id || '' };
    const tiers = existing.bulkPricing || [];
    return {
      id: existing.id,
      name: existing.name,
      category: existing.category,
      price: String(existing.price),
      stock: String(existing.stock),
      dimensions: existing.dimensions,
      material: existing.material,
      ply: existing.ply,
      condition: existing.condition,
      description: existing.description,
      imageUrl: existing.images[0] || '',
      customizable: existing.customizable,
      bulkTier1Qty: tiers[0] ? String(tiers[0].minQty) : '',
      bulkTier1Price: tiers[0] ? String(tiers[0].price) : '',
      bulkTier2Qty: tiers[1] ? String(tiers[1].minQty) : '',
      bulkTier2Price: tiers[1] ? String(tiers[1].price) : '',
    };
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const bulkPricing = [];
    if (form.bulkTier1Qty && form.bulkTier1Price) {
      bulkPricing.push({ minQty: Number(form.bulkTier1Qty), price: Number(form.bulkTier1Price) });
    }
    if (form.bulkTier2Qty && form.bulkTier2Price) {
      bulkPricing.push({ minQty: Number(form.bulkTier2Qty), price: Number(form.bulkTier2Price) });
    }

    const product = {
      id: form.id.trim(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      dimensions: form.dimensions,
      material: form.material,
      ply: form.ply,
      condition: form.condition,
      description: form.description,
      images: [form.imageUrl || 'https://placehold.co/600x600/070707/FF4D00?text=Product'],
      customizable: form.customizable,
      bulkPricing,
    };

    try {
      if (existing) {
        await updateProduct(existing.id, product);
      } else {
        if (products.some((p) => p.id === product.id)) {
          setError('Product ID already exists');
          setSaving(false);
          return;
        }
        await addProduct(product);
      }
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold uppercase text-white">
          {existing ? 'Edit Product' : 'Add Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="card-dark max-w-2xl space-y-5 p-8">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}
        <Field label="Product ID" required>
          <input className="input-field w-full !bg-void !text-white" value={form.id} onChange={(e) => set('id', e.target.value)} disabled={!!existing} required />
        </Field>

        <Field label="Name" required>
          <input className="input-field w-full !bg-void !text-white" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </Field>

        <Field label="Category" required>
          <select className="input-field w-full !bg-void !text-white" value={form.category} onChange={(e) => set('category', e.target.value)} required>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Price (Rs)" required>
            <input type="number" className="input-field w-full !bg-void !text-white" value={form.price} onChange={(e) => set('price', e.target.value)} required />
          </Field>
          <Field label="Stock" required>
            <input type="number" className="input-field w-full !bg-void !text-white" value={form.stock} onChange={(e) => set('stock', e.target.value)} required />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Dimensions">
            <input className="input-field w-full !bg-void !text-white" value={form.dimensions} onChange={(e) => set('dimensions', e.target.value)} placeholder="12×10×8 in" />
          </Field>
          <Field label="Material">
            <input className="input-field w-full !bg-void !text-white" value={form.material} onChange={(e) => set('material', e.target.value)} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Ply">
            <select className="input-field w-full !bg-void !text-white" value={form.ply} onChange={(e) => set('ply', e.target.value)}>
              {plyOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Condition">
            <select className="input-field w-full !bg-void !text-white" value={form.condition} onChange={(e) => set('condition', e.target.value)}>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="New/Used">New/Used</option>
            </select>
          </Field>
        </div>

        <Field label="Image URL">
          <input className="input-field w-full !bg-void !text-white" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://..." />
        </Field>

        <Field label="Description">
          <textarea className="input-field w-full !bg-void !text-white min-h-[100px]" value={form.description} onChange={(e) => set('description', e.target.value)} />
        </Field>

        <label className="flex items-center gap-3 text-sm text-white/70">
          <input type="checkbox" checked={form.customizable} onChange={(e) => set('customizable', e.target.checked)} className="accent-blaze" />
          Customizable (size/printing)
        </label>

        <div className="rounded-xl border border-line p-5">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Wholesale tiers (optional)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tier 1 min qty">
              <input type="number" className="input-field w-full !bg-void !text-white" value={form.bulkTier1Qty} onChange={(e) => set('bulkTier1Qty', e.target.value)} />
            </Field>
            <Field label="Tier 1 price">
              <input type="number" className="input-field w-full !bg-void !text-white" value={form.bulkTier1Price} onChange={(e) => set('bulkTier1Price', e.target.value)} />
            </Field>
            <Field label="Tier 2 min qty">
              <input type="number" className="input-field w-full !bg-void !text-white" value={form.bulkTier2Qty} onChange={(e) => set('bulkTier2Qty', e.target.value)} />
            </Field>
            <Field label="Tier 2 price">
              <input type="number" className="input-field w-full !bg-void !text-white" value={form.bulkTier2Price} onChange={(e) => set('bulkTier2Price', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-blaze">{saving ? 'Saving…' : existing ? 'Save changes' : 'Add product'}</button>
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
