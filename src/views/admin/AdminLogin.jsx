'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLogin() {
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const router = useRouter();

  const [email, setEmail] = useState('admin@ghazienterprise.com');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') router.replace('/admin/dashboard');
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) router.push('/admin/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-4">
      <div className="glow-orb absolute left-1/4 top-1/4 h-[400px] w-[400px] bg-blaze/20" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-extrabold uppercase text-white">
            Ghazi <span className="text-blaze">Admin</span>
          </h1>
          <p className="mt-2 text-sm text-white/40">Next.js full-stack app</p>
        </div>

        <form onSubmit={handleSubmit} className="card-dark space-y-5 p-8">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/40">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full !bg-void !pl-11 !text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/40">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full !bg-void !pl-11 !text-white"
                placeholder="admin123"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-blaze w-full !rounded-xl">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
