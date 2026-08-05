import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import LeistungsZeilen from '@/components/sections/LeistungsZeilen';
import JsonLd from '@/components/seo/JsonLd';
import { services } from '@/lib/content/services';
import { breadcrumbSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Leistungen',
  description:
    'Social Media, Branding, Webdesign, laufende Betreuung und KI im Arbeitsalltag — für Schweizer KMU.',
  alternates: { canonical: '/leistungen' },
};

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Start', pfad: '/' },
        { name: 'Leistungen', pfad: '/leistungen' },
      ])} />

      <PageHero
        eyebrow="Leistungen"
        zeilen={['Fünf Dinge, die wir', 'richtig machen.']}
        lead="Kein Bauchladen. Was hier nicht steht, machen wir nicht — und sagen Ihnen, wer es besser kann."
      />

      {/* Gleiche Zeilen wie auf der Startseite (Immobilien-Referenz):
          vollbreit, Foto beim Überfahren, Nachbarn dimmen. */}
      <section className="bg-[var(--ink)] pb-[var(--sec-y)] text-[var(--cream)]" data-nav="dark">
        <LeistungsZeilen
          eintraege={services.map((s) => ({
            slug: s.slug, name: s.name, claim: s.claim, fuerWen: s.fuerWen,
            bildSlot: s.bildSlot,
          }))}
        />
      </section>

    </>
  );
}
