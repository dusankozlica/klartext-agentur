/**
 * Referenzen — Repository-Modul.
 *
 * Die Fälle sind anonymisiert: Branche, Grösse und Ausgangslage stehen da,
 * der Firmenname nicht. Das ist kein Platzhalter, sondern eine Haltung —
 * Kundennamen und Zahlen erscheinen erst mit schriftlicher Freigabe.
 *
 * Erfundene Kennzahlen gibt es hier nicht. `belastbareKennzahlen()` gibt nur
 * aus, was Messmethode UND Zeitraum trägt; solange nichts freigegeben ist,
 * bleibt der Abschnitt leer und die Seite sagt offen, warum.
 */

export type Kennzahl = {
  wert: string;
  label: string;
  messmethode: string;
  zeitraum: string;
};

export type Project = {
  slug: string;
  /** Anonymisierte Bezeichnung, z. B. „Schreinerei, 24 Mitarbeitende“ */
  kunde: string;
  /** Echter Firmenname — erscheint nur mit Freigabe */
  firmenname?: string;
  branche: string;
  zeitraum: string;
  leistungen: string[];
  /** Ein Satz für Übersichten */
  ergebnisSatz: string;
  ausgangslage: string;
  vorgehen: { titel: string; text: string }[];
  kennzahlen: Kennzahl[];
  zitat?: { text: string; person: string; funktion: string; freigabeVorhanden: boolean };
  coverSlot: string;
  bildSlots: string[];
  videoSlot?: string;
  freigabeVorhanden: boolean;
};

export const projects: Project[] = [
  {
    slug: 'schreinerei-marke-und-website',
    kunde: 'Schreinerei im Mittelland',
    branche: 'Handwerk',
    zeitraum: 'Projekt über vier Monate',
    leistungen: ['Branding', 'Webdesign'],
    ergebnisSatz:
      'Aus „wir machen alles aus Holz“ wurde ein Betrieb mit einer klaren Antwort auf die Frage, wofür er steht.',
    ausgangslage:
      'Ein Familienbetrieb in dritter Generation, gut ausgelastet, aber mit den falschen Aufträgen: viele kleine Reparaturen, wenig von dem, was der Betrieb eigentlich am besten kann. Der Auftritt bestand aus einem Logo von 1998 und einer Website, auf der alles gleich wichtig war.',
    vorgehen: [
      {
        titel: 'Gespräche statt Fragebogen',
        text: 'Wir haben mit der Geschäftsleitung, zwei Mitarbeitenden aus der Werkstatt und drei Kunden gesprochen. Die Kunden nannten immer dieselbe Stärke — und die stand nirgends auf der Website.',
      },
      {
        titel: 'Positionierung auf einen Satz',
        text: 'Diese Stärke wurde zur Positionierung. Alles, was der Betrieb zwar kann, aber nicht sucht, tritt seither in den Hintergrund.',
      },
      {
        titel: 'Marke als System',
        text: 'Wortmarke, Farben, Schrift und Bildsprache — plus Vorlagen für Offerten und Beschriftung, damit der Auftritt auch im Alltag hält.',
      },
      {
        titel: 'Website mit einem Ziel',
        text: 'Eine Seite, die auf die Anfrage für genau diese Arbeiten hinführt. Reparaturen stehen weiterhin drauf, aber nicht mehr an erster Stelle.',
      },
    ],
    kennzahlen: [],
    coverSlot: 'projects/case-01-cover',
    bildSlots: ['projects/case-detail-wide', 'projects/case-detail-tall'],
    freigabeVorhanden: false,
  },
  {
    slug: 'dienstleister-social-media-betrieb',
    kunde: 'Dienstleistungsbetrieb, rund 40 Mitarbeitende',
    branche: 'Dienstleistung',
    zeitraum: 'Laufende Betreuung seit über einem Jahr',
    leistungen: ['Social Media', 'Marketingpartner'],
    ergebnisSatz:
      'Von zwei Beiträgen im Jahr zu einem Rhythmus, der ohne interne Nachtschicht funktioniert.',
    ausgangslage:
      'Zwei angelegte Profile, der letzte Beitrag über ein Jahr alt. Intern war klar, dass etwas passieren müsste, aber die Zuständigkeit lag bei einer Person, die eigentlich einen anderen Job hat. Jeder Anlauf endete nach drei Wochen.',
    vorgehen: [
      {
        titel: 'Themen aus dem Betrieb holen',
        text: 'Nicht die Geschäftsleitung liefert die Themen, sondern die Leute, die die Arbeit machen. Ein Nachmittag in den Abteilungen ergab genug Stoff für ein halbes Jahr.',
      },
      {
        titel: 'Quartalsdrehtag',
        text: 'Statt wöchentlicher Kleinproduktion ein Drehtag pro Quartal. Das reduziert die Störung des Tagesgeschäfts auf vier Tage im Jahr.',
      },
      {
        titel: 'Freigaben bündeln',
        text: 'Ein Freigabetermin pro Monat für den ganzen Monat. Nicht jeder Beitrag einzeln durch drei Instanzen.',
      },
      {
        titel: 'Monatlich nachschärfen',
        text: 'Was funktioniert hat, wird ausgebaut. Was nicht, verschwindet — auch wenn es intern beliebt war.',
      },
    ],
    kennzahlen: [],
    coverSlot: 'projects/case-02-cover',
    bildSlots: ['projects/case-detail-wide'],
    videoSlot: 'video/showreel',
    freigabeVorhanden: false,
  },
  {
    slug: 'kmu-offerten-automatisiert',
    kunde: 'Zulieferbetrieb, Industrie',
    branche: 'Industrie',
    zeitraum: 'Projekt über sechs Wochen',
    leistungen: ['KI für KMU'],
    ergebnisSatz:
      'Der Freitagnachmittag gehört wieder dem Betrieb statt dem Zusammentragen von Rapporten.',
    ausgangslage:
      'Jede Offerte wurde von Hand aus drei Quellen zusammengesucht: Preisliste, letzte vergleichbare Offerte, Notizen aus dem Kundengespräch. Dauer pro Offerte: geschätzt eine knappe Stunde. Gemessen hatte es nie jemand.',
    vorgehen: [
      {
        titel: 'Erst messen',
        text: 'Zwei Wochen lang wurde festgehalten, wie lange der Vorgang tatsächlich dauert und wo die Zeit hingeht. Das Ergebnis überraschte den Betrieb selbst.',
      },
      {
        titel: 'Einen Schritt herauslösen',
        text: 'Nicht die ganze Offerte, sondern das Zusammentragen der Grundlagen — der Teil ohne fachliche Entscheidung.',
      },
      {
        titel: 'Datenschutz vorab',
        text: 'Vor der Umsetzung wurde schriftlich festgehalten, welche Daten das Haus verlassen und welche nicht. Kundendaten blieben aussen vor.',
      },
      {
        titel: 'Mit Rückfallebene einführen',
        text: 'Der alte Weg bleibt dokumentiert und einsatzbereit. Wer lieber von Hand arbeitet, darf das.',
      },
    ],
    kennzahlen: [],
    coverSlot: 'projects/case-03-cover',
    bildSlots: ['projects/case-detail-tall'],
    freigabeVorhanden: false,
  },
];

/** Kennzahl nur mit Herkunft — sonst wird sie nicht ausgegeben. */
export const belastbareKennzahlen = (p: Project) =>
  p.kennzahlen.filter((k) => k.messmethode.trim() && k.zeitraum.trim()).slice(0, 3);

/** Anzeigename: echter Firmenname nur mit Freigabe, sonst die Umschreibung. */
export const anzeigeName = (p: Project) =>
  p.freigabeVorhanden && p.firmenname ? p.firmenname : p.kunde;

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const projectSlugs = () => projects.map((p) => p.slug);

export const alleLeistungenFilter = () =>
  [...new Set(projects.flatMap((p) => p.leistungen))].sort();
export const alleBranchenFilter = () =>
  [...new Set(projects.map((p) => p.branche))].sort();

export const naechsterProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
