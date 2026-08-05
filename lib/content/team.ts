/**
 * Team — Repository-Modul.
 *
 * Namen und Fotos sind personenbezogene Daten und werden nicht erfunden.
 * Die Rollen und Haltungssätze sind fertige Copy; sobald Namen und
 * Freigaben vorliegen, werden sie hier eingetragen und erscheinen überall.
 *
 * Solange kein Name gesetzt ist, zeigt die Karte die Rolle als Titel — das
 * ist eine vollständige Aussage, kein Platzhalter.
 */

export type Person = {
  id: string;
  /** Leer, solange keine Freigabe vorliegt */
  name: string;
  rolle: string;
  bildSlot: string;
  satz: string;
  freigabeVorhanden: boolean;
};

export const team: Person[] = [
  {
    id: 'p1',
    name: '',
    rolle: 'Strategie und Kundenkontakt',
    bildSlot: 'team/portrait-01',
    satz: 'Stellt die Fragen, die im ersten Gespräch unangenehm sind und im dritten Monat Geld sparen.',
    freigabeVorhanden: false,
  },
  {
    id: 'p2',
    name: '',
    rolle: 'Gestaltung',
    bildSlot: 'team/portrait-02',
    satz: 'Findet die eine Idee, die trägt — und wirft die neun weg, die auch ganz nett gewesen wären.',
    freigabeVorhanden: false,
  },
  {
    id: 'p3',
    name: '',
    rolle: 'Bewegtbild und Produktion',
    bildSlot: 'team/portrait-03',
    satz: 'Kommt mit wenig Ausrüstung und geht mit Material für ein halbes Jahr.',
    freigabeVorhanden: false,
  },
  {
    id: 'p4',
    name: '',
    rolle: 'Technik und Umsetzung',
    bildSlot: 'team/portrait-04',
    satz: 'Baut Seiten, die auch in zwei Jahren noch jemand pflegen kann, ohne uns anzurufen.',
    freigabeVorhanden: false,
  },
];

/** Titel der Personenkarte: Name, sobald freigegeben — sonst die Rolle. */
export const personTitel = (p: Person) =>
  p.freigabeVorhanden && p.name.trim() ? p.name : p.rolle;

/**
 * Kundenlogos für die Marquee.
 *
 * Abschnitt 5 des Briefs: nur echte, freigegebene Logos — bei weniger als
 * fünf entfällt die Sektion ersatzlos. Die Liste ist leer, bis Freigaben
 * vorliegen; die Sektion erscheint dann von selbst.
 */
export const kundenlogos: { name: string; datei: string }[] = [];

export const MINDEST_LOGOS = 5;
export const logosAusspielen = () => kundenlogos.length >= MINDEST_LOGOS;
