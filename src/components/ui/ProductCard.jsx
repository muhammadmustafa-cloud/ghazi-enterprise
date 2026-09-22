'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useCatalogStore } from '@/store/useCatalogStore';

const catColors = {
  'new-box': 'from-blaze/20 to-blaze/5',
  'old-box': 'from-gold/20 to-gold/5',
  tape: 'from-mint/20 to-mint/5',
  'shrink-roll': 'from-blue-500/20 to-blue-500/5',
  'bubble-wrap': 'from-purple-500/20 to-purple-500/5',
  'pizza-cake': 'from-pink-500/20 to-pink-500/5',
};

export default function ProductCard({ product, variant = 'light' }) {
  const getCategoryName = useCatalogStore((s) => s.getCategoryName);
  const dark = variant === 'dark';
  const grad = catColors[product.category] || 'from-white/10 to-white/5';

  return (
    <article className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-2 ${dark ? 'card-dark' : 'card-light'}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

      <Link href={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-void-soft">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-60" />
        {product.condition === 'New' && (
          <span className="absolute left-4 top-4 rounded-full bg-blaze px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            New
          </span>
        )}
        <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-blaze text-white opacity-0 shadow-[0_0_30px_rgba(255,77,0,0.6)] transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </div>
      </Link>

      <div className={`relative p-5 ${dark ? 'text-white' : ''}`}>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blaze">
          {getCategoryName(product.category)}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className={`font-display text-lg font-bold leading-tight transition-colors group-hover:text-blaze ${dark ? 'text-white' : 'text-void'}`}>
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-xs text-smoke">
          {product.dimensions}{product.ply !== 'N/A' ? ` · ${product.ply}` : ''}
        </p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-smoke-light">From</p>
            <p className={`font-display text-2xl font-bold ${dark ? 'text-gold' : 'text-void'}`}>
              Rs {product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
