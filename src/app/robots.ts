import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/cart', '/profile'], // Profile is private, Cart is dynamic/not useful to index
    },
    sitemap: 'https://elite-tea.vercel.app/sitemap.xml',
  };
}
