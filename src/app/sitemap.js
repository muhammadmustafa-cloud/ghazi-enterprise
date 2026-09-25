import db from '@/lib/db';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ghazipackages.com').replace(/\/$/, '');

export const dynamic = 'force-dynamic';

const buildUrl = (path) => `${SITE_URL}${path}`;

async function getPublicCatalogUrls() {
  try {
    const [categories] = await db.query('SELECT id FROM categories ORDER BY id ASC');
    const [products] = await db.query('SELECT id, created_at FROM products ORDER BY created_at DESC');

    return [
      ...categories.map((category) => ({
        url: buildUrl(`/shop/${category.id}`),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })),
      ...products.map((product) => ({
        url: buildUrl(`/product/${product.id}`),
        lastModified: product.created_at || new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })),
    ];
  } catch (error) {
    console.warn('Unable to load catalog URLs for sitemap:', error);
    return [];
  }
}

export default async function sitemap() {
  const lastModified = new Date();
  const catalogUrls = await getPublicCatalogUrls();

  return [
    {
      url: buildUrl('/'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: buildUrl('/shop/all'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: buildUrl('/about'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: buildUrl('/contact'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...catalogUrls,
  ];
}
