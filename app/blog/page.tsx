import type { Metadata } from 'next';
import Link from 'next/link';

import JsonLd from '@/components/seo/JsonLd';
import PageHero from '@/components/ui/PageHero';
import { allePosts, kategorien } from '@/lib/content/blog';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import { breadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Beiträge zu Marketing, Marke und Sichtbarkeit für Schweizer KMU.',
  alternates: { canonical: '/blog' },
};

/**
 * Blog-Index als Liste statt Kachelraster: Datum, Titel, Kategorie und
 * Lesezeit sind auf einen Blick vergleichbar, und die Seite bleibt leicht.
 */
export default async function Page() {
  const posts = await allePosts();
  const kats = await kategorien();

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Start', pfad: '/' },
        { name: 'Blog', pfad: '/blog' },
      ])} />

      <PageHero
        eyebrow="Blog"
        zeilen={['Gedanken,', 'die weiterhelfen.']}
      />

      {/* ESE-News-Referenz: dunkle Karten mit Bild, Kategorie, Titel */}
      <section className="section bg-[var(--ink)] text-[var(--cream)]" data-nav="dark">
        <div className="wrap">
          {posts.length === 0 ? (
            <p className="body-measure text-[var(--grau-d)]">
              Noch keine Beiträge. Neue Artikel werden als MDX unter{' '}
              <code>content/blog/</code> abgelegt.
            </p>
          ) : (
            <ul className="grid gap-[var(--s-5)] md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug} data-reveal>
                  <Link href={`/blog/${p.slug}`} className="group block h-full overflow-hidden rounded-[var(--radius)] bg-[var(--ink-2)]">
                    <span className="block overflow-hidden">
                      <PlaceholderImage
                        slot={p.coverSlot}
                        alt=""
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="aspect-[16/10] transition-transform duration-[var(--dauer-3)] ease-[var(--ease-quart)] group-hover:scale-[1.04]"
                      />
                    </span>
                    <span className="block p-[var(--s-5)]">
                      <span className="block text-[0.8rem] uppercase tracking-[0.12em] text-[var(--grau-d)]">
                        {p.kategorie}
                      </span>
                      <span className="mt-[var(--s-2)] block font-[family-name:var(--font-display)] text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] transition-colors duration-[var(--dauer-1)] group-hover:text-[var(--violet-hell)]">
                        {p.titel}
                      </span>
                      <span className="body-measure mt-[var(--s-3)] block text-[0.92rem] text-[var(--grau-d)]">
                        {p.beschreibung}
                      </span>
                      <span className="mt-[var(--s-4)] flex flex-wrap gap-[var(--s-2)]">
                        <span className="chip text-[var(--grau-d)]">{p.lesezeitMinuten} Min. Lesezeit</span>
                        <span className="chip text-[var(--grau-d)]"><time dateTime={p.datum}>{p.datum}</time></span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

    </>
  );
}
