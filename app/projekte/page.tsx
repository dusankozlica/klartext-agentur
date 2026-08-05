import type { Metadata } from 'next';

import ProjekteExplorer from '@/components/sections/ProjekteExplorer';
import JsonLd from '@/components/seo/JsonLd';
import { projects, anzeigeName } from '@/lib/content/projects';
import { placeholder } from '@/lib/placeholders';
import { breadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Arbeiten',
  description: 'Referenzen von KLARTEXT. — mit Ausgangslage, Vorgehen und Ergebnis.',
  alternates: { canonical: '/projekte' },
};

/**
 * Projektübersicht als Explorer (sirnik.co): riesige Namen rechts,
 * wandernde Vorschau mit Steckbrief links. Die ganze Seite bleibt dunkel.
 */
export default function Page() {
  const eintraege = projects.map((p) => {
    const cover = placeholder(p.coverSlot);
    return {
      slug: p.slug,
      name: anzeigeName(p),
      branche: p.branche,
      zeitraum: p.zeitraum,
      leistungen: p.leistungen,
      ergebnisSatz: p.ergebnisSatz,
      cover: {
        src: cover.src, width: cover.width, height: cover.height,
        blurDataURL: cover.blurDataURL,
      },
    };
  });

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Start', pfad: '/' },
        { name: 'Arbeiten', pfad: '/projekte' },
      ])} />

      <section className="bg-[var(--ink)] text-[var(--cream)]" data-nav="dark">
        <div className="wrap pb-[var(--sec-y)] pt-[calc(var(--sec-y)+44px)]">
          <p className="eyebrow" data-decode>Arbeiten</p>
          <h1 className="display display--sm">
            <span className="line"><span className="line__i">Was daraus</span></span>
            <span className="line"><span className="line__i">geworden ist<span className="akzent-d">.</span></span></span>
          </h1>
          <p className="body-measure mt-[var(--s-6)] max-w-[52ch] text-[1.05rem] text-[var(--grau-d)]">
            Jede Arbeit mit Ausgangslage, Vorgehen und Ergebnis. Kennzahlen nur
            dort, wo wir sagen können, wie gemessen wurde.
          </p>
          <div className="mt-[var(--s-8)] border-t border-current/15 pt-[var(--s-8)]">
            <ProjekteExplorer eintraege={eintraege} />
          </div>
        </div>
      </section>
    </>
  );
}
