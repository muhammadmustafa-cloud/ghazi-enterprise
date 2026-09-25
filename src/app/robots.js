const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ghazipackages.com').replace(/\/$/, '');

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/cart', '/checkout'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
