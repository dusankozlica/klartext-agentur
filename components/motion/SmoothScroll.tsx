'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion, splitLines } from '@/lib/motion';

/**
 * Fundament: Lenis + ScrollTrigger, sauber synchronisiert und beim
 * Verlassen der Route vollständig abgebaut.
 *
 * Bei `prefers-reduced-motion: reduce` wird Lenis gar nicht erst
 * erzeugt — die Seite scrollt nativ, alle Reveals stehen im Endzustand.
 */
export default function SmoothScroll() {
  useEffect(() => {
    registerGsap();
    splitLines();

    if (prefersReducedMotion()) {
      gsap.set('[data-reveal]', { opacity: 1, y: 0 });
      return;
    }

    const lenis = new Lenis({ lerp: 0.1, duration: 1.1, syncTouch: false });

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Offenes Overlay-Menü friert den Hintergrund ein — ohne das scrollt
    // Lenis munter weiter, obwohl body overflow:hidden hat.
    const onMenue = (e: Event) => {
      if ((e as CustomEvent<boolean>).detail) lenis.stop(); else lenis.start();
    };
    window.addEventListener('kt:menue', onMenue);

    // Anker-Links müssen mit Smooth Scroll funktionieren
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      const href = link?.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement);
    };
    document.addEventListener('click', onClick);

    // Browser soll die alte Scrollposition nicht gegen Lenis setzen
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';

    return () => {
      window.removeEventListener('kt:menue', onMenue);
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      history.scrollRestoration = previousRestoration;
    };
  }, []);

  return null;
}
