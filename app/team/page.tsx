import type { Metadata } from 'next';
import Link from 'next/link';

import PageHero from '@/components/ui/PageHero';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import JsonLd from '@/components/seo/JsonLd';
import { team, personTitel } from '@/lib/content/team';
import { breadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Team',
  description: 'Wer bei KLARTEXT. arbeitet und wie wir arbeiten.',
  alternates: { canonical: '/team' },
};

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Start', pfad: '/' },
        { name: 'Team', pfad: '/team' },
      ])} />

      <PageHero
        eyebrow="Team"
        zeilen={['Kleine Truppe.', 'Kurze Wege.']}
        lead="Wer im Erstgespräch sitzt, arbeitet auch am Projekt — keine Übergaben, keine Zwischenschichten."
      />

      <section className="section bg-[var(--paper)]">
        <div className="wrap grid gap-[var(--s-8)] md:grid-cols-[4fr_8fr]">
          <p className="eyebrow self-start" data-reveal>Haltung</p>
          <div>
            <p className="body-measure font-[family-name:var(--font-display)] text-[clamp(1.4rem,2.4vw,2.1rem)] font-semibold leading-[1.2] tracking-[-0.02em]" data-reveal>
              Sie reden mit den Leuten, die die Arbeit machen. Nicht mit einem
              Kundenbetreuer, der es weitergibt.
            </p>
            <p className="body-measure mt-[var(--s-6)] opacity-80" data-reveal>
              Wir sind bewusst klein geblieben. Das heisst: Wer im Erstgespräch
              sitzt, arbeitet auch am Projekt. Es gibt keine Übergabe an ein
              Team, das Sie nie kennengelernt haben.
            </p>
            <p className="body-measure mt-[var(--s-5)] opacity-80" data-reveal>
              Es heisst auch, dass wir nicht jedes Mandat annehmen. Wenn wir für
              eine Aufgabe nicht die Richtigen sind, sagen wir das im ersten
              Gespräch — meistens kennen wir jemanden, der besser passt.
            </p>
          </div>
        </div>
      </section>

      {/* ESE-Team-Referenz: grosse Farbporträts auf Schwarz, Info-Zeile
          mit Haarlinie darunter. ESE zeigt dort E-Mail/Telefon pro Kopf —
          bei uns erst, wenn echte Kontaktdaten existieren. */}
      <section className="section bg-[var(--ink)] text-[var(--cream)]" data-nav="dark">
        <div className="wrap">
          <h2 className="sec-title" data-reveal>Die Leute</h2>
          <ul className="grid gap-x-[var(--s-5)] gap-y-[var(--s-8)] sm:grid-cols-2 lg:grid-cols-4">
            {team.map((p) => (
              <li key={p.id} data-reveal>
                <span className="group relative block overflow-hidden rounded-[var(--radius)]">
                  <PlaceholderImage
                    slot={p.bildSlot}
                    alt=""
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="aspect-[3/4] transition-transform duration-[var(--dauer-3)] ease-[var(--ease-quart)] group-hover:scale-[1.03]"
                  />
                </span>
                <div className="mt-[var(--s-4)] border-t border-[color-mix(in_srgb,var(--cream)_30%,transparent)] pt-[var(--s-3)]">
                  <p className="font-[family-name:var(--font-display)] text-[1.2rem] font-semibold tracking-[-0.02em]">
                    {personTitel(p)}
                  </p>
                  {p.freigabeVorhanden && p.name.trim() && (
                    <p className="text-[0.9rem] text-[var(--grau-d)]">{p.rolle}</p>
                  )}
                  <p className="mt-[var(--s-3)] text-[0.95rem] text-[var(--grau-d)]">{p.satz}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-[var(--cream)]">
        <div className="wrap">
          <h2 className="sec-title" data-reveal>Lieber persönlich?</h2>
          <p className="body-measure mb-[var(--s-7)] opacity-80" data-reveal>
            Rund 30 Minuten, ohne Kosten und ohne Verpflichtung. Sie erzählen,
            wo es hakt — wir sagen, ob und wie wir helfen können.
          </p>
          <Link className="btn btn--primary" href="/kontakt">Erstgespräch buchen</Link>
        </div>
      </section>
    </>
  );
}
