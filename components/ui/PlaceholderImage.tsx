import Image from 'next/image';
import { placeholder } from '@/lib/placeholders';

type Props = {
  slot: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Parallax über die Attribut-API, Werte zwischen -0.2 und 0.3 */
  scrollSpeed?: number;
  /** Beschriftung des Custom Cursors über dieser Fläche */
  cursorLabel?: string;
};

/**
 * Bild aus dem Platzhalter-Register.
 *
 * Im Dev-Modus liegt sichtbar ein Badge darüber, damit im Layout sofort
 * erkennbar ist, welches Asset noch aussteht. In Produktion greift
 * zusätzlich die Build-Sperre in lib/placeholders.ts.
 */
export default function PlaceholderImage({
  slot, alt, sizes, className, priority, scrollSpeed, cursorLabel,
}: Props) {
  const asset = placeholder(slot);

  return (
    <div
      className={`relative overflow-hidden ${className ?? ''}`}
      data-cursor={cursorLabel}
    >
      <Image
        src={asset.src}
        alt={alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        priority={priority}
        placeholder={asset.blurDataURL ? 'blur' : 'empty'}
        blurDataURL={asset.blurDataURL}
        data-scroll-speed={scrollSpeed}
        className="h-full w-full object-cover"
      />
      {process.env.NODE_ENV !== 'production' && (
        <span className="placeholder-badge">Platzhalter · {asset.slot}</span>
      )}
    </div>
  );
}
