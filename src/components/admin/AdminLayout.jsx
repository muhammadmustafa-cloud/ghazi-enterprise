'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, FolderPlus, ShoppingBag, LogOut, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCatalogStore } from '@/store/useCatalogStore';
import { useOrderStore } from '@/store/useOrderStore';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products/add', label: 'Add Product', icon: Package },
  { href: '/admin/categories/add', label: 'Add Category', icon: FolderPlus },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const fetchCatalog = useCatalogStore((s) => s.fetchCatalog);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleRefresh = () => {
    fetchCatalog();
    fetchOrders();
  };

  return (
    <div className="flex min-h-screen bg-void">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-void-soft">
        <div className="border-b border-line p-6">
          <Link href="/admin/dashboard" className="font-display text-xl font-extrabold uppercase tracking-tight text-white">
            Ghazi <span className="text-blaze">Admin</span>
          </Link>
          <p className="mt-1 text-xs text-white/40">Next.js · MySQL</p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
                  ? 'bg-blaze text-white shadow-[0_0_20px_rgba(255,77,0,0.3)]'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="space-y-2 border-t border-line p-4">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/50 hover:bg-white/5 hover:text-white">
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <button type="button" onClick={handleRefresh} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-gold hover:bg-gold/10">
            <RefreshCw className="h-4 w-4" /> Refresh data
          </button>
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/50 hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" /> Logout
          </button>
          <p className="px-4 pt-2 text-[10px] text-white/30">{user?.email}</p>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
