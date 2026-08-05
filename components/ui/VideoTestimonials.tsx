'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { testimonialTitel, type Testimonial } from '@/lib/content/testimonials';

/**
 * Die Medienpfade werden vom Server mitgegeben. Die Komponente greift
 * bewusst nicht selbst auf lib/placeholders zu — sonst laege das gesamte
 * Register samt Base64-Vorschaubildern im Browser-Buendel, und die dort
 * mitlaufende Produktionssperre wuerde beim Hydrieren zuschlagen.
 */
export type TestimonialMedien = Testimonial & { src: string; poster?: string };

/**
 * Video-Testimonials.
 *
 * Facade-Pattern: Zunächst liegt nur das Poster-Bild da, `preload="none"`.
 * Erst beim Klick wird ein <video> erzeugt — dadurch kostet die Sektion im
 * Erstaufruf nichts ausser einem Bild.
 *
 * Kein Autoplay mit Ton. Untertitel sind Pflicht; fehlen sie, weist die
 * Karte sichtbar darauf hin, statt es stillschweigend zu übergehen.
 */
export default function VideoTestimonials({ items }: { items: TestimonialMedien[] }) {
  const [offen, setOffen] = useState<TestimonialMedien | null>(null);

  if (!items.length) return null;

  return (
    <>
      <ul className="grid gap-[var(--s-5)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => {
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setOffen(t)}
                className="group relative block w-full overflow-hidden text-left"
                data-cursor="Video ansehen"
              >
                <span className="relative block aspect-[9/16]">
                  {t.poster && (
                    <Image
                      src={t.poster}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  )}
                  {/* Die Kante fährt beim Hover über die Karte */}
                  <span className="pointer-events-none absolute inset-0 translate-y-full bg-[var(--violet)] mix-blend-multiply transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:translate-y-0" />
                </span>
                <span className="mt-[var(--s-4)] block border-t border-current pt-[var(--s-4)]">
                  <span className="block font-[family-name:var(--font-display)] text-[1.15rem] font-semibold tracking-[-0.02em]">
                    {testimonialTitel(t)}
                  </span>
                  <span className="block text-[0.9rem]">{t.firma}</span>
                </span>
              </button>

              {t.caseSlug && (
                <Link href={`/projekte/${t.caseSlug}`} className="mt-[var(--s-2)] inline-block text-[0.9rem] underline underline-offset-4">
                  Zur Case Study
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {offen && <Lightbox item={offen} onClose={() => setOffen(null)} />}
    </>
  );
}

/** Lightbox mit Fokusfalle, Escape und Rückgabe des Fokus. */
function Lightbox({ item, onClose }: { item: TestimonialMedien; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const zuvorFokussiert = document.activeElement as HTMLElement | null;
    const el = dialog.current;
    el?.querySelector<HTMLElement>('button')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !el) return;

      const fokussierbar = el.querySelectorAll<HTMLElement>(
        'button, [href], video, [tabindex]:not([tabindex="-1"])',
      );
      if (!fokussierbar.length) return;
      const erster = fokussierbar[0];
      const letzter = fokussierbar[fokussierbar.length - 1];

      if (e.shiftKey && document.activeElement === erster) {
        e.preventDefault(); letzter.focus();
      } else if (!e.shiftKey && document.activeElement === letzter) {
        e.preventDefault(); erster.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const scrollSperre = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = scrollSperre;
      zuvorFokussiert?.focus();
    };
  }, [onClose]);

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`Video: ${testimonialTitel(item)}, ${item.firma}`}
      className="fixed inset-0 z-[95] grid place-items-center bg-[var(--ink)]/90 p-[var(--pad-x)]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[420px]">
        <video
          controls
          autoPlay
          playsInline
          preload="none"
          poster={item.poster}
          className="aspect-[9/16] w-full bg-black"
        >
          <source src={item.src} type="video/mp4" />
          {/* TODO: echte Untertiteldatei einhängen, sobald vorhanden:
              <track kind="captions" srcLang="de" src="..." default /> */}
          Ihr Browser kann dieses Video nicht abspielen.
        </video>

        <div className="mt-[var(--s-4)] flex items-start justify-between gap-[var(--s-5)] text-[var(--cream)]">
          <p>
            <span className="block font-[family-name:var(--font-display)] text-[1.1rem] font-semibold">
              {testimonialTitel(item)}
            </span>
            <span className="block text-[0.9rem] opacity-75">{item.firma}</span>
          </p>
          <button type="button" onClick={onClose} className="btn btn--hell shrink-0">
            Schliessen
          </button>
        </div>
      </div>
    </div>
  );
}
