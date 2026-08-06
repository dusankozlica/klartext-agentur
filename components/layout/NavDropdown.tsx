'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Bild = { src: string; width: number; height: number; blurDataURL?: string };
export type DropdownEintrag = {
  slug: string; name: string; claim: string; kurz: string; bild: Bild;
};

/**
 * Leistungs-Dropdown nach dem ESE-«Expertise»-Muster: Zeigen öffnet das
 * vollbreite Glas-Panel, der überfahrene Eintrag bleibt hell während die
 * Geschwister dimmen, rechts poppt das Vorschaubild der Leistung ein.
 *
 * Tastatur: Fokus auf dem Auslöser öffnet das Panel, Tab wandert durch
 * die Einträge, Fokus ausserhalb oder Escape schliesst. Der Auslöser
 * bleibt ein echter Link auf /leistungen.
 */
export default function NavDropdown({ eintraege }: { eintraege: DropdownEintrag[] }) {
  const [offen, setOffen] = useState(false);
  const [aktiv, setAktiv] = useState(0);
  const aufTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wurzel = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  const aufAbbrechen = () => { if (aufTimer.current) { clearTimeout(aufTimer.current); aufTimer.current = null; } };
  const zuAbbrechen = () => { if (zuTimer.current) { clearTimeout(zuTimer.current); zuTimer.current = null; } };

  // Öffnen NUR über den Auslöser selbst, und erst nach kurzer Verweilzeit
  // (130 ms) — blosses Vorbeistreifen auf dem Weg zu Menü/CTA öffnet
  // nichts. Das Panel darf ein OFFENES Panel am Leben halten, aber nie
  // selbst das Öffnen auslösen.
  const triggerRein = () => {
    zuAbbrechen();
    if (offen) return;
    aufAbbrechen();
    aufTimer.current = setTimeout(() => setOffen(true), 130);
  };
  const bald_zu = () => {
    zuAbbrechen();
    zuTimer.current = setTimeout(() => setOffen(false), 180);
  };
  const triggerRaus = () => { aufAbbrechen(); bald_zu(); };
  const panelRein = () => { if (offen) zuAbbrechen(); };
  const panelRaus = () => { if (offen) bald_zu(); };

  // Routenwechsel und Escape räumen das Panel ab.
  useEffect(() => { setOffen(false); }, [pathname]);
  useEffect(() => {
    if (!offen) return;
    const aufTaste = (e: KeyboardEvent) => { if (e.key === 'Escape') setOffen(false); };
    window.addEventListener('keydown', aufTaste);
    return () => window.removeEventListener('keydown', aufTaste);
  }, [offen]);

  return (
    <span
      ref={wurzel}
      className={`navdd${offen ? ' is-open' : ''}`}
      onFocus={() => { zuAbbrechen(); setOffen(true); }}
      onBlur={(e) => {
        if (!wurzel.current?.contains(e.relatedTarget as Node)) setOffen(false);
      }}
    >
      <Link
        href="/leistungen"
        className="navdd__trigger"
        aria-expanded={offen}
        onPointerEnter={triggerRein}
        onPointerLeave={triggerRaus}
      >
        <span className="nl">
          <span className="nl__t">Leistungen</span>
          <span className="nl__t nl__t--kopie" aria-hidden="true">Leistungen</span>
        </span>
        <span className="navdd__chev" aria-hidden="true">▾</span>
      </Link>

      <div
        className="navdd__panel"
        role="group"
        aria-label="Leistungen im Überblick"
        aria-hidden={!offen}
        onPointerEnter={panelRein}
        onPointerLeave={panelRaus}
      >
        <div className="navdd__inhalt">
          {/* Bild + Kurztext LINKS — die Liste sitzt rechts, direkt unterm
              Auslöser: kürzester Mausweg vom Hover zur Auswahl. */}
          <div className="navdd__rechts" aria-hidden="true">
            <div className="navdd__bild">
              {eintraege.map((s, i) => (
                <Image
                  key={s.slug}
                  src={s.bild.src}
                  alt=""
                  width={s.bild.width}
                  height={s.bild.height}
                  sizes="280px"
                  placeholder={s.bild.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={s.bild.blurDataURL}
                  className={i === aktiv ? 'is-aktiv' : undefined}
                />
              ))}
            </div>
            <div className="navdd__saetze">
              {eintraege.map((s, i) => (
                <div key={s.slug} className={`navdd__satz${i === aktiv ? ' is-aktiv' : ''}`}>
                  <p className="satz--claim">{s.claim}</p>
                  <p className="satz--kurz">{s.kurz}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <ol className="navdd__liste">
              {eintraege.map((s, i) => (
                <li key={s.slug}>
                  <Link
                    className="navdd__link"
                    href={`/leistungen/${s.slug}`}
                    tabIndex={offen ? 0 : -1}
                    onPointerEnter={() => setAktiv(i)}
                    onFocus={() => setAktiv(i)}
                  >
                    <span className="navdd__nr">{String(i + 1).padStart(2, '0')}</span>
                    {s.name}
                    <span className="pfeil" aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link className="navdd__fuss" href="/leistungen" tabIndex={offen ? 0 : -1}>
              Alle Leistungen&nbsp;↗
            </Link>
          </div>
        </div>
      </div>
    </span>
  );
}
