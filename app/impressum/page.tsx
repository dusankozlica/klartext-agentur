import type { Metadata } from 'next';
import Link from 'next/link';
import { site, hatWert, offeneStammdaten } from '@/lib/content/site';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und Kontaktangaben von KLARTEXT.',
  alternates: { canonical: '/impressum' },
};

/**
 * Impressum.
 *
 * Struktur nach UWG Art. 3 Abs. 1 lit. s: vollständige Kontaktangaben mit
 * Postadresse und einem direkten Kommunikationsweg.
 *
 * Felder, die noch nicht gesetzt sind, werden weggelassen statt erfunden.
 * Der Hinweiskasten am Ende erscheint nur, solange etwas fehlt, und
 * verschwindet automatisch — er ist die interne Erinnerung, keine Ausrede.
 */
export default function Page() {
  const offen = offeneStammdaten();

  return (
    <section className="section bg-[var(--paper)] pt-[calc(var(--sec-y)+40px)]">
      <div className="wrap">
        <h1 className="sec-title">Impressum</h1>

        <div className="body-measure grid gap-[var(--s-7)]">
          <div>
            <h2 className="eyebrow">Verantwortlich für den Inhalt</h2>
            <p>{site.name}</p>
            {hatWert(site.rechtsform) && <p>{site.rechtsform}</p>}
          </div>

          {hatWert(site.adresse.strasse) && (
            <div>
              <h2 className="eyebrow">Adresse</h2>
              <p>{site.adresse.strasse}</p>
              <p>{site.adresse.plz} {site.adresse.ort}</p>
              <p>Schweiz</p>
            </div>
          )}

          {(hatWert(site.kontakt.email) || hatWert(site.kontakt.telefon)) && (
            <div>
              <h2 className="eyebrow">Kontakt</h2>
              {hatWert(site.kontakt.email) && (
                <p>
                  E-Mail:{' '}
                  <a href={`mailto:${site.kontakt.email}`} className="underline underline-offset-4">
                    {site.kontakt.email}
                  </a>
                </p>
              )}
              {hatWert(site.kontakt.telefon) && <p>Telefon: {site.kontakt.telefon}</p>}
            </div>
          )}

          {hatWert(site.mwstNummer) && (
            <div>
              <h2 className="eyebrow">Mehrwertsteuer</h2>
              <p>{site.mwstNummer}</p>
            </div>
          )}

          <div>
            <h2 className="eyebrow">Haftung</h2>
            <p>
              Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für
              Richtigkeit, Vollständigkeit und Aktualität wird keine Gewähr
              übernommen. Für die Inhalte verlinkter externer Seiten sind
              ausschliesslich deren Betreiber verantwortlich.
            </p>
          </div>

          <div>
            <h2 className="eyebrow">Urheberrecht</h2>
            <p>
              Texte, Bilder und Gestaltung dieser Website sind urheberrechtlich
              geschützt. Eine Verwendung ausserhalb der gesetzlichen Schranken
              bedarf der schriftlichen Zustimmung.
            </p>
          </div>

          <div>
            <h2 className="eyebrow">Kundenangaben auf dieser Seite</h2>
            <p>
              Referenzen sind anonymisiert dargestellt, solange keine
              schriftliche Freigabe des jeweiligen Kunden vorliegt. Kennzahlen
              werden nur mit Angabe der Messmethode und des Zeitraums
              veröffentlicht.
            </p>
          </div>
        </div>

        {offen.length > 0 && (
          <aside className="mt-[var(--s-9)] border-l-4 border-current bg-[var(--cream-tint)] p-[var(--s-6)]">
            <p className="eyebrow mb-[var(--s-3)]">Vor dem Aufschalten</p>
            <p className="body-measure">
              Für ein rechtsgültiges Impressum fehlen noch:{' '}
              <strong>{offen.join(', ')}</strong>. Diese Angaben werden in{' '}
              <code>lib/content/site.ts</code> gesetzt und wirken von dort auf
              Impressum, Footer, Kontaktseite und strukturierte Daten.
            </p>
            <p className="body-measure mt-[var(--s-3)]">
              Dieser Hinweis verschwindet automatisch, sobald alles gesetzt ist.{' '}
              <Link href="/kontakt" className="underline underline-offset-4">
                Zur Kontaktseite
              </Link>
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}
