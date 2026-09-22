'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { plyOptions } from '@/data/products';
import { Check } from 'lucide-react';
import clsx from 'clsx';

export default function CustomizeOrderForm({ product, onSuccess }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [selectedPly, setSelectedPly] = useState(product.ply !== 'N/A' ? product.ply : plyOptions[0]);
  const [hasPrinting, setHasPrinting] = useState(false);
  const [quantity, setQuantity] = useState(500);
  const [submitted, setSubmitted] = useState(false);
  const addToCart = useCartStore((s) => s.addToCart);

  const handleSubmit = (e) => {
    e.preventDefault();
    addToCart({
      id: `${product.id}-custom-${Date.now()}`, name: `Custom: ${product.name}`, price: 0,
      dimensions: `${length}x${width}x${height} inch`, ply: selectedPly, material: product.material,
      condition: product.condition, images: product.images, quantity: Number(quantity),
      isCustom: true, hasPrinting,
    });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setLength(''); setWidth(''); setHeight(''); setHasPrinting(false); onSuccess?.(); }, 2500);
  };

  return (
    <div className="p-6 md:p-8">
      <p className="text-[10px] font-bold uppercase tracking-widest text-blaze">Custom Quote</p>
      <h3 className="font-display text-xl font-bold text-white">Build your spec</h3>

      {submitted ? (
        <div className="flex flex-col items-center py-10 text-center">
          <Check className="h-10 w-10 text-mint" />
          <p className="mt-3 font-display text-lg font-bold text-white">Added to cart!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/40">Dimensions (in)</label>
            <div className="flex items-center gap-2">
              <input type="number" required placeholder="L" value={length} onChange={(e) => setLength(e.target.value)} className="input-field !bg-void-card !border-line !text-white" />
              <span className="text-white/30">×</span>
              <input type="number" required placeholder="W" value={width} onChange={(e) => setWidth(e.target.value)} className="input-field !bg-void-card !border-line !text-white" />
              <span className="text-white/30">×</span>
              <input type="number" required placeholder="H" value={height} onChange={(e) => setHeight(e.target.value)} className="input-field !bg-void-card !border-line !text-white" />
            </div>
          </div>
          {product.category !== 'tape' && (
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/40">Ply</label>
              <div className="grid grid-cols-3 gap-2">
                {plyOptions.map((ply) => (
                  <button key={ply} type="button" onClick={() => setSelectedPly(ply)}
                    className={clsx('rounded-xl border-2 py-2.5 text-sm font-bold', selectedPly === ply ? 'border-blaze bg-blaze/20 text-blaze' : 'border-line text-white/50')}>
                    {ply}
                  </button>
                ))}
              </div>
            </div>
          )}
          <label className="flex items-center gap-3 text-sm text-white/70">
            <input type="checkbox" checked={hasPrinting} onChange={(e) => setHasPrinting(e.target.checked)} className="accent-blaze" />
            Add logo printing
          </label>
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/40">Qty (min 100)</label>
            <input type="number" required min="100" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input-field !bg-void-card !border-line !text-white" />
          </div>
          <button type="submit" className="btn-blaze w-full !rounded-2xl">Add to cart</button>
        </form>
      )}
    </div>
  );
}
