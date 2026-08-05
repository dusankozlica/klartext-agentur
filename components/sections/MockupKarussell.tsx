'use client';

import { useRef } from 'react';
import Image from 'next/image';

type Bild = { src: string; width: number; height: number; blurDataURL?: string };
export type KarussellKarte = { label: string; chip: string; bild: Bild };

/**
 * Zieh-Karussell nach der ohhmydesign-Work-Referenz: weisse, runde
 * Rahmenkarten mit Mockup-Bild, darunter Punkt + Beschriftung links und
 * Chip rechts. Gezogen wird mit der Maus (Pointer-Drag) oder nativ per
 * Trackpad; Scroll-Snap hält die Karten sauber im Raster.
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
  const onUp = () => { zug.current.aktiv = false; };

  return (
    <div
      ref={bahn}
      className="flex snap-x snap-mandatory gap-[var(--s-5)] overflow-x-auto px-[var(--pad-x)] pb-[var(--s-4)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ cursor: 'grab' }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      data-cursor="Ziehen"
    >
      {karten.map((k) => (
        <figure
          key={k.label}
          className="w-[clamp(300px,38vw,560px)] shrink-0 snap-start rounded-[22px] bg-[#fff] p-[10px] shadow-[0_18px_50px_rgb(14_13_11/0.08)]"
        >
          <div className="overflow-hidden rounded-[14px]">
            <Image
              src={k.bild.src}
              alt=""
              width={k.bild.width}
              height={k.bild.height}
              sizes="(max-width: 768px) 80vw, 40vw"
              placeholder={k.bild.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={k.bild.blurDataURL}
              className="aspect-[4/3] w-full select-none object-cover"
              draggable={false}
            />
          </div>
          <figcaption className="flex items-center justify-between gap-[var(--s-3)] px-[var(--s-3)] py-[var(--s-3)]">
            <span className="flex items-center gap-[0.5em] font-[family-name:var(--font-display)] text-[1.05rem] font-semibold tracking-[-0.01em] text-[var(--ink)]">
              <span aria-hidden="true" className="inline-block h-[8px] w-[8px] rounded-full bg-[var(--violet)]" />
              {k.label}
            </span>
            <span className="chip text-[var(--grau-l)]">{k.chip}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
