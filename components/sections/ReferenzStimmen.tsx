'use client';

import { useState } from 'react';
import MediaLoop from '@/components/ui/MediaLoop';

export type Stimme = {
  id: string;
  zitat: string;
  titel: string;    // Funktion (anonymisiert, bis Freigabe)
  firma: string;
  src: string;
  poster?: string;
};

/**
 * Referenzen nach dem ESE-Muster: bildschirmfüllendes Video, grosses
 * Zitat in Guillemets links, unten eine Chip-Leiste zum Umschalten
 * zwischen den Stimmen. Videos laufen stumm als Loop; die Chips tragen
 * Initialen-Kreise statt Fotos, solange keine Freigaben vorliegen.
 */
export default function ReferenzStimmen({ stimmen }: { stimmen: Stimme[] }) {
  const [aktiv, setAktiv] = useState(0);
  const s = stimmen[aktiv];
  if (!s) return null;

  return (
    <div className="relative min-h-[92svh] overflow-hidden bg-[var(--ink)] text-[var(--cream)]">
      {/* Video wechselt mit der aktiven Stimme */}
      <div key={s.id} className="absolute inset-0">
        <MediaLoop src={s.src} poster={s.poster} />
      </div>
      <div className="absolute inset-0 bg-[rgb(10_9_7/0.52)]" aria-hidden="true" />

      <div className="wrap relative flex min-h-[92svh] flex-col justify-between pb-[var(--s-7)] pt-[calc(var(--sec-y)*0.8)]">
        <p className="eyebrow text-[var(--grau-d)]" data-decode>
          Kundenstimmen · Platzhalter bis zur Freigabe
        </p>

        <blockquote className="max-w-[24ch] font-[family-name:var(--font-display)] text-[clamp(1.8rem,3.6vw,3.4rem)] font-semibold leading-[1.12] tracking-[-0.02em]">
          «{s.zitat}»
          <footer className="mt-[var(--s-5)] font-[family-name:var(--font-body)] text-[1rem] font-normal tracking-normal">
            {s.titel} <span className="text-[var(--grau-d)]">· {s.firma}</span>
          </footer>
        </blockquote>

        {/* Chip-Leiste (ESE): eine Pille pro Stimme */}
        <div className="flex flex-wrap gap-[var(--s-3)]">
          {stimmen.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setAktiv(i)}
              aria-pressed={i === aktiv}
              className={`flex min-h-[56px] items-center gap-[var(--s-3)] rounded-full border px-[18px] py-[8px] text-left backdrop-blur-md transition-[background,border-color,opacity] duration-[var(--dauer-1)] ${
                i === aktiv
                  ? 'border-[color-mix(in_srgb,var(--cream)_45%,transparent)] bg-[rgb(243_238_227/0.14)]'
                  : 'border-[color-mix(in_srgb,var(--cream)_18%,transparent)] bg-[rgb(14_13_11/0.35)] opacity-75 hover:opacity-100'
              }`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--violet)] text-[0.8rem] font-semibold text-[#fff]">
                {t.firma.slice(0, 1)}
              </span>
              <span className="leading-tight">
                <span className="block text-[0.9rem] font-medium">{t.titel}</span>
                <span className="block text-[0.8rem] text-[var(--grau-d)]">{t.firma}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
