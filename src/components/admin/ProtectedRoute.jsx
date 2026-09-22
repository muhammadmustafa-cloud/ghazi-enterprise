'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!user || user.role !== 'admin') {
      router.replace('/admin/login');
    }
  }, [user, hydrated, router]);

  if (!hydrated || !user || user.role !== 'admin') return null;
  return children;
}
