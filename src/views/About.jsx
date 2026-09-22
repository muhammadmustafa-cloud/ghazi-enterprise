'use client';

import { Shield, Truck, Users, Package } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';

const values = [
  { icon: Shield, t: 'Quality First', d: 'Burst strength tested on every batch.' },
  { icon: Package, t: 'Custom Builds', d: 'Your dimensions, ply & logo printing.' },
  { icon: Truck, t: 'Fast Dispatch', d: 'Same-day on standard inventory.' },
  { icon: Users, t: 'B2B Partner', d: 'Volume pricing & dedicated support.' },
];

export default function About() {
  return (
    <div className="bg-snow min-h-screen">
      <PageHeader
        tag="About"
        title="Pakistan's Packaging Powerhouse"
        description="From a single corrugated supplier in Karachi to a full-scale industrial packaging company."
      />

      <section className="container-main grid items-center gap-16 py-20 lg:grid-cols-2">
        <div>
          <h2 className="headline-lg">Built on boxes.<br />Trusted by 500+.</h2>
          <div className="mt-6 space-y-4 leading-relaxed text-smoke">
            <p>Ghazi Enterprise supplies factories, e-commerce brands, bakeries, and logistics companies with corrugated cartons, tapes, shrink film, and custom-manufactured packaging.</p>
            <p>We obsess over wall strength, edge crush, and stacking durability — because your products depend on it.</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <img src="/new-boxes.png" alt="Boxes" className="aspect-[4/3] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-blaze/40 to-transparent" />
        </div>
      </section>

      <section className="section-dark py-24">
        <div className="container-main">
          <h2 className="headline-lg mb-14 text-center text-white">Why Choose Us</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-line bg-void-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blaze/20">
                  <Icon className="h-6 w-6 text-blaze" />
                </div>
                <h3 className="font-display font-bold text-white">{t}</h3>
                <p className="mt-2 text-sm text-white/40">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
