import Link from 'next/link';
import dynamic from 'next/dynamic';
import { preload } from 'react-dom';

import Faq from '@/components/ui/Faq';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import MediaLoop from '@/components/ui/MediaLoop';
import LeistungsZeilen from '@/components/sections/LeistungsZeilen';

import { services } from '@/lib/content/services';
import { projects, anzeigeName } from '@/lib/content/projects';
import { ausspielbar } from '@/lib/content/testimonials';
import { team, personTitel, logosAusspielen, kundenlogos } from '@/lib/content/team';
import { faq } from '@/lib/content/faq';
import { site, ortOderLand } from '@/lib/content/site';
import { allePosts } from '@/lib/content/blog';
import { placeholder } from '@/lib/placeholders';

// Lightbox und Fokusfalle werden erst gebraucht, wenn jemand ein Video öffnet.
const VideoTestimonials = dynamic(() => import('@/components/ui/VideoTestimonials'));

export default async function Home() {
  const testimonials = ausspielbar();
  const posts = (await allePosts()).slice(0, 3);
  // Platzhalter werden auf dem Server aufgeloest; Client-Komponenten
  // bekommen fertige Pfade und nie das Register selbst.
  const kino = placeholder('video/hero-kino');
  // Poster ist das erste grosse Bild im Viewport — früh anstossen.
  if (kino.poster) preload(kino.poster, { as: 'image', fetchPriority: 'high' });
  const band = placeholder('video/band-neon');
  const testimonialMedien = testimonials.map((t) => {
    const a = placeholder(t.videoSlot);
    return { ...t, src: a.src, poster: a.poster };
  });

  return (
    <>
      {/* ══ 1 — Hero: Kinovideo in voller Fläche (ESE-Startseite) ══════
          Video vollflächig, drei kleine Labels auf einer Linie, riesige
          Headline unten links. Flache Abdunklung sichert die Lesbarkeit. */}
      <section className="relative min-h-[100svh] overflow-hidden bg-[var(--ink)] text-[var(--cream)]" data-nav="dark" data-hero>
        <div className="absolute inset-0">
          <MediaLoop src={kino.src} poster={kino.poster} />
        </div>
        <div className="absolute inset-0 bg-[rgb(10_9_7/0.42)]" aria-hidden="true" />

        {/* Drei Labels auf einer Linie (ESE: modern · hochwertig · fresh) */}
        <div className="pointer-events-none absolute inset-x-[var(--pad-x)] top-[38svh] hidden justify-between text-[0.8rem] font-medium uppercase tracking-[0.16em] md:flex">
          <span data-decode>klar</span>
          <span data-decode>direkt</span>
          <span data-decode>messbar</span>
        </div>

        <div className="wrap relative flex min-h-[100svh] flex-col justify-end pb-[var(--s-8)] pt-[var(--s-10)]">
          <p className="eyebrow" data-decode>Marketingagentur · {ortOderLand()}</p>
          <h1 className="display">
            <span className="line"><span className="line__i">Wir sagen Ihren Kunden,</span></span>
            <span className="line"><span className="line__i">was Sache ist<span className="akzent-d">.</span></span></span>
          </h1>
          <div className="hero-foot mt-[var(--s-7)] flex flex-wrap items-center justify-between gap-[var(--s-5)]">
            <p className="body-measure max-w-[44ch] text-[1.05rem]">
              {site.positionierung}
            </p>
            <div className="flex flex-wrap gap-[var(--s-4)]">
              <Link className="btn btn--primary" href="/kontakt">Erstgespräch buchen</Link>
              <Link className="btn btn--hell" href="/projekte">Arbeiten ansehen</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2 — Statement: Zweitton-Satz auf hellem Creme (sohub) ══════ */}
      <section className="section bg-[var(--cream)] text-[var(--ink)]">
        <div className="wrap">
          <p className="eyebrow text-[var(--grau-l)]" data-decode>Das ist KLARTEXT.</p>
          <p className="statement" data-reveal>
            Wir sind die Agentur für KMU, <span className="leise">die keine Lust
            auf Agentur-Theater haben:</span> Erst die Frage, warum jemand bei
            Ihnen kaufen soll — <span className="leise">dann Marke, Website und
            Kanäle.</span> Alles aus einer Hand, alles
            <span className="akzent"> messbar</span>.
          </p>
          <div className="mt-[var(--s-8)] grid gap-[var(--s-6)] md:grid-cols-3">
            {[
              ['01', 'Klar statt laut', 'Eine Botschaft, die sitzt, schlägt zehn Kampagnen, die niemand versteht.'],
              ['02', 'Machen statt managen', 'Wer im Erstgespräch sitzt, arbeitet auch am Projekt — keine Übergaben.'],
              ['03', 'Zahlen statt Bauchgefühl', 'Was nicht funktioniert hat, steht im Rapport. Auch das gehört zu Klartext.'],
            ].map(([nr, titel, text]) => (
              <div key={nr} className="border-t border-current/20 pt-[var(--s-4)]" data-reveal>
                <p className="text-[0.85rem] font-medium tracking-[0.1em] text-[var(--grau-l)]">{nr}</p>
                <p className="mt-[var(--s-2)] font-[family-name:var(--font-display)] text-[1.25rem] font-semibold tracking-[-0.02em]">{titel}</p>
                <p className="mt-[var(--s-2)] text-[0.95rem] text-[var(--grau-l)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3 — Arbeiten: grosse runde Bildkarten (sohub /work) ════════ */}
      <section className="section bg-[var(--cream)] pt-0 text-[var(--ink)]" id="arbeiten">
        <div className="wrap">
          <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-4)]">
            <h2 className="sec-title mb-0" data-reveal>Ausgewählte Arbeiten</h2>
            <Link href="/projekte" className="inline-flex min-h-[44px] items-center underline underline-offset-4 hover:text-[var(--violet)]">
              Alle Projekte&nbsp;↗
            </Link>
          </div>
          <ul className="mt-[var(--s-7)] grid gap-[var(--s-6)] md:grid-cols-2">
            {projects.slice(0, 3).map((p, i) => (
              <li key={p.slug} className={i === 2 ? 'md:col-span-2' : undefined} data-reveal>
                <Link href={`/projekte/${p.slug}`} className="group relative block overflow-hidden rounded-[var(--radius-lg)]" data-cursor="Case ansehen">
                  <PlaceholderImage
                    slot={p.coverSlot}
                    alt=""
                    sizes={i === 2 ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                    className={`${i === 2 ? 'aspect-[16/7] max-md:aspect-[4/3]' : 'aspect-[4/3]'} transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.03]`}
                  />
                  {/* Flacher Verlauf nur im Fussbereich — Trägerfläche für den Titel */}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[rgb(10_9_7/0.82)] to-transparent" aria-hidden="true" />
                  <span className="absolute left-[var(--s-5)] top-[var(--s-5)] flex flex-wrap gap-[var(--s-2)]">
                    {p.leistungen.slice(0, 2).map((l) => (
                      <span key={l} className="chip bg-[rgb(10_9_7/0.45)] text-[#fff] backdrop-blur-sm">{l}</span>
                    ))}
                  </span>
                  <span className="absolute bottom-[var(--s-5)] left-[var(--s-5)] right-[var(--s-5)] flex items-baseline justify-between gap-[var(--s-4)] text-[#fff]">
                    <span className="font-[family-name:var(--font-display)] text-[clamp(1.4rem,2.4vw,2rem)] font-semibold tracking-[-0.02em]">
                      <span aria-hidden="true" className="mr-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                      {anzeigeName(p)}
                    </span>
                    <span className="hidden text-[0.9rem] opacity-90 md:block">{p.ergebnisSatz}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 4 — Kundenlogos: erst ab fünf Freigaben ════════════════════ */}
      {logosAusspielen() && (
        <section className="bg-[var(--cream)] pb-[var(--s-9)]" aria-label="Kunden">
          <ul className="wrap flex flex-wrap items-center justify-between gap-[var(--s-8)] text-[var(--grau-l)]">
            {kundenlogos.map((l) => <li key={l.name}>{l.name}</li>)}
          </ul>
        </section>
      )}

      {/* ══ 5 — Leistungen: nexola-Tabelle + pixel-Hover-Balken ════════ */}
      <section className="section bg-[var(--ink)] text-[var(--cream)]" data-nav="dark" id="leistungen">
        <div className="wrap flex flex-wrap items-baseline justify-between gap-[var(--s-4)]">
          <h2 className="sec-title mb-0" data-reveal>Leistungen</h2>
          <p className="eyebrow mb-0 text-[var(--grau-d)]" data-decode>Fünf Felder · ein Ansprechpartner</p>
        </div>
        <div className="mt-[var(--s-7)]">
          <LeistungsZeilen
            eintraege={services.map((s) => ({
              slug: s.slug, name: s.name, claim: s.claim, fuerWen: s.fuerWen,
            }))}
          />
        </div>
      </section>

      {/* ══ 6 — Zwischenband: Video mit Umriss-Typo (ESE Expertise) ════ */}
      <section className="relative overflow-hidden bg-[var(--ink)]" data-nav="dark" aria-hidden="true">
        <div className="bleed relative max-h-[62svh] overflow-hidden">
          <div className="relative aspect-video max-h-[62svh] w-full">
            <MediaLoop src={band.src} poster={band.poster} />
          </div>
          <div className="absolute inset-0 bg-[rgb(10_9_7/0.35)]" />
          <p
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-[family-name:var(--font-display)] text-[11vw] font-semibold leading-none tracking-[-0.02em] text-transparent"
            style={{ WebkitTextStroke: '1.5px rgba(243,238,227,0.85)' }}
            data-scroll-speed="0.06"
          >
            Marke — Web — Social — KI
          </p>
        </div>
      </section>

      {/* ══ 7 — Kundenstimmen (erst mit Freigabe ausgespielt) ══════════ */}
      {testimonials.length > 0 && (
        <section className="section bg-[var(--ink)] text-[var(--cream)]" data-nav="dark">
          <div className="wrap">
            <h2 className="sec-title" data-reveal>Was Kunden sagen</h2>
            <VideoTestimonials items={testimonialMedien} />
          </div>
        </section>
      )}

      {/* ══ 8 — Team: grosse Porträts auf Schwarz (ESE Team) ═══════════ */}
      <section className="section bg-[var(--ink)] text-[var(--cream)]" data-nav="dark">
        <div className="wrap">
          <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-4)]">
            <h2 className="sec-title mb-0" data-reveal>Das Team<span className="akzent-d">.</span></h2>
            <Link href="/team" className="inline-flex min-h-[44px] items-center underline underline-offset-4 hover:text-[var(--violet-hell)]">
              Mehr über uns&nbsp;↗
            </Link>
          </div>
          <ul className="mt-[var(--s-7)] grid grid-cols-2 gap-[var(--s-5)] lg:grid-cols-4">
            {team.map((p, i) => (
              <li key={p.id} data-reveal>
                <div className="overflow-hidden rounded-[var(--radius)]">
                  <PlaceholderImage
                    slot={p.bildSlot}
                    alt=""
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="aspect-[3/4] grayscale transition-[filter,transform] duration-[600ms] ease-[var(--ease-out)] hover:scale-[1.02] hover:grayscale-0"
                  />
                </div>
                <p className="mt-[var(--s-4)] flex items-baseline gap-[var(--s-3)]">
                  <span className="text-[0.8rem] font-medium tracking-[0.1em] text-[var(--grau-d)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[1.1rem] font-semibold tracking-[-0.02em]">
                    {personTitel(p)}
                  </span>
                </p>
                <p className="mt-[var(--s-1)] text-[0.9rem] text-[var(--grau-d)]">{p.satz}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 9 — Aktuelles: dunkle Karten (ESE News) ════════════════════ */}
      {posts.length > 0 && (
        <section className="section bg-[var(--ink)] pt-0 text-[var(--cream)]" data-nav="dark">
          <div className="wrap">
            <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-5)]">
              <h2 className="sec-title mb-0" data-reveal>Aus dem Blog</h2>
              <Link href="/blog" className="inline-flex min-h-[44px] items-center underline underline-offset-4 hover:text-[var(--violet-hell)]">
                Alle Beiträge&nbsp;↗
              </Link>
            </div>
            <ul className="mt-[var(--s-7)] grid gap-[var(--s-5)] md:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug} data-reveal>
                  <Link href={`/blog/${p.slug}`} className="group block h-full overflow-hidden rounded-[var(--radius)] bg-[var(--ink-2)]">
                    <span className="block overflow-hidden">
                      <PlaceholderImage
                        slot={p.coverSlot}
                        alt=""
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="aspect-[16/10] transition-transform duration-[700ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
                      />
                    </span>
                    <span className="block p-[var(--s-5)]">
                      <span className="block text-[0.8rem] uppercase tracking-[0.12em] text-[var(--grau-d)]">
                        {p.kategorie}
                      </span>
                      <span className="mt-[var(--s-2)] block font-[family-name:var(--font-display)] text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] transition-colors group-hover:text-[var(--violet-hell)]">
                        {p.titel}
                      </span>
                      <span className="mt-[var(--s-4)] inline-flex">
                        <span className="chip text-[var(--grau-d)]">{p.lesezeitMinuten} Min. Lesezeit</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ══ 10 — FAQ auf Creme ═════════════════════════════════════════ */}
      <section className="section bg-[var(--cream)] text-[var(--ink)]">
        <div className="wrap grid gap-[var(--s-8)] md:grid-cols-[4fr_8fr]">
          <h2 className="sec-title self-start" data-reveal>Häufige Fragen</h2>
          <Faq eintraege={faq} />
        </div>
      </section>
    </>
  );
}
