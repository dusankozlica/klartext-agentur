import Link from 'next/link';
import PlaceholderImage from '@/components/ui/PlaceholderImage';

type Eintrag = {
  slug: string;
  name: string;
  claim: string;
  fuerWen: string;
  bildSlot: string;
};

/**
 * Leistungs-Zeilen nach dem Immobilien-Referenzmuster: hohe, vollbreite
 * Zeilen mit Haarlinien. Links Nummernkreis und riesiger Name, rechts der
 * Kurztext auf Lesemass. Unterm Zeiger blendet das Foto der Leistung als
 * Zeilenhintergrund ein, der Name bekommt einen Unterstrich, der Pfeil
 * rückt von aussen nach. Die ganze Zeile ist ein Link — kein Akkordeon.
 */
export default function LeistungsZeilen({ eintraege }: { eintraege: Eintrag[] }) {
  return (
    <ol className="list-none border-t border-current/15 p-0" data-zeilen>
      {eintraege.map((s, i) => (
        <li key={s.slug} className="border-b border-current/15" data-reveal>
          <Link
            href={`/leistungen/${s.slug}`}
            data-cursor="Ansehen"
            className="group relative block overflow-hidden"
          >
            {/* Foto der Leistung — nur auf Desktop, erst beim Überfahren */}
            <div
              aria-hidden="true"
              className="absolute inset-0 hidden opacity-0 transition-opacity duration-[var(--dauer-2)] ease-[var(--ease-fluss)] group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
            >
              <div className="h-full w-full scale-[1.06] transition-transform duration-[var(--dauer-3)] ease-[var(--ease-quart)] group-hover:scale-100">
                {/* Quadratbild in flacher Zeile: Ausschnitt Richtung oberes
                    Drittel, damit Köpfe nicht auf Augenhöhe beschnitten werden */}
                <PlaceholderImage slot={s.bildSlot} alt="" sizes="100vw" className="h-full w-full [&_img]:object-[center_32%]" />
              </div>
              <div className="absolute inset-0 bg-[rgb(10_9_7/0.55)]" />
            </div>

            <div data-zeile-inhalt className="wrap relative z-[1] grid items-center gap-x-[var(--s-6)] gap-y-[var(--s-3)] py-[clamp(28px,6.5svh,64px)] md:grid-cols-[3.2rem_minmax(0,1fr)_minmax(0,36ch)_2.4rem]">
              <span className="grid h-[2.6rem] w-[2.6rem] place-items-center rounded-full border border-current/30 text-[0.78rem] font-medium">
                {String(i + 1).padStart(2, '0')}
              </span>

              <span className="font-[family-name:var(--font-display)] text-[clamp(2.2rem,4.8vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.03em] underline decoration-transparent decoration-[2.5px] underline-offset-[0.16em] transition-[text-decoration-color] duration-[var(--dauer-2)] group-hover:decoration-current group-focus-visible:decoration-current">
                {s.name}
              </span>

              {/* Kurztext rechts, wie in der bisherigen Fassung */}
              <span className="grid gap-[var(--s-2)] text-[0.95rem] leading-[1.55]">
                <span>{s.claim}</span>
                <span className="text-[var(--grau-d)] transition-colors duration-[var(--dauer-2)] group-hover:text-[color-mix(in_srgb,var(--cream)_78%,transparent)]">
                  {s.fuerWen}
                </span>
              </span>

              <span
                aria-hidden="true"
                className="hidden -translate-x-2 text-[1.7rem] opacity-0 transition-[opacity,transform] duration-[var(--dauer-2)] ease-[var(--ease-fluss)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block"
              >
                →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
