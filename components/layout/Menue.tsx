'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Start' },
  { href: '/projekte', label: 'Arbeiten' },
  { href: '/leistungen', label: 'Leistungen' },
  { href: '/team', label: 'Team' },
  { href: '/blog', label: 'Blog' },
  { href: '/kontakt', label: 'Kontakt' },
];

/**
 * Overlay-Menü nach pixel.melbourne, auf KLARTEXT übersetzt: Panel fährt
 * von rechts ein, riesige Zeilen, die überfahrene Zeile wird zum
 * vollbreiten Violett-Balken mit Pfeil.
 *
 * Navigation läuft über router.push NACH dem Zuklappen, damit das Panel
 * sauber ausfährt statt hart zu verschwinden.
 */
export default function Menue() {
  const [offen, setOffen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const ausloeser = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const schliessen = useCallback(() => {
    setOffen(false);
    ausloeser.current?.focus();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menue-offen', offen);
    window.dispatchEvent(new CustomEvent('kt:menue', { detail: offen }));
    if (!offen) return;

    // Fokus ins Panel, Escape schliesst.
    const erster = panelRef.current?.querySelector<HTMLElement>('a, button');
    erster?.focus();
    const aufTaste = (e: KeyboardEvent) => { if (e.key === 'Escape') schliessen(); };
    window.addEventListener('keydown', aufTaste);
    return () => window.removeEventListener('keydown', aufTaste);
  }, [offen, schliessen]);

  // Routenwechsel (z. B. Zurück-Taste) räumt das Menü ab.
  useEffect(() => { setOffen(false); }, [pathname]);

  const geheZu = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOffen(false);
    // Erst ausfahren lassen, dann navigieren (Panel-Exit läuft .45s).
    setTimeout(() => router.push(href as Parameters<typeof router.push>[0]), 320);
  };

  return (
    <>
      <button
        ref={ausloeser}
        type="button"
        className="nav__menue"
        aria-expanded={offen}
        aria-controls="menue-panel"
        onClick={() => setOffen(true)}
      >
        Menü
      </button>

      <div className={`menue${offen ? ' is-open' : ''}`} aria-hidden={!offen}>
        <button
          type="button"
          className="menue__scrim"
          tabIndex={-1}
          aria-label="Menü schliessen"
          onClick={schliessen}
        />
        <div
          id="menue-panel"
          ref={panelRef}
          className="menue__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Hauptmenü"
        >
          <button type="button" className="menue__schliessen" onClick={schliessen}>
            Schliessen ✕
          </button>
          <ul className="menue__liste">
            {LINKS.map((l) => (
              <li key={l.href}>
                {/* Bewusst <a>: der Klick wird abgefangen, damit das Panel
                    erst ausfährt. href bleibt für Mittelklick/SEO korrekt. */}
                <a className="menue__link" href={l.href} onClick={geheZu(l.href)}>
                  {l.label}
                  <span className="pfeil" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="menue__fuss">
            KLARTEXT. — Marketingagentur, Schweiz
          </p>
        </div>
      </div>
    </>
  );
}
