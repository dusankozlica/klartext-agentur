import type { Metadata } from 'next';
import './globals.css';

import { site } from '@/lib/content/site';

import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import MotionLayer from '@/components/motion/MotionLayer';

export const metadata: Metadata = {
  // Basis für kanonische URLs und OG-Bilder. Solange NEXT_PUBLIC_SITE_URL
  // nicht gesetzt ist, zeigt sie auf example.invalid — das ist Absicht:
  // eine falsche echte Domain wäre schlimmer als eine offensichtlich leere.
  metadataBase: new URL(site.url),
  title: {
    default: 'KLARTEXT. — Marketingagentur',
    template: '%s · KLARTEXT.',
  },
  description: site.kurzprofil,
  openGraph: {
    type: 'website',
    locale: 'de_CH',
    siteName: site.name,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // suppressHydrationWarning ist hier korrekt und kein Zudecken: Das
    // Inline-Skript unten setzt bewusst eine Klasse VOR der Hydration.
    // Ohne diesen Hinweis meldet React einen Mismatch am <html>-Element —
    // zu Recht, denn Server und Client unterscheiden sich an dieser Stelle.
    <html lang="de-CH" suppressHydrationWarning>
      <head>
        {/* Display-Schrift früh: Der LCP ist die Headline, und ihr letzter
            Paint ist der Font-Swap. 15 KB — der Preload zieht den Swap an
            den First Paint heran. (Einzeln gemessen: −0.9s LCP.)
            Basis-Pfad im Code statt per Deploy-sed: React fügt den Link
            bei der Hydration sonst ein zweites Mal MIT Roh-Pfad ein (404
            auf GitHub Pages). */}
        <link
          rel="preload"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/fonts/clash-display-600.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Markiert, dass JavaScript läuft — erst dann greift der
            Startzustand der Reveals. Ohne das bliebe Inhalt unsichtbar,
            solange das nachgeladene Motion-Bündel unterwegs ist. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#inhalt">Zum Inhalt springen</a>

        <Nav />
        <main id="inhalt">{children}</main>
        <Footer />

        {/* Motion-Fundament, nachgeladen. Startet bei Reduced Motion
            gar nicht erst bzw. baut sich selbst ab. */}
        <MotionLayer />
      </body>
    </html>
  );
}
