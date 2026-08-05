import Link from 'next/link';
import Menue from '@/components/layout/Menue';
import NavDropdown from '@/components/layout/NavDropdown';
import { services } from '@/lib/content/services';
import { placeholder } from '@/lib/placeholders';

/**
 * Navigation: Wortmarke links (violetter Punkt), rechts Direktlink,
 * Leistungs-Dropdown (ESE-Muster), Erstgespräch-Pille und der Menü-Knopf
 * fürs Overlay. Der Farbwechsel über dunklen Sektionen läuft über die
 * Body-Klasse aus Reveals. Platzhalter-Bilder werden hier auf dem Server
 * aufgelöst — das Dropdown bekommt fertige Pfade.
 */
export default function Nav() {
  const dropdownEintraege = services.map((s) => {
    const b = placeholder(s.bildSlot);
    return {
      slug: s.slug,
      name: s.name,
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
          <Link className="nav__cta" href="/kontakt">Erstgespräch</Link>
          <Menue />
        </nav>
      </div>
    </header>
  );
}
