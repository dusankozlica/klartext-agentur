import type { Metadata } from 'next';
import { site, hatWert } from '@/lib/content/site';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Wie diese Website mit Daten umgeht.',
  alternates: { canonical: '/datenschutz' },
};

/**
 * Datenschutzerklärung — Struktur nach revDSG, mit Blick auf Besucher aus
 * der EU (DSGVO).
 *
 * WICHTIG: Das ist ein Gerüst, das den tatsächlichen technischen Aufbau
 * dieser Seite beschreibt — keine Rechtsberatung und keine geprüfte
 * Erklärung. Vor dem Launch muss sie fachlich abgenommen werden.
 *
 * Was hier steht, entspricht dem, was die Seite heute wirklich tut:
 * selbst gehostete Schriften, keine Analytics, kein Consent-Banner,
 * Cal.com und Turnstile erst nach Interaktion bzw. nur wenn konfiguriert.
 */
export default function Page() {
  return (
    <section className="section bg-[var(--paper)] pt-[calc(var(--sec-y)+40px)]">
      <div className="wrap">
        <h1 className="sec-title">Datenschutzerklärung</h1>

        <div className="body-measure grid gap-[var(--s-7)]">
          <div>
            <h2 className="eyebrow">Verantwortliche Stelle</h2>
            <p>
              {site.name}
              {hatWert(site.adresse.strasse) &&
                `, ${site.adresse.strasse}, ${site.adresse.plz} ${site.adresse.ort}`}
            </p>
            {hatWert(site.kontakt.email) && <p>E-Mail: {site.kontakt.email}</p>}
          </div>

          <div>
            <h2 className="eyebrow">Server-Logdateien</h2>
            <p>
              Beim Aufruf dieser Website verarbeitet der Hostinganbieter
              technisch notwendige Daten wie IP-Adresse, Zeitpunkt, aufgerufene
              Seite und Browsertyp. Diese Daten sind für den sicheren Betrieb
              erforderlich und werden nicht mit anderen Quellen zusammengeführt.
            </p>
            <p className="mt-[var(--s-3)]">
              Diese Daten werden nicht dazu verwendet, einzelne Personen
              wiederzuerkennen, und nicht an Dritte weitergegeben.
            </p>
          </div>

          <div>
            <h2 className="eyebrow">Schriften</h2>
            <p>
              Die verwendeten Schriften werden von unserem eigenen Server
              ausgeliefert. Es entsteht keine Verbindung zu Google Fonts oder
              einem anderen Drittanbieter.
            </p>
          </div>

          <div>
            <h2 className="eyebrow">Cookies und Statistik</h2>
            <p>
              Diese Website setzt keine Cookies zu Werbe- oder Analysezwecken
              und verwendet keine Reichweitenmessung, die einzelne Personen
              wiedererkennt. Deshalb erscheint auch kein Cookie-Banner.
            </p>
            <p className="mt-[var(--s-3)]">
              Sollte später eine Reichweitenmessung dazukommen, wird sie an
              dieser Stelle beschrieben — inklusive Anbieter und Serverstandort.
            </p>
          </div>

          <div>
            <h2 className="eyebrow">Kontaktformular</h2>
            <p>
              Die im Formular eingegebenen Angaben werden ausschliesslich zur
              Bearbeitung Ihrer Anfrage verwendet. Zum Schutz vor automatisierten
              Zusendungen prüfen wir technische Merkmale des Absendevorgangs und
              begrenzen die Anzahl Anfragen pro Anschluss.
            </p>
            <p className="mt-[var(--s-3)]">
              Die Anfrage wird per E-Mail an uns zugestellt und dort so lange
              aufbewahrt, wie es für die Bearbeitung und allfällige Rückfragen
              nötig ist. Eine Weitergabe zu Werbezwecken findet nicht statt.
            </p>
          </div>

          <div>
            <h2 className="eyebrow">Terminbuchung</h2>
            <p>
              Der Buchungskalender wird von einem externen Anbieter
              bereitgestellt und erst geladen, wenn Sie ihn ausdrücklich öffnen.
              Vorher wird keine Verbindung zu diesem Anbieter hergestellt.
            </p>
          </div>

          <div>
            <h2 className="eyebrow">Videos</h2>
            <p>
              Videos werden erst nach einem Klick geladen. Bis dahin sehen Sie
              lediglich ein Vorschaubild von unserem eigenen Server.
            </p>
          </div>

          <div>
            <h2 className="eyebrow">Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft über die zu Ihrer Person
              bearbeiteten Daten sowie auf Berichtigung oder Löschung. Wenden Sie
              sich dazu an die oben genannte Adresse.
            </p>
          </div>

          <div>
            <h2 className="eyebrow">Besucher aus der EU</h2>
            <p>
              Für Besucherinnen und Besucher aus dem EU-Raum gelten zusätzlich
              die Rechte nach DSGVO, insbesondere auf Datenübertragbarkeit,
              Einschränkung der Bearbeitung und Beschwerde bei einer
              Aufsichtsbehörde.
            </p>
          </div>
        </div>

        <aside className="mt-[var(--s-9)] border-l-4 border-current bg-[var(--cream-tint)] p-[var(--s-6)]">
          <p className="eyebrow mb-[var(--s-3)]">Hinweis</p>
          <p className="body-measure">
            Dieser Text beschreibt den tatsächlichen technischen Aufbau dieser
            Seite. Er ist keine Rechtsberatung und wurde nicht juristisch
            geprüft — diese Abnahme muss vor dem Aufschalten erfolgen.
          </p>
        </aside>
      </div>
    </section>
  );
}
