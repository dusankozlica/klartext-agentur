/**
 * Stammdaten der Seite.
 *
 * Grundregel für die ganze Website: Ein Feld ist entweder gefüllt und wird
 * ausgegeben, oder es ist leer und das Element entfällt. Es steht nirgends
 * „TODO“ im sichtbaren Text — das gehört ins Änderungslog, nicht auf die
 * Seite. Was fehlt, meldet `offeneStammdaten()` intern.
 */

export const site = {
  name: 'KLARTEXT.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.invalid',
  sprache: 'de-CH',

  positionierung:
    'Wir machen Schweizer KMU verständlich — damit die richtigen Kunden anrufen und die falschen gar nicht erst.',
  kurzprofil:
    'Marketingagentur für Schweizer KMU. Positionierung, Marke, Website, laufende Betreuung und KI im Arbeitsalltag.',

  // ── Angaben, die von Dusan kommen. Leer = wird nicht ausgegeben. ────
  standort: { ort: '', kanton: '', land: 'CH' },
  adresse: { strasse: '', plz: '', ort: '' },
  kontakt: { email: '', telefon: '' },
  rechtsform: '',
  mwstNummer: '',
  social: [] as { name: string; url: string }[],
} as const;

export const hatWert = (wert: string | undefined): wert is string =>
  Boolean(wert && wert.trim());

/** Was vor dem Aufschalten noch gesetzt werden muss. */
export function offeneStammdaten(): string[] {
  const offen: string[] = [];
  if (!hatWert(site.standort.ort)) offen.push('Standort');
  if (!hatWert(site.adresse.strasse)) offen.push('Adresse');
  if (!hatWert(site.kontakt.email)) offen.push('E-Mail');
  if (!hatWert(site.kontakt.telefon)) offen.push('Telefon');
  if (!hatWert(site.rechtsform)) offen.push('Rechtsform');
  if (site.url.includes('example.invalid')) offen.push('Domain');
  if (site.social.length === 0) offen.push('Social-Profile');
  return offen;
}

/** Ortsangabe für Fliesstext — fällt sauber auf „Schweiz“ zurück. */
export const ortOderLand = () =>
  hatWert(site.standort.ort) ? site.standort.ort : 'Schweiz';
