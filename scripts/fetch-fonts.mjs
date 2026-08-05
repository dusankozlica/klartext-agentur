#!/usr/bin/env node
/**
 * Holt die Schriften von Fontshare und legt sie als woff2 ins Repo.
 *
 *   node scripts/fetch-fonts.mjs
 *
 * Warum selbst hosten: kein Drittanbieter-Request beim Seitenaufruf
 * (revDSG/DSGVO) und keine zweite DNS-Auflösung im kritischen Ladepfad.
 * Beide Familien stehen unter der ITF Free Font License, kommerziell frei.
 *
 * Erzeugt zusätzlich app/fonts.css mit den @font-face-Regeln.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const FAMILIES = [
  { name: 'Clash Display', slug: 'clash-display', weights: [600, 700] },
  { name: 'Switzer',       slug: 'switzer',       weights: [400, 500, 600] },
];

const OUT_FONTS = path.resolve('public/fonts');
const OUT_CSS   = path.resolve('app/fonts.css');

const query = FAMILIES.map((f) => `f[]=${f.slug}@${f.weights.join(',')}`).join('&');

const css = await fetch(`https://api.fontshare.com/v2/css?${query}`, {
  headers: { 'User-Agent': 'Mozilla/5.0' },
}).then((r) => {
  if (!r.ok) throw new Error(`Fontshare antwortete mit ${r.status}`);
  return r.text();
});

// @font-face-Blöcke auseinandernehmen: Familie, Gewicht und woff2-URL je Block
const blocks = css.split('@font-face').slice(1);
const faces = [];

for (const block of blocks) {
  const family = block.match(/font-family:\s*'([^']+)'/)?.[1];
  const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
  const url    = block.match(/url\('(\/\/[^']+\.woff2)'\)/)?.[1];
  if (!family || !weight || !url) continue;

  const slug = family.toLowerCase().replace(/\s+/g, '-');
  const file = `${slug}-${weight}.woff2`;

  const buf = await fetch(`https:${url}`).then((r) => r.arrayBuffer());
  await mkdir(OUT_FONTS, { recursive: true });
  await writeFile(path.join(OUT_FONTS, file), Buffer.from(buf));

  faces.push({ family, weight, file, bytes: buf.byteLength });
  console.log(`  ✓ ${file.padEnd(26)} ${(buf.byteLength / 1024).toFixed(1)} KB`);
}

if (!faces.length) throw new Error('Keine woff2-Dateien gefunden — Antwortformat geprüft?');

const out = `/* Automatisch erzeugt von scripts/fetch-fonts.mjs — nicht von Hand ändern. */
${faces
  .map(
    (f) => `@font-face{
  font-family:"${f.family}";
  src:url("/fonts/${f.file}") format("woff2");
  font-weight:${f.weight};
  font-style:normal;
  font-display:swap;
}`,
  )
  .join('\n')}
`;

await writeFile(OUT_CSS, out, 'utf8');
const total = faces.reduce((s, f) => s + f.bytes, 0);
console.log(`\n${faces.length} Schnitte, ${(total / 1024).toFixed(0)} KB gesamt → public/fonts/, Regeln → app/fonts.css`);
