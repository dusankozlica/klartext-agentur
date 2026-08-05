import Link from 'next/link';
import { site, hatWert } from '@/lib/content/site';

/**
 * Footer nach dem ohhmydesign-Muster: grosse Abschlussfrage mit CTA,
 * Linkspalten, dann die riesige Wortmarke, die auf der Unterkante sitzt
 * (der Punkt in Violett), zuletzt die Metazeile.
 *
 * Kontaktangaben erscheinen nur, wenn sie gesetzt sind — ein leeres Feld
 * wird weggelassen statt mit Platzhaltertext gefüllt. Die vollständigen
 * Angaben verlangt das Impressum (UWG Art. 3 Abs. 1 lit. s); solange sie
 * fehlen, weist die Impressumsseite intern darauf hin.
 */
export default function Footer() {
  const hatKontakt =
    hatWert(site.kontakt.email) ||
    hatWert(site.kontakt.telefon) ||
    hatWert(site.adresse.strasse);

  return (
    <footer className="footer" data-nav="dark">
      <div className="wrap pt-[var(--sec-y)]">
        <div className="grid gap-[var(--s-8)] md:grid-cols-[7fr_5fr]">
          <div>
            <p className="eyebrow" data-decode>Eine Idee im Kopf?</p>
            <h2 className="display--sm display">
              <span className="line"><span className="line__i">Reden wir</span></span>
              <span className="line"><span className="line__i">Klartext<span className="akzent-d">.</span></span></span>
            </h2>
            <div className="mt-[var(--s-7)] flex flex-wrap items-center gap-[var(--s-5)]">
              <Link className="btn btn--primary" href="/kontakt">Erstgespräch buchen&nbsp;→</Link>
              <span className="text-[0.9rem] text-[var(--grau-d)]">
                <span className="status-punkt" aria-hidden="true" />
                Nimmt neue Projekte an
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[var(--s-6)] self-end">
            <nav aria-label="Seiten">
              <p className="eyebrow">Seiten</p>
              <ul className="grid gap-[var(--s-2)]">
                <li><Link href="/projekte">Arbeiten</Link></li>
                <li><Link href="/leistungen">Leistungen</Link></li>
                <li><Link href="/team">Team</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/kontakt">Kontakt</Link></li>
              </ul>
            </nav>
            <div>
              <p className="eyebrow">Kontakt</p>
              {hatKontakt ? (
                <ul className="grid gap-[var(--s-2)] text-[var(--grau-d)]">
                  {hatWert(site.kontakt.email) && (
                    <li><a href={`mailto:${site.kontakt.email}`}>{site.kontakt.email}</a></li>
                  )}
                  {hatWert(site.kontakt.telefon) && (
                    <li><a href={`tel:${site.kontakt.telefon.replace(/\s/g, '')}`}>{site.kontakt.telefon}</a></li>
                  )}
                  {hatWert(site.adresse.strasse) && (
                    <li>{site.adresse.strasse}<br />{site.adresse.plz} {site.adresse.ort}</li>
                  )}
                </ul>
              ) : (
                <p className="text-[var(--grau-d)]">
                  <Link href="/kontakt" className="underline underline-offset-4">
                    Erstgespräch vereinbaren
                  </Link>
                </p>
              )}
              {site.social.length > 0 && (
                <ul className="mt-[var(--s-4)] flex flex-wrap gap-[var(--s-4)] text-[var(--grau-d)]">
                  {site.social.map((s) => (
                    <li key={s.name}>
                      <a href={s.url} rel="me noopener" target="_blank">{s.name}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="mt-[var(--s-8)] flex flex-wrap items-center justify-between gap-[var(--s-5)] border-t border-current/15 pt-[var(--s-5)] text-[0.85rem] text-[var(--grau-d)]">
          <span>© {new Date().getFullYear()} {site.name} — Marketingagentur, Schweiz</span>
          <span className="flex gap-[var(--s-5)]">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
            {/* Kleiner pixel.melbourne-Gruss. Führt natürlich doch wohin. */}
            <Link href="/kontakt" title="Doch geklickt.">bitte nicht klicken</Link>
          </span>
        </div>
      </div>

      <p className="footer-wortmarke" aria-hidden="true">
        KLARTEXT<span className="punkt">.</span>
      </p>
    </footer>
  );
}
