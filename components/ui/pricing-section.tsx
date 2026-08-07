'use client';

import { Fragment, useRef, useState } from 'react';
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
  const sektion = useRef<HTMLElement>(null);
  const zeilen = SORTIERT;

  /* Zeilen-Hervorhebung ohne React-Zustand: Beim Überfahren wird in
     allen drei Karten dieselbe Zeile per Klasse markiert. Ein State
     würde die ganze Sektion neu aufbauen — das kostet Bildrate, und
     die zeigt sich sofort als träge Maus. */
  const markiere = (schluessel: string | null) => {
    const el = sektion.current;
    if (!el) return;
    el.querySelectorAll('.preis-zeile.is-markiert').forEach((n) => n.classList.remove('is-markiert'));
    if (schluessel) {
      el.querySelectorAll(`.preis-zeile[data-z="${schluessel}"]`).forEach((n) => n.classList.add('is-markiert'));
    }
  };

  return (
    <section ref={sektion} className="section relative overflow-hidden bg-[var(--violet)] text-[#fff]" data-nav="dark" id="preise">
      {/* Tiefe hinter dem Glas: Riesenwort + zwei weiche Lichter.
          Ohne etwas dahinter hätte der Milchglas-Effekt nichts zu
          brechen — die Karten sähen nur wie flache Kästen aus. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute left-[-6%] top-[16%] h-[46vw] w-[46vw] rounded-full bg-[radial-gradient(circle,rgb(165_123_255/0.55),transparent_65%)] blur-[40px]" />
        <span className="absolute right-[-10%] top-[42%] h-[40vw] w-[40vw] rounded-full bg-[radial-gradient(circle,rgb(74_0_170/0.75),transparent_65%)] blur-[40px]" />
        <span className="absolute inset-x-0 top-[26%] select-none whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[17vw] font-semibold leading-none tracking-[-0.03em] text-[rgb(255_255_255/0.09)]">
          Preise
        </span>
      </div>
      <div className="wrap relative">
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
              markiere={markiere}
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
  stufe, spalte, monate, zeilen, markiere,
}: {
  stufe: Stufe;
  spalte: 0 | 1 | 2;
  monate: 6 | 12;
  zeilen: Zeile[];
  markiere: (s: string | null) => void;
}) {
  const hervor = stufe.beliebt;   // Favorit: heller, grösser, davor
  const preis = monate === 12 ? Math.round(stufe.basis * (1 - RABATT_12)) : stufe.basis;

  return (
    <div data-reveal className={hervor ? 'relative z-10' : undefined}>
      <div
        aria-label={`Abo ${stufe.titel}`}
        className={cn(
          'preis-glas flex h-full flex-col rounded-[28px] p-[clamp(24px,2.2vw,36px)] text-[#fff]',
          // 3D bleibt reine Tiefe: gerade ausgerichtet, Favorit tritt vor.
          'transition-transform duration-[var(--dauer-3)] ease-[var(--ease-quart)]',
          hervor
            ? 'preis-glas--hervor min-[900px]:[transform:translateZ(60px)] min-[900px]:hover:[transform:translateZ(60px)_translateY(-10px)]'
            : 'min-[900px]:[transform:translateZ(0px)] min-[900px]:hover:[transform:translateZ(28px)]',
        )}
      >
        <div className="flex items-center gap-[var(--s-3)]">
          <Badge
            variant={hervor ? 'default' : 'secondary'}
            className={cn(
              'border px-3 py-1 text-[0.72rem] uppercase tracking-[0.1em]',
              hervor
                ? 'border-transparent bg-[var(--cream)] text-[var(--ink)]'
                : 'border-[rgb(255_255_255/0.28)] bg-[rgb(255_255_255/0.1)] text-[#fff]',
            )}
          >
            {stufe.titel}
          </Badge>
          {stufe.beliebt && (
            <span className="rounded-full border border-[rgb(255_255_255/0.3)] px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.1em] text-[rgb(255_255_255/0.85)]">
              Beliebteste Wahl
            </span>
          )}
        </div>

        <p className="mt-[var(--s-6)] font-[family-name:var(--font-display)] text-[clamp(2rem,2.8vw,2.7rem)] font-semibold leading-none tracking-[-0.02em]">
          {franken(preis)}
          <span className="ml-2 align-baseline text-[0.95rem] font-normal tracking-normal text-[rgb(255_255_255/0.7)]">
            / Monat
          </span>
        </p>

        <p className="mt-[var(--s-2)] text-[0.88rem] text-[rgb(255_255_255/0.72)]">
          {monate === 12 ? (
            <>
              <span className="line-through">{franken(stufe.basis)}</span>
              {' · '}
              <span className="text-[#fff]">15 % gespart bei 12 Monaten</span>
            </>
          ) : (
            <>Laufzeit 6 Monate · 12 Monate sind 15 % günstiger</>
          )}
        </p>

        <p className="mt-[var(--s-4)] text-[0.95rem] leading-[1.55] text-[rgb(255_255_255/0.78)]">
          {stufe.beschreibung}
        </p>

        <div className="my-[var(--s-5)] border-t border-[rgb(255_255_255/0.18)]" />

        {/* Gleiche Zeilen in jeder Karte, treppenförmig sortiert —
            nicht enthaltene stehen als Block unten und sind ausgegraut */}
        <ul className="grid gap-[2px]" onPointerLeave={() => markiere(null)}>
          {zeilen.map((z, i) => {
            const wert = z.werte[spalte];
            const drin = wert !== false;
            // Erste nicht enthaltene Zeile bekommt eine Überschrift —
            // so ist sofort klar: ab hier kommt, was die nächste Stufe bringt.
            const blockStart = !drin && zeilen[i - 1] && zeilen[i - 1].werte[spalte] !== false;
            return (
              <Fragment key={z.schluessel}>
              {blockStart && (
                <li aria-hidden="true" className="mt-[var(--s-4)] flex items-center gap-[0.7em] pb-[2px]">
                  <span className="h-px flex-1 bg-[rgb(255_255_255/0.18)]" />
                  <span className="text-[0.7rem] uppercase tracking-[0.12em] text-[rgb(255_255_255/0.6)]">
                    Nicht enthalten
                  </span>
                  <span className="h-px flex-1 bg-[rgb(255_255_255/0.18)]" />
                </li>
              )}
              <li
                data-z={z.schluessel}
                onPointerEnter={() => markiere(z.schluessel)}
                className={cn(
                  'preis-zeile -mx-[8px] flex items-start gap-[0.6em] rounded-[9px] px-[8px] py-[6px] text-[0.92rem] leading-[1.45]',
                  drin ? '' : 'text-[rgb(255_255_255/0.55)] opacity-70',
                )}
              >
                {drin ? (
                  <CircleCheck
                    aria-hidden
                    size={18}
                    className="mt-[2px] shrink-0 text-[#fff]"
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
            className={cn(
              'btn w-full justify-center border-0',
              hervor
                ? 'bg-[var(--cream)] text-[var(--ink)] hover:text-[var(--ink)]'
                : 'bg-[rgb(255_255_255/0.12)] text-[#fff] ring-1 ring-inset ring-[rgb(255_255_255/0.35)]',
            )}
          >
            {stufe.cta}&nbsp;→
          </Link>
        </div>
      </div>
    </div>
  );
}
