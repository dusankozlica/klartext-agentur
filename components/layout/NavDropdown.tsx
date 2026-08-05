'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Bild = { src: string; width: number; height: number; blurDataURL?: string };
export type DropdownEintrag = { slug: string; name: string; bild: Bild };

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
  const zu = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wurzel = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  const oeffnen = () => { if (zu.current) clearTimeout(zu.current); setOffen(true); };
  const schliessen = () => {
    if (zu.current) clearTimeout(zu.current);
    // Kurze Gnadenfrist für den Weg Pille → Panel (10px Lücke).
    zu.current = setTimeout(() => setOffen(false), 180);
  };

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
      onPointerEnter={oeffnen}
      onPointerLeave={schliessen}
      onFocus={oeffnen}
      onBlur={(e) => {
        if (!wurzel.current?.contains(e.relatedTarget as Node)) setOffen(false);
      }}
    >
      <Link href="/leistungen" className="navdd__trigger" aria-expanded={offen}>
        <span className="nl">
          <span className="nl__t">Leistungen</span>
          <span className="nl__t nl__t--kopie" aria-hidden="true">Leistungen</span>
        </span>
        <span className="navdd__chev" aria-hidden="true">▾</span>
      </Link>

      <div className="navdd__panel" role="group" aria-label="Leistungen im Überblick" aria-hidden={!offen}>
        <div className="navdd__inhalt">
          <div className="navdd__kopf">
            <p className="eyebrow mb-0 text-[var(--grau-d)]">
              Leistungen<br />
              <span className="normal-case tracking-normal">Fünf Felder · ein Ansprechpartner</span>
            </p>
            <Link className="navdd__fuss" href="/leistungen" tabIndex={offen ? 0 : -1}>
              Alle Leistungen&nbsp;↗
            </Link>
          </div>

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

          <div className="navdd__bild" aria-hidden="true">
            {eintraege.map((s, i) => (
              <Image
                key={s.slug}
                src={s.bild.src}
                alt=""
                width={s.bild.width}
                height={s.bild.height}
                sizes="320px"
                placeholder={s.bild.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={s.bild.blurDataURL}
                className={i === aktiv ? 'is-aktiv' : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </span>
  );
}
