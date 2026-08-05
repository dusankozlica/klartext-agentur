'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from '@/lib/motion';

/**
 * Zahlen-Counter für Case Studies. Zählt einmal beim Eintritt ins Bild.
 *
 * Bei Reduced Motion steht der Endwert sofort da — und weil der Endwert
 * bereits im HTML steht, ist die Zahl auch ohne JS lesbar.
 */
export default function Counter({ wert, className }: { wert: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    // Nur der numerische Teil wird gezählt, Präfix und Suffix bleiben stehen
    const treffer = wert.match(/^(\D*)([\d'.,]+)(.*)$/);
    if (!treffer) return;
    const [, prefix, zahlRoh, suffix] = treffer;
    const ziel = Number(zahlRoh.replace(/[',]/g, ''));
    if (!Number.isFinite(ziel)) return;

    registerGsap();
    const state = { v: 0 };
    const tween = gsap.to(state, {
      v: ziel, duration: 1.4, ease: 'power2.out',
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(state.v).toLocaleString('de-CH')}${suffix}`;
      },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });

    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [wert]);

  return <span ref={ref} className={className}>{wert}</span>;
}
