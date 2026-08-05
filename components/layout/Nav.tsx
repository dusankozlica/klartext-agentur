import Link from 'next/link';
import Menue from '@/components/layout/Menue';

/**
 * Navigation: Wortmarke links (violetter Punkt), rechts zwei Direktlinks,
 * die Erstgespräch-Pille und der Menü-Knopf fürs Overlay. Der Farbwechsel
 * über dunklen Sektionen läuft über die Body-Klasse aus Reveals.
 */
export default function Nav() {
  return (
    <header className="nav">
      <div className="nav__glas">
        <Link className="nav__mark" href="/">
          KLARTEXT<span className="punkt">.</span>
        </Link>
        <nav className="nav__links" aria-label="Hauptnavigation">
          <Link href="/projekte">Arbeiten</Link>
          <Link href="/leistungen">Leistungen</Link>
          <Link className="nav__cta" href="/kontakt">Erstgespräch</Link>
          <Menue />
        </nav>
      </div>
    </header>
  );
}
