// Statischer Export (GitHub Pages) verlangt das explizit.
export const dynamic = 'force-static';

import type { MetadataRoute } from 'next';
import { site } from '@/lib/content/site';
import { serviceSlugs } from '@/lib/content/services';
import { projectSlugs } from '@/lib/content/projects';
import { allePosts } from '@/lib/content/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await allePosts();

  const statisch = [
    '', '/leistungen', '/projekte', '/team', '/blog', '/kontakt',
    '/impressum', '/datenschutz',
  ];

  return [
    ...statisch.map((pfad) => ({
      url: `${site.url}${pfad}`,
      lastModified: new Date(),
      priority: pfad === '' ? 1 : 0.7,
    })),
    ...serviceSlugs().map((slug) => ({
      url: `${site.url}/leistungen/${slug}`,
      lastModified: new Date(),
      priority: 0.8,
    })),
    ...projectSlugs().map((slug) => ({
      url: `${site.url}/projekte/${slug}`,
      lastModified: new Date(),
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.datum ? new Date(p.datum) : new Date(),
      priority: 0.5,
    })),
  ];
}
