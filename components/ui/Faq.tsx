import type { FaqEintrag } from '@/lib/content/faq';

/**
 * FAQ als natives <details>/<summary>.
 *
 * Bewusst ohne JavaScript: Tastaturbedienung, Screenreader-Semantik und
 * Öffnen/Schliessen bringt der Browser mit. Der Inhalt steht dadurch auch
 * ohne JS im HTML — relevant für Suchmaschinen und AI-Antwortsysteme.
 */
export default function Faq({ eintraege }: { eintraege: FaqEintrag[] }) {
  return (
    <div className="border-t border-current/20">
      {eintraege.map((e) => (
        <details key={e.frage} className="group border-b border-current/20">
          <summary className="flex cursor-pointer list-none items-baseline justify-between gap-[var(--s-5)] py-[var(--s-6)] font-[family-name:var(--font-display)] text-[clamp(1.15rem,2vw,1.5rem)] font-semibold tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
            {e.frage}
            <span aria-hidden="true" className="shrink-0 text-[1.4em] leading-none transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="body-measure pb-[var(--s-7)] opacity-80">{e.antwort}</p>
        </details>
      ))}
    </div>
  );
}
