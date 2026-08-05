'use client';

import { useEffect, useMemo, useState } from 'react';

const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
  'August', 'September', 'Oktober', 'November', 'Dezember'];
const WOCHENTAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

/**
 * Terminbuchung nach dem Fabio-Soltani-Muster: Art der Beratung als
 * Segmente, Monatskalender mit Vor/Zurück, Zeitslots nach Datumswahl,
 * daneben die Kontaktfelder, am Ende ein Erfolgs-Zustand mit
 * Zusammenfassung.
 *
 * Versand ist noch nicht verdrahtet (Postfach fehlt) — der Erfolgs-
 * Zustand sagt das ehrlich, statt eine Mail vorzutäuschen.
 */
export default function TerminKalender() {
  // Kalender erst im Browser aufbauen: Der Prerender-Zeitpunkt (Build)
  // und der Besuchszeitpunkt liegen sonst in verschiedenen Monaten und
  // React meldet einen Hydration-Mismatch.
  const [bereit, setBereit] = useState(false);
  useEffect(() => { setBereit(true); }, []);
  const heute = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [anzeige, setAnzeige] = useState(() => new Date(heute.getFullYear(), heute.getMonth(), 1));
  const [tag, setTag] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [art, setArt] = useState('Vor Ort oder bei Ihnen');
  const [gesendet, setGesendet] = useState(false);
  const [fehler, setFehler] = useState('');

  // Kalendermatrix des angezeigten Monats, Wochen zu je 7 Tagen
  const wochen = useMemo(() => {
    const erster = new Date(anzeige);
    const start = (erster.getDay() + 6) % 7;          // Mo=0
    const tageImMonat = new Date(anzeige.getFullYear(), anzeige.getMonth() + 1, 0).getDate();
    const zellen: (Date | null)[] = Array.from({ length: start }, () => null);
    for (let t = 1; t <= tageImMonat; t++) zellen.push(new Date(anzeige.getFullYear(), anzeige.getMonth(), t));
    while (zellen.length % 7) zellen.push(null);
    const w: (Date | null)[][] = [];
    for (let i = 0; i < zellen.length; i += 7) w.push(zellen.slice(i, i + 7));
    return w;
  }, [anzeige]);

  const waehlbar = (d: Date) => d > heute && d.getDay() !== 0 && d.getDay() !== 6;

  const absenden = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tag || !slot) { setFehler('Bitte zuerst Datum und Uhrzeit wählen.'); return; }
    const f = new FormData(e.currentTarget);
    if (!String(f.get('name') ?? '').trim() || !String(f.get('email') ?? '').trim()) {
      setFehler('Name und E-Mail brauchen wir, um uns zu melden.'); return;
    }
    setFehler('');
    setGesendet(true);
  };

  if (!bereit) {
    return <div className="min-h-[560px] rounded-[var(--radius-lg)] bg-[var(--ink)]" aria-hidden="true" />;
  }

  if (gesendet && tag && slot) {
    return (
      <div className="rounded-[var(--radius-lg)] bg-[var(--ink)] p-[var(--s-7)] text-[var(--cream)]">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--violet)] text-[1.3rem] text-[#fff]" aria-hidden="true">✓</span>
        <h3 className="mt-[var(--s-5)] font-[family-name:var(--font-display)] text-[1.6rem] font-semibold tracking-[-0.02em]">
          Termin vorgemerkt
        </h3>
        <p className="body-measure mt-[var(--s-3)] text-[var(--grau-d)]">
          {art} · {tag.getDate()}. {MONATE[tag.getMonth()]} {tag.getFullYear()} · {slot} Uhr
        </p>
        <p className="body-measure mt-[var(--s-4)]">
          Ehrlich gesagt: Das Postfach ist in dieser Vorschau noch nicht
          verbunden — die Anfrage wurde darum nicht versendet. In der fertigen
          Version bestätigen wir Ihnen den Termin innert zwei Arbeitstagen.
        </p>
        <button
          type="button"
          className="btn btn--hell mt-[var(--s-6)]"
          onClick={() => { setGesendet(false); setTag(null); setSlot(null); }}
        >
          Neue Anfrage starten
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={absenden} className="rounded-[var(--radius-lg)] bg-[var(--ink)] p-[clamp(20px,3vw,44px)] text-[var(--cream)]">
      {/* Art der Beratung */}
      <fieldset className="flex flex-wrap gap-[var(--s-3)] border-0 p-0">
        <legend className="mb-[var(--s-3)] w-full text-[0.8rem] uppercase tracking-[0.14em] text-[var(--grau-d)]">
          Art des Gesprächs
        </legend>
        {['Vor Ort oder bei Ihnen', 'Video-Call'].map((a) => (
          <label key={a} className={`cursor-pointer rounded-full border px-[18px] py-[10px] text-[0.92rem] transition-colors duration-[var(--dauer-1)] ${
            art === a ? 'border-[var(--violet)] bg-[var(--violet)] text-[#fff]'
                      : 'border-[color-mix(in_srgb,var(--cream)_25%,transparent)] hover:border-[color-mix(in_srgb,var(--cream)_55%,transparent)]'
          }`}>
            <input type="radio" name="art" value={a} checked={art === a}
              onChange={() => setArt(a)} className="sr-only" />
            {a}
          </label>
        ))}
      </fieldset>

      <div className="mt-[var(--s-6)] grid gap-[var(--s-7)] lg:grid-cols-[1.1fr_1fr]">
        {/* Kalender */}
        <div>
          <div className="flex items-center justify-between">
            <p className="font-[family-name:var(--font-display)] text-[1.15rem] font-semibold">
              {MONATE[anzeige.getMonth()]} {anzeige.getFullYear()}
            </p>
            <div className="flex gap-[var(--s-2)]">
              <button type="button" aria-label="Vorheriger Monat"
                onClick={() => setAnzeige(new Date(anzeige.getFullYear(), anzeige.getMonth() - 1, 1))}
                className="grid h-11 w-11 place-items-center rounded-full border border-[color-mix(in_srgb,var(--cream)_25%,transparent)] transition-colors duration-[var(--dauer-1)] hover:border-[var(--cream)]">←</button>
              <button type="button" aria-label="Nächster Monat"
                onClick={() => setAnzeige(new Date(anzeige.getFullYear(), anzeige.getMonth() + 1, 1))}
                className="grid h-11 w-11 place-items-center rounded-full border border-[color-mix(in_srgb,var(--cream)_25%,transparent)] transition-colors duration-[var(--dauer-1)] hover:border-[var(--cream)]">→</button>
            </div>
          </div>
          <div className="mt-[var(--s-4)] grid grid-cols-7 gap-[4px] text-center text-[0.75rem] uppercase tracking-[0.1em] text-[var(--grau-d)]">
            {WOCHENTAGE.map((w) => <span key={w}>{w}</span>)}
          </div>
          <div className="mt-[var(--s-2)] grid grid-cols-7 gap-[4px]">
            {wochen.flat().map((d, i) => d ? (
              <button
                key={i}
                type="button"
                disabled={!waehlbar(d)}
                onClick={() => { setTag(d); setSlot(null); }}
                aria-pressed={tag?.getTime() === d.getTime()}
                className={`aspect-square rounded-[12px] text-[0.95rem] transition-colors duration-[var(--dauer-1)] ${
                  tag?.getTime() === d.getTime()
                    ? 'bg-[var(--violet)] font-semibold text-[#fff]'
                    : waehlbar(d)
                      ? 'bg-[var(--ink-2)] hover:bg-[color-mix(in_srgb,var(--violet)_35%,var(--ink-2))]'
                      : 'text-[color-mix(in_srgb,var(--cream)_22%,transparent)]'
                }`}
              >
                {d.getDate()}
              </button>
            ) : <span key={i} />)}
          </div>

          {tag && (
            <div className="mt-[var(--s-5)]">
              <p className="text-[0.8rem] uppercase tracking-[0.14em] text-[var(--grau-d)]">Uhrzeit</p>
              <div className="mt-[var(--s-3)] flex flex-wrap gap-[6px]">
                {SLOTS.map((z) => (
                  <button key={z} type="button" onClick={() => setSlot(z)} aria-pressed={slot === z}
                    className={`rounded-full border px-[14px] py-[8px] text-[0.88rem] transition-colors duration-[var(--dauer-1)] ${
                      slot === z ? 'border-[var(--violet)] bg-[var(--violet)] text-[#fff]'
                                 : 'border-[color-mix(in_srgb,var(--cream)_25%,transparent)] hover:border-[color-mix(in_srgb,var(--cream)_60%,transparent)]'
                    }`}>
                    {z}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Kontaktfelder */}
        <div className="grid content-start gap-[var(--s-4)]">
          {[
            ['name', 'Name', 'text', 'Ihr Name'],
            ['email', 'E-Mail', 'email', 'name@firma.ch'],
            ['telefon', 'Telefon (optional)', 'tel', '+41 …'],
          ].map(([n, label, typ, ph]) => (
            <label key={n} className="grid gap-[6px] text-[0.8rem] uppercase tracking-[0.12em] text-[var(--grau-d)]">
              {label}
              <input
                name={n} type={typ} placeholder={ph}
                className="rounded-[12px] border border-[color-mix(in_srgb,var(--cream)_20%,transparent)] bg-[var(--ink-2)] px-[14px] py-[12px] text-[1rem] normal-case tracking-normal text-[var(--cream)] outline-none transition-colors duration-[var(--dauer-1)] placeholder:text-[color-mix(in_srgb,var(--cream)_35%,transparent)] focus:border-[var(--violet-hell)]"
              />
            </label>
          ))}
          <label className="grid gap-[6px] text-[0.8rem] uppercase tracking-[0.12em] text-[var(--grau-d)]">
            Worum geht&rsquo;s? (optional)
            <textarea
              name="nachricht" rows={3} placeholder="z. B. Website wirkt veraltet, Anfragen bleiben aus …"
              className="resize-none rounded-[12px] border border-[color-mix(in_srgb,var(--cream)_20%,transparent)] bg-[var(--ink-2)] px-[14px] py-[12px] text-[1rem] normal-case tracking-normal text-[var(--cream)] outline-none transition-colors duration-[var(--dauer-1)] placeholder:text-[color-mix(in_srgb,var(--cream)_35%,transparent)] focus:border-[var(--violet-hell)]"
            />
          </label>

          {fehler && <p role="alert" className="text-[0.92rem] text-[#FF9D9D]">{fehler}</p>}

          <button className="btn btn--primary mt-[var(--s-2)] justify-center" type="submit">
            Termin anfragen&nbsp;→
          </button>
          <p className="text-[0.8rem] leading-relaxed text-[var(--grau-d)]">
            Unverbindlich und kostenlos. Keine Weitergabe an Dritte.
          </p>
        </div>
      </div>
    </form>
  );
}
