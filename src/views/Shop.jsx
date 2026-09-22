'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'
import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';
import { useCatalogStore } from '@/store/useCatalogStore';
import { plyOptions } from '@/data/products';
import ProductCard from '@/components/ui/ProductCard';

export default function Shop() {
  const { categoryId } = useParams();
  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);

  const [mobileFilters, setMobileFilters] = useState(false);
  const [category, setCategory] = useState(categoryId === 'all' ? 'all' : categoryId || 'all');
  const [ply, setPly] = useState('all');
  const [condition, setCondition] = useState('all');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    setCategory(!categoryId || categoryId === 'all' ? 'all' : categoryId);
  }, [categoryId]);

  let filtered = [...products];
  if (category !== 'all') filtered = filtered.filter((p) => p.category === category);
  if (ply !== 'all') filtered = filtered.filter((p) => p.ply === ply);
  if (condition !== 'all') filtered = filtered.filter((p) => p.condition.includes(condition));
  if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);

  const activeCat = categories.find((c) => c.id === category);
  const title = category === 'all' ? 'Full Catalog' : activeCat?.name || 'Products';

  const clearFilters = () => { setCategory('all'); setPly('all'); setCondition('all'); };

  const FilterPanel = ({ dark = false }) => (
    <div className="space-y-8">
      <FilterGroup title="Category" dark={dark}>
        <FilterRadio dark={dark} name="cat" value="all" checked={category === 'all'} onChange={setCategory} label="All" />
        {categories.map((cat) => (
          <FilterRadio dark={dark} key={cat.id} name="cat" value={cat.id} checked={category === cat.id} onChange={setCategory} label={cat.name} />
        ))}
      </FilterGroup>
      <FilterGroup title="Condition" dark={dark}>
        <FilterRadio dark={dark} name="cond" value="all" checked={condition === 'all'} onChange={setCondition} label="Any" />
        <FilterRadio dark={dark} name="cond" value="New" checked={condition === 'New'} onChange={setCondition} label="New" />
        <FilterRadio dark={dark} name="cond" value="Used" checked={condition === 'Used'} onChange={setCondition} label="Used" />
      </FilterGroup>
      {(category === 'all' || category.includes('box')) && (
        <FilterGroup title="Ply" dark={dark}>
          <FilterRadio dark={dark} name="ply" value="all" checked={ply === 'all'} onChange={setPly} label="Any" />
          {plyOptions.map((p) => (
            <FilterRadio dark={dark} key={p} name="ply" value={p} checked={ply === p} onChange={setPly} label={p} />
          ))}
        </FilterGroup>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-snow">
      {/* Dark hero — matches homepage */}
      <section className="relative overflow-hidden bg-void pt-28 pb-16">
        <div className="glow-orb -left-20 top-10 h-[350px] w-[350px] bg-blaze/25" />
        <div className="glow-orb right-0 top-20 h-[250px] w-[250px] bg-mint/15" />
        {activeCat && (
          <img src={activeCat.image} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10" />
        )}
        <div className="container-main relative">
          <span className="tag mb-4">Shop</span>
          <h1 className="headline-xl text-white">{title}</h1>
          <p className="mt-4 text-white/50">{filtered.length} products · wholesale pricing available</p>

          {/* Category pills */}
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
            <Link href="/shop/all" className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${category === 'all' ? 'bg-blaze text-white' : 'border border-white/20 text-white/60 hover:border-white/40'}`}>
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.id}`}
                className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${category === cat.id ? 'bg-blaze text-white' : 'border border-white/20 text-white/60 hover:border-white/40'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container-main py-12 pb-20">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <button type="button" onClick={() => setMobileFilters(true)} className="btn-outline !py-2.5 !text-xs lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field w-auto min-w-[180px] cursor-pointer">
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
        </div>

        <div className="flex gap-10">
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="card-dark p-6">
              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Filter</p>
              <FilterPanel dark />
              {(category !== 'all' || ply !== 'all' || condition !== 'all') && (
                <button type="button" onClick={clearFilters} className="mt-6 text-sm font-bold text-blaze hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          </aside>

          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-line-light py-24 text-center">
                <p className="font-display text-2xl font-bold">No matches</p>
                <button type="button" onClick={clearFilters} className="btn-blaze mt-6">Clear filters</button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFilters && (
        <div className="fixed inset-0 z-50 bg-void lg:hidden">
          <div className="flex h-full flex-col p-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-bold uppercase text-white">Filters</span>
              <button type="button" onClick={() => setMobileFilters(false)}><X className="h-6 w-6 text-white" /></button>
            </div>
            <div className="mt-8 flex-1 overflow-y-auto"><FilterPanel dark /></div>
            <button type="button" onClick={() => setMobileFilters(false)} className="btn-blaze mt-4 w-full">
              Show {filtered.length} products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children, dark }) {
  return (
    <div>
      <p className={`mb-4 text-[10px] font-bold uppercase tracking-[0.2em] ${dark ? 'text-white/40' : 'text-smoke'}`}>{title}</p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function FilterRadio({ name, value, checked, onChange, label, dark }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="radio" name={name} checked={checked} onChange={() => onChange(value)} className="accent-blaze" />
      <span className={checked ? `font-bold ${dark ? 'text-white' : 'text-void'}` : dark ? 'text-white/50' : 'text-smoke'}>{label}</span>
    </label>
  );
}
