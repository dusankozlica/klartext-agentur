'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion, hasFinePointer } from '@/lib/motion';

/**
 * Custom Cursor — offener Ring, der über Links und Medien aufgeht.
 *
 * WICHTIG (07.08., zweite Tempo-Rückmeldung): Die Position wird DIREKT
 * im pointermove gesetzt, ohne Lerp und ohne GSAP-Ticker. Jedes
 * Nachziehen liest sich als Verzögerung, sobald die Bildrate schwankt —
 * und der Ticker hängt am selben Frame-Budget wie Lenis und die
 * Scroll-Effekte. Direkt gesetzt läuft der Ring 1:1 mit der Hand, auch
 * wenn die Seite gerade rechnet.
 *
 * Nur bei `pointer: fine` und ohne Reduced-Motion.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;

    const cur = ref.current;
    if (!cur) return;
    const label = cur.querySelector<HTMLElement>('.cursor__label');

    document.body.classList.add('has-cursor');

    const onMove = (e: PointerEvent) => {
      // Erst ab der ersten echten Bewegung sichtbar.
      if (!cur.classList.contains('is-live')) cur.classList.add('is-live');
      cur.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%,-50%)`;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // Fenster verlassen: ausblenden, beim Wiedereintritt sitzt der Ring
    // dank Direktsetzung sofort an der richtigen Stelle.
    const onLeave = () => cur.classList.remove('is-live');
    document.documentElement.addEventListener('pointerleave', onLeave);

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const media = t?.closest?.<HTMLElement>('[data-cursor]');
      if (media) {
        if (label) label.textContent = media.dataset.cursor ?? '';
        cur.classList.add('is-media');
      }
      if (t?.closest?.('a, button')) cur.classList.add('is-link');
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t?.closest?.('[data-cursor]')) cur.classList.remove('is-media');
      if (t?.closest?.('a, button')) cur.classList.remove('is-link');
    };
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.body.classList.remove('has-cursor');
    };
  }, []);

  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <span className="cursor__label" />
    </div>
  );
}
