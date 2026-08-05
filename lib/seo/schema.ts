import { site } from '@/lib/content/site';
import { faq } from '@/lib/content/faq';
import type { Project } from '@/lib/content/projects';
import type { PostMeta } from '@/lib/content/blog';
import type { Testimonial } from '@/lib/content/testimonials';
import { placeholder } from '@/lib/placeholders';

/**
 * JSON-LD.
 *
 * Grundregel: Felder, deren Wert noch TODO ist, werden WEGGELASSEN statt mit
 * Platzhaltertext ausgegeben. Strukturierte Daten mit „TODO: Ort“ wären eine
 * falsche Angabe gegenüber Suchmaschinen — schlimmer als eine fehlende.
 */

const echt = (wert: string | undefined) =>
  wert && !wert.startsWith('TODO') ? wert : undefined;

const ohneLeere = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null));

export function organizationSchema() {
  const adresse = ohneLeere({
    '@type': 'PostalAddress',
    streetAddress: echt(site.adresse.strasse),
    postalCode: echt(site.adresse.plz),
    addressLocality: echt(site.adresse.ort),
    addressCountry: 'CH',
  });

  return ohneLeere({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    description: site.kurzprofil,
    url: site.url,
    areaServed: { '@type': 'Country', name: 'Schweiz' },
    email: echt(site.kontakt.email),
    telephone: echt(site.kontakt.telefon),
    address: Object.keys(adresse).length > 1 ? adresse : undefined,
    sameAs: site.social.length ? site.social.map((s) => s.url) : undefined,
  });
}

export function faqSchema() {
  // Antworten, die noch TODO sind, gehören nicht in strukturierte Daten.
  const beantwortet = faq.filter((f) => !f.antwort.startsWith('TODO'));
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: beantwortet.map((f) => ({
      '@type': 'Question',
      name: f.frage,
      acceptedAnswer: { '@type': 'Answer', text: f.antwort },
    })),
  };
}

export function breadcrumbSchema(teile: { name: string; pfad: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: teile.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${site.url}${t.pfad}`,
    })),
  };
}

export function articleSchema(post: PostMeta) {
  return ohneLeere({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titel,
    description: post.beschreibung || undefined,
    datePublished: post.datum || undefined,
    author: echt(post.autor) ? { '@type': 'Person', name: post.autor } : undefined,
    publisher: { '@type': 'Organization', name: site.name },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  });
}

export function caseSchema(p: Project) {
  return ohneLeere({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: echt(p.kunde) ? `${p.kunde} — ${p.leistungen.join(', ')}` : undefined,
    about: echt(p.branche),
    url: `${site.url}/projekte/${p.slug}`,
    creator: { '@type': 'Organization', name: site.name },
  });
}

/**
 * VideoObject je Testimonial — relevant für Video-Rich-Results und für
 * AI-Antwortsysteme. Nur für Videos mit Freigabe.
 */
export function videoSchema(t: Testimonial) {
  if (!t.freigabeVorhanden) return null;
  const asset = placeholder(t.videoSlot);
  return ohneLeere({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: echt(t.name) ? `${t.name}, ${t.firma}` : undefined,
    description: echt(t.firma) ? `Kundenstimme von ${t.name}, ${t.funktion} bei ${t.firma}.` : undefined,
    thumbnailUrl: asset.poster ? `${site.url}${asset.poster}` : undefined,
    contentUrl: `${site.url}${asset.src}`,
    duration: asset.durationSeconds ? `PT${asset.durationSeconds}S` : undefined,
  });
}
