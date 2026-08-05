/**
 * Gibt ein JSON-LD-Objekt als <script type="application/ld+json"> aus.
 *
 * Gibt nichts aus, wenn das Objekt leer oder null ist — ein leeres
 * Schema-Fragment ist schlechter als gar keines.
 */
export default function JsonLd({ data }: { data: unknown }) {
  if (!data || (typeof data === 'object' && Object.keys(data as object).length === 0)) {
    return null;
  }
  return (
    <script
      type="application/ld+json"
      // Inhalt stammt ausschliesslich aus eigenen Modulen, keine Nutzereingabe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
