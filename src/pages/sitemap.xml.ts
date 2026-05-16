import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const BASE = 'https://www.telos.cl';

const staticRoutes = [
  { path: '/',           priority: '1.0', changefreq: 'weekly'  },
  { path: '/nosotros/',  priority: '0.8', changefreq: 'monthly' },
  { path: '/servicios/', priority: '0.8', changefreq: 'monthly' },
  { path: '/cfo/',       priority: '0.8', changefreq: 'monthly' },
  { path: '/contacto/',  priority: '0.7', changefreq: 'monthly' },
  { path: '/articulos/', priority: '0.9', changefreq: 'weekly'  },
];

export const GET: APIRoute = async () => {
  const articulos = await getCollection('blog');

  const articleEntries = articulos.map(a => {
    const fecha = a.data.fecha instanceof Date
      ? a.data.fecha.toISOString().split('T')[0]
      : a.data.fecha;
    return {
      path:       `/articulos/${a.id.replace(/\.md$/, '')}/`,
      priority:   '0.7',
      changefreq: 'monthly',
      lastmod:    fecha,
    };
  });

  const allRoutes = [
    ...staticRoutes.map(r => ({ ...r, lastmod: undefined })),
    ...articleEntries,
  ];

  const urls = allRoutes.map(r => `  <url>
    <loc>${BASE}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>${r.lastmod ? `\n    <lastmod>${r.lastmod}</lastmod>` : ''}
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type':  'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
