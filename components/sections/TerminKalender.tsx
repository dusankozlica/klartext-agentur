'use client';

import { useEffect, useMemo, useState } from 'react';
import { de } from 'react-day-picker/locale';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

/**
 * Terminbuchung auf shadcn-Basis (Muster «calendar-with-time-pressets»):
 * Kalender links, Zeitslot-Leiste rechts, Zusammenfassung im Fuss —
 * plus unsere Gesprächsart-Segmente und Kontaktfelder. Wochenenden und
 * Vergangenheit sind gesperrt; erfundene «belegte» Tage gibt es nicht.
 *
 * Versand ist weiterhin nicht verdrahtet (Postfach fehlt) — der
 * Erfolgs-Zustand sagt das ehrlich, statt eine Mail vorzutäuschen.
 */
export default function TerminKalender() {
  // Erst im Browser aufbauen: Build- und Besuchszeitpunkt liegen sonst in
  // verschiedenen Monaten und React meldet einen Hydration-Mismatch.
  const [bereit, setBereit] = useState(false);
  useEffect(() => { setBereit(true); }, []);

  const heute = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const morgen = useMemo(() => { const d = new Date(heute); d.setDate(d.getDate() + 1); return d; }, [heute]);

  const [tag, setTag] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | null>(null);
  const [art, setArt] = useState('Vor Ort oder bei Ihnen');
  const [gesendet, setGesendet] = useState(false);
  const [fehler, setFehler] = useState('');

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

  const datumLang = (d: Date) =>
    d.toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  if (!bereit) {
    return <div className="min-h-[560px] rounded-[var(--radius-lg)] bg-[var(--ink)]" aria-hidden="true" />;
  }

  if (gesendet && tag && slot) {
    return (
      <div className="uidunkel">
        <Card className="rounded-[var(--radius-lg)] p-[var(--s-7)]">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--violet)] text-[1.3rem] text-[#fff]" aria-hidden="true">✓</span>
          <h3 className="mt-[var(--s-5)] font-[family-name:var(--font-display)] text-[1.6rem] font-semibold tracking-[-0.02em]">
            Termin vorgemerkt
          </h3>
          <p className="body-measure mt-[var(--s-3)] text-[var(--grau-d)]">
            {art} · {datumLang(tag)} · {slot} Uhr
          </p>
          <p className="body-measure mt-[var(--s-4)]">
            Ehrlich gesagt: Das Postfach ist in dieser Vorschau noch nicht
            verbunden — die Anfrage wurde darum nicht versendet. In der fertigen
            Version bestätigen wir Ihnen den Termin innert zwei Arbeitstagen.
          </p>
          <div>
            <button
              type="button"
              className="btn btn--hell mt-[var(--s-6)]"
              onClick={() => { setGesendet(false); setTag(undefined); setSlot(null); }}
            >
              Neue Anfrage starten
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={absenden} className="uidunkel">
      <Card className="gap-0 overflow-hidden rounded-[var(--radius-lg)] p-0">
        {/* Gesprächsart */}
        <fieldset className="flex flex-wrap gap-[var(--s-3)] border-0 border-b border-border p-6 pb-5">
          <legend className="sr-only">Art des Gesprächs</legend>
          {['Vor Ort oder bei Ihnen', 'Video-Call'].map((a) => (
            <Button
              key={a}
              type="button"
              variant={art === a ? 'default' : 'outline'}
              className="rounded-full shadow-none"
              onClick={() => setArt(a)}
              aria-pressed={art === a}
            >
              {a}
            </Button>
          ))}
        </fieldset>

        {/* Kalender + Zeitslots (calendar-with-time-pressets) */}
        <CardContent className="relative p-0 md:pr-56">
          <div className="flex justify-center p-6">
            <Calendar
              mode="single"
              locale={de}
              selected={tag}
              onSelect={(d) => { setTag(d ?? undefined); setSlot(null); }}
              defaultMonth={morgen}
              disabled={[{ dayOfWeek: [0, 6] }, { before: morgen }]}
              showOutsideDays={false}
              className="bg-transparent p-0"
            />
          </div>
          <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t border-border p-6 md:absolute md:max-h-none md:w-56 md:border-t-0 md:border-l">
            <p className="text-[0.75rem] uppercase tracking-[0.14em] text-muted-foreground">Uhrzeit</p>
            <div className="grid gap-2">
              {SLOTS.map((z) => (
                <Button
                  key={z}
                  type="button"
                  variant={slot === z ? 'default' : 'outline'}
                  onClick={() => setSlot(z)}
                  className="w-full shadow-none"
                  disabled={!tag}
                  aria-pressed={slot === z}
                >
                  {z}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Kontaktfelder */}
        <div className="grid gap-[var(--s-4)] border-t border-border p-6 md:grid-cols-2">
          {[
            ['name', 'Name', 'text', 'Ihr Name'],
            ['email', 'E-Mail', 'email', 'name@firma.ch'],
            ['telefon', 'Telefon (optional)', 'tel', '+41 …'],
          ].map(([n, label, typ, ph]) => (
            <label key={n} className="grid gap-[6px] text-[0.8rem] uppercase tracking-[0.12em] text-muted-foreground">
              {label}
              <input
                name={n} type={typ} placeholder={ph}
                className="rounded-lg border border-input bg-secondary px-[14px] py-[11px] text-[1rem] normal-case tracking-normal text-foreground outline-none transition-colors duration-[var(--dauer-1)] placeholder:text-muted-foreground/60 focus:border-[var(--violet-hell)]"
              />
            </label>
          ))}
          <label className="grid gap-[6px] text-[0.8rem] uppercase tracking-[0.12em] text-muted-foreground md:col-span-2">
            Worum geht&rsquo;s? (optional)
            <textarea
              name="nachricht" rows={3} placeholder="z. B. Website wirkt veraltet, Anfragen bleiben aus …"
              className="resize-none rounded-lg border border-input bg-secondary px-[14px] py-[11px] text-[1rem] normal-case tracking-normal text-foreground outline-none transition-colors duration-[var(--dauer-1)] placeholder:text-muted-foreground/60 focus:border-[var(--violet-hell)]"
            />
          </label>
        </div>

        {/* Zusammenfassung + Absenden */}
        <CardFooter className="flex flex-col gap-4 border-t border-border p-6 md:flex-row">
          <div className="text-sm" aria-live="polite">
            {fehler ? (
              <span role="alert" className="text-[#FF9D9D]">{fehler}</span>
            ) : tag && slot ? (
              <>
                Ihr Wunschtermin:{' '}
                <span className="font-medium">{datumLang(tag)}</span> um{' '}
                <span className="font-medium">{slot} Uhr</span> · {art}.
              </>
            ) : (
              <>Wählen Sie Datum und Uhrzeit für Ihr Erstgespräch.</>
            )}
          </div>
          <Button
            type="submit"
            disabled={!tag || !slot}
            className="w-full rounded-full md:ml-auto md:w-auto"
          >
            Termin anfragen&nbsp;→
          </Button>
        </CardFooter>

        <p className="px-6 pb-5 text-[0.8rem] leading-relaxed text-muted-foreground">
          Unverbindlich und kostenlos. Keine Weitergabe an Dritte.
        </p>
      </Card>
    </form>
  );
}
