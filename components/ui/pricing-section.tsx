'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { CircleCheck, CircleMinus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Preis-Sektion für das Abo-Modell (shadcn-Registry «pricing-section»,
 * auf KLARTEXT übersetzt): violette Bühne, Creme-Karten mit Ink-Favorit,
 * Pillen-CTAs zur Terminbuchung.
 *
 * Vergleichbar statt drei verschiedene Aufzählungen: Alle Karten zeigen
 * DIESELBEN Leistungszeilen in derselben Reihenfolge. Nicht enthaltene
 * Zeilen bleiben sichtbar, aber ausgegraut (Minus-Icon) — so sieht man
 * auf einen Blick, was die nächste Stufe zusätzlich bringt.
 *
 * Interaktiv: Laufzeit-Schalter (6/12 Monate, 15% Rabatt bei 12 —
 * gerechnet, nicht getippt) und eine Zeilen-Hervorhebung, die beim
 * Überfahren in allen drei Karten dieselbe Zeile markiert.
 *
 * Preise und Fokus von Dusan vorgegeben (06./07.08.2026). Die
 * Leistungszeilen sind mein Vorschlag aus den bestehenden Service-Texten
 * — Freigabe offen. Verbindlich bleibt die schriftliche Offerte.
 */
type Stufe = {
  titel: string;
  basis: number;          // Monatspreis bei 6 Monaten Laufzeit
  beschreibung: string;
  cta: string;
  beliebt?: boolean;
};

/** true = enthalten, false = nicht enthalten, Text = enthalten mit Menge */
type Wert = boolean | string;
type Zeile = { schluessel: string; name: string; werte: [Wert, Wert, Wert] };

const RABATT_12 = 0.15;

const STUFEN: Stufe[] = [
  {
    titel: 'Sichtbar',
    basis: 1499,
    beschreibung: 'Der Content-Grundbetrieb: Ihre Kanäle laufen verlässlich, ohne dass es intern jemanden auffrisst.',
    cta: 'Abo anfragen',
  },
  {
    titel: 'Präsent',
    beliebt: true,
    basis: 1999,
    beschreibung: 'Mehr Content plus Performance Marketing: gesehen werden — und gezielt Anfragen holen.',
    cta: 'Abo anfragen',
  },
  {
    titel: 'Partner',
    basis: 2999,
    beschreibung: 'Die volle Bespielung: Content, Kampagnen und ein fester Ansprechpartner für alles.',
    cta: 'Abo anfragen',
  },
];

const LEISTUNGEN: Zeile[] = [
  // In allen Abos enthalten
  { schluessel: 'plan', name: 'Redaktionsplan pro Monat', werte: [true, true, true] },
  { schluessel: 'posts', name: 'Beiträge pro Monat', werte: ['8', '12', '16'] },
  { schluessel: 'dreh', name: 'Drehtag bei Ihnen', werte: ['1× pro Quartal', '1× pro Quartal', '1× pro Monat'] },
  { schluessel: 'community', name: 'Community-Betreuung', werte: [true, true, true] },
  { schluessel: 'rapport', name: 'Monatsrapport mit Empfehlung', werte: [true, true, true] },
  // Kommt mit Präsent dazu
  { schluessel: 'reels', name: 'Reels und Story-Formate', werte: [false, true, true] },
  { schluessel: 'meta', name: 'Kampagnen auf Meta und Instagram', werte: [false, true, true] },
  { schluessel: 'quartal', name: 'Quartalsplanung mit festen Zielen', werte: [false, true, true] },
  // Kommt mit Partner dazu
  { schluessel: 'linkedin', name: 'Kampagnen auf LinkedIn und Google', werte: [false, false, true] },
  { schluessel: 'partner', name: 'Fester Ansprechpartner', werte: [false, false, true] },
];

/** Ab welcher Stufe eine Zeile enthalten ist (0 = alle, 1 = ab Präsent …) */
const abStufe = (z: Zeile) => z.werte.findIndex((w) => w !== false);

/** Treppen-Sortierung: erst alles Gemeinsame, dann was Präsent ergänzt,
 *  dann was Partner ergänzt. Dadurch stehen die ausgegrauten Zeilen in
 *  JEDER Karte als zusammenhängender Block unten — die Stufen lesen sich
 *  als Ergänzung statt als Flickenteppich. Sort ist stabil, die
 *  Reihenfolge innerhalb einer Gruppe bleibt wie oben notiert. */
const SORTIERT: Zeile[] = [...LEISTUNGEN].sort((a, b) => abStufe(a) - abStufe(b));

/** Schweizer Tausendertrennung, bewusst ohne toLocaleString:
 *  Server und Browser dürfen sich hier nicht unterscheiden. */
const franken = (n: number) => `CHF ${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;

export default function Pricing() {
  const [monate, setMonate] = useState<6 | 12>(6);
  const [aktiveZeile, setAktiveZeile] = useState<string | null>(null);

  const zeilen = SORTIERT;

  return (
    <section className="section bg-[var(--violet)] text-[#fff]" data-nav="dark" id="preise">
      <div className="wrap">
        <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-4)]">
          <h2 className="sec-title mb-0" data-reveal>Leistung im Abo<span className="text-[var(--ink)]">.</span></h2>
          <p className="eyebrow mb-0 text-[rgb(255_255_255/0.7)]" data-decode>Preise · Monatsabo</p>
        </div>
        <p className="body-measure mt-[var(--s-5)] max-w-[52ch] text-[1.05rem] text-[rgb(255_255_255/0.85)]" data-reveal>
          Ein fester Monatsbetrag, eine feste Kapazität — Sie wissen vorher,
          was es kostet. Keine Stundenabrechnung, keine Überraschungen.
        </p>

        {/* Laufzeit-Schalter */}
        <div className="mt-[var(--s-7)] flex justify-center" data-reveal>
          <div
            role="group"
            aria-label="Laufzeit wählen"
            className="inline-flex items-center gap-[4px] rounded-full border border-[rgb(255_255_255/0.28)] bg-[rgb(20_0_60/0.22)] p-[5px] backdrop-blur-md"
          >
            {([6, 12] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMonate(m)}
                aria-pressed={monate === m}
                className={cn(
                  'inline-flex min-h-[44px] items-center gap-[0.5em] rounded-full px-[20px] text-[0.95rem] font-medium',
                  'transition-colors duration-[var(--dauer-2)] ease-[var(--ease-fluss)]',
                  monate === m
                    ? 'bg-[var(--cream)] text-[var(--ink)]'
                    : 'text-[rgb(255_255_255/0.8)] hover:text-[#fff]',
                )}
              >
                {m} Monate
                {m === 12 && (
                  <span
                    className={cn(
                      'rounded-full px-[8px] py-[2px] text-[0.72rem] font-semibold',
                      monate === 12 ? 'bg-[var(--violet)] text-[#fff]' : 'bg-[rgb(255_255_255/0.18)] text-[#fff]',
                    )}
                  >
                    −15%
                  </span>
                )}
              </button>
            ))}
          </div>

        </div>

        {/* Karten: gerade ausgerichtet, 3D nur als Tiefe */}
        <div className="mt-[var(--s-7)] grid items-stretch gap-[var(--s-5)] [perspective:1400px] min-[900px]:grid-cols-3">
          {STUFEN.map((s, i) => (
            <PreisKarte
              key={s.titel}
              stufe={s}
              spalte={i as 0 | 1 | 2}
              monate={monate}
              zeilen={zeilen}
              aktiveZeile={aktiveZeile}
              setAktiveZeile={setAktiveZeile}
            />
          ))}
        </div>

        <p className="mt-[var(--s-7)] max-w-[70ch] text-[0.9rem] leading-relaxed text-[rgb(255_255_255/0.75)]" data-reveal>
          Ausgegraute Zeilen sind im jeweiligen Abo nicht enthalten. Bei 12
          Monaten Laufzeit sind 15 % auf den Monatspreis bereits abgezogen.
          Werbebudget für Kampagnen geht direkt an die Plattformen und kommt
          zum Monatsbetrag dazu. Verbindlich ist die schriftliche Offerte nach
          dem Erstgespräch — was dazukommt, wird vorher offeriert, nicht
          nachträglich verrechnet.
        </p>
      </div>
    </section>
  );
}

function PreisKarte({
  stufe, spalte, monate, zeilen, aktiveZeile, setAktiveZeile,
}: {
  stufe: Stufe;
  spalte: 0 | 1 | 2;
  monate: 6 | 12;
  zeilen: Zeile[];
  aktiveZeile: string | null;
  setAktiveZeile: (s: string | null) => void;
}) {
  const dunkel = stufe.beliebt;
  const preis = monate === 12 ? Math.round(stufe.basis * (1 - RABATT_12)) : stufe.basis;

  return (
    <div data-reveal className={dunkel ? 'relative z-10' : undefined}>
      <div
        aria-label={`Abo ${stufe.titel}`}
        className={cn(
          'flex h-full flex-col rounded-[var(--radius-lg)] p-[clamp(24px,2.2vw,36px)]',
          // 3D nur als TIEFE: gerade ausgerichtet, Favorit tritt vor,
          // beim Überfahren hebt die Karte an. Keine Drehung.
          'transition-transform duration-[var(--dauer-3)] ease-[var(--ease-quart)] will-change-transform',
          dunkel
            ? 'bg-[var(--ink)] text-[var(--cream)] shadow-[0_46px_110px_rgb(20_0_60/0.5)] ring-1 ring-[color-mix(in_srgb,var(--violet-hell)_55%,transparent)] min-[900px]:[transform:translateZ(60px)] min-[900px]:hover:[transform:translateZ(60px)_translateY(-10px)]'
            : 'bg-[var(--cream)] text-[var(--ink)] shadow-[0_26px_64px_rgb(20_0_60/0.26)] min-[900px]:[transform:translateZ(0px)] min-[900px]:hover:[transform:translateZ(28px)]',
        )}
      >
        <div className="flex items-center gap-[var(--s-3)]">
          <Badge
            variant={dunkel ? 'default' : 'secondary'}
            className="px-3 py-1 text-[0.72rem] uppercase tracking-[0.1em]"
          >
            {stufe.titel}
          </Badge>
          {stufe.beliebt && (
            <span className="rounded-full bg-[color-mix(in_srgb,var(--violet-hell)_22%,transparent)] px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.1em] text-[var(--violet-hell)]">
              Beliebteste Wahl
            </span>
          )}
        </div>

        <p className="mt-[var(--s-6)] font-[family-name:var(--font-display)] text-[clamp(2rem,2.8vw,2.7rem)] font-semibold leading-none tracking-[-0.02em]">
          {franken(preis)}
          <span className={cn('ml-2 align-baseline text-[0.95rem] font-normal tracking-normal', dunkel ? 'text-[var(--grau-d)]' : 'text-[var(--grau-l)]')}>
            / Monat
          </span>
        </p>

        <p className={cn('mt-[var(--s-2)] text-[0.88rem]', dunkel ? 'text-[var(--grau-d)]' : 'text-[var(--grau-l)]')}>
          {monate === 12 ? (
            <>
              <span className="line-through">{franken(stufe.basis)}</span>
              {' · '}
              <span className={dunkel ? 'text-[var(--violet-hell)]' : 'text-[var(--violet)]'}>
                15 % gespart bei 12 Monaten
              </span>
            </>
          ) : (
            <>Laufzeit 6 Monate · 12 Monate sind 15 % günstiger</>
          )}
        </p>

        <p className={cn('mt-[var(--s-4)] text-[0.95rem] leading-[1.55]', dunkel ? 'text-[var(--grau-d)]' : 'text-[var(--grau-l)]')}>
          {stufe.beschreibung}
        </p>

        <div className={cn('my-[var(--s-5)] border-t', dunkel ? 'border-[rgb(243_238_227/0.16)]' : 'border-[rgb(14_13_11/0.14)]')} />

        {/* Gleiche Zeilen in jeder Karte, treppenförmig sortiert —
            nicht enthaltene stehen als Block unten und sind ausgegraut */}
        <ul className="grid gap-[2px]" onPointerLeave={() => setAktiveZeile(null)}>
          {zeilen.map((z, i) => {
            const wert = z.werte[spalte];
            const drin = wert !== false;
            const aktiv = aktiveZeile === z.schluessel;
            // Erste nicht enthaltene Zeile bekommt eine Überschrift —
            // so ist sofort klar: ab hier kommt, was die nächste Stufe bringt.
            const blockStart = !drin && zeilen[i - 1] && zeilen[i - 1].werte[spalte] !== false;
            return (
              <Fragment key={z.schluessel}>
              {blockStart && (
                <li aria-hidden="true" className="mt-[var(--s-4)] flex items-center gap-[0.7em] pb-[2px]">
                  <span className={cn('h-px flex-1', dunkel ? 'bg-[rgb(243_238_227/0.16)]' : 'bg-[rgb(14_13_11/0.14)]')} />
                  <span className={cn('text-[0.7rem] uppercase tracking-[0.12em]', dunkel ? 'text-[var(--grau-d)]' : 'text-[var(--grau-l)]')}>
                    Nicht enthalten
                  </span>
                  <span className={cn('h-px flex-1', dunkel ? 'bg-[rgb(243_238_227/0.16)]' : 'bg-[rgb(14_13_11/0.14)]')} />
                </li>
              )}
              <li
                onPointerEnter={() => setAktiveZeile(z.schluessel)}
                className={cn(
                  '-mx-[8px] flex items-start gap-[0.6em] rounded-[9px] px-[8px] py-[6px] text-[0.92rem] leading-[1.45]',
                  'transition-[background-color,opacity] duration-[var(--dauer-1)] ease-[var(--ease-fluss)]',
                  drin ? '' : dunkel ? 'text-[var(--grau-d)] opacity-45' : 'text-[var(--grau-l)] opacity-50',
                  aktiv && (dunkel ? 'bg-[rgb(243_238_227/0.09)]' : 'bg-[rgb(14_13_11/0.05)]'),
                )}
              >
                {drin ? (
                  <CircleCheck
                    aria-hidden
                    size={18}
                    className={cn('mt-[2px] shrink-0', dunkel ? 'text-[var(--violet-hell)]' : 'text-[var(--violet)]')}
                  />
                ) : (
                  <CircleMinus aria-hidden size={18} className="mt-[2px] shrink-0 opacity-70" />
                )}
                <span>
                  {z.name}
                  {typeof wert === 'string' && (
                    <span className="font-semibold"> · {wert}</span>
                  )}
                  {!drin && <span className="sr-only"> — nicht enthalten</span>}
                </span>
              </li>
              </Fragment>
            );
          })}
        </ul>

        <div className="mt-auto pt-[var(--s-6)]">
          <Link
            href="/#termin"
            className={cn('btn w-full justify-center', dunkel ? 'btn--primary' : 'btn--dunkel')}
          >
            {stufe.cta}&nbsp;→
          </Link>
        </div>
      </div>
    </div>
  );
}
