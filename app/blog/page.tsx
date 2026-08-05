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

      <section className="section bg-[var(--paper)]">
        <div className="wrap">
          {posts.length === 0 ? (
            <p className="body-measure opacity-80">
              Noch keine Beiträge. Neue Artikel werden als MDX unter{' '}
              <code>content/blog/</code> abgelegt.
            </p>
          ) : (
            <ul className="border-t border-current/20">
              {posts.map((p, i) => (
                <li key={p.slug} className="border-b border-current/20" data-reveal>
                  <Link href={`/blog/${p.slug}`} className="group grid grid-cols-[96px_1fr] items-center gap-[var(--s-5)] py-[var(--s-6)] transition-colors hover:text-[var(--violet)] md:grid-cols-[3rem_120px_1fr_auto] md:gap-[var(--s-6)]">
                    <span className="hidden text-[0.85rem] font-medium tracking-[0.1em] opacity-65 md:block">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="block overflow-hidden">
                      <PlaceholderImage slot={p.coverSlot} alt="" sizes="120px" className="aspect-video transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:scale-[1.05]" />
                    </span>
                    <span>
                      <span className="block font-[family-name:var(--font-display)] text-[clamp(1.3rem,2.4vw,1.9rem)] font-semibold tracking-[-0.02em]">
                        {p.titel}
                      </span>
                      <span className="body-measure mt-[var(--s-2)] block text-[0.95rem] opacity-70">
                        {p.beschreibung}
                      </span>
                    </span>
                    <span className="hidden text-[0.85rem] opacity-65 md:block">
                      {p.kategorie} · {p.lesezeitMinuten} Min. · <time dateTime={p.datum}>{p.datum}</time>
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
