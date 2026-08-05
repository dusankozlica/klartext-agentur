'use server';

import { headers } from 'next/headers';
import { rateLimit, aufraeumen } from '@/lib/rate-limit';

export type FormularStatus = {
  ok: boolean;
  meldung: string;
  felderFehler?: Record<string, string>;
};

/**
 * Kontaktformular — Server Action.
 *
 * Drei Schutzebenen, absteigend nach Aufdringlichkeit:
 *  1. Honeypot: unsichtbares Feld. Bots füllen es, Menschen sehen es nicht.
 *  2. Zeitfalle: wer in unter 3 Sekunden absendet, war kein Mensch.
 *  3. Rate Limit pro IP.
 *
 * Turnstile ist vorgesehen, aber erst aktiv, wenn die Schlüssel gesetzt sind —
 * ohne Schlüssel würde jede Prüfung fehlschlagen und das Formular wäre tot.
 */
export async function sendeAnfrage(
  _vorher: FormularStatus | null,
  formular: FormData,
): Promise<FormularStatus> {
  aufraeumen();

  // 1 — Honeypot
  if (String(formular.get('firmenname') ?? '').trim() !== '') {
    // Bewusst „ok“ melden: ein Bot soll nicht lernen, dass er erkannt wurde.
    return { ok: true, meldung: 'Danke, Ihre Anfrage ist eingegangen.' };
  }

  // 2 — Zeitfalle
  const gestartet = Number(formular.get('gestartet') ?? 0);
  if (gestartet && Date.now() - gestartet < 3000) {
    return { ok: true, meldung: 'Danke, Ihre Anfrage ist eingegangen.' };
  }

  // 3 — Rate Limit
  const kopfzeilen = await headers();
  const ip =
    kopfzeilen.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    kopfzeilen.get('x-real-ip') ||
    'unbekannt';
  const limit = rateLimit(`kontakt:${ip}`);
  if (!limit.erlaubt) {
    return {
      ok: false,
      meldung: `Zu viele Anfragen. Bitte versuchen Sie es in ${limit.wartenMinuten} Minuten erneut oder rufen Sie an.`,
    };
  }

  // 4 — Turnstile, sobald konfiguriert
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = String(formular.get('cf-turnstile-response') ?? '');
    const geprueft = await pruefeTurnstile(token, turnstileSecret, ip);
    if (!geprueft) {
      return { ok: false, meldung: 'Die Spam-Prüfung ist fehlgeschlagen. Bitte laden Sie die Seite neu.' };
    }
  }

  // 5 — Inhalt prüfen
  const name = String(formular.get('name') ?? '').trim();
  const email = String(formular.get('email') ?? '').trim();
  const nachricht = String(formular.get('nachricht') ?? '').trim();

  const felderFehler: Record<string, string> = {};
  if (name.length < 2) felderFehler.name = 'Bitte Ihren Namen angeben.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) felderFehler.email = 'Bitte eine gültige E-Mail-Adresse angeben.';
  if (nachricht.length < 10) felderFehler.nachricht = 'Bitte beschreiben Sie kurz Ihr Anliegen (mindestens 10 Zeichen).';

  if (Object.keys(felderFehler).length) {
    return { ok: false, meldung: 'Bitte prüfen Sie die markierten Felder.', felderFehler };
  }

  // 6 — Versand
  const resendKey = process.env.RESEND_API_KEY;
  const empfaenger = process.env.KONTAKT_EMPFAENGER;

  if (!resendKey || !empfaenger) {
    // Ehrlich bleiben: ohne Zugangsdaten wird nichts verschickt. Es wäre
    // schlimmer, „gesendet“ zu melden und die Anfrage zu verlieren.
    console.warn('[kontakt] RESEND_API_KEY oder KONTAKT_EMPFAENGER fehlt — Anfrage NICHT versendet:', {
      name, email, laenge: nachricht.length,
    });
    return {
      ok: false,
      meldung:
        'Das Formular ist noch nicht mit dem Postfach verbunden. Bitte schreiben Sie uns direkt per E-Mail — die Adresse steht im Impressum.',
    };
  }

  const antwort = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.KONTAKT_ABSENDER ?? 'Website <onboarding@resend.dev>',
      to: [empfaenger],
      reply_to: email,
      subject: `Anfrage über die Website — ${name}`,
      text: `Name: ${name}\nE-Mail: ${email}\n\n${nachricht}`,
    }),
  });

  if (!antwort.ok) {
    console.error('[kontakt] Versand fehlgeschlagen:', antwort.status, await antwort.text());
    return {
      ok: false,
      meldung: 'Der Versand hat nicht geklappt. Bitte versuchen Sie es später erneut oder rufen Sie an.',
    };
  }

  return { ok: true, meldung: 'Danke — wir melden uns innerhalb von zwei Arbeitstagen.' };
}

async function pruefeTurnstile(token: string, secret: string, ip: string) {
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const daten = (await res.json()) as { success?: boolean };
    return Boolean(daten.success);
  } catch {
    return false;
  }
}
