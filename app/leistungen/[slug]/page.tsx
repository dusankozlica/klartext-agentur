import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import PageHero from '@/components/ui/PageHero';
import Faq from '@/components/ui/Faq';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import BrandingBuehne from '@/components/sections/BrandingBuehne';
import NexolaTabelle from '@/components/sections/NexolaTabelle';
import ReferenzStimmen from '@/components/sections/ReferenzStimmen';
import MockupKarussell from '@/components/sections/MockupKarussell';
import JsonLd from '@/components/seo/JsonLd';

import { getService, serviceSlugs, services } from '@/lib/content/services';
import { vorschauStimmen, testimonialTitel } from '@/lib/content/testimonials';
import { placeholder } from '@/lib/placeholders';
import { breadcrumbSchema } from '@/lib/seo/schema';

export function generateStaticParams() {
  return serviceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/leistungen/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.claim,
    alternates: { canonical: `/leistungen/${service.slug}` },
  };
}

export default async function Page({ params }: PageProps<'/leistungen/[slug]'>) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const weitere = services.filter((s) => s.slug !== service.slug);

  // ohhmydesign-Referenz gehört thematisch zu Webdesign: Arbeiten als
  // Mockup-Karten (Gerät auf Farbfläche) im Zieh-Karussell. Die Mockups
  // sind generierte Platzhalter in unserer Markenwelt; nur der echte
  // (anonymisierte) Website-Case trägt einen Case-Namen, der Rest ist
  // ehrlich als Konzeptstudie beschriftet.
  const karussell = (service.slug === 'webdesign'
    ? [
        { slot: 'projects/mockup-01', label: 'Schreinerei im Mittelland', chip: 'Website' },
        { slot: 'projects/mockup-02', label: 'Konzeptstudie Gastronomie', chip: 'Studie' },
        { slot: 'projects/mockup-03', label: 'Konzeptstudie B2B', chip: 'Studie' },
        { slot: 'projects/mockup-04', label: 'Konzeptstudie Praxis', chip: 'Studie' },
        { slot: 'projects/mockup-05', label: 'Konzeptstudie Bäckerei', chip: 'Studie' },
        { slot: 'projects/mockup-06', label: 'Konzeptstudie Fitness', chip: 'Studie' },
      ]
    : []
  ).map((k) => {
    const b = placeholder(k.slot);
    return {
      label: k.label, chip: k.chip,
      bild: { src: b.src, width: b.width, height: b.height, blurDataURL: b.blurDataURL },
    };
  });

  // ESE-Testimonial-Referenz gehört thematisch zu Social Media: Videos
  // in voller Fläche, Platzhalter bis zur Freigabe (wie Startseite).
  const stimmenMedien = (service.slug === 'social-media' ? vorschauStimmen() : []).map((t) => {
    const a = placeholder(t.videoSlot);
    return {
      id: t.id, zitat: t.zitatPlatzhalter, titel: testimonialTitel(t),
      firma: t.firma, src: a.src, poster: a.poster,
    };
  });

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Start', pfad: '/' },
        { name: 'Leistungen', pfad: '/leistungen' },
        { name: service.name, pfad: `/leistungen/${service.slug}` },
      ])} />

      <PageHero eyebrow="Leistung" zeilen={[service.name]} lead={service.claim} />

      {/* Themen-Bühne nach der ESE-Branding-Referenz: schwebende Karten
          mit unserem eigenen Markensystem + Umriss-Wortband */}
      {service.slug === 'branding' && <BrandingBuehne />}

      {/* sohub-Referenz «Brand Identities»: Zweitton-Titel + Chip-Reihe */}
      {service.slug === 'branding' && (
        <section className="section bg-[var(--ink)] text-[var(--cream)]" data-nav="dark">
          <div className="wrap">
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.4rem,5.4vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.03em]" data-reveal>
              Marken-<br />
              <span className="text-[var(--grau-d)]">Identitäten.</span>
            </h2>
            <div className="mt-[var(--s-7)] flex flex-wrap gap-[var(--s-3)]" data-reveal>
              {['Logo', 'Farbsystem', 'Typografie', 'Bildsprache', 'Tonfall', 'Brandboard'].map((c) => (
                <span key={c} className="chip">{c}</span>
              ))}
            </div>
            <p className="body-measure mt-[var(--s-7)] max-w-[52ch] text-[1.05rem]" data-reveal>
              <span aria-hidden="true" className="mr-[0.6em] text-[var(--violet-hell)]">✳</span>
              Eine Marke ist erst dann eine, wenn sie überall gleich auftritt —
              vom Logo über die Farben bis zum Tonfall im Kundenmail. Genau
              dieses System bauen wir, und wir übergeben es so, dass Ihr Team
              es ohne uns bedienen kann.
            </p>
          </div>
        </section>
      )}

      {/* Für wen + was drin ist */}
      <section className="section bg-[var(--paper)]">
        <div className="wrap grid gap-[var(--s-8)] md:grid-cols-[4fr_8fr]">
          <p className="eyebrow self-start" data-reveal>Für wen</p>
          <div>
            <p className="body-measure font-[family-name:var(--font-display)] text-[clamp(1.3rem,2.2vw,2rem)] font-semibold leading-[1.2] tracking-[-0.02em]" data-reveal>
              {service.fuerWen}
            </p>
            <p className="body-measure mt-[var(--s-5)] opacity-80" data-reveal>
              {service.problem}
            </p>
            <ul className="mt-[var(--s-8)] border-t border-current/20">
              {service.leistungen.map((l) => (
                <li key={l} className="border-b border-current/20 py-[var(--s-5)]" data-reveal>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Ablauf — hier ist Nummerierung berechtigt, es sind echte Schritte.
          Webdesign bekommt die nexola-Referenz: helle Aufklapp-Tabelle
          statt Vierer-Raster. */}
      {service.slug === 'webdesign' ? (
        <section className="section bg-[var(--paper)]">
          <div className="wrap">
            <h2 className="sec-title" data-reveal>Wie das abläuft</h2>
          </div>
          <div className="wrap" data-reveal>
            <NexolaTabelle zeilen={service.ablauf} />
          </div>
        </section>
      ) : (
        <section className="section bg-[var(--ink)] text-[var(--cream)]" data-nav="dark">
          <div className="wrap">
            <h2 className="sec-title" data-reveal>Wie das abläuft</h2>
            <ol className="grid gap-[var(--s-6)] md:grid-cols-4">
              {service.ablauf.map((schritt, i) => (
                <li key={schritt.titel} className="border-t border-current pt-[var(--s-4)]" data-reveal>
                  <span className="text-[0.85rem] tracking-[0.1em]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-[var(--s-2)] font-[family-name:var(--font-display)] text-[1.25rem] font-semibold tracking-[-0.02em]">
                    {schritt.titel}
                  </h3>
                  <p className="mt-[var(--s-2)] text-[0.95rem]">{schritt.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Social Media: Kundenstimmen-Videos wie auf der Startseite */}
      {stimmenMedien.length > 0 && (
        <section data-nav="dark" aria-label="Kundenstimmen">
          <ReferenzStimmen stimmen={stimmenMedien} />
        </section>
      )}

      {/* Webdesign: ohhmy-Zieh-Karussell statt statischem Medienband */}
      {karussell.length > 0 ? (
        <section className="bg-[var(--paper)] pb-[var(--sec-y)]">
          <div className="wrap flex flex-wrap items-baseline justify-between gap-[var(--s-4)] pb-[var(--s-6)]">
            <p className="eyebrow mb-0" data-decode>Aus der Arbeit · Platzhalter</p>
            <p className="text-[0.85rem] text-[var(--grau-l)]">Ziehen zum Stöbern&nbsp;→</p>
          </div>
          <MockupKarussell karten={karussell} />
        </section>
      ) : (
        service.medienSlots.length > 0 && (
          <section className="bg-[var(--paper)] pb-[var(--sec-y)]">
            <div className="wrap grid gap-[var(--s-5)] md:grid-cols-2">
              {service.medienSlots.map((slot, i) => (
                <PlaceholderImage
                  key={slot}
                  slot={slot}
                  alt=""
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={i === 0 ? 'aspect-video' : 'aspect-[4/3]'}
                  scrollSpeed={i === 0 ? 0.1 : -0.08}
                />
              ))}
            </div>
          </section>
        )
      )}

      {/* Bild + Preislogik als Ehrlichkeitssignal */}
      <section className="section bg-[var(--cream-tint)]">
        <div className="wrap grid items-center gap-[var(--s-8)] md:grid-cols-2">
          <PlaceholderImage
            slot={service.bildSlot}
            alt=""
            sizes="(max-width: 768px) 100vw, 50vw"
            className="aspect-square"
            scrollSpeed={0.1}
          />
          <div>
            <h2 className="sec-title" data-reveal>Was es kostet</h2>
            <p className="body-measure opacity-80" data-reveal>{service.preisLogik}</p>
            <p className="body-measure mt-[var(--s-4)] text-[0.95rem] opacity-70" data-reveal>
              Einen konkreten Richtwert nennen wir Ihnen im Erstgespräch, sobald
              wir den Umfang kennen. Verbindlich wird er schriftlich mit der
              Offerte — nicht mündlich und nicht später auf der Rechnung.
            </p>
            <Link className="btn btn--primary mt-[var(--s-7)]" href="/kontakt">
              Erstgespräch buchen
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ zur Leistung */}
      {service.faq.length > 0 && (
        <section className="section bg-[var(--paper)]">
          <div className="wrap grid gap-[var(--s-8)] md:grid-cols-[4fr_8fr]">
            <h2 className="sec-title self-start" data-reveal>Fragen dazu</h2>
            <Faq eintraege={service.faq} />
          </div>
        </section>
      )}

      {/* Weiter zu den anderen Leistungen */}
      <section className="section bg-[var(--cream)]">
        <div className="wrap">
          <h2 className="sec-title" data-reveal>Weitere Leistungen</h2>
          <ul className="border-t border-current/20">
            {weitere.map((s) => (
              <li key={s.slug} className="border-b border-current/20">
                <Link
                  href={`/leistungen/${s.slug}`}
                  className="flex flex-wrap items-baseline justify-between gap-[var(--s-4)] py-[var(--s-5)] transition-colors hover:text-[var(--violet)]"
                >
                  <span className="font-[family-name:var(--font-display)] text-[1.4rem] font-semibold tracking-[-0.02em]">
                    {s.name}
                  </span>
                  <span className="text-[0.9rem] opacity-70">{s.claim}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
