'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type ExplorerEintrag = {
  slug: string;
  name: string;
  branche: string;
  zeitraum: string;
  leistungen: string[];
  ergebnisSatz: string;
  cover: { src: string; width: number; height: number; blurDataURL?: string };
};

/**
 * Projekt-Explorer nach sirnik.co: rechts die riesigen Projektnamen
 * (grau, der aktive weiss mit Jahr), links wandert die Vorschau mit
 * Steckbrief-Zeilen mit. Auf Mobile fällt das Ganze auf gestapelte
 * Karten zurück — Hover existiert dort nicht.
 */
export default function ProjekteExplorer({ eintraege }: { eintraege: ExplorerEintrag[] }) {
  const [aktiv, setAktiv] = useState(0);
  const p = eintraege[aktiv];

  return (
    <>
      {/* Desktop: Liste + wandernde Vorschau */}
      <div className="hidden gap-[var(--s-8)] md:grid md:grid-cols-[5fr_7fr]">
        <div>
          <div className="sticky top-[120px]">
            <div className="overflow-hidden rounded-[var(--radius-lg)]">
              <Image
                key={p.slug}
                src={p.cover.src}
                alt=""
                width={p.cover.width}
                height={p.cover.height}
                sizes="42vw"
                placeholder={p.cover.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={p.cover.blurDataURL}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <dl className="mt-[var(--s-5)] text-[0.95rem]">
              {[
                ['Überblick', p.ergebnisSatz],
                ['Leistungen', p.leistungen.join(', ')],
                ['Branche', p.branche],
                ['Zeitraum', p.zeitraum],
              ].map(([label, wert]) => (
                <div key={label} className="grid grid-cols-[120px_1fr] gap-[var(--s-5)] border-t border-current/15 py-[var(--s-3)]">
                  <dt className="text-[var(--grau-d)]">{label}</dt>
                  <dd>{wert}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={`/projekte/${p.slug}`}
              className="mt-[var(--s-4)] inline-flex min-h-[44px] items-center font-medium underline underline-offset-4 transition-colors duration-[var(--dauer-1)] hover:text-[var(--violet-hell)]"
            >
              Case ansehen&nbsp;↗
            </Link>
          </div>
        </div>

        <ul className="self-center">
          {eintraege.map((e, i) => (
            <li key={e.slug} className="flex items-baseline gap-[var(--s-5)]">
              <span
                aria-hidden="true"
                className={`w-[2.4rem] shrink-0 text-[0.85rem] tracking-[0.1em] transition-opacity duration-[var(--dauer-1)] ${
                  i === aktiv ? 'opacity-100 text-[var(--grau-d)]' : 'opacity-40 text-[var(--grau-d)]'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <Link
                href={`/projekte/${e.slug}`}
                onMouseEnter={() => setAktiv(i)}
                onFocus={() => setAktiv(i)}
                className={`block py-[0.08em] font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,5rem)] font-semibold leading-[1.1] tracking-[-0.02em] transition-colors duration-[var(--dauer-2)] ease-[var(--ease-soft)] ${
                  i === aktiv ? 'text-[var(--cream)]' : 'text-[color-mix(in_srgb,var(--cream)_30%,transparent)] hover:text-[color-mix(in_srgb,var(--cream)_60%,transparent)]'
                }`}
              >
                {e.name}
                <span
                  aria-hidden="true"
                  className={`ml-4 inline-block text-[0.55em] text-[var(--violet-hell)] transition-[opacity,transform] duration-[var(--dauer-1)] ${
                    i === aktiv ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                  }`}
                >
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: gestapelte Karten */}
      <ul className="grid gap-[var(--s-6)] md:hidden">
        {eintraege.map((e) => (
          <li key={e.slug}>
            <Link href={`/projekte/${e.slug}`} className="group relative block overflow-hidden rounded-[var(--radius)]">
              <Image
                src={e.cover.src}
                alt=""
                width={e.cover.width}
                height={e.cover.height}
                sizes="100vw"
                placeholder={e.cover.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={e.cover.blurDataURL}
                className="aspect-[4/3] w-full object-cover"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[rgb(10_9_7/0.72)] to-transparent" aria-hidden="true" />
              <span className="absolute bottom-[var(--s-4)] left-[var(--s-4)] right-[var(--s-4)] text-[#fff]">
                <span className="block font-[family-name:var(--font-display)] text-[1.4rem] font-semibold tracking-[-0.02em]">→ {e.name}</span>
                <span className="mt-1 block text-[0.85rem] opacity-90">{e.leistungen.join(' · ')}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
