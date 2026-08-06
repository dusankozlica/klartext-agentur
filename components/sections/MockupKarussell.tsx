'use client';

import { useRef } from 'react';
import Image from 'next/image';

type Bild = { src: string; width: number; height: number; blurDataURL?: string };
export type KarussellKarte = { label: string; chip: string; bild: Bild };

/**
 * Zieh-Karussell nach der ohhmydesign-Work-Referenz: übergrosse weisse
 * Rahmenkarten mit Mockup auf Farbfläche, darunter Punkt + Beschriftung
 * und Chip.
 *
 * Steuerung: Maus-Drag und natives Trackpad-Wischen (links/rechts).
 * Das vertikale Mausrad bleibt UNANGETASTET und scrollt die Seite ganz
 * normal weiter — eine frühere Rad-Umlenkung hat bei den übergrossen
 * Karten die halbe Seite blockiert. data-lenis-prevent sorgt dafür,
 * dass horizontales Wischen im Container nativ funktioniert.
 */
export default function MockupKarussell({ karten }: { karten: KarussellKarte[] }) {
  const bahn = useRef<HTMLDivElement>(null);
  const zug = useRef<{ aktiv: boolean; startX: number; startScroll: number }>({
    aktiv: false, startX: 0, startScroll: 0,
  });

  const onDown = (e: React.PointerEvent) => {
    const el = bahn.current;
    if (!el) return;
    zug.current = { aktiv: true, startX: e.clientX, startScroll: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const el = bahn.current;
    if (!el || !zug.current.aktiv) return;
    el.scrollLeft = zug.current.startScroll - (e.clientX - zug.current.startX);
  };
  const onUp = (e: React.PointerEvent) => {
    zug.current.aktiv = false;
    try { bahn.current?.releasePointerCapture(e.pointerId); } catch { /* schon frei */ }
  };

  return (
    <div
      ref={bahn}
      className="flex gap-[var(--s-6)] overflow-x-auto px-[var(--pad-x)] pb-[var(--s-4)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ cursor: 'grab' }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      data-cursor="Ziehen"
      data-lenis-prevent
    >
      {karten.map((k) => (
        <figure
          key={k.label}
          className="w-[clamp(340px,60vw,980px)] shrink-0 rounded-[26px] bg-[#fff] p-[clamp(10px,0.9vw,16px)] shadow-[0_22px_60px_rgb(14_13_11/0.1)]"
        >
          <div className="overflow-hidden rounded-[16px]">
            <Image
              src={k.bild.src}
              alt=""
              width={k.bild.width}
              height={k.bild.height}
              sizes="(max-width: 768px) 90vw, 60vw"
              placeholder={k.bild.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={k.bild.blurDataURL}
              className="aspect-[4/3] w-full select-none object-cover"
              draggable={false}
            />
          </div>
          <figcaption className="flex items-center justify-between gap-[var(--s-3)] px-[var(--s-4)] py-[var(--s-4)]">
            <span className="flex items-center gap-[0.5em] font-[family-name:var(--font-display)] text-[clamp(1.1rem,1.4vw,1.5rem)] font-semibold tracking-[-0.01em] text-[var(--ink)]">
              <span aria-hidden="true" className="inline-block h-[9px] w-[9px] rounded-full bg-[var(--violet)]" />
              {k.label}
            </span>
            <span className="chip text-[var(--grau-l)]">{k.chip}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
