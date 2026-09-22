'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Zap } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { WHATSAPP_URL } from '@/config/env';
import clsx from 'clsx';

const navLinks = [
  { name: 'Shop', path: '/shop/all' },
  { name: 'New Boxes', path: '/shop/new-box' },
  { name: 'Used', path: '/shop/old-box' },
  { name: 'Tape', path: '/shop/tape' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartStore((s) => s.getTotalItems());
  const pathname = usePathname();
  const isHome = pathname === '/';
  const onDark = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, pathname]);

  return (
    <>
      <header className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-line-light/80 bg-white/90 py-3 shadow-lg shadow-black/5 backdrop-blur-xl'
          : isHome
            ? 'bg-transparent py-5'
            : 'border-b border-line-light bg-white py-3'
      )}>
        <div className="container-main flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-blaze shadow-[0_0_30px_rgba(255,77,0,0.5)] transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 text-white" fill="white" />
            </div>
            <div>
              <span className={clsx('block font-display text-xl font-extrabold uppercase tracking-tight', onDark && !scrolled ? 'text-white' : 'text-void')}>
                Ghazi
              </span>
              <span className={clsx('text-[9px] font-bold uppercase tracking-[0.3em]', onDark && !scrolled ? 'text-white/50' : 'text-smoke')}>
                Enterprise
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-line-light/80 bg-white/80 px-2 py-1.5 shadow-sm backdrop-blur-md lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || pathname.startsWith(`${link.path}/`);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={clsx(
                    'rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all',
                    isActive ? 'bg-void text-white' : 'text-smoke hover:bg-void/5 hover:text-void'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'hidden rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all sm:inline-flex',
                onDark && !scrolled
                  ? 'border border-white/20 text-white hover:bg-white/10'
                  : 'border border-line-light text-void hover:border-blaze hover:text-blaze'
              )}
            >
              WhatsApp
            </a>

            <Link
              href="/cart"
              className={clsx(
                'relative flex h-11 w-11 items-center justify-center rounded-full transition-all',
                onDark && !scrolled
                  ? 'border border-white/20 text-white hover:bg-white/10'
                  : 'border border-line-light text-void hover:border-blaze hover:text-blaze'
              )}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blaze px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/shop/all" className="btn-blaze hidden !px-5 !py-2.5 !text-xs md:inline-flex">
              Shop Now
            </Link>

            <button
              type="button"
              className={clsx(
                'flex h-11 w-11 items-center justify-center rounded-full lg:hidden',
                onDark && !scrolled ? 'border border-white/20 text-white' : 'border border-line-light text-void'
              )}
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-void lg:hidden">
          <div className="flex h-full flex-col p-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-bold uppercase text-white">Menu</span>
              <button type="button" onClick={() => setMenuOpen(false)} className="text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-12 flex flex-1 flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={clsx(
                      'border-b border-line py-5 font-display text-3xl font-bold uppercase transition-colors',
                      isActive ? 'text-blaze' : 'text-white/70 hover:text-white'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            <Link href="/shop/all" className="btn-blaze w-full justify-center">Shop Now</Link>
          </div>
        </div>
      )}
    </>
  );
}
