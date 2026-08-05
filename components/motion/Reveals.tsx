'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion, splitLines } from '@/lib/motion';

/**
 * Die wiederkehrenden Scroll-Effekte, zentral statt pro Sektion:
 *
 *  - Masken-Reveal der Headlines (.line__i fährt im Fenster hoch)
 *  - Sanftes Einblenden für [data-reveal]
 *  - Parallax über die Attribut-API [data-scroll-speed]
 *  - Decode-Labels ([data-decode])
 *  - Navigationsfarbe folgt der Sektion unter der Leiste
 *
 * WICHTIG: läuft pro ROUTE, nicht einmal pro Sitzung. Der Layer wohnt im
 * Root-Layout — beim Seitenwechsel im Client baut Next den Seiteninhalt
 * neu auf, und ohne neuen Durchlauf bekämen die frischen [data-reveal]-
 * Elemente nie einen Trigger: Sektionen blieben unsichtbar (der Bug vom
 * 05.08., leeres Statement nach Dropdown-Ausflug und zurück).
 */
export default function Reveals() {
  const pathname = usePathname();

  useEffect(() => {
    registerGsap();
    // Neue Seiteninhalte brauchen ihre Masken-Fenster, bevor Trigger
    // entstehen — idempotent, bereits zerlegte Zeilen bleiben unberührt.
    splitLines();
    if (prefersReducedMotion()) {
      gsap.set('[data-reveal]', { opacity: 1, y: 0 });
      return;
    }

    // Beim Erstbesuch der Session gehoeren die Hero-Zeilen dem Intro.
    // Wichtig: Dieser Effekt laeuft VOR dem Intro-Effekt (Mount-Reihenfolge
    // im MotionLayer), liest den Schluessel also, bevor das Intro ihn setzt.
    const heroOwnedByIntro = !sessionStorage.getItem('kt_intro');

    const ctx = gsap.context(() => {
      // Headlines
      document.querySelectorAll<HTMLElement>('.display').forEach((h) => {
        if (heroOwnedByIntro && h.closest('[data-hero]')) return;
        gsap.from(h.querySelectorAll('.line__i'), {
          yPercent: 105, duration: 1.2, ease: 'power4.out', stagger: 0.07,
          scrollTrigger: { trigger: h, start: 'top 85%', once: true },
        });
      });

      // Allgemeine Reveals. Variante «vorhang»: Bild öffnet sich aus
      // einem Beschnitt-Rahmen (clip-path) statt nur aufzublenden.
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        if (el.dataset.reveal === 'vorhang') {
          gsap.fromTo(el,
            { clipPath: 'inset(12% 6% 12% 6%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0,
              duration: 1.25, ease: 'power4.out',
              scrollTrigger: { trigger: el, start: 'top 82%', once: true },
            });
          return;
        }
        gsap.to(el, {
          opacity: 1, y: 0, duration: 1.0, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      // Hero-Video zoomt beim Wegscrollen minimal auf (scrub)
      const heroZoom = document.querySelector<HTMLElement>('[data-hero-zoom]');
      if (heroZoom) {
        gsap.to(heroZoom, {
          scale: 1.09, ease: 'none',
          scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true },
        });
      }

      // Statement: Wörter färben mit dem Scroll ein (sohub-Moment).
      // Wortweise einwickeln, Klassen wie .leise/.akzent bleiben erhalten,
      // weil nur Textknoten ersetzt werden.
      document.querySelectorAll<HTMLElement>('[data-wortstrom]').forEach((abs) => {
        if (!abs.querySelector('.w')) {
          const wickle = (knoten: Node) => {
            [...knoten.childNodes].forEach((k) => {
              if (k.nodeType === Node.TEXT_NODE) {
                const frag = document.createDocumentFragment();
                (k.textContent ?? '').split(/(\s+)/).forEach((t) => {
                  if (!t) return;
                  if (/^\s+$/.test(t)) { frag.append(t); return; }
                  const s = document.createElement('span');
                  s.className = 'w'; s.textContent = t;
                  frag.append(s);
                });
                k.replaceWith(frag);
              } else if (k.nodeType === Node.ELEMENT_NODE) {
                wickle(k);
              }
            });
          };
          wickle(abs);
        }
        gsap.fromTo(abs.querySelectorAll('.w'), { opacity: 0.14 }, {
          opacity: 1, stagger: 0.06, ease: 'none',
          scrollTrigger: { trigger: abs, start: 'top 80%', end: 'top 30%', scrub: true },
        });
      });

      // Klartext-Filter: Floskel wird durchgestrichen, die Übersetzung
      // steigt aus der Maske — einmalig pro Zeile.
      document.querySelectorAll<HTMLElement>('[data-filterzeile]').forEach((z) => {
        const strich = z.querySelector('[data-strich]');
        const floskel = z.querySelector('[data-floskel]');
        const klar = z.querySelector('[data-klartext]');
        if (klar) gsap.set(klar, { yPercent: 110 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: z, start: 'top 76%', once: true },
        });
        if (strich) tl.to(strich, { scaleX: 1, duration: 0.5, ease: 'power4.out' });
        if (floskel) tl.to(floskel, { opacity: 0.45, duration: 0.4, ease: 'power2.out' }, '<0.1');
        if (klar) tl.to(klar, { yPercent: 0, duration: 0.9, ease: 'power4.out' }, '-=0.15');
      });

      // Parallax über Attribut-API. Der Massstab wächst um die Laufweite
      // mit: Ein Bild, das ±6 % wandert, muss 6 % grösser sein, sonst
      // blitzen an den vollbreiten Bändern oben und unten Kanten auf.
      gsap.utils.toArray<HTMLElement>('[data-scroll-speed]').forEach((el) => {
        const speed = parseFloat(el.dataset.scrollSpeed ?? '0');
        if (!speed) return;
        gsap.fromTo(el,
          { yPercent: -speed * 100, scale: 1 + Math.abs(speed) },
          {
            yPercent: speed * 100, scale: 1 + Math.abs(speed), ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top bottom', end: 'bottom top', scrub: true,
            },
          });
      });

      // Decode-Labels: kleine Zeilen entschlüsseln sich beim Eintritt —
      // das Sharebien-Detail, übersetzt auf unsere Eyebrows. Läuft einmal,
      // endet immer im Originaltext.
      const ZEICHEN = 'KLARTEXTabcdefghikmnprstuvwz';
      gsap.utils.toArray<HTMLElement>('[data-decode]').forEach((el) => {
        const original = el.textContent ?? '';
        if (!original.trim()) return;
        ScrollTrigger.create({
          trigger: el, start: 'top 92%', once: true,
          onEnter: () => {
            const state = { p: 0 };
            gsap.to(state, {
              p: 1, duration: 0.55, ease: 'power1.out',
              onUpdate: () => {
                const fest = Math.floor(state.p * original.length);
                el.textContent =
                  original.slice(0, fest) +
                  Array.from(original.slice(fest), (c) =>
                    c === ' ' || c === '·' ? c : ZEICHEN[(Math.random() * ZEICHEN.length) | 0],
                  ).join('');
              },
              onComplete: () => { el.textContent = original; },
            });
          },
        });
      });

      // Navigationsfarbe. Schwelle ist die MITTELLINIE der Leiste, nicht
      // ihre Unterkante — sonst schaltet die Schrift zurück, während oben
      // noch Violett hinter ihr steht, und die dunkle Wortmarke ist für
      // einen Moment unlesbar.
      const navMid = Math.round(
        (document.querySelector('.nav')?.getBoundingClientRect().height ?? 66) / 2,
      );
      document.querySelectorAll<HTMLElement>('[data-nav="dark"]').forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec, start: `top ${navMid}px`, end: `bottom ${navMid}px`,
          onToggle: (self) =>
            document.body.classList.toggle('nav-on-dark', self.isActive),
        });
      });
    });

    // Schriften verschieben die Zeilenhöhe. Vor `fonts.ready` gemessene
    // Positionen sitzen daneben — also danach neu rechnen.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [pathname]);

  return null;
}

