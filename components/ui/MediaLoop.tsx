'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Stummes Schleifenvideo für Kopfbereiche.
 *
 * Bekommt `src` und `poster` als fertige Werte vom Server. Die Komponente
 * greift bewusst NICHT selbst auf lib/placeholders zu: Damit landete sonst
 * das gesamte Platzhalter-Register samt Base64-Vorschaubildern im
 * Browser-Bündel — und die dort mitlaufende Produktionssperre liess die
 * Seite beim Hydrieren abstürzen.
 *
 * Regeln, die hier im Code stehen und nicht im Kommentar:
 *  - Startet erst im Sichtbereich (IntersectionObserver); ein Video, das
 *    ausserhalb dekodiert wird, kostet Akku für nichts.
 *  - Bei `prefers-reduced-motion: reduce` läuft es gar nicht, das Poster
 *    bleibt stehen.
 *  - `preload="none"` bis zum Sichtbarwerden.
 *  - Immer stumm, nie mit Ton.
 */
export default function MediaLoop({
  src, poster, className, cursorLabel,
}: {
  src: string;
  poster?: string;
  className?: string;
  cursorLabel?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [sichtbar, setSichtbar] = useState(false);
  // Die Videodatei wird erst NACH dem Load-Event angehängt. Vorher sog
  // das Hero-Video (850 KB) auf gedrosselten Verbindungen die Leitung
  // leer und schob den Font-Swap — und damit den LCP — auf 4.5 s hinaus.
  // Das Poster steht ab dem ersten Paint, der Loop startet eine
  // Wimpernschlag später.
  const [bereit, setBereit] = useState(false);
  useEffect(() => {
    if (document.readyState === 'complete') { setBereit(true); return; }
    const anWindowLoad = () => setBereit(true);
    window.addEventListener('load', anWindowLoad, { once: true });
    return () => window.removeEventListener('load', anWindowLoad);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !bereit) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Quelle ist gerade erst in den DOM gekommen — Video neu einlesen.
    el.load();

    const beobachter = new IntersectionObserver(
      ([eintrag]) => {
        setSichtbar(eintrag.isIntersecting);
        if (eintrag.isIntersecting) {
          el.play().catch(() => { /* Autoplay verweigert — Poster bleibt stehen */ });
        } else {
          el.pause();
        }
      },
      { rootMargin: '200px' },
    );
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, [bereit]);

  return (
    <video
      ref={ref}
      className={`h-full w-full bg-[var(--ink)] object-cover ${className ?? ''}`}
      // Das Poster wird IMMER sofort gesetzt. Der Versuch, es erst beim
      // Sichtbarwerden zu laden, hat den LCP von 2.2 s auf 3.9 s verschlechtert
      // (dreimal gemessen): Das Showreel-Video ist das LCP-Element, und ohne
      // Poster entsteht es erst nach dem Hydrieren. Die 28 KB sind der
      // deutlich kleinere Preis.
      poster={poster}
      muted
      loop
      playsInline
      preload={sichtbar ? 'auto' : 'none'}
      aria-hidden="true"
      tabIndex={-1}
      data-cursor={cursorLabel}
    >
      {bereit && <source src={src} type="video/mp4" />}
    </video>
  );
}
