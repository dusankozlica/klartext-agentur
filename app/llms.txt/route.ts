import { site } from '@/lib/content/site';
import { services } from '@/lib/content/services';
import { allePosts } from '@/lib/content/blog';

/**
 * llms.txt — Kurzprofil und Seitenverzeichnis für AI-Antwortsysteme.
 *
 * Wird als Route Handler erzeugt statt als statische Datei, damit das
 * Verzeichnis nicht veraltet, sobald eine Leistung oder ein Artikel
 * dazukommt.
 */
export const dynamic = 'force-static';

export async function GET() {
  const posts = await allePosts();

  const zeilen = [
    `# ${site.name}`,
    '',
    `> ${site.kurzprofil}`,
    '',
    '## Leistungen',
    ...services.map((s) => `- [${s.name}](${site.url}/leistungen/${s.slug}): ${s.claim}`),
    '',
    '## Seiten',
    `- [Arbeiten](${site.url}/projekte): Referenzen, filterbar nach Leistung und Branche`,
    `- [Team](${site.url}/team)`,
    `- [Blog](${site.url}/blog)`,
    `- [Kontakt](${site.url}/kontakt)`,
    `- [Impressum](${site.url}/impressum)`,
    `- [Datenschutz](${site.url}/datenschutz)`,
  ];

  if (posts.length) {
    zeilen.push('', '## Artikel',
      ...posts.map((p) => `- [${p.titel}](${site.url}/blog/${p.slug})`));
  }

  return new Response(zeilen.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
