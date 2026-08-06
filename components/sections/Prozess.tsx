import MediaLoop from '@/components/ui/MediaLoop';
import { placeholder } from '@/lib/placeholders';

/**
 * Prozess-Sektion nach der bymonolog-Referenz: pro Schritt links das
 * kleine Label am Rand plus Titel und Kurztext auf Lesemass, rechts ein
 * randabfallendes, stumm loopendes 10-Sekunden-Video (MediaLoop spielt
 * erst im Sichtfeld — exakt das Verhalten der Referenz).
 *
 * Bewusst übersetzt statt kopiert: Labels laufen in Switzer-Versalien
 * (keine Mono-Schrift), Bewegungen über unsere Reveal-/Parallax-Tokens.
 */
const SCHRITTE = [
  {
    nr: '01',
    titel: 'Wir hören zu.',
    text: 'Erstgespräch, Fragen, Blick in den Betrieb. Wir reden mit den Leuten, die die Arbeit machen — nicht nur mit der Chefetage.',
    videoSlot: 'video/prozess-01',
  },
  {
    nr: '02',
    titel: 'Wir finden den Klartext.',
    text: 'Ihre Positionierung auf einen Satz, der auch in der Beiz funktioniert. Erst wenn der steht, wird gestaltet.',
    videoSlot: 'video/prozess-02',
  },
  {
    nr: '03',
    titel: 'Wir setzen um.',
    text: 'Marke, Website, Kanäle — aus einer Hand, in Etappen, die Sie freigeben. Keine Übergaben an ein Team, das Sie nie getroffen haben.',
    videoSlot: 'video/prozess-03',
  },
  {
    nr: '04',
    titel: 'Wir messen und schärfen nach.',
    text: 'Was nicht wirkt, steht im Rapport — und wird geändert. Auch das ist Klartext.',
    videoSlot: 'video/prozess-04',
  },
];

export default function Prozess() {
  return (
    <section className="bg-[var(--ink)] text-[var(--cream)]" data-nav="dark" id="prozess" aria-label="So arbeiten wir">
      <div className="wrap flex flex-wrap items-baseline justify-between gap-[var(--s-4)] pb-[var(--s-7)] pt-[var(--sec-y)]">
        <h2 className="sec-title mb-0" data-reveal>So arbeiten wir</h2>
        <p className="eyebrow mb-0 text-[var(--grau-d)]" data-decode>Vier Schritte · kein Theater</p>
      </div>

      {/* Schritte fugenlos gestapelt, feine Haarlinien als Trenner */}
      <div className="border-b border-current/15">
        {SCHRITTE.map((s) => {
          const video = placeholder(s.videoSlot);
          return (
            <div key={s.nr} className="grid border-t border-current/15 md:grid-cols-2">
              {/* Text links: Label am Rand, Titel + Kurztext auf Mass */}
              <div className="relative flex items-start px-[var(--pad-x)] py-[clamp(44px,8svh,96px)]">
                <span
                  className="absolute left-[var(--pad-x)] top-[clamp(48px,8.4svh,100px)] text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[var(--grau-d)]"
                  data-decode
                >
                  Schritt · {s.nr}
                </span>
                <div className="md:pl-[clamp(5rem,10vw,11rem)]" data-reveal>
                  <h3 className="max-w-[16ch] font-[family-name:var(--font-display)] text-[clamp(1.8rem,3.2vw,3rem)] font-semibold leading-[1.06] tracking-[-0.02em]">
                    {s.titel}
                  </h3>
                  <p className="mt-[var(--s-5)] max-w-[34ch] text-[1rem] leading-[1.6] text-[var(--grau-d)]">
                    {s.text}
                  </p>
                </div>
              </div>

              {/* Video rechts: randabfallend, stummer 10s-Loop */}
              <div className="relative min-h-[38svh] overflow-hidden md:min-h-[56svh]" data-reveal>
                <div className="absolute inset-0" data-scroll-speed="0.05">
                  <MediaLoop src={video.src} poster={video.poster} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
