import Link from 'next/link';
import { preload } from 'react-dom';

import Faq from '@/components/ui/Faq';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import MediaLoop from '@/components/ui/MediaLoop';
import LeistungsZeilen from '@/components/sections/LeistungsZeilen';
import Prozess from '@/components/sections/Prozess';
import Pricing from '@/components/ui/pricing-section';
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
  const stimmenMedien = stimmen.map((t) => {
    const a = placeholder(t.videoSlot);
    return {
      id: t.id, zitat: t.zitatPlatzhalter, titel: testimonialTitel(t),
      firma: t.firma, src: a.src, poster: a.poster,
    };
  });

  return (
    <>
      {/* ══ 1 — Kopfbereich nach der LySonic-Referenz: violette Bühne,
          riesige helle Headline, links die Einordnung, rechts die
          Team-Pille, darunter zwei runde Medienkarten. ═════════════ */}
      <section className="relative overflow-hidden bg-[var(--violet)] text-[#fff]" data-nav="dark" data-hero>
        <div className="wrap pb-[var(--s-9)] pt-[calc(var(--s-10)+clamp(20px,4vw,56px))]">
          <div className="grid gap-[var(--s-7)] lg:grid-cols-[minmax(210px,17%)_1fr] lg:items-start">
            {/* Einordnung links */}
            <div>
              {/* Zwei getrennte Zeilen: Der Decode-Effekt schreibt
                  textContent neu und wuerde ein <br> darin verschlucken. */}
              <p className="eyebrow mb-0 text-[rgb(255_255_255/0.72)]">
                <span className="block" data-decode>Marketingagentur</span>
                <span className="block" data-decode>{ortOderLand()}</span>
              </p>
              <span className="mt-[var(--s-5)] block h-px w-[64px] bg-[rgb(255_255_255/0.45)]" aria-hidden="true" />
              <p className="mt-[var(--s-5)] max-w-[30ch] text-[0.95rem] leading-[1.6] text-[rgb(255_255_255/0.9)]">
                {site.positionierung}
              </p>
            </div>

            {/* Headline + Team-Pille */}
            <div>
              <h1 className="display text-[color-mix(in_srgb,#fff_78%,var(--violet))]">
                <span className="line"><span className="line__i">Wir sagen Ihren</span></span>
                <span className="line"><span className="line__i">Kunden, was</span></span>
                <span className="line">
                  <span className="line__i">
                    Sache ist<span className="text-[#fff]">.</span>
                    <span className="ml-[0.3em] inline-flex translate-y-[-0.12em] items-center rounded-full border border-[rgb(255_255_255/0.55)] p-[6px] align-middle">
                      {team.slice(0, 3).map((p, i) => (
                        <span
                          key={p.id}
                          className={`block h-[clamp(38px,3.4vw,54px)] w-[clamp(38px,3.4vw,54px)] overflow-hidden rounded-full ring-2 ring-[var(--violet)] ${i > 0 ? 'ml-[-14px]' : ''}`}
                        >
                          <PlaceholderImage slot={p.bildSlot} alt="" sizes="60px" className="h-full w-full" />
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
              </h1>

              <div className="mt-[var(--s-7)] flex flex-wrap gap-[var(--s-4)]">
                <Link className="btn btn--hell" href="/kontakt">Erstgespräch buchen</Link>
                <Link className="btn btn--hell" href="/projekte">Arbeiten ansehen</Link>
              </div>
            </div>
          </div>

          {/* Zwei runde Medienkarten */}
          <div className="mt-[var(--s-8)] grid gap-[var(--s-5)] md:grid-cols-2">
            <div className="overflow-hidden rounded-[var(--radius-lg)]" data-reveal>
              <div className="aspect-[16/11]">
                <MediaLoop src={kino.src} poster={kino.poster} />
              </div>
            </div>
            <Link
              href="/projekte"
              className="group relative block overflow-hidden rounded-[var(--radius-lg)]"
              data-cursor="Arbeiten"
              data-reveal
            >
              <div className="aspect-[16/11] transition-transform duration-[var(--dauer-3)] ease-[var(--ease-quart)] group-hover:scale-[1.03]">
                <MediaLoop src={showreel.src} poster={showreel.poster} />
              </div>
              <span className="absolute bottom-[var(--s-5)] right-[var(--s-5)] grid h-[clamp(54px,4.6vw,74px)] w-[clamp(54px,4.6vw,74px)] place-items-center rounded-full bg-[var(--cream)] text-[1.4rem] text-[var(--violet)] transition-transform duration-[var(--dauer-2)] ease-[var(--ease-pop)] group-hover:scale-110">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 2 — Statement: Zweitton-Satz auf hellem Creme (sohub) ══════ */}
      <section className="section bg-[var(--cream)] text-[var(--ink)]">
        <div className="wrap">
          <p className="eyebrow text-[var(--grau-l)]" data-decode>Das ist KLARTEXT.</p>
          {/* Wortstrom: Wörter färben sich beim Scrollen ein (Reveals) */}
          <p className="statement" data-wortstrom>
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

      {/* ══ 3 — Arbeiten nach der sohub-Work-Referenz: Eyebrow, grosses
          Zweitton-Statement, darunter ein ruhiges 2er-Raster aus runden
          Karten mit «→ Name» im Bild. Kachel 1 ist das Showreel-VIDEO. */}
      <section className="section bg-[var(--cream)] text-[var(--ink)]" id="arbeiten">
        <div className="wrap">
          <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-4)]">
            <p className="eyebrow mb-0 text-[var(--grau-l)]" data-decode>Arbeiten</p>
            <Link href="/projekte" className="inline-flex min-h-[44px] items-center underline underline-offset-4 transition-colors duration-[var(--dauer-1)] hover:text-[var(--violet)]">
              Alle Projekte&nbsp;↗
            </Link>
          </div>
          <h2 className="statement mt-[var(--s-5)]" data-reveal>
            Arbeiten, <span className="leise">die zeigen,</span> was Klartext
            heisst<span className="akzent">.</span>
          </h2>

          <div className="mt-[var(--s-8)] grid gap-[var(--s-5)] md:grid-cols-2">
            {/* Showreel-Kachel */}
            <div className="group relative overflow-hidden rounded-[var(--radius-lg)]" data-reveal>
              <div className="aspect-[4/3] transition-transform duration-[var(--dauer-3)] ease-[var(--ease-quart)] group-hover:scale-[1.03]">
                <MediaLoop src={showreel.src} poster={showreel.poster} cursorLabel="Showreel" />
              </div>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[rgb(10_9_7/0.6)] to-transparent" aria-hidden="true" />
              <p className="pointer-events-none absolute bottom-[var(--s-5)] left-[var(--s-5)] flex items-center gap-[0.5em] font-[family-name:var(--font-display)] text-[clamp(1.2rem,1.8vw,1.6rem)] font-semibold tracking-[-0.02em] text-[#fff]">
                <span aria-hidden="true">→</span> Showreel
              </p>
            </div>

            {projects.slice(0, 3).map((p) => (
              <Link
                key={p.slug}
                href={`/projekte/${p.slug}`}
                className="group relative block overflow-hidden rounded-[var(--radius-lg)]"
                data-cursor="Case ansehen"
                data-reveal
              >
                <PlaceholderImage
                  slot={p.coverSlot}
                  alt=""
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="aspect-[4/3] transition-transform duration-[var(--dauer-3)] ease-[var(--ease-quart)] group-hover:scale-[1.03]"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[rgb(10_9_7/0.65)] to-transparent" aria-hidden="true" />
                <span className="absolute bottom-[var(--s-5)] left-[var(--s-5)] right-[var(--s-5)] flex items-center gap-[0.5em] font-[family-name:var(--font-display)] text-[clamp(1.2rem,1.8vw,1.6rem)] font-semibold tracking-[-0.02em] text-[#fff]">
                  <span aria-hidden="true" className="inline-block transition-transform duration-[var(--dauer-2)] ease-[var(--ease-fluss)] group-hover:translate-x-1">→</span>
                  {anzeigeName(p)}
                </span>
              </Link>
            ))}
          </div>
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

      {/* ══ 5 — Leistungen: hohe Zeilen, Foto erscheint beim Überfahren ═ */}
      <section className="section bg-[var(--ink)] text-[var(--cream)]" data-nav="dark" id="leistungen">
        <div className="wrap flex flex-wrap items-baseline justify-between gap-[var(--s-4)]">
          <h2 className="sec-title mb-0" data-reveal>Leistungen</h2>
          <p className="eyebrow mb-0 text-[var(--grau-d)]" data-decode>Fünf Felder · ein Ansprechpartner</p>
        </div>
        <div className="mt-[var(--s-7)]">
          <LeistungsZeilen
            eintraege={services.map((s) => ({
              slug: s.slug, name: s.name, claim: s.claim, fuerWen: s.fuerWen,
              bildSlot: s.bildSlot,
            }))}
          />
        </div>
      </section>

      {/* ══ 5b — Der Klartext-Filter: Agentur-Deutsch, übersetzt ═══════
          Alleinstellungs-Stück aus der Marke heraus: Floskel wird beim
          Scrollen durchgestrichen, darunter steigt die Übersetzung aus
          der Maske. Choreografie liegt in Reveals ([data-filterzeile]). */}
      <section className="section bg-[var(--cream)] text-[var(--ink)]" aria-label="Der Klartext-Filter">
        <div className="wrap">
          <p className="eyebrow text-[var(--grau-l)]" data-decode>Der Klartext-Filter</p>
          <h2 className="sec-title" data-reveal>Agentur-Deutsch, übersetzt.</h2>
          <div className="grid gap-[var(--s-8)]">
            {[
              ['Wir aktivieren 360°-Synergien entlang Ihrer Customer Journey.',
               'Wir machen Werbung, die Ihre Kunden verstehen.'],
              ['Holistische Brand-Experience mit datengetriebenem Storytelling.',
               'Eine Marke, die man wiedererkennt — und Zahlen, die es belegen.'],
              ['Wir disrupten Ihren Funnel mit KI-powered Growth-Hacking.',
               'Wir automatisieren den einen Handgriff, der Ihnen Zeit frisst.'],
            ].map(([floskel, klartext]) => (
              <div key={floskel} className="border-t border-current/15 pt-[var(--s-5)]" data-filterzeile>
                <p className="relative inline-block max-w-[46ch] font-[family-name:var(--font-display)] text-[clamp(1.15rem,2.1vw,1.8rem)] font-medium leading-[1.3] tracking-[-0.01em] text-[var(--grau-l)]">
                  <span data-floskel>{floskel}</span>
                  <span
                    aria-hidden="true"
                    data-strich
                    className="absolute left-0 top-1/2 h-[2.5px] w-full origin-left scale-x-0 bg-[var(--violet)]"
                  />
                </p>
                <p className="mt-[var(--s-3)] max-w-[38ch] font-[family-name:var(--font-display)] text-[clamp(1.6rem,3vw,2.7rem)] font-semibold leading-[1.12] tracking-[-0.02em]">
                  <span className="line"><span className="line__i" data-klartext>{klartext}</span></span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5c — Prozess: Schritte mit Loop-Videos (bymonolog) ═════════ */}
      <Prozess />

      {/* ══ 5d — Preise: Abo-Stufen auf violetter Bühne. Beträge sind
          gekennzeichnete Richtwerte — Freigabe durch Dusan offen. ═════ */}
      <Pricing />

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
                    className="aspect-[3/4] grayscale transition-[filter,transform] duration-[var(--dauer-3)] ease-[var(--ease-quart)] hover:scale-[1.02] hover:grayscale-0"
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
                        className="aspect-[16/10] transition-transform duration-[var(--dauer-3)] ease-[var(--ease-quart)] group-hover:scale-[1.04]"
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
