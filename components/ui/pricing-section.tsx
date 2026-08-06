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
 * Marketing) von Dusan am 06.08.2026 vorgegeben. Werbebudget läuft laut
 * Fussnote separat; verbindlich bleibt die schriftliche Offerte.
 */
type Stufe = {
  titel: string;
  preis: string;
  einheit: string;
  beschreibung: string;
  punkte: string[];
  cta: string;
  beliebt?: boolean;
};

const STUFEN: Stufe[] = [
  {
    titel: 'Sichtbar',
    preis: "CHF 1'499",
    einheit: '/ Monat',
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
    preis: "CHF 1'999",
    einheit: '/ Monat',
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
    preis: "CHF 2'999",
    einheit: '/ Monat',
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

export default function Pricing() {
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

        <div className="mt-[var(--s-8)] grid gap-[var(--s-5)] min-[900px]:grid-cols-3">
          {STUFEN.map((s) => (
            <PreisKarte key={s.titel} stufe={s} />
          ))}
        </div>

        <p className="mt-[var(--s-7)] max-w-[66ch] text-[0.9rem] leading-relaxed text-[rgb(255_255_255/0.75)]" data-reveal>
          Werbebudget für Kampagnen geht direkt an die Plattformen und kommt
          zum Monatsbetrag dazu. Verbindlich ist die schriftliche Offerte nach
          dem Erstgespräch — was dazukommt, wird vorher offeriert, nicht
          nachträglich verrechnet.
        </p>
      </div>
    </section>
  );
}

function PreisKarte({ stufe }: { stufe: Stufe }) {
  const dunkel = stufe.beliebt;

  return (
    <div
      className={cn(
        'flex flex-col rounded-[var(--radius-lg)] p-[clamp(24px,2.2vw,36px)]',
        dunkel
          ? 'bg-[var(--ink)] text-[var(--cream)] shadow-[0_30px_80px_rgb(20_0_60/0.35)]'
          : 'bg-[var(--cream)] text-[var(--ink)]',
      )}
      aria-label={`Abo ${stufe.titel}`}
      data-reveal
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
        {stufe.preis}
        <span className={cn('ml-2 align-baseline text-[0.95rem] font-normal tracking-normal', dunkel ? 'text-[var(--grau-d)]' : 'text-[var(--grau-l)]')}>
          {stufe.einheit}
        </span>
      </p>
      <p className={cn('mt-[var(--s-3)] text-[0.95rem] leading-[1.55]', dunkel ? 'text-[var(--grau-d)]' : 'text-[var(--grau-l)]')}>
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
  );
}
