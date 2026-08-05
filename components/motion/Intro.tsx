'use client';

import { useEffect, useRef } from 'react';
import {
  gsap, ScrollTrigger, registerGsap, prefersReducedMotion, splitLines,
} from '@/lib/motion';

/**
 * Intro v3 — kurz und leise: Wortmarke buchstabenweise auf Schwarz,
 * violetter Punkt als Schlussakzent, dann gibt die Fläche den Blick frei.
 * Gesamtdauer ~1.5s statt ~3s: Das alte Intro hielt den Hero-Text zurück
 * und trieb den LCP auf 4.8s.
 *
 * Läuft einmal pro Session (`sessionStorage`), nie bei Reduced Motion.
 * Reveals liest denselben Schlüssel VOR diesem Effekt (Mount-Reihenfolge
 * im MotionLayer) und überlässt dem Intro die Hero-Zeilen beim Erstbesuch.
 */
export default function Intro() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Mobil läuft kein Intro (siehe CSS) — Schlüssel nicht verbrauchen.
    if (prefersReducedMotion() || sessionStorage.getItem('kt_intro')
        || !window.matchMedia('(min-width:900px)').matches) {
      el.remove();
      return;
    }
    sessionStorage.setItem('kt_intro', '1');

    registerGsap();
    splitLines();
    document.documentElement.classList.add('intro-laeuft');

    const buchstaben = el.querySelectorAll('.intro__mark span');
    // Ohne den Schnitt existieren die Hero-Zeilen nur noch einmal —
    // der Stagger läuft linear, kein Modulo mehr nötig.
    const heroZeilen = gsap.utils.toArray<HTMLElement>('[data-hero] .display .line__i');

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete() {
        el.remove();
        document.documentElement.classList.remove('intro-laeuft');
        ScrollTrigger.refresh();
      },
    });

    tl.to(buchstaben, { y: 0, duration: 0.55, stagger: 0.035 })
      .to(el, {
        yPercent: -100, duration: 0.6, ease: 'power3.inOut', delay: 0.45,
      });

    if (heroZeilen.length) {
      tl.from(heroZeilen, {
        yPercent: 105, duration: 0.9, ease: 'power3.out', stagger: 0.07,
      }, '-=0.25')
        .from('[data-hero] .eyebrow, [data-hero] .hero-foot', {
          opacity: 0, y: 18, duration: 0.5, stagger: 0.08,
        }, '-=0.45');
    }

    return () => { tl.kill(); document.documentElement.classList.remove('intro-laeuft'); };
  }, []);

  return (
    <div className="intro" ref={ref} aria-hidden="true">
      <p className="intro__mark">
        {'KLARTEXT'.split('').map((b, i) => <span key={i}>{b}</span>)}
        <span className="punkt">.</span>
      </p>
    </div>
  );
}
