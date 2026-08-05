#!/usr/bin/env node
/**
 * Importiert kuratierte Stock-Medien in die Platzhalter-Slots.
 *
 *   node scripts/import-stock.mjs /tmp/kt-stock
 *
 * Schneidet jedes Foto auf die Zielmasse des Slots (JPG + WebP + Unschärfe-
 * Vorschau), skaliert die Videos, erzeugt Poster und aktualisiert
 * content/_placeholders.json.
 *
 * `isPlaceholder` bleibt TRUE: Es sind weiterhin Platzhalter — nur eben
 * welche, die wie eine fertige Seite aussehen. `quelle` hält die
 * Freepik-Nummer fest, damit die Lizenz später belegbar ist.
 */
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const exec = promisify(execFile);
const QUELLE = process.argv[2] ?? '/tmp/kt-stock';
const OUT = path.resolve('public/placeholders');
const MANIFEST = path.resolve('content/_placeholders.json');

// [Quelldatei, Slot, Breite, Höhe, Freepik-ID, contain statt cover?]
const BILDER = [
  ['team-portrait-01.jpg', 'team/portrait-01', 900, 1200, 7262931],
  ['team-portrait-02.jpg', 'team/portrait-02', 900, 1200, 27645925],
  ['team-portrait-03.jpg', 'team/portrait-03', 900, 1200, 21249806],
  ['team-portrait-04.jpg', 'team/portrait-04', 900, 1200, 10701569],
  ['team-group.jpg', 'team/group', 2400, 1350, 13250350],
  ['case-01.jpg', 'projects/case-01-cover', 1600, 1200, 18895939],
  ['case-02.jpg', 'projects/case-02-cover', 1600, 1200, 26538639],
  ['case-03.jpg', 'projects/case-03-cover', 1600, 1200, 25856144],
  ['detail-wide.jpg', 'projects/case-detail-wide', 2400, 1350, 150835424],
  ['detail-tall.jpg', 'projects/case-detail-tall', 1200, 1600, 14600809],
  ['hero-still.jpg', 'hero/hero-still', 2400, 1350, 24492673],
  ['blog-01.jpg', 'blog/cover-01', 1600, 900, 9142993],
  ['blog-02.jpg', 'blog/cover-02', 1600, 900, 10204439],
  ['service-social.jpg', 'services/social-media', 1200, 1200, 417846996],
  ['service-branding.jpg', 'services/branding', 1200, 1200, 2765718],
  ['service-webdesign.jpg', 'services/webdesign', 1200, 1200, 152533021],
  ['service-partner.jpg', 'services/marketingpartner', 1200, 1200, 21130991],
  ['service-ki.jpg', 'services/ki-fuer-kmu', 1200, 1200, 20999719],
];

// Echter Freisteller mit Alphakanal — bleibt PNG, kein Zuschnitt aufs
// Format: Die Silhouette IST das Format.
const FREISTELLER = ['cutout.png', 'hero/hero-portrait', 900, 414356583];

const VIDEOS = [
  ['video-hero.mp4', 'video/hero-loop', 1080, 1920, 10, 7462448],
  ['video-showreel.mp4', 'video/showreel', 1920, 1080, 12, 7333764],
];

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
const byName = new Map(manifest.assets.map((a) => [a.slot, a]));

for (const [datei, slot, w, h, freepikId, contain] of BILDER) {
  const quelle = path.join(QUELLE, datei);
  const ziel = path.join(OUT, `${slot}.jpg`);
  await mkdir(path.dirname(ziel), { recursive: true });

  const basis = sharp(quelle).rotate().resize(w, h, contain
    ? { fit: 'contain', background: '#ffffff' }
    : { fit: 'cover', position: sharp.strategy.attention });

  await basis.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(ziel);
  await basis.clone().webp({ quality: 78 }).toFile(ziel.replace(/\.jpg$/, '.webp'));
  const lqip = await basis.clone().resize(20).jpeg({ quality: 40 }).toBuffer();

  const eintrag = byName.get(slot);
  if (eintrag) {
    eintrag.width = w;
    eintrag.height = h;
    eintrag.blurDataURL = `data:image/jpeg;base64,${lqip.toString('base64')}`;
    eintrag.quelle = `Freepik #${freepikId}`;
  }
  console.log(`  ✓ ${slot} ${w}×${h}`);
}

{
  const [datei, slot, breite, freepikId] = FREISTELLER;
  // WebP statt PNG: gleicher Alphakanal, ~15x kleiner. Das 3.5-MB-PNG
  // war das schwerste Element der Startseite.
  const ziel = path.join(OUT, `${slot}.webp`);
  await mkdir(path.dirname(ziel), { recursive: true });
  const info = await sharp(path.join(QUELLE, datei))
    .resize({ width: breite })
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(ziel);
  const eintrag = byName.get(slot);
  if (eintrag) {
    eintrag.width = info.width;
    eintrag.height = info.height;
    eintrag.src = `/placeholders/${slot}.webp`;
    delete eintrag.blurDataURL;          // Blur-Up auf Transparenz sieht falsch aus
    eintrag.quelle = `Freepik #${freepikId}`;
  }
  console.log(`  ✓ ${slot}.png ${info.width}×${info.height} (Alpha)`);
}

for (const [datei, slot, w, h, dauer, freepikId] of VIDEOS) {
  const quelle = path.join(QUELLE, datei);
  const ziel = path.join(OUT, `${slot}.mp4`);
  await mkdir(path.dirname(ziel), { recursive: true });

  // Auf Zielmass zuschneiden (cover), Dauer begrenzen, ohne Ton.
  await exec(ffmpegPath, [
    '-y', '-i', quelle, '-t', String(dauer),
    '-vf', `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}`,
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '28',
    '-movflags', '+faststart', '-an', ziel,
  ]);
  const poster = ziel.replace(/\.mp4$/, '-poster.jpg');
  await exec(ffmpegPath, ['-y', '-i', ziel, '-vframes', '1', '-q:v', '4', poster]);

  const eintrag = byName.get(slot);
  if (eintrag) {
    eintrag.width = w;
    eintrag.height = h;
    eintrag.durationSeconds = dauer;
    eintrag.quelle = `Freepik #${freepikId}`;
  }
  console.log(`  ✓ ${slot} ${w}×${h} ${dauer}s + Poster`);
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2), 'utf8');
console.log('\nRegister aktualisiert.');
