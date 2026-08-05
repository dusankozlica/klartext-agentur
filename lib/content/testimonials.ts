/**
 * Video-Testimonials — Repository-Modul.
 *
 * Harte Regel aus Abschnitt 5.1 des Briefs, hier als Code statt als
 * Kommentar: Ohne dokumentierte schriftliche Freigabe (Recht am eigenen
 * Bild, revDSG) und ohne Untertitel wird ein Video in Produktion nicht
 * ausgespielt. Namen werden nicht erfunden — sie bleiben leer, bis die
 * Freigabe vorliegt.
 */

export type Testimonial = {
  id: string;
  name: string;
  funktion: string;
  firma: string;
  caseSlug?: string;
  videoSlot: string;
  /** Untertitel sind Pflicht: Barrierefreiheit und Social-Verwertung. */
  untertitelVorhanden: boolean;
  freigabeVorhanden: boolean;
};

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: '',
    funktion: 'Geschäftsleitung',
    firma: 'Schreinerei im Mittelland',
    caseSlug: 'schreinerei-marke-und-website',
    videoSlot: 'video/testimonial-01',
    untertitelVorhanden: false,
    freigabeVorhanden: false,
  },
  {
    id: 't2',
    name: '',
    funktion: 'Leitung Marketing',
    firma: 'Dienstleistungsbetrieb',
    caseSlug: 'dienstleister-social-media-betrieb',
    videoSlot: 'video/testimonial-02',
    untertitelVorhanden: false,
    freigabeVorhanden: false,
  },
  {
    id: 't3',
    name: '',
    funktion: 'Betriebsleitung',
    firma: 'Zulieferbetrieb, Industrie',
    caseSlug: 'kmu-offerten-automatisiert',
    videoSlot: 'video/testimonial-03',
    untertitelVorhanden: false,
    freigabeVorhanden: false,
  },
];

/** Titel der Karte: Name, sobald freigegeben — sonst Funktion und Firma. */
export const testimonialTitel = (t: Testimonial) =>
  t.freigabeVorhanden && t.name.trim() ? t.name : t.funktion;

/**
 * Was öffentlich ausgespielt werden darf.
 *
 * Im Entwicklungsmodus alle, damit Raster und Lightbox überhaupt gebaut und
 * geprüft werden können. In Produktion greift die Regel hart.
 */
export function ausspielbar(): Testimonial[] {
  if (process.env.NODE_ENV !== 'production') return testimonials;
  return testimonials.filter((t) => t.freigabeVorhanden && t.untertitelVorhanden);
}
