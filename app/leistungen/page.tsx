import type { Metadata } from 'next';
import Link from 'next/link';

import PageHero from '@/components/ui/PageHero';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import JsonLd from '@/components/seo/JsonLd';
import { services } from '@/lib/content/services';
import { breadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Leistungen',
  description:
    'Social Media, Branding, Webdesign, laufende Betreuung und KI im Arbeitsalltag — für Schweizer KMU.',
  alternates: { canonical: '/leistungen' },
};

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Start', pfad: '/' },
        { name: 'Leistungen', pfad: '/leistungen' },
      ])} />

      <PageHero
        eyebrow="Leistungen"
        zeilen={['Fünf Dinge, die wir', 'richtig machen.']}
        lead="Kein Bauchladen. Was hier nicht steht, machen wir nicht — und sagen Ihnen, wer es besser kann."
      />

      <section className="section bg-[var(--cream)] text-[var(--ink)]">
        <div className="wrap grid gap-[var(--s-9)]">
          {services.map((s, i) => (
            <article
              key={s.slug}
              className={`grid items-center gap-[var(--s-8)] md:grid-cols-2 ${
                i % 2 ? 'md:[&>a]:order-2' : ''
              }`}
              data-reveal
            >
              <Link href={`/leistungen/${s.slug}`} data-cursor="Ansehen" className="block overflow-hidden rounded-[var(--radius-lg)]">
                <PlaceholderImage
                  slot={s.bildSlot}
                  alt=""
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="aspect-square"
                  scrollSpeed={0.08}
                />
              </Link>
              <div>
                <p className="text-[0.85rem] font-medium tracking-[0.1em] text-[var(--grau-l)]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="sec-title mb-[var(--s-4)]">
                  <Link href={`/leistungen/${s.slug}`}>{s.name}</Link>
                </h2>
                <p className="body-measure opacity-80">{s.claim}</p>
                <p className="body-measure mt-[var(--s-4)] text-[0.95rem] text-[var(--grau-l)]">
                  {s.fuerWen}
                </p>
                <Link className="btn btn--dunkel mt-[var(--s-6)]" href={`/leistungen/${s.slug}`}>
                  Details&nbsp;→
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
