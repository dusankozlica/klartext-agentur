/**
 * Film Grain. Letztes Element im Body, damit es über allem liegt ausser
 * Navigation, Cursor und späteren Modalen.
 *
 * Die Textur ist eine 256er-Kachel als Datei (public/grain-256.png),
 * kein Live-SVG-Filter — feTurbulence in Echtzeit ist teuer.
 * Bewegung und Deckkraft stehen in globals.css, samt Begründung, warum
 * hier kein mix-blend-mode verwendet wird.
 */
export default function Grain() {
  return <div className="noise" aria-hidden="true" />;
}
