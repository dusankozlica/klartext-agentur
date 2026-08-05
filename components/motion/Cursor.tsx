'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, hasFinePointer } from '@/lib/motion';

/**
 * Custom Cursor — ein waagrechter Balken, kein Kreis: dasselbe Motiv wie
 * der Schnitt. Über Medienflächen wird er zur beschrifteten Leiste.
 *
 * Nur bei `pointer: fine` und ohne Reduced-Motion. Auf Touch existiert er
 * nicht, und der native Cursor wird nur dann versteckt, wenn der eigene
 * tatsächlich läuft (Klasse `has-cursor` am Body) — sonst hätte man auf
 * Geräten ohne JS-Cursor gar keinen Zeiger mehr.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;

    const cur = ref.current;
    if (!cur) return;
    const label = cur.querySelector<HTMLElement>('.cursor__label');

    document.body.classList.add('has-cursor');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const tgt = { ...pos };

    const onMove = (e: PointerEvent) => {
      // Erst ab der ersten echten Bewegung sichtbar — und dann ohne
      // Anlauf aus der Bildschirmmitte: Position springt direkt zum Zeiger.
      if (!cur.classList.contains('is-live')) {
        pos.x = e.clientX; pos.y = e.clientY;
        cur.classList.add('is-live');
      }
      tgt.x = e.clientX; tgt.y = e.clientY;
    };
    window.addEventListener('pointermove', onMove);

    const tick = () => {
      pos.x += (tgt.x - pos.x) * 0.16;
      pos.y += (tgt.y - pos.y) * 0.16;
      cur.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
    };
    gsap.ticker.add(tick);

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
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      gsap.ticker.remove(tick);
      document.body.classList.remove('has-cursor');
    };
  }, []);

  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <span className="cursor__label" />
    </div>
  );
}
