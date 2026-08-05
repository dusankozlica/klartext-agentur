'use client';

import { useState } from 'react';
import Link from 'next/link';

type Eintrag = { slug: string; name: string; claim: string; fuerWen: string };

/**
 * Leistungs-Zeilen: die nexola-Tabelle (Nummer · Name · Plus), gekreuzt
 * mit dem pixel.melbourne-Hover — die ganze Zeile wird zum vollbreiten
 * Violett-Balken. Ein Klick klappt Claim + Zielgruppe + Link auf.
 *
 * Zustand liegt hier statt in <details>, damit immer nur EINE Zeile
 * offen ist und der Pfeil-Link Tastatur-erreichbar bleibt.
 */
export default function LeistungsZeilen({ eintraege }: { eintraege: Eintrag[] }) {
  const [offen, setOffen] = useState<number | null>(null);

  return (
    <ol className="list-none border-t border-current/15 p-0">
      {eintraege.map((s, i) => {
        const istOffen = offen === i;
        return (
          <li key={s.slug} className="border-b border-current/15">
            <div
              className={`group transition-colors duration-300 ${
                istOffen ? 'bg-[var(--violet)] text-[#fff]' : 'hover:bg-[var(--violet)] hover:text-[#fff]'
              }`}
            >
              <button
                type="button"
                aria-expanded={istOffen}
                aria-controls={`leistung-${s.slug}`}
                onClick={() => setOffen(istOffen ? null : i)}
                className="block w-full cursor-pointer py-[var(--s-5)] text-left"
              >
                <span className="wrap grid grid-cols-[3.2rem_1fr_auto] items-center gap-[var(--s-5)]">
                <span className="text-[0.85rem] font-medium tracking-[0.1em] opacity-70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,3.4vw,2.8rem)] font-semibold tracking-[-0.02em]">
                  {s.name}
                </span>
                <span
                  aria-hidden="true"
                  className={`text-[1.6rem] font-light transition-transform duration-300 ${istOffen ? 'rotate-45' : ''}`}
                >
                  +
                </span>
                </span>
              </button>

              <div
                id={`leistung-${s.slug}`}
                hidden={!istOffen}
                className="wrap grid gap-[var(--s-5)] pb-[var(--s-6)] md:grid-cols-[3.2rem_1fr_1fr]"
              >
                <span aria-hidden="true" />
                <p className="body-measure max-w-[46ch]">{s.claim}</p>
                <div className="md:justify-self-end md:text-right">
                  <p className="max-w-[38ch] text-[0.95rem] opacity-85">{s.fuerWen}</p>
                  <Link
                    className="mt-[var(--s-4)] inline-flex min-h-[44px] items-center font-medium underline underline-offset-4"
                    href={`/leistungen/${s.slug}`}
                  >
                    Mehr zu {s.name}&nbsp;↗
                  </Link>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
