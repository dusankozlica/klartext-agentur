import registry from '@/content/_placeholders.json';

export type PlaceholderAsset = {
  slot: string;
  width: number;
  height: number;
  label?: string;
  src: string;
  poster?: string;
  blurDataURL?: string;
  durationSeconds?: number;
  isPlaceholder: true;
  freigabeVorhanden?: boolean;
};

const assets = registry.assets as PlaceholderAsset[];

/**
 * Holt einen Platzhalter aus dem Register. Fehlt der Slot, ist das ein
 * Fehler im Code und kein stiller Leerzustand — sonst rendert später eine
 * Sektion ohne Bild und niemand merkt es.
 */
export function placeholder(slot: string): PlaceholderAsset {
  // Die Sperre hängt am Zugriff, nicht an einem separaten Aufruf, den man
  // zu setzen vergisst: Wer im Produktionsbuild einen Platzhalter rendert,
  // bricht den Build ab.
  guardProduction(slot);

  const asset = assets.find((a) => a.slot === slot);
  if (!asset) {
    throw new Error(
      `Platzhalter "${slot}" fehlt im Register. Slot-Liste in scripts/generate-placeholders.mjs ergänzen und den Generator erneut laufen lassen.`,
    );
  }

  // Statischer Export auf GitHub Pages liegt unter einem Projektpfad.
  // next/image kennt den basePath selbst — aber <video>, Poster und
  // alle direkt verwendeten src-Werte nicht. Deshalb hier zentral.
  const basis = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  if (basis && !asset.src.startsWith(basis)) {
    return {
      ...asset,
      src: basis + asset.src,
      poster: asset.poster ? basis + asset.poster : asset.poster,
    };
  }
  return asset;
}

function guardProduction(slot: string) {
  // NUR auf dem Server. Im Browser ist NODE_ENV zwar "production", aber
  // ALLOW_PLACEHOLDERS existiert dort nicht (keine NEXT_PUBLIC_-Variable) —
  // die Sperre würde beim Hydrieren zuschlagen und die gesamte Seite im
  // Browser abstürzen lassen. Genau das ist passiert: Der Server lieferte
  // korrektes HTML, React starb danach, und Titel, lang und <main> waren weg.
  // Deshalb greift die Sperre dort, wo sie hingehört: beim Build.
  if (typeof window !== 'undefined') return;
  if (process.env.NODE_ENV !== 'production') return;
  if (process.env.ALLOW_PLACEHOLDERS === '1') return;
  throw new Error(
    `Build abgebrochen: Der Platzhalter "${slot}" wird noch gerendert. ` +
      `Echtes Asset einsetzen — oder für ein Preview-Deployment ` +
      `ALLOW_PLACEHOLDERS=1 setzen.`,
  );
}

export const allPlaceholders = () => assets;

/** Wie viele Platzhalter noch im Register stehen — für ein späteres Dashboard. */
export const remainingPlaceholders = () => assets.filter((a) => a.isPlaceholder).length;
