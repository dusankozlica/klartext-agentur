import type { ReactNode } from 'react';

/**
 * Seitenkopf für Unterseiten — das ESE-/agency-Muster: dunkle Bühne,
 * riesiger Titel, optional ein Lead rechts, Haarlinie als Abschluss.
 * Ersetzt die früheren Schnitt-Köpfe.
 */
export default function PageHero({
  eyebrow,
  zeilen,
  lead,
  children,
}: {
  eyebrow: string;
  zeilen: string[];
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-[var(--ink)] text-[var(--cream)]" data-nav="dark">
      <div className="wrap pt-[calc(var(--sec-y)+44px)] pb-[var(--s-8)]">
        <div className="grid items-end gap-[var(--s-7)] md:grid-cols-[7fr_5fr]">
          <div>
            <p className="eyebrow" data-decode>{eyebrow}</p>
            <h1 className="display">
              {zeilen.map((z) => <span key={z} className="line"><span className="line__i">{z}</span></span>)}
            </h1>
          </div>
          {lead && (
            <p className="body-measure max-w-[42ch] text-[1.05rem] text-[var(--grau-d)] md:justify-self-end">
              {lead}
            </p>
          )}
        </div>
        {children}
        <div className="mt-[var(--s-8)] border-t border-current/15" aria-hidden="true" />
      </div>
    </section>
  );
}
