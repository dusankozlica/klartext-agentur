import Link from 'next/link';
import Menue from '@/components/layout/Menue';
import NavDropdown from '@/components/layout/NavDropdown';
import { services } from '@/lib/content/services';
import { placeholder } from '@/lib/placeholders';

/**
 * Navigation nach der LySonic-Referenz: DREI Zonen — Wortmarke links,
 * Links exakt mittig, rechts nur die gefüllte CTA-Pille. Kein
 * Glas-Container, kein zusätzlicher Knopf daneben.
 *
 * Der Menü-Knopf fürs Overlay erscheint erst unter 900px, wo die Links
 * ausgeblendet sind — auf dem Desktop bleibt die Leiste so aufgeräumt
 * wie in der Vorlage. Platzhalter-Bilder fürs Dropdown werden hier auf
 * dem Server aufgelöst.
 */
export default function Nav() {
  const dropdownEintraege = services.map((s) => {
    const b = placeholder(s.bildSlot);
    return {
      slug: s.slug,
      name: s.name,
      claim: s.claim,
      kurz: s.kurz,
      bild: { src: b.src, width: b.width, height: b.height, blurDataURL: b.blurDataURL },
    };
  });

  return (
    <header className="nav">
      <div className="nav__glas">
        <Link className="nav__mark" href="/">
          KLARTEXT<span className="punkt">.</span>
        </Link>

        <nav className="nav__links" aria-label="Hauptnavigation">
          <Link href="/projekte">
            <span className="nl">
              <span className="nl__t">Arbeiten</span>
              <span className="nl__t nl__t--kopie" aria-hidden="true">Arbeiten</span>
            </span>
          </Link>
          <NavDropdown eintraege={dropdownEintraege} />
          <Link href="/team">
            <span className="nl">
              <span className="nl__t">Team</span>
              <span className="nl__t nl__t--kopie" aria-hidden="true">Team</span>
            </span>
          </Link>
        </nav>

        <div className="nav__aktionen">
          <Link className="nav__cta" href="/kontakt">Erstgespräch</Link>
          <Menue />
        </div>
      </div>
    </header>
  );
}
