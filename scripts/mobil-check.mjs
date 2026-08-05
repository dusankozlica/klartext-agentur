#!/usr/bin/env node
/**
 * Mobil-Prüfung im echten Gerätemodus.
 *
 *   node scripts/mobil-check.mjs [basis-url]
 *
 * Prüft je Seite:
 *  - horizontalen Überlauf (scrollWidth > clientWidth) und benennt die
 *    Elemente, die tatsächlich über den Rand ragen
 *  - Touch-Ziele unter 44 px
 *  - Textstellen, die aus ihrem Kasten laufen
 *
 * Nutzt den Chrome, den Lighthouse ohnehin mitbringt. Kein zusätzlicher
 * Systemeingriff.
 */
import puppeteer from 'puppeteer-core';

const BASIS = process.argv[2] ?? 'http://localhost:3100';
const CHROME = process.env.CHROME_PATH
  ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const SEITEN = [
  '/', '/leistungen', '/leistungen/branding', '/projekte',
  '/projekte/schreinerei-marke-und-website', '/team', '/blog',
  '/blog/klarheit-vor-reichweite', '/kontakt', '/impressum', '/datenschutz',
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
});

let problemeGesamt = 0;

for (const pfad of SEITEN) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(BASIS + pfad, { waitUntil: 'networkidle0', timeout: 60000 });

  const befund = await page.evaluate(() => {
    const doc = document.documentElement;
    const breite = doc.clientWidth;

    // Elemente, die tatsächlich über den rechten Rand ragen
    const ueberlauf = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > breite + 1 || r.left < -1) {
        const stil = getComputedStyle(el);
        if (stil.position === 'fixed') continue;         // Overlays dürfen das
        ueberlauf.push({
          tag: el.tagName.toLowerCase(),
          klasse: String(el.className).slice(0, 70),
          links: Math.round(r.left),
          rechts: Math.round(r.right),
          text: (el.textContent ?? '').trim().slice(0, 40),
        });
      }
    }

    // Nur die äussersten Verursacher melden, nicht jedes Kind
    const echte = ueberlauf.filter((a, _, alle) =>
      !alle.some((b) => b !== a && b.links <= a.links && b.rechts >= a.rechts && b.text.includes(a.text)));

    // Touch-Ziele.
    // Zwei begründete Ausnahmen, sonst meldet der Prüfer Fehlalarme:
    //  - Alles unter aria-hidden (z. B. das Honeypot-Feld) ist kein Ziel.
    //  - WCAG 2.2 SC 2.5.8 nimmt Links AUS, die im Fliesstext stehen
    //    ("inline"): Sie im Satz auf 44 px aufzublasen zerstört den Textfluss.
    const imFliesstext = (el) => {
      const p = el.parentElement;
      if (!p) return false;
      if (!['P', 'LI', 'SPAN', 'TD', 'DD'].includes(p.tagName)) return false;
      // Es steht anderer Text daneben → der Link ist eingebettet, nicht eigenständig
      return (p.textContent ?? '').trim().length > (el.textContent ?? '').trim().length + 3;
    };

    const klein = [];
    for (const el of document.querySelectorAll('a, button, input, textarea, select, summary')) {
      if (el.closest('[aria-hidden="true"]')) continue;
      if (el.tagName === 'A' && imFliesstext(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.height < 44 || r.width < 44) {
        klein.push({
          tag: el.tagName.toLowerCase(),
          groesse: `${Math.round(r.width)}x${Math.round(r.height)}`,
          text: (el.textContent ?? '').trim().slice(0, 34),
        });
      }
    }

    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: breite,
      ueberlauf: echte.slice(0, 6),
      kleineZiele: klein.slice(0, 8),
    };
  });

  const scrollt = befund.scrollWidth > befund.clientWidth;
  const probleme = (scrollt ? 1 : 0) + befund.ueberlauf.length + befund.kleineZiele.length;
  problemeGesamt += probleme;

  console.log(`\n── ${pfad} ──`);
  console.log(`   Breite: ${befund.clientWidth}px, Inhalt: ${befund.scrollWidth}px ${scrollt ? '← SCROLLT SEITWÄRTS' : 'OK'}`);
  for (const u of befund.ueberlauf) {
    console.log(`   ÜBERLAUF <${u.tag}> ${u.links}…${u.rechts}px  "${u.text}"  [${u.klasse}]`);
  }
  for (const k of befund.kleineZiele) {
    console.log(`   ZU KLEIN <${k.tag}> ${k.groesse}  "${k.text}"`);
  }
  if (!probleme) console.log('   keine Probleme');

  await page.close();
}

await browser.close();
console.log(`\n${problemeGesamt === 0 ? 'Alle Seiten sauber.' : `${problemeGesamt} Befunde insgesamt.`}`);
