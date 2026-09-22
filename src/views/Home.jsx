'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Layers, Factory, Truck, Star } from 'lucide-react';
import { useCatalogStore } from '@/store/useCatalogStore';
import ProductCard from '@/components/ui/ProductCard';
import Marquee from '@/components/ui/Marquee';
import ReviewsSection from '@/components/ReviewsSection';
import { WHATSAPP_URL } from '@/config/env';

const stats = [
  { n: '500+', l: 'Clients' },
  { n: '13+', l: 'Products' },
  { n: '24h', l: 'Quotes' },
  { n: 'Same Day', l: 'Dispatch' },
];

const bentoColors = ['bg-blaze', 'bg-gold', 'bg-mint', 'bg-void-card', 'bg-blaze/80', 'bg-gold/80'];

export default function Home() {
  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* HERO — full dark immersive */}
      <section className="relative min-h-screen overflow-hidden bg-void pt-28">
        <div className="glow-orb -left-32 top-20 h-[500px] w-[500px] bg-blaze/30" />
        <div className="glow-orb -right-20 top-40 h-[400px] w-[400px] bg-mint/20" />
        <div className="glow-orb bottom-0 left-1/3 h-[300px] w-[300px] bg-gold/15" />

        {/* Grid texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="container-main relative grid items-center gap-16 pb-20 lg:grid-cols-2 lg:pb-0 lg:pt-10">
          <div>
            <span className="tag mb-8">
              <span className="h-2 w-2 animate-pulse rounded-full bg-mint" />
              Karachi · Est. Industrial Packaging
            </span>

            <h1 className="headline-xl text-white">
              Box It.<br />
              <span className="text-gradient">Ship It.</span><br />
              Scale It.
            </h1>

            <p className="mt-8 max-w-md text-base leading-relaxed text-white/60">
              Heavy-duty corrugated cartons, industrial tapes, shrink film & custom boxes — built for factories, e-commerce & logistics at wholesale prices.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/shop/all" className="btn-blaze">
                Explore Catalog <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Get a Quote
              </a>
            </div>

            <div className="mt-14 grid grid-cols-4 gap-4 border-t border-line pt-8">
              {stats.map((s) => (
                <div key={s.l}>
                  <p className="font-display text-2xl font-bold text-white lg:text-3xl">{s.n}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual — floating product cards */}
          <div className="relative hidden h-[600px] lg:block">
            {categories.slice(0, 3).map((cat, i) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.id}`}
                className={`absolute overflow-hidden rounded-2xl border border-white/10 shadow-2xl ${[
                  'float-y right-0 top-0 h-72 w-56 rotate-3',
                  'float-y-delay right-32 top-40 h-64 w-52 -rotate-6',
                  'float-y bottom-8 left-8 h-60 w-48 rotate-2',
                ][i]}`}
              >
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blaze">{String(i + 1).padStart(2, '0')}</p>
                  <p className="font-display text-sm font-bold text-white">{cat.name}</p>
                </div>
              </Link>
            ))}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 rounded-2xl border border-blaze/30 bg-blaze/10 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-white">4.9</p>
              <p className="text-xs text-white/50">500+ happy clients</p>
            </div>
          </div>
        </div>

        {/* Mobile hero images strip */}
        <div className="container-main flex gap-3 overflow-x-auto pb-8 lg:hidden">
          {categories.slice(0, 4).map((cat) => (
            <Link key={cat.id} href={`/shop/${cat.id}`} className="relative h-44 w-36 shrink-0 overflow-hidden rounded-xl">
              <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent" />
              <p className="absolute bottom-3 left-3 text-xs font-bold text-white">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <Marquee />

      {/* BENTO CATEGORIES */}
      <section className="section-light py-24 md:py-32">
        <div className="container-main">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="tag-dark mb-4">Categories</span>
              <h2 className="headline-lg">Pick Your<br />Packaging Line</h2>
            </div>
            <Link href="/shop/all" className="btn-outline self-start">
              All Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:grid-cols-4 md:auto-rows-[200px] md:gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.id}`}
                className={`group relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2' : ''} ${bentoColors[i % bentoColors.length]}`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-40 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">0{i + 1}</p>
                  <h3 className="font-display text-xl font-bold text-white md:text-2xl">{cat.name}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blaze opacity-0 transition-opacity group-hover:opacity-100">
                    Shop Now <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US — dark split */}
      <section className="section-dark diagonal-cut py-24 md:py-32">
        <div className="container-main">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="tag mb-6">Why Ghazi</span>
              <h2 className="headline-lg text-white">
                Not Your Average<br />
                <span className="text-gradient">Cardboard Shop</span>
              </h2>
              <p className="mt-6 max-w-md text-white/50">
                We&apos;re the packaging partner factories and e-commerce brands trust when failure isn&apos;t an option.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Shield, t: 'Burst-Tested', d: 'Every batch strength-checked before dispatch.' },
                { icon: Layers, t: 'Bulk Pricing', d: 'Transparent tiers from 50 to 5,000 units.' },
                { icon: Factory, t: 'Custom Build', d: 'Your dimensions, ply & logo — our factory.' },
                { icon: Truck, t: 'Fast Dispatch', d: 'Same-day on standard in-stock inventory.' },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="rounded-2xl border border-line bg-void-card p-6 transition-colors hover:border-blaze/40">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blaze/20">
                    <Icon className="h-5 w-5 text-blaze" />
                  </div>
                  <h3 className="font-display font-bold text-white">{t}</h3>
                  <p className="mt-2 text-sm text-white/40">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section-light py-24 md:py-32">
        <div className="container-main">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="tag-dark mb-4">Bestsellers</span>
              <h2 className="headline-lg">Top Picks<br />This Season</h2>
            </div>
            <Link href="/shop/all" className="btn-dark self-start">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative overflow-hidden bg-blaze py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }} />
        <div className="container-main relative text-center">
          <h2 className="headline-lg text-white">
            Need Custom Boxes?<br />We Build Anything.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-white/80">
            Send dimensions, ply rating & artwork. Quote back within 24 hours.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/product/nb-001" className="rounded-full bg-void px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-105">
              Start Custom Order
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-white/40 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <ReviewsSection productId="home" dark />
    </div>
  );
}
