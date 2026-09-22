'use client';

import Link from 'next/link';
import { Zap, ArrowUpRight } from 'lucide-react';
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_URL } from '@/config/env';

const links = [
  { l: 'All Products', to: '/shop/all' },
  { l: 'New Boxes', to: '/shop/new-box' },
  { l: 'Used Boxes', to: '/shop/old-box' },
  { l: 'Tape', to: '/shop/tape' },
  { l: 'About', to: '/about' },
  { l: 'Contact', to: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-void text-white">
      {/* Big CTA strip */}
      <div className="border-b border-line">
        <div className="container-main flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center">
          <div>
            <p className="font-display text-4xl font-extrabold uppercase md:text-5xl">Ready to order?</p>
            <p className="mt-2 text-white/40">Wholesale pricing · Same-day dispatch · Custom builds</p>
          </div>
          <div className="flex gap-3">
            <Link href="/shop/all" className="btn-blaze">Shop Now</Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="container-main py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blaze">
                <Zap className="h-5 w-5 text-white" fill="white" />
              </div>
              <span className="font-display text-2xl font-extrabold uppercase">Ghazi</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/40">
              Pakistan&apos;s go-to supplier for corrugated boxes, industrial tapes, shrink film & custom packaging solutions.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Navigate</p>
            <ul className="space-y-3">
              {links.map(({ l, to }) => (
                <li key={to}>
                  <Link href={to} className="group flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-blaze">
                    {l}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Contact</p>
            <ul className="space-y-3 text-sm text-white/60">
              <li>{CONTACT_ADDRESS}</li>
              <li><a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="hover:text-blaze">{CONTACT_PHONE}</a></li>
              <li><a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-blaze">{CONTACT_EMAIL}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-xs text-white/30 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Ghazi Enterprise</p>
          <p>Karachi, Pakistan · Industrial Packaging</p>
        </div>
      </div>
    </footer>
  );
}
