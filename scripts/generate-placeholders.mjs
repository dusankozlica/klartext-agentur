#!/usr/bin/env node
/**
 * Platzhalter-Generator — Bilder + Videos im Markendesign.
 *
 *   node scripts/generate-placeholders.mjs            # alles
 *   node scripts/generate-placeholders.mjs --images   # nur Bilder
 *   node scripts/generate-placeholders.mjs --videos   # nur Videos (braucht ffmpeg)
 *
 * Ausgabe: public/placeholders/**  +  content/_placeholders.json
 * Jeder Platzhalter zeigt Slot-Name, Seitenverhältnis und Zielmasse,
 * damit im Layout sofort sichtbar ist, welches Asset dort hingehört.
 *
 * Abhängigkeit: sharp. ffmpeg kommt aus dem Paket ffmpeg-static — auf diesem
 * Rechner ist kein System-ffmpeg installiert, und ein Systemeingriff dafür
 * wäre unnötig: die Binärdatei liegt in node_modules und reist mit dem Repo.
 */

import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';
import { mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const exec = promisify(execFile);

// ---------------------------------------------------------------- Markentokens
const C = {
  violet: '#6A00F4',
  violetDeep: '#3B0088',
  cream: '#FFD6A5',
  creamTint: '#FFF1DE',
  ink: '#12101A',
  paper: '#FAF7F2',
};

// Slot-Definition: [Ordner/Datei, Breite, Höhe, Label, Variante]
const IMAGE_SLOTS = [
  ['hero/hero-still',            2400, 1350, 'HERO STILL 16:9',            'violet'],
  ['hero/hero-portrait',         1080, 1920, 'HERO 9:16',                  'violet'],
  ['projects/case-01-cover',     1600, 1200, 'CASE 01 COVER 4:3',          'cream'],
  ['projects/case-02-cover',     1600, 1200, 'CASE 02 COVER 4:3',          'ink'],
  ['projects/case-03-cover',     1600, 1200, 'CASE 03 COVER 4:3',          'violet'],
  ['projects/case-detail-wide',  2400, 1350, 'CASE DETAIL 16:9',           'cream'],
  ['projects/case-detail-tall',  1200, 1600, 'CASE DETAIL 3:4',            'ink'],
  ['team/portrait-01',            900, 1200, 'TEAM PORTRAIT 3:4',          'cream'],
  ['team/portrait-02',            900, 1200, 'TEAM PORTRAIT 3:4',          'violet'],
  ['team/portrait-03',            900, 1200, 'TEAM PORTRAIT 3:4',          'ink'],
  ['team/portrait-04',            900, 1200, 'TEAM PORTRAIT 3:4',          'cream'],
  ['team/group',                 2400, 1350, 'TEAM GRUPPENBILD 16:9',      'violet'],
  ['testimonials/poster-01',     1080, 1920, 'TESTIMONIAL POSTER 9:16',    'cream'],
  ['testimonials/poster-02',     1080, 1920, 'TESTIMONIAL POSTER 9:16',    'violet'],
  ['testimonials/poster-03',     1080, 1920, 'TESTIMONIAL POSTER 9:16',    'ink'],
  ['blog/cover-01',              1600,  900, 'BLOG COVER 16:9',            'cream'],
  ['blog/cover-02',              1600,  900, 'BLOG COVER 16:9',            'violet'],
  ['services/social-media',      1200, 1200, 'LEISTUNG SOCIAL MEDIA 1:1',  'violet'],
  ['services/branding',          1200, 1200, 'LEISTUNG BRANDING 1:1',      'cream'],
  ['services/webdesign',         1200, 1200, 'LEISTUNG WEBDESIGN 1:1',     'ink'],
  ['services/marketingpartner',  1200, 1200, 'LEISTUNG PARTNER 1:1',       'violet'],
  ['services/ki-fuer-kmu',       1200, 1200, 'LEISTUNG KI FÜR KMU 1:1',    'cream'],
  ['og/default',                 1200,  630, 'OPEN GRAPH 1.91:1',          'violet'],
];

const LOGO_COUNT = 8; // Kundenlogos für die Marquee

const VARIANTS = {
  violet: { bg: C.violet,     fg: C.cream,      grid: 'rgba(255,214,165,.22)' },
  cream:  { bg: C.cream,      fg: C.ink,        grid: 'rgba(18,16,26,.16)'    },
  ink:    { bg: C.ink,        fg: C.creamTint,  grid: 'rgba(255,241,222,.14)' },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function svgPlaceholder(w, h, label, variantKey) {
  const v = VARIANTS[variantKey] ?? VARIANTS.violet;
  const min = Math.min(w, h);
  const pad = Math.round(min * 0.06);
  const step = Math.round(min / 12);
  const labelSize = Math.round(min * 0.055);
  const metaSize = Math.round(min * 0.032);
  const ratio = (w / h).toFixed(3);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <pattern id="g" width="${step}" height="${step}" patternUnits="userSpaceOnUse">
      <path d="M ${step} 0 L 0 0 0 ${step}" fill="none" stroke="${v.grid}" stroke-width="1"/>
    </pattern>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="${v.bg}"/>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <line x1="0" y1="0" x2="${w}" y2="${h}" stroke="${v.grid}" stroke-width="2"/>
  <line x1="${w}" y1="0" x2="0" y2="${h}" stroke="${v.grid}" stroke-width="2"/>
  <rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}"
        fill="none" stroke="${v.fg}" stroke-width="3" stroke-dasharray="14 10" opacity="0.55"/>
  <text x="50%" y="${h / 2 - metaSize}" text-anchor="middle"
        font-family="Helvetica,Arial,sans-serif" font-weight="700" font-size="${labelSize}"
        letter-spacing="${labelSize * 0.06}" fill="${v.fg}">${esc(label)}</text>
  <text x="50%" y="${h / 2 + metaSize * 1.6}" text-anchor="middle"
        font-family="Helvetica,Arial,sans-serif" font-weight="400" font-size="${metaSize}"
        letter-spacing="${metaSize * 0.12}" fill="${v.fg}" opacity="0.75">${w} × ${h} · AR ${ratio}</text>
  <text x="50%" y="${h - pad * 1.4}" text-anchor="middle"
        font-family="Helvetica,Arial,sans-serif" font-weight="700" font-size="${metaSize * 0.85}"
        letter-spacing="${metaSize * 0.2}" fill="${v.fg}" opacity="0.6">PLATZHALTER — ERSETZEN</text>
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.09" style="mix-blend-mode:overlay"/>
</svg>`;
}

function svgLogo(i) {
  const w = 480, h = 160;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="none"/>
  <circle cx="70" cy="80" r="34" fill="none" stroke="${C.ink}" stroke-width="8"/>
  <rect x="52" y="62" width="36" height="36" fill="${C.ink}" opacity="0.9"/>
  <text x="128" y="96" font-family="Helvetica,Arial,sans-serif" font-weight="700"
        font-size="44" letter-spacing="2" fill="${C.ink}">KUNDE ${String(i).padStart(2, '0')}</text>
</svg>`;
}

async function buildImages(outRoot) {
  const manifest = [];
  for (const [slot, w, h, label, variant] of IMAGE_SLOTS) {
    const target = path.join(outRoot, `${slot}.jpg`);
    await mkdir(path.dirname(target), { recursive: true });
    const svg = Buffer.from(svgPlaceholder(w, h, label, variant));
    await sharp(svg, { density: 96 }).jpeg({ quality: 82, mozjpeg: true }).toFile(target);
    await sharp(svg, { density: 96 }).webp({ quality: 78 }).toFile(target.replace(/\.jpg$/, '.webp'));
    // LQIP für Blur-Up
    const lqip = await sharp(svg, { density: 96 }).resize(20).jpeg({ quality: 40 }).toBuffer();
    manifest.push({
      slot, width: w, height: h, label,
      src: `/placeholders/${slot}.jpg`,
      blurDataURL: `data:image/jpeg;base64,${lqip.toString('base64')}`,
      isPlaceholder: true,
    });
    console.log(`  ✓ ${slot}.jpg  ${w}×${h}`);
  }
  for (let i = 1; i <= LOGO_COUNT; i++) {
    const target = path.join(outRoot, 'logos', `logo-${String(i).padStart(2, '0')}.svg`);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, svgLogo(i), 'utf8');
    manifest.push({
      slot: `logos/logo-${String(i).padStart(2, '0')}`, width: 480, height: 160,
      label: `KUNDENLOGO ${i}`, src: `/placeholders/logos/logo-${String(i).padStart(2, '0')}.svg`,
      isPlaceholder: true,
    });
  }
  console.log(`  ✓ ${LOGO_COUNT} Logo-Platzhalter`);
  return manifest;
}

// --------------------------------------------------------------------- Videos
const VIDEO_SLOTS = [
  ['showreel',          1920, 1080, 12, 'SHOWREEL — PLATZHALTER',      C.violet, C.cream],
  ['testimonial-01',    1080, 1920,  9, 'TESTIMONIAL 01 — PLATZHALTER', C.cream,  C.ink],
  ['testimonial-02',    1080, 1920,  9, 'TESTIMONIAL 02 — PLATZHALTER', C.violet, C.cream],
  ['testimonial-03',    1080, 1920,  9, 'TESTIMONIAL 03 — PLATZHALTER', C.ink,    C.cream],
  ['hero-loop',         1920, 1080,  6, 'HERO LOOP — PLATZHALTER',      C.ink,    C.cream],
];

const hex2ff = (h) => '0x' + h.replace('#', '');

async function buildVideos(outRoot) {
  const dir = path.join(outRoot, 'video');
  await mkdir(dir, { recursive: true });
  const manifest = [];
  for (const [name, w, h, dur, label, bg, fg] of VIDEO_SLOTS) {
    const out = path.join(dir, `${name}.mp4`);
    const fontsize = Math.round(Math.min(w, h) * 0.055);
    const drawText = [
      `drawtext=text='${label}':fontcolor=${hex2ff(fg)}:fontsize=${fontsize}`,
      `x=(w-text_w)/2:y=(h-text_h)/2-${fontsize}`,
      `box=0`,
    ].join(':');
    const drawTimer = [
      `drawtext=text='%{eif\\:t\\:d}s / ${dur}s':fontcolor=${hex2ff(fg)}@0.75:fontsize=${Math.round(fontsize * 0.6)}`,
      `x=(w-text_w)/2:y=(h-text_h)/2+${fontsize}`,
    ].join(':');
    const filters = [
      drawText,
      drawTimer,
      `noise=alls=12:allf=t+u`,
      `format=yuv420p`,
    ].join(',');
    await exec(ffmpegPath, [
      '-y', '-f', 'lavfi', '-i', `color=c=${hex2ff(bg)}:s=${w}x${h}:d=${dur}:r=25`,
      '-vf', filters,
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '30', '-movflags', '+faststart',
      '-an', out,
    ]);
    // Poster aus Frame 1
    const poster = path.join(dir, `${name}-poster.jpg`);
    await exec(ffmpegPath, ['-y', '-i', out, '-vframes', '1', '-q:v', '4', poster]);
    manifest.push({
      slot: `video/${name}`, width: w, height: h, durationSeconds: dur,
      src: `/placeholders/video/${name}.mp4`,
      poster: `/placeholders/video/${name}-poster.jpg`,
      isPlaceholder: true, freigabeVorhanden: false,
    });
    console.log(`  ✓ ${name}.mp4  ${w}×${h}  ${dur}s`);
  }
  return manifest;
}

// ----------------------------------------------------------------------- main
const args = process.argv.slice(2);
const doImages = args.length === 0 || args.includes('--images');
const doVideos = args.length === 0 || args.includes('--videos');

const outRoot = path.resolve('public/placeholders');
await mkdir(outRoot, { recursive: true });

let manifest = [];
if (doImages) { console.log('Bilder:'); manifest = manifest.concat(await buildImages(outRoot)); }
if (doVideos) { console.log('Videos:'); manifest = manifest.concat(await buildVideos(outRoot)); }

await mkdir(path.resolve('content'), { recursive: true });
await writeFile(
  path.resolve('content/_placeholders.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), count: manifest.length, assets: manifest }, null, 2),
  'utf8',
);
console.log(`\n${manifest.length} Platzhalter erzeugt → public/placeholders/, Register → content/_placeholders.json`);
