'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Weicher Seitenwechsel: Interne Link-Klicks werden abgefangen, ein
 * Ink-Überzug fährt hoch (Wortmarke kurz sichtbar), dann erst wird
 * navigiert; auf der neuen Route gibt der Überzug die Seite nach oben
 * frei. Ohne diesen Baustein schneidet jeder Routenwechsel hart.
 *
 * Bewusst ausgenommen: das Overlay-Menü (eigene Ausfahr-Choreografie),
 * Anker auf derselben Seite, neue Tabs, Downloads und modifizierte
 * Klicks. Zurück-Taste löst keinen Überzug aus (aktiv-Flag).
 */
export default function Seitenwechsel() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<'ruht' | 'rein' | 'raus'>('ruht');
  const aktiv = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement)?.closest?.('a');
      if (!a) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (a.closest('.menue')) return;
      let href = a.getAttribute('href') ?? '';
      if (!href.startsWith('/') || href.startsWith('//')) return;
      // Im statischen Export tragen Links das Basis-Präfix — der Router
      // erwartet Pfade OHNE Präfix und würde es sonst doppelt anhängen.
      const basis = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
      if (basis && href.startsWith(basis)) href = href.slice(basis.length) || '/';
      const ziel = href.split('#')[0].replace(/\/+$/, '') || '/';
      const hier = pathname.replace(/\/+$/, '') || '/';
      if (ziel === hier) return;

      e.preventDefault();
      aktiv.current = true;
      setPhase('rein');
      window.setTimeout(() => router.push(href as Parameters<typeof router.push>[0]), 460);
    };

    // Capture-Phase: Next bricht seinen eigenen Link-Handler ab, sobald
    // defaultPrevented gesetzt ist — genau darauf stützt sich der Abgriff.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [pathname, router]);

  // Neue Route steht: Überzug nach oben freigeben, dann zurücksetzen.
  useEffect(() => {
    if (!aktiv.current) return;
    aktiv.current = false;
    const frei = window.setTimeout(() => setPhase('raus'), 60);
    const ende = window.setTimeout(() => setPhase('ruht'), 700);
    return () => { window.clearTimeout(frei); window.clearTimeout(ende); };
  }, [pathname]);

  return (
    <div className={`wechsel${phase !== 'ruht' ? ` wechsel--${phase}` : ''}`} aria-hidden="true">
      <span className="wechsel__mark">KLARTEXT<span className="punkt">.</span></span>
    </div>
  );
}
