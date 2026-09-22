'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation'
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, Check, ShoppingBag } from 'lucide-react';
import { useCatalogStore } from '@/store/useCatalogStore';
import { useCartStore } from '@/store/useCartStore';
import CustomizeOrderForm from '@/components/CustomizeOrderForm';
import ReviewsSection from '@/components/ReviewsSection';
import clsx from 'clsx';

export default function ProductDetail() {
  const { id } = useParams();
  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const addToCart = useCartStore((s) => s.addToCart);
  const product = products.find((p) => p.id === id);

  const [qty, setQty] = useState(1);
  const [imageIdx, setImageIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center pt-28">
        <h1 className="headline-lg">Not found</h1>
        <Link href="/shop/all" className="btn-blaze mt-8">Back to shop</Link>
      </div>
    );
  }

  const catLabel = categories.find((c) => c.id === product.category)?.name || product.category;
  const unitPrice = getPrice(product, qty);
  const tiers = buildTiers(product);
  const activeTier = getActiveTierMinQty(qty, tiers);

  const handleAdd = () => {
    addToCart({ ...product, quantity: qty, price: unitPrice, isCustom: false });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-snow min-h-screen pt-28">
      <div className="container-main pb-20">
        <Link href={`/shop/${product.category}`} className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-smoke hover:text-blaze">
          <ArrowLeft className="h-4 w-4" /> {catLabel}
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-void-soft">
              <img src={product.images[imageIdx]} alt={product.name} className="h-full w-full object-contain p-8" />
              {product.condition === 'New' && (
                <span className="absolute left-5 top-5 rounded-full bg-blaze px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">New</span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} type="button" onClick={() => setImageIdx(i)}
                    className={clsx('h-20 w-20 overflow-hidden rounded-xl border-2', imageIdx === i ? 'border-blaze' : 'border-line-light opacity-60')}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="tag-dark">{catLabel}</span>
            <h1 className="headline-lg mt-4">{product.name}</h1>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-5xl font-extrabold text-blaze">Rs {unitPrice.toLocaleString()}</span>
              <span className="text-sm text-smoke">/ unit · qty {qty}</span>
            </div>

            <p className="mt-6 leading-relaxed text-smoke">{product.description}</p>

            {tiers.length > 0 && (
              <div className="mt-8 rounded-2xl border border-line-light bg-white p-6">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-smoke">Wholesale tiers</p>
                <p className="mb-4 text-xs text-smoke">Tap a tier to set quantity</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {tiers.map((tier) => (
                    <button
                      key={tier.minQty}
                      type="button"
                      onClick={() => setQty(tier.minQty)}
                      className={clsx(
                        'rounded-xl border-2 p-4 text-center transition-all hover:scale-[1.02]',
                        activeTier === tier.minQty
                          ? 'border-blaze bg-blaze/10 shadow-[0_0_20px_rgba(255,77,0,0.15)]'
                          : 'border-line-light hover:border-blaze/50'
                      )}
                    >
                      <p className="text-xs text-smoke">{tier.label}</p>
                      <p className={clsx('font-display text-xl font-bold', activeTier === tier.minQty ? 'text-blaze' : '')}>
                        Rs {tier.price}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-line-light bg-white p-6 shadow-lg">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="inline-flex items-center rounded-full border-2 border-line-light">
                  <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-5 py-3"><Minus className="h-4 w-4" /></button>
                  <span className="w-12 text-center font-display text-xl font-bold">{qty}</span>
                  <button type="button" onClick={() => setQty(qty + 1)} className="px-5 py-3"><Plus className="h-4 w-4" /></button>
                </div>
                <button type="button" onClick={handleAdd} disabled={added}
                  className={clsx('btn-blaze flex-1 !rounded-2xl', added && '!bg-success !shadow-none')}>
                  {added ? <><Check className="h-5 w-5" /> Added!</> : <><ShoppingBag className="h-5 w-5" /> Add to Cart</>}
                </button>
              </div>
              {product.customizable && (
                <button type="button" onClick={() => setShowCustom(!showCustom)} className="mt-4 w-full text-sm font-bold text-blaze hover:underline">
                  {showCustom ? 'Hide custom form ↑' : 'Need custom size or printing? →'}
                </button>
              )}
            </div>

            {showCustom && product.customizable && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-void">
                <CustomizeOrderForm product={product} onSuccess={() => setShowCustom(false)} />
              </div>
            )}

            <dl className="mt-8 grid grid-cols-2 gap-3">
              {[['Dimensions', product.dimensions], ['Material', product.material], ['Ply', product.ply], ['Stock', `${product.stock.toLocaleString()} units`]].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-line-light bg-white p-4">
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-smoke">{k}</dt>
                  <dd className="mt-1 font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <ReviewsSection productId={product.id} title="Reviews" subtitle={`What buyers say about ${product.name}`} limit={4} />
    </div>
  );
}

function buildTiers(product) {
  const tiers = [{ label: '1 – 99', minQty: 1, price: product.price }];
  if (!product.bulkPricing?.length) return tiers;

  const sorted = [...product.bulkPricing].sort((a, b) => a.minQty - b.minQty);
  sorted.forEach((tier, i) => {
    const next = sorted[i + 1];
    tiers.push({
      label: next ? `${tier.minQty} – ${next.minQty - 1}` : `${tier.minQty}+`,
      minQty: tier.minQty,
      price: tier.price,
    });
  });
  return tiers;
}

function getActiveTierMinQty(qty, tiers) {
  let active = tiers[0]?.minQty ?? 1;
  for (const tier of tiers) {
    if (qty >= tier.minQty) active = tier.minQty;
  }
  return active;
}

function getPrice(product, qty) {
  let price = product.price;
  if (product.bulkPricing) {
    for (const tier of [...product.bulkPricing].sort((a, b) => b.minQty - a.minQty)) {
      if (qty >= tier.minQty) { price = tier.price; break; }
    }
  }
  return price;
}
