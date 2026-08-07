'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CircleCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Preis-Sektion für das Abo-Modell, aus der shadcn-Registry-Vorlage
 * («pricing-section») auf KLARTEXT übersetzt: violette Vollflächen-Bühne,
 * Creme-Karten mit einer Ink-Karte als Favorit, Pillen-CTAs zur
 * Terminbuchung statt Stripe-Links.
 *
 * Preise 1'499/1'999/2'999 und Fokus (Social-Media-Content, Performance
 * Marketing) von Dusan am 06.08.2026 vorgegeben; Laufzeit-Schalter mit
 * 15% Rabatt auf den Monatspreis bei 12 Monaten am 07.08. dazu. Die
 * Rabattpreise werden GERECHNET, nicht getippt — so kann keine falsche
 * Zahl entstehen. Verbindlich bleibt die schriftliche Offerte.
 */
type Stufe = {
  titel: string;
  basis: number;          // Monatspreis bei 6 Monaten Laufzeit
  beschreibung: string;
  punkte: string[];
  cta: string;
  beliebt?: boolean;
};

const RABATT_12 = 0.15;

const STUFEN: Stufe[] = [
  {
    titel: 'Sichtbar',
    basis: 1499,
    beschreibung: 'Der Content-Grundbetrieb: Ihre Kanäle laufen verlässlich, ohne dass es intern jemanden auffrisst.',
    punkte: [
      'Redaktionsplan und 8 Beiträge pro Monat',
      'Ein Drehtag pro Quartal bei Ihnen',
      'Veröffentlichung und Community-Betreuung',
      'Monatsrapport, der in einer Empfehlung endet',
    ],
    cta: 'Abo anfragen',
  },
  {
    titel: 'Präsent',
    beliebt: true,
    basis: 1999,
    beschreibung: 'Mehr Content plus Performance Marketing: gesehen werden — und gezielt Anfragen holen.',
    punkte: [
      'Alles aus Sichtbar',
      '12 Beiträge pro Monat plus Reel- und Story-Formate',
      'Performance-Kampagnen auf Meta und Instagram',
      'Monatliche Auswertung mit klarer Empfehlung',
    ],
    cta: 'Abo anfragen',
  },
  {
    titel: 'Partner',
    basis: 2999,
    beschreibung: 'Die volle Bespielung: Content, Kampagnen und ein fester Ansprechpartner für alles.',
    punkte: [
      'Alles aus Präsent',
      'Ein Drehtag pro Monat bei Ihnen',
      'Kampagnen über Meta, LinkedIn und Google',
      'Quartalsplanung, fester Ansprechpartner, kurze Wege',
    ],
    cta: 'Abo anfragen',
  },
];

/** Schweizer Tausendertrennung, bewusst ohne toLocaleString:
 *  Server und Browser dürfen sich hier nicht unterscheiden. */
const franken = (n: number) => `CHF ${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;

export default function Pricing() {
  const [monate, setMonate] = useState<6 | 12>(6);

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
                      monate === 12
                        ? 'bg-[var(--violet)] text-[#fff]'
                        : 'bg-[rgb(255_255_255/0.18)] text-[#fff]',
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
          {STUFEN.map((s) => (
            <PreisKarte key={s.titel} stufe={s} monate={monate} />
          ))}
        </div>

        <p className="mt-[var(--s-7)] max-w-[70ch] text-[0.9rem] leading-relaxed text-[rgb(255_255_255/0.75)]" data-reveal>
          Bei 12 Monaten Laufzeit sind 15 % auf den Monatspreis bereits
          abgezogen. Werbebudget für Kampagnen geht direkt an die Plattformen
          und kommt zum Monatsbetrag dazu. Verbindlich ist die schriftliche
          Offerte nach dem Erstgespräch — was dazukommt, wird vorher offeriert,
          nicht nachträglich verrechnet.
        </p>
      </div>
    </section>
  );
}

function PreisKarte({ stufe, monate }: { stufe: Stufe; monate: 6 | 12 }) {
  const dunkel = stufe.beliebt;
  const preis = monate === 12 ? Math.round(stufe.basis * (1 - RABATT_12)) : stufe.basis;

  return (
    <div data-reveal className={dunkel ? 'relative z-10' : undefined}>
      <div
        aria-label={`Abo ${stufe.titel}`}
        className={cn(
          'flex h-full flex-col rounded-[var(--radius-lg)] p-[clamp(24px,2.2vw,36px)]',
          // 3D nur als TIEFE: gerade ausgerichtet, Favorit tritt vor,
          // beim Überfahren hebt die Karte an. Keine Drehung (Dusan:
          // verdrehte Karten gefallen nicht).
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

        {/* Ersparnis nur zeigen, wenn sie auch gilt */}
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

        <ul className="grid gap-[var(--s-3)]">
          {stufe.punkte.map((punkt) => (
            <li key={punkt} className="flex items-start gap-[0.6em] text-[0.95rem] leading-[1.5]">
              <CircleCheck
                aria-hidden
                size={18}
                className={cn('mt-[2px] shrink-0', dunkel ? 'text-[var(--violet-hell)]' : 'text-[var(--violet)]')}
              />
              <span>{punkt}</span>
            </li>
          ))}
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
