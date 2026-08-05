/**
 * Einfaches Rate Limit im Arbeitsspeicher.
 *
 * EHRLICHE EINSCHRÄNKUNG: Das hält nur innerhalb einer Serverinstanz. Auf
 * Vercel oder Cloudflare mit mehreren Instanzen greift es je Instanz separat
 * und überlebt kein Neuladen der Funktion. Für den Start reicht das gegen
 * plumpe Formular-Bots; sobald echter Missbrauch auftritt, gehört das an
 * einen gemeinsamen Speicher (Upstash Redis, Vercel KV).
 */

type Eintrag = { treffer: number; zuruecksetzenUm: number };

const speicher = new Map<string, Eintrag>();

const FENSTER_MS = 10 * 60 * 1000;   // 10 Minuten
const MAX_ANFRAGEN = 3;

export function rateLimit(schluessel: string) {
  const jetzt = Date.now();
  const vorhanden = speicher.get(schluessel);

  if (!vorhanden || jetzt > vorhanden.zuruecksetzenUm) {
    speicher.set(schluessel, { treffer: 1, zuruecksetzenUm: jetzt + FENSTER_MS });
    return { erlaubt: true, verbleibend: MAX_ANFRAGEN - 1 };
  }

  if (vorhanden.treffer >= MAX_ANFRAGEN) {
    return {
      erlaubt: false,
      verbleibend: 0,
      wartenMinuten: Math.ceil((vorhanden.zuruecksetzenUm - jetzt) / 60000),
    };
  }

  vorhanden.treffer += 1;
  return { erlaubt: true, verbleibend: MAX_ANFRAGEN - vorhanden.treffer };
}

/** Alte Einträge aufräumen, damit die Map nicht unbegrenzt wächst. */
export function aufraeumen() {
  const jetzt = Date.now();
  for (const [k, v] of speicher) if (jetzt > v.zuruecksetzenUm) speicher.delete(k);
}
