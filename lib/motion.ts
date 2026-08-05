/**
 * Gemeinsame Motion-Grundlagen.
 *
 * Warum Lenis und nicht ScrollSmoother: ScrollSmoother verpackt den
 * Seiteninhalt in einen transformierten Container. Darin verliert
 * `position: fixed` seine Bezugsgrösse — und genau darauf stehen bei uns
 * das Grain-Overlay, der Custom Cursor und die Navigation. Lenis lässt
 * das DOM unangetastet.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function registerGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/**
 * Zerlegt Headline-Zeilen in ein Fenster (.line) mit innerem Läufer
 * (.line__i). Das ist der Masken-Reveal ohne SplitText-Abhängigkeit im
 * kritischen Pfad — und es ist idempotent, läuft also bei erneutem
 * Mounten nicht doppelt.
 */
export function splitLines(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('.display .line').forEach((line) => {
    if (line.querySelector(':scope > .line__i')) return;
    const inner = document.createElement('span');
    inner.className = 'line__i';
    inner.append(...Array.from(line.childNodes));
    line.append(inner);
  });
}

export { gsap, ScrollTrigger };
