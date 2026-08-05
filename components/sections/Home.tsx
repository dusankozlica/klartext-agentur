import Link from 'next/link';
import { preload } from 'react-dom';

import Faq from '@/components/ui/Faq';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import MediaLoop from '@/components/ui/MediaLoop';
import LeistungsZeilen from '@/components/sections/LeistungsZeilen';
import ReferenzStimmen from '@/components/sections/ReferenzStimmen';
import TerminKalender from '@/components/sections/TerminKalender';

import { services } from '@/lib/content/services';
import { projects, anzeigeName } from '@/lib/content/projects';
import { vorschauStimmen, testimonialTitel } from '@/lib/content/testimonials';
import { team, personTitel, logosAusspielen, kundenlogos } from '@/lib/content/team';
import { faq } from '@/lib/content/faq';
import { site, ortOderLand } from '@/lib/content/site';
import { allePosts } from '@/lib/content/blog';
import { placeholder } from '@/lib/placeholders';

export default async function Home() {
  const stimmen = vorschauStimmen();
  const posts = (await allePosts()).slice(0, 3);
  // Platzhalter werden auf dem Server aufgeloest; Client-Komponenten
  // bekommen fertige Pfade und nie das Register selbst.
  const kino = placeholder('video/hero-kino');
  const showreel = placeholder('video/showreel');
  // Poster ist das erste grosse Bild im Viewport — früh anstossen.
  if (kino.poster) preload(kino.poster, { as: 'image', fetchPriority: 'high' });
  const band = placeholder('video/band-neon');
  const stimmenMedien = stimmen.map((t) => {
    const a = placeholder(t.videoSlot);
    return {
      id: t.id, zitat: t.zitatPlatzhalter, titel: testimonialTitel(t),
      firma: t.firma, src: a.src, poster: a.poster,
    };
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

      {/* ══ 3 — Arbeiten: volle Bänder in Bildschirmbreite (ESE Work).
          Band 0 ist das Showreel-VIDEO, danach die drei Cases. */}
      <section className="bg-[var(--cream)] pb-[var(--sec-y)] text-[var(--ink)]" id="arbeiten">
        <div className="wrap flex flex-wrap items-baseline justify-between gap-[var(--s-4)] pb-[var(--s-7)]">
          <h2 className="sec-title mb-0" data-reveal>Ausgewählte Arbeiten</h2>
          <Link href="/projekte" className="inline-flex min-h-[44px] items-center underline underline-offset-4 transition-colors duration-[var(--dauer-1)] hover:text-[var(--violet)]">
            Alle Projekte&nbsp;↗
          </Link>
        </div>

        <div className="grid gap-[10px]">
          {/* Showreel-Band */}
          <div className="group relative h-[82svh] min-h-[440px] overflow-hidden" data-reveal>
            <div className="absolute inset-0 transition-transform duration-[var(--dauer-3)] ease-[var(--ease-soft)] group-hover:scale-[1.02]">
              <MediaLoop src={showreel.src} poster={showreel.poster} cursorLabel="Showreel" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[rgb(10_9_7/0.75)] to-transparent" aria-hidden="true" />
            <p className="absolute left-[var(--pad-x)] top-[var(--s-6)] text-[0.8rem] font-medium uppercase tracking-[0.16em] text-[#fff]" data-decode>
              Showreel · Ausschnitte aus Produktionen
            </p>
            <p className="absolute bottom-[var(--s-6)] left-[var(--pad-x)] font-[family-name:var(--font-display)] text-[clamp(1.8rem,3.4vw,3rem)] font-semibold tracking-[-0.02em] text-[#fff]">
              Ein Blick in die Arbeit<span className="akzent-d">.</span>
            </p>
          </div>

          {projects.slice(0, 3).map((p, i) => (
            <Link
              key={p.slug}
              href={`/projekte/${p.slug}`}
              className="group relative block h-[82svh] min-h-[440px] overflow-hidden"
              data-cursor="Case ansehen"
              data-reveal
            >
              <PlaceholderImage
                slot={p.coverSlot}
                alt=""
                sizes="100vw"
                className="h-full w-full transition-transform duration-[var(--dauer-3)] ease-[var(--ease-soft)] group-hover:scale-[1.02]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[rgb(10_9_7/0.8)] to-transparent" aria-hidden="true" />
              <span className="absolute left-[var(--pad-x)] top-[var(--s-6)] flex flex-wrap gap-[var(--s-2)]">
                {p.leistungen.slice(0, 2).map((l) => (
                  <span key={l} className="chip bg-[rgb(10_9_7/0.45)] text-[#fff] backdrop-blur-sm">{l}</span>
                ))}
              </span>
              <span className="absolute bottom-[var(--s-6)] left-[var(--pad-x)] right-[var(--pad-x)] flex flex-wrap items-end justify-between gap-[var(--s-4)] text-[#fff]">
                <span>
                  <span className="block text-[0.85rem] uppercase tracking-[0.14em] opacity-80">
                    {String(i + 1).padStart(2, '0')} · {p.branche}
                  </span>
                  <span className="mt-[var(--s-2)] block font-[family-name:var(--font-display)] text-[clamp(2rem,4.4vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
                    <span aria-hidden="true" className="mr-3 inline-block transition-transform duration-[var(--dauer-1)] ease-[var(--ease-soft)] group-hover:translate-x-2">→</span>
                    {anzeigeName(p)}
                  </span>
                </span>
                <span className="max-w-[36ch] text-[0.95rem] opacity-90">{p.ergebnisSatz}</span>
              </span>
            </Link>
          ))}
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

      {/* ══ 7 — Referenzen: Video in voller Fläche + grosses Zitat (ESE) ══ */}
      {stimmenMedien.length > 0 && (
        <section data-nav="dark" aria-label="Kundenstimmen">
          <ReferenzStimmen stimmen={stimmenMedien} />
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

      {/* ══ 10 — Termin: Kalenderbuchung (Fabio-Soltani-Muster) ════════ */}
      <section className="section bg-[var(--cream)] text-[var(--ink)]" id="termin">
        <div className="wrap grid items-start gap-[var(--s-8)] lg:grid-cols-[5fr_7fr]">
          <div className="lg:sticky lg:top-[120px]">
            <p className="eyebrow text-[var(--grau-l)]" data-decode>Termin vereinbaren</p>
            <h2 className="display--sm display">
              <span className="line"><span className="line__i">Reden wir über</span></span>
              <span className="line"><span className="line__i">Ihr Projekt<span className="akzent">.</span></span></span>
            </h2>
            <p className="body-measure mt-[var(--s-6)] max-w-[46ch] text-[var(--grau-l)]">
              Wählen Sie Datum und Uhrzeit für ein unverbindliches Erstgespräch —
              bei Ihnen im Betrieb oder per Video-Call.
            </p>
            <ul className="mt-[var(--s-6)] grid gap-[var(--s-3)]">
              {[
                'Unverbindlich und kostenlos',
                'Rund 30 Minuten, danach eine schriftliche Einschätzung',
                'Antwort innert zwei Arbeitstagen',
              ].map((punkt) => (
                <li key={punkt} className="flex items-baseline gap-[var(--s-3)]">
                  <span aria-hidden="true" className="text-[var(--violet)]">✓</span>
                  {punkt}
                </li>
              ))}
            </ul>
          </div>
          <TerminKalender />
        </div>
      </section>

      {/* ══ 11 — FAQ auf Creme ═════════════════════════════════════════ */}
      <section className="section bg-[var(--cream)] text-[var(--ink)]">
        <div className="wrap grid gap-[var(--s-8)] md:grid-cols-[4fr_8fr]">
          <h2 className="sec-title self-start" data-reveal>Häufige Fragen</h2>
          <div className="max-w-[78ch]"><Faq eintraege={faq} /></div>
        </div>
      </section>
    </>
  );
}
