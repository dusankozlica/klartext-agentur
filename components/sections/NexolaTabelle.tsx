'use client';

import { useState } from 'react';

type Zeile = { titel: string; text: string };

/**
 * Nummerierte Aufklapp-Tabelle nach der nexola-Referenz: helle, ruhige
 * Zeilen mit Haarlinien; die offene Zeile zeigt links den Beschrieb.
 * Erste Zeile startet offen (wie im Referenz-Screenshot). Nexolas
 * «Results»-Spalte mit Prozentzahlen lassen wir bewusst weg — erfundene
 * Kennzahlen gibt es bei uns nicht.
 */
export default function NexolaTabelle({ zeilen }: { zeilen: Zeile[] }) {
  const [offen, setOffen] = useState<number | null>(0);

  return (
    <div className="border-t border-current/15" data-zeilen>
      {zeilen.map((z, i) => {
        const istOffen = offen === i;
        return (
          <div key={z.titel} className="border-b border-current/15">
            <button
              type="button"
              aria-expanded={istOffen}
              aria-controls={`tabelle-${i}`}
              onClick={() => setOffen(istOffen ? null : i)}
              className="grid w-full cursor-pointer grid-cols-[2.8rem_1fr_2.2rem] items-center gap-[var(--s-5)] py-[var(--s-6)] text-left"
            >
              <span className="text-[0.8rem] font-medium tracking-[0.1em] opacity-55">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold tracking-[-0.02em]">
                {z.titel}
              </span>
              <span
                aria-hidden="true"
                className={`justify-self-end text-[1.7rem] font-light transition-transform duration-[var(--dauer-2)] ease-[var(--ease-fluss)] ${istOffen ? 'rotate-45' : ''}`}
              >
                +
              </span>
            </button>
            <div
              id={`tabelle-${i}`}
              hidden={!istOffen}
              className="grid gap-[var(--s-5)] pb-[var(--s-7)] md:grid-cols-[2.8rem_minmax(0,46ch)]"
            >
              <span aria-hidden="true" />
              <p className="opacity-80">{z.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
