'use client';

import { useEffect } from 'react';
import { useCatalogStore } from '@/store/useCatalogStore';

export default function CatalogBootstrap() {
  const fetchCatalog = useCatalogStore((s) => s.fetchCatalog);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return null;
}
