'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useCatalogStore } from '@/store/useCatalogStore';

export default function ClientProviders({ children }) {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const fetchCatalog = useCatalogStore((s) => s.fetchCatalog);

  useEffect(() => {
    hydrateAuth();
    useCartStore.persist.rehydrate();
    fetchCatalog();
  }, [hydrateAuth, fetchCatalog]);

  return children;
}
