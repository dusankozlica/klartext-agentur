/**
 * Branding-Bühne nach der ESE-Referenz (expertise/branding): schwebende,
 * leicht gedrehte Karten über einer satten Violett-Fläche, unten ein
 * Umriss-Wortband, links das Label.
 *
 * ESE zeigt dort Kundenlogos — wir haben keine Freigaben und erfinden
 * keine. Die Karten zeigen darum ehrlich UNSER eigenes Markensystem:
 * Wortmarke, Farbklima, Typografie. Parallax läuft über die
 * [data-scroll-speed]-API aus Reveals.
 */
export default function BrandingBuehne() {
  return (
    <section
      className="relative overflow-hidden text-[var(--cream)]"
      style={{ background: 'linear-gradient(132deg, #1C0340 0%, var(--violet) 55%, #8F45FF 100%)' }}
      data-nav="dark"
      aria-label="Bausteine einer Marke"
    >
      <div className="relative min-h-[72svh]">
        {/* Label links, wie bei ESE */}
        <p className="absolute left-[var(--pad-x)] top-1/2 z-10 -translate-y-1/2 text-[0.85rem] font-medium uppercase tracking-[0.16em]" data-decode>
          Branding &amp; Design
        </p>

        {/* Karte 1: Wortmarke */}
        <div
          className="absolute left-[14%] top-[12%] w-[clamp(170px,24vw,330px)] -rotate-6 rounded-[18px] bg-[var(--cream)] p-[clamp(16px,1.8vw,28px)] text-[var(--ink)] shadow-[0_30px_80px_rgb(10_2_30/0.35)]"
          data-scroll-speed="0.12"
          data-reveal
        >
          <p className="font-[family-name:var(--font-display)] text-[clamp(1.4rem,2.4vw,2.2rem)] font-semibold tracking-[-0.02em]">
            KLARTEXT<span className="text-[var(--violet)]">.</span>
          </p>
          <p className="mt-[clamp(20px,3vw,44px)] text-[0.75rem] uppercase tracking-[0.14em] text-[var(--grau-l)]">
            Wortmarke
          </p>
        </div>

        {/* Karte 2: Farbsystem */}
        <div
          className="absolute left-[40%] top-[38%] w-[clamp(180px,25vw,350px)] rotate-2 rounded-[18px] bg-[var(--ink)] p-[clamp(16px,1.8vw,28px)] shadow-[0_30px_80px_rgb(10_2_30/0.4)]"
          data-scroll-speed="-0.08"
          data-reveal
        >
          <div className="flex gap-[10px]">
            {['#6A00F4', '#A57BFF', '#F3EEE3', '#1A1814'].map((farbe) => (
              <span
                key={farbe}
                className="h-[clamp(40px,5vw,72px)] flex-1 rounded-[10px] border border-[rgb(243_238_227/0.16)]"
                style={{ background: farbe }}
              />
            ))}
          </div>
          <p className="mt-[var(--s-4)] text-[0.75rem] uppercase tracking-[0.14em] text-[var(--grau-d)]">
            Farbklima
          </p>
        </div>

        {/* Karte 3: Typografie */}
        <div
          className="absolute right-[12%] top-[10%] w-[clamp(160px,21vw,300px)] rotate-6 rounded-[18px] bg-[#FFFFFF] p-[clamp(16px,1.8vw,28px)] text-[var(--ink)] shadow-[0_30px_80px_rgb(10_2_30/0.35)]"
          data-scroll-speed="0.16"
          data-reveal
        >
          <p className="font-[family-name:var(--font-display)] text-[clamp(2.6rem,5vw,4.4rem)] font-semibold leading-none tracking-[-0.02em]">
            Aa
          </p>
          <p className="mt-[clamp(16px,2.4vw,36px)] text-[0.75rem] uppercase tracking-[0.14em] text-[var(--grau-l)]">
            Clash Display · Switzer
          </p>
        </div>

        {/* Umriss-Wortband unten (ESE: «…g — Logo — Corpor…») */}
        <p
          className="pointer-events-none absolute inset-x-0 bottom-[4%] select-none whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[9vw] font-semibold leading-none tracking-[-0.02em] text-transparent"
          style={{ WebkitTextStroke: '1.5px rgba(243,238,227,0.8)' }}
          data-scroll-speed="0.05"
          aria-hidden="true"
        >
          Logo — Farbe — Typografie — Tonfall
        </p>
      </div>
    </section>
  );
}
