import { ImageResponse } from 'next/og';
import { site } from '@/lib/content/site';

export const alt = 'KLARTEXT. — Marketingagentur';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * OG-Bild im Markendesign: der Schnitt als Bild.
 *
 * Bewusst ohne eigene Schrift-Ladung — ImageResponse müsste die woff2 zur
 * Laufzeit holen, was den Build verlangsamt und bei fehlender Datei bricht.
 * Die Marke trägt hier über Farbe und Kante, nicht über die Hausschrift.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
        {/* obere Hälfte: Ink auf Creme */}
        <div
          style={{
            display: 'flex', flex: 1, background: '#FFD6A5', color: '#12101A',
            padding: '56px 64px 0', alignItems: 'flex-end',
          }}
        >
          <div style={{ display: 'flex', fontSize: 96, fontWeight: 700, letterSpacing: '-3px' }}>
            {site.name}
          </div>
        </div>

        {/* untere Hälfte: Creme auf Violett — die Kante */}
        <div
          style={{
            display: 'flex', flex: 1, background: '#6A00F4', color: '#FFD6A5',
            padding: '0 64px 56px', alignItems: 'flex-start', flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', fontSize: 34, lineHeight: 1.3, maxWidth: 900 }}>
            {site.kurzprofil}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
