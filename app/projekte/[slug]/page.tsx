import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import PageHero from '@/components/ui/PageHero';
import Counter from '@/components/ui/Counter';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import JsonLd from '@/components/seo/JsonLd';

import {
  getProject, projectSlugs, belastbareKennzahlen, anzeigeName, projects,
} from '@/lib/content/projects';
import { breadcrumbSchema, caseSchema } from '@/lib/seo/schema';

export function generateStaticParams() {
  return projectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/projekte/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${anzeigeName(p)} — ${p.leistungen.join(', ')}`,
    description: p.ausgangslage.slice(0, 155),
    alternates: { canonical: `/projekte/${p.slug}` },
  };
}

export default async function Page({ params }: PageProps<'/projekte/[slug]'>) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const kennzahlen = belastbareKennzahlen(p);
  const weitere = projects.filter((x) => x.slug !== p.slug);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Start', pfad: '/' },
        { name: 'Arbeiten', pfad: '/projekte' },
        { name: anzeigeName(p), pfad: `/projekte/${p.slug}` },
      ])} />
      <JsonLd data={caseSchema(p)} />

      <PageHero eyebrow="Case Study" zeilen={[anzeigeName(p)]}>
        <dl className="mt-[var(--s-7)] grid gap-[var(--s-5)] sm:grid-cols-3">
          <div>
            <dt className="text-[0.8rem] uppercase tracking-[0.14em] text-[var(--grau-d)]">Branche</dt>
            <dd className="mt-[var(--s-1)]">{p.branche}</dd>
          </div>
          <div>
            <dt className="text-[0.8rem] uppercase tracking-[0.14em] text-[var(--grau-d)]">Zeitraum</dt>
            <dd className="mt-[var(--s-1)]">{p.zeitraum}</dd>
          </div>
          <div>
            <dt className="text-[0.8rem] uppercase tracking-[0.14em] text-[var(--grau-d)]">Leistungen</dt>
            <dd className="mt-[var(--s-1)]">{p.leistungen.join(', ')}</dd>
          </div>
        </dl>
      </PageHero>

      <section className="section bg-[var(--paper)]">
        <div className="wrap grid gap-[var(--s-9)]">
          <div className="grid gap-[var(--s-8)] md:grid-cols-[4fr_8fr]">
            <h2 className="eyebrow self-start" data-reveal>Ausgangslage</h2>
            <p className="body-measure text-[1.1rem]" data-reveal>{p.ausgangslage}</p>
          </div>

          <div className="bleed">
            <PlaceholderImage
              slot={p.bildSlots[0] ?? 'projects/case-detail-wide'}
              alt=""
              sizes="100vw"
              className="h-[72svh] min-h-[380px] w-full"
              scrollSpeed={0.08}
            />
          </div>

          <div className="grid gap-[var(--s-8)] md:grid-cols-[4fr_8fr]">
            <h2 className="eyebrow self-start" data-reveal>Vorgehen</h2>
            <ol className="border-t border-current/20">
              {p.vorgehen.map((schritt, i) => (
                <li key={schritt.titel} className="flex gap-[var(--s-5)] border-b border-current/20 py-[var(--s-5)]" data-reveal>
                  <span className="shrink-0 text-[0.85rem] tracking-[0.1em] opacity-65">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-[family-name:var(--font-display)] text-[1.2rem] font-semibold tracking-[-0.02em]">
                      {schritt.titel}
                    </span>
                    <span className="body-measure mt-[var(--s-2)] block opacity-80">{schritt.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Ergebnis — nur Kennzahlen mit Messmethode und Zeitraum */}
      <section className="section bg-[var(--ink)] text-[var(--cream)]" data-nav="dark">
        <div className="wrap">
          <h2 className="sec-title" data-reveal>Ergebnis</h2>

          {kennzahlen.length > 0 ? (
            <ul className="grid gap-[var(--s-7)] md:grid-cols-3">
              {kennzahlen.map((k) => (
                <li key={k.label} className="border-t border-current pt-[var(--s-4)]" data-reveal>
                  <Counter
                    wert={k.wert}
                    className="block font-[family-name:var(--font-display)] text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.02em]"
                  />
                  <p className="mt-[var(--s-3)] text-[1.05rem]">{k.label}</p>
                  <p className="mt-[var(--s-2)] text-[0.85rem]">
                    {k.messmethode} · {k.zeitraum}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="body-measure text-[1.15rem]" data-reveal>{p.ergebnisSatz}</p>
              <p className="body-measure mt-[var(--s-6)]" data-reveal>
                Zahlen zu diesem Projekt veröffentlichen wir erst, wenn der Kunde
                sie freigegeben hat und wir die Messmethode mitliefern können.
                Eine Prozentzahl ohne Angabe, was gemessen wurde und über welchen
                Zeitraum, ist keine Information — sie ist Dekoration.
              </p>
            </>
          )}

          {p.zitat?.freigabeVorhanden && (
            <blockquote className="mt-[var(--s-9)] border-t border-current pt-[var(--s-6)]" data-reveal>
              <p className="body-measure font-[family-name:var(--font-display)] text-[clamp(1.3rem,2.4vw,2rem)] font-semibold leading-[1.2] tracking-[-0.02em]">
                „{p.zitat.text}“
              </p>
              <footer className="mt-[var(--s-4)] text-[0.95rem]">
                {p.zitat.person}, {p.zitat.funktion}
              </footer>
            </blockquote>
          )}
        </div>
      </section>

      {p.bildSlots.length > 1 && (
        <section className="section bg-[var(--cream-tint)]">
          <div className="wrap grid gap-[var(--s-5)] md:grid-cols-2">
            {p.bildSlots.slice(1).map((slot) => (
              <PlaceholderImage
                key={slot}
                slot={slot}
                alt=""
                sizes="(max-width: 768px) 100vw, 50vw"
                className="aspect-[3/4]"
              />
            ))}
          </div>
        </section>
      )}

      {/* ohhmydesign-Referenz: weitere Arbeiten als grosse runde Karten,
          Punkt + Name links, Leistungs-Chips rechts */}
      <section className="section bg-[var(--cream)]">
        <div className="wrap">
          <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-4)]">
            <h2 className="sec-title mb-0" data-reveal>Weitere Arbeiten</h2>
            <Link href="/projekte" className="inline-flex min-h-[44px] items-center underline underline-offset-4 transition-colors duration-[var(--dauer-1)] hover:text-[var(--violet)]">
              Alle Projekte&nbsp;↗
            </Link>
          </div>
          <div className="mt-[var(--s-7)] grid gap-[var(--s-6)] md:grid-cols-2">
            {weitere.map((w) => (
              <Link
                key={w.slug}
                href={`/projekte/${w.slug}`}
                className="group block"
                data-cursor="Case ansehen"
                data-reveal
              >
                <span className="block overflow-hidden rounded-[var(--radius-lg)]">
                  <PlaceholderImage
                    slot={w.coverSlot}
                    alt=""
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="aspect-[4/3] transition-transform duration-[var(--dauer-3)] ease-[var(--ease-quart)] group-hover:scale-[1.03]"
                  />
                </span>
                <span className="mt-[var(--s-4)] flex flex-wrap items-center justify-between gap-[var(--s-3)]">
                  <span className="flex items-center gap-[0.5em] font-[family-name:var(--font-display)] text-[1.35rem] font-semibold tracking-[-0.02em]">
                    <span aria-hidden="true" className="inline-block h-[9px] w-[9px] rounded-full bg-[var(--violet)]" />
                    {anzeigeName(w)}
                  </span>
                  <span className="flex gap-[var(--s-2)]">
                    {w.leistungen.slice(0, 2).map((l) => (
                      <span key={l} className="chip text-[var(--grau-l)]">{l}</span>
                    ))}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
