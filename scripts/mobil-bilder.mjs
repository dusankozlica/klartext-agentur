#!/usr/bin/env node
/**
 * Mobil-Screenshots im echten Gerätemodus.
 *
 *   node scripts/mobil-bilder.mjs [basis-url] [zielordner]
 *
 * Wichtig: Chrome über die Kommandozeile mit `--window-size=390,844` und
 * `--screenshot` liefert KEIN verlässliches Bild — es legt die Seite breiter
 * aus und schneidet dann auf 390 px zu. Das sieht nach abgeschnittenem Text
 * aus, obwohl das Layout stimmt. Nur echte Geräte-Emulation über das
 * DevTools-Protokoll (hier via puppeteer) zeigt den wahren Zustand.
 */
import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASIS = process.argv[2] ?? 'http://localhost:3100';
const ZIEL = process.argv[3] ?? '/tmp/kt-mobil';
const CHROME = process.env.CHROME_PATH
  ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const SEITEN = [
  ['start', '/'],
  ['leistungen', '/leistungen'],
  ['leistung-branding', '/leistungen/branding'],
  ['projekte', '/projekte'],
  ['case', '/projekte/schreinerei-marke-und-website'],
  ['team', '/team'],
  ['blog', '/blog'],
  ['artikel', '/blog/klarheit-vor-reichweite'],
  ['kontakt', '/kontakt'],
];

await mkdir(ZIEL, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
});

for (const [name, pfad] of SEITEN) {
  const page = await browser.newPage();
  await page.setViewport({
    width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  });
  await page.goto(BASIS + pfad, { waitUntil: 'networkidle0', timeout: 60000 });
  // Reveals brauchen einen Moment, sonst steht alles auf opacity 0
  await new Promise((r) => setTimeout(r, 1200));
  const datei = path.join(ZIEL, `${name}.png`);
  await page.screenshot({ path: datei });
  console.log(`  ✓ ${name.padEnd(20)} ${pfad}`);
  await page.close();
}

await browser.close();
console.log(`\n${SEITEN.length} Bilder → ${ZIEL}`);
