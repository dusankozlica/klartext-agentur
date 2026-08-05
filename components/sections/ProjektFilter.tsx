'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import { anzeigeName, type Project } from '@/lib/content/projects';

/**
 * Referenz-Index mit Filter nach Leistung und Branche.
 *
 * Filter als Textzeile mit echten Buttons statt Dropdown: mit der Tastatur
 * bedienbar, für Screenreader über `aria-pressed` verständlich, und die
 * Auswahl ist auf einen Blick sichtbar.
 *
 * Wichtig: Gefiltert wird clientseitig aus einer bereits im HTML stehenden
 * Liste. Ohne JS sieht man alle Projekte — nichts wird erst per JS eingefügt.
 */
export default function ProjektFilter({
  projekte, leistungen, branchen,
}: {
  projekte: Project[];
  leistungen: string[];
  branchen: string[];
}) {
  const [leistung, setLeistung] = useState<string | null>(null);
  const [branche, setBranche] = useState<string | null>(null);

  const gefiltert = useMemo(
    () => projekte.filter((p) =>
      (!leistung || p.leistungen.includes(leistung)) &&
      (!branche || p.branche === branche)),
    [projekte, leistung, branche],
  );

  return (
    <>
      <div className="grid gap-[var(--s-5)]">
        <FilterZeile
          label="Leistung"
          werte={leistungen}
          aktiv={leistung}
          onWaehlen={setLeistung}
        />
        <FilterZeile
          label="Branche"
          werte={branchen}
          aktiv={branche}
          onWaehlen={setBranche}
        />
      </div>

      <p className="mt-[var(--s-6)] text-[0.9rem] opacity-70" aria-live="polite">
        {gefiltert.length} {gefiltert.length === 1 ? 'Arbeit' : 'Arbeiten'}
      </p>

      <ul className="mt-[var(--s-8)] grid gap-[var(--s-8)] md:grid-cols-2">
        {gefiltert.map((p, i) => (
          <li key={p.slug} className={i % 3 === 2 ? 'md:col-start-2' : undefined}>
            <Link href={`/projekte/${p.slug}`} className="group block" data-cursor="Case ansehen">
              <span className="relative block overflow-hidden">
                <PlaceholderImage
                  slot={p.coverSlot}
                  alt=""
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="aspect-[4/3]"
                />
                <span className="pointer-events-none absolute inset-0 z-10 translate-y-full bg-[var(--violet)] mix-blend-multiply transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:translate-y-0" />
              </span>
              <span className="mt-[var(--s-4)] flex items-baseline justify-between gap-[var(--s-5)] border-t border-current pt-[var(--s-4)]">
                <span className="font-[family-name:var(--font-display)] text-[1.4rem] font-semibold tracking-[-0.02em]">
                  {anzeigeName(p)}
                </span>
                <span className="text-[0.9rem] opacity-70">{p.branche}</span>
              </span>
              <span className="mt-[var(--s-2)] block text-[0.9rem] opacity-70">
                {p.leistungen.join(' · ')}
              </span>
              <span className="body-measure mt-[var(--s-2)] block text-[0.95rem] opacity-70">
                {p.ergebnisSatz}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {gefiltert.length === 0 && (
        <p className="mt-[var(--s-8)] body-measure opacity-80">
          Zu dieser Auswahl liegt noch keine veröffentlichte Arbeit vor.{' '}
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => { setLeistung(null); setBranche(null); }}
          >
            Filter zurücksetzen
          </button>
        </p>
      )}
    </>
  );
}

function FilterZeile({
  label, werte, aktiv, onWaehlen,
}: {
  label: string;
  werte: string[];
  aktiv: string | null;
  onWaehlen: (w: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-[var(--s-5)] gap-y-[var(--s-2)]">
      <span className="eyebrow mb-0 w-[6rem] shrink-0">{label}</span>
      <button
        type="button"
        aria-pressed={aktiv === null}
        onClick={() => onWaehlen(null)}
        className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-[var(--s-2)] underline-offset-4 ${aktiv === null ? 'underline' : 'opacity-60 hover:opacity-100'}`}
      >
        Alle
      </button>
      {werte.map((w) => (
        <button
          key={w}
          type="button"
          aria-pressed={aktiv === w}
          onClick={() => onWaehlen(aktiv === w ? null : w)}
          className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-[var(--s-2)] underline-offset-4 ${aktiv === w ? 'underline' : 'opacity-60 hover:opacity-100'}`}
        >
          {w}
        </button>
      ))}
    </div>
  );
}
