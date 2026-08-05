'use client';

import dynamic from 'next/dynamic';

/**
 * Motion wird nachgeladen, nicht mitgeliefert.
 *
 * GSAP, ScrollTrigger und Lenis wiegen zusammen rund 53 kB gzip. Im
 * Erstladen gemessen lag die Startseite damit bei 232 kB — über dem Budget
 * von 180 kB aus Abschnitt 8. Nichts davon wird für den ersten Bildschirm
 * gebraucht: der Schnitt steht als CSS, der Text ist da, gescrollt wird
 * erst danach.
 *
 * `ssr: false` ist hier korrekt, weil keine dieser Komponenten Inhalt
 * rendert — sie hängen sich nur an vorhandenes DOM. Die Absicherung gegen
 * unsichtbare Inhalte liegt in globals.css (`.js [data-reveal]`).
 */
const SmoothScroll = dynamic(() => import('./SmoothScroll'), { ssr: false });
const Reveals = dynamic(() => import('./Reveals'), { ssr: false });
const Cursor = dynamic(() => import('./Cursor'), { ssr: false });
const Magnete = dynamic(() => import('./Magnete'), { ssr: false });
const Seitenwechsel = dynamic(() => import('./Seitenwechsel'), { ssr: false });
// Intro MUSS nach Reveals mounten: Reveals liest den Session-Schluessel,
// bevor das Intro ihn setzt — so gehoeren die Hero-Zeilen beim Erstbesuch
// dem Intro und danach dem Scroll-Reveal.
const Intro = dynamic(() => import('./Intro'), { ssr: false });

export default function MotionLayer() {
  return (
    <>
      <SmoothScroll />
      <Reveals />
      <Cursor />
      <Magnete />
      <Seitenwechsel />
      <Intro />
    </>
  );
}
