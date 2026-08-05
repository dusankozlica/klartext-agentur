import type { Metadata } from 'next';

import PageHero from '@/components/ui/PageHero';
import KontaktFormular from '@/components/sections/KontaktFormular';
import TerminKalender from '@/components/sections/TerminKalender';
import JsonLd from '@/components/seo/JsonLd';
import { site, hatWert } from '@/lib/content/site';
import { breadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Erstgespräch vereinbaren — 30 Minuten, ohne Kosten.',
  alternates: { canonical: '/kontakt' },
};

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Start', pfad: '/' },
        { name: 'Kontakt', pfad: '/kontakt' },
      ])} />

      <PageHero
        eyebrow="Kontakt"
        zeilen={['Reden wir', 'Klartext.']}
        lead="Ein Gespräch, rund 30 Minuten, ohne Kosten. Danach wissen Sie, ob wir zueinander passen."
      />

      <section className="section bg-[var(--paper)]">
        <div className="wrap grid gap-[var(--s-9)] lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
          <div>
            <h2 className="sec-title">Schreiben</h2>
            <p className="body-measure mb-[var(--s-7)] opacity-80">
              Ein paar Sätze genügen: was Sie tun, was gerade hakt, was Sie sich
              erhoffen. Wir melden uns innerhalb von zwei Arbeitstagen.
            </p>
            <KontaktFormular />
          </div>

          <div>
            <h2 className="sec-title">Oder direkt einen Termin</h2>
            <TerminKalender />

            {(hatWert(site.kontakt.email) || hatWert(site.kontakt.telefon) || hatWert(site.adresse.strasse)) && (
              <div className="mt-[var(--s-8)] border-t border-current/20 pt-[var(--s-6)]">
                <p className="eyebrow">Direkt</p>
                <ul className="grid gap-[var(--s-2)]">
                  {hatWert(site.kontakt.email) && (
                    <li><a href={`mailto:${site.kontakt.email}`} className="underline underline-offset-4">{site.kontakt.email}</a></li>
                  )}
                  {hatWert(site.kontakt.telefon) && (
                    <li><a href={`tel:${site.kontakt.telefon.replace(/\s/g, '')}`} className="underline underline-offset-4">{site.kontakt.telefon}</a></li>
                  )}
                  {hatWert(site.adresse.strasse) && (
                    <li>{site.adresse.strasse}, {site.adresse.plz} {site.adresse.ort}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
