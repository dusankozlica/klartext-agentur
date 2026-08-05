'use client';

import { useEffect } from 'react';
import { gsap, hasFinePointer, prefersReducedMotion } from '@/lib/motion';

/**
 * Magnetische Pillen: Buttons ziehen sich dem Zeiger ein Stück entgegen
 * und federn beim Verlassen zurück (back.out — das nexola-Gefühl über
 * Physik, ohne deren Look zu kopieren).
 *
 * Delegiert über document, damit auch nach Routenwechseln jede Pille
 * mitmacht; quickTo-Setter werden pro Element einmalig angelegt.
 */
export default function Magnete() {
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;

    const STAERKE = 0.32;
    const MAX = 11;
    type Setter = { x: (v: number) => void; y: (v: number) => void };
    const karte = new WeakMap<HTMLElement, Setter>();

    const ziel = (t: EventTarget | null) =>
      (t as HTMLElement)?.closest?.<HTMLElement>('.btn, .nav__cta, .nav__menue, .menue__schliessen');

    const onMove = (e: PointerEvent) => {
      const el = ziel(e.target);
      if (!el) return;
      let q = karte.get(el);
      if (!q) {
        q = {
          x: gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' }),
        };
        karte.set(el, q);
      }
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      q.x(Math.max(-MAX, Math.min(MAX, dx * STAERKE)));
      q.y(Math.max(-MAX, Math.min(MAX, dy * STAERKE)));
    };

    const onOut = (e: PointerEvent) => {
      const el = ziel(e.target);
      if (!el || el.contains(e.relatedTarget as Node)) return;
      gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'back.out(2.2)' });
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerout', onOut);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
    };
  }, []);

  return null;
}
