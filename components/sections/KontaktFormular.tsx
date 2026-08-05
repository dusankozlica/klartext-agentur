'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { sendeAnfrage, type FormularStatus } from '@/app/kontakt/actions';

/**
 * Kontaktformular.
 *
 * Barrierefreiheit: jedes Feld hat ein sichtbares Label, Fehler werden über
 * `aria-describedby` mit dem Feld verknüpft, und die Statusmeldung liegt in
 * einer `aria-live`-Region — Screenreader bekommen das Ergebnis mit, ohne
 * dass der Fokus springt.
 */
export default function KontaktFormular() {
  const [status, action, laeuft] = useActionState<FormularStatus | null, FormData>(
    sendeAnfrage,
    null,
  );
  const [gestartet, setGestartet] = useState(0);
  const meldung = useRef<HTMLParagraphElement>(null);

  // Zeitstempel erst im Browser setzen — sonst wäre er beim Ausliefern der
  // Seite eingefroren und die Zeitfalle träfe echte Besucher.
  useEffect(() => setGestartet(Date.now()), []);

  useEffect(() => {
    if (status) meldung.current?.focus();
  }, [status]);

  if (status?.ok) {
    return (
      <p
        ref={meldung}
        tabIndex={-1}
        className="body-measure border-l-4 border-current pl-[var(--s-5)] text-[1.1rem]"
        role="status"
      >
        {status.meldung}
      </p>
    );
  }

  return (
    <form action={action} className="grid gap-[var(--s-5)]" noValidate>
      <input type="hidden" name="gestartet" value={gestartet} />

      {/* Honeypot — für Menschen unsichtbar, für Screenreader ausgeblendet */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden [clip-path:inset(50%)]">
        <label htmlFor="firmenname">Firmenname (bitte leer lassen)</label>
        <input id="firmenname" name="firmenname" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Feld
        id="name" name="name" label="Name" autoComplete="name"
        fehler={status?.felderFehler?.name}
      />
      <Feld
        id="email" name="email" label="E-Mail" type="email" autoComplete="email"
        fehler={status?.felderFehler?.email}
      />
      <Feld
        id="nachricht" name="nachricht" label="Worum geht es?" mehrzeilig
        fehler={status?.felderFehler?.nachricht}
      />

      {/* Turnstile-Widget wird erst gerendert, wenn ein Site-Key gesetzt ist */}
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div
          className="cf-turnstile"
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        />
      )}

      <div className="flex flex-wrap items-center gap-[var(--s-5)]">
        <button type="submit" className="btn btn--primary" disabled={laeuft}>
          {laeuft ? 'Wird gesendet …' : 'Anfrage senden'}
        </button>
        <p className="text-[0.85rem] opacity-70">
          Ihre Angaben gehen nur an uns. Details in der{' '}
          <a href="/datenschutz" className="underline underline-offset-4">Datenschutzerklärung</a>.
        </p>
      </div>

      <p
        ref={meldung}
        tabIndex={-1}
        role="alert"
        aria-live="polite"
        className={status && !status.ok ? 'text-[0.95rem]' : 'sr-only'}
      >
        {status?.meldung ?? ''}
      </p>
    </form>
  );
}

function Feld({
  id, name, label, type = 'text', mehrzeilig, autoComplete, fehler,
}: {
  id: string; name: string; label: string; type?: string;
  mehrzeilig?: boolean; autoComplete?: string; fehler?: string;
}) {
  const fehlerId = `${id}-fehler`;
  const klassen =
    'mt-[var(--s-2)] w-full border-b-2 border-current bg-transparent py-[var(--s-3)] text-[1.05rem] outline-none placeholder:opacity-40 focus-visible:border-[var(--violet)]';

  return (
    <p className="grid">
      <label htmlFor={id} className="text-[0.9rem] font-medium">{label}</label>
      {mehrzeilig ? (
        <textarea
          id={id} name={name} rows={5} required
          aria-invalid={Boolean(fehler)}
          aria-describedby={fehler ? fehlerId : undefined}
          className={`${klassen} resize-y`}
        />
      ) : (
        <input
          id={id} name={name} type={type} required autoComplete={autoComplete}
          aria-invalid={Boolean(fehler)}
          aria-describedby={fehler ? fehlerId : undefined}
          className={klassen}
        />
      )}
      {fehler && (
        <span id={fehlerId} className="mt-[var(--s-2)] text-[0.85rem] font-medium">
          {fehler}
        </span>
      )}
    </p>
  );
}
