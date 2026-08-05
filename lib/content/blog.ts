import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

/**
 * Blog — Repository-Modul.
 *
 * Inhalte liegen als MDX unter content/blog/. Komponenten sehen ausschliesslich
 * die Typen aus dieser Datei, nie das Dateisystem — dadurch lässt sich später
 * ein CMS dahinterhängen, ohne eine Seite umzubauen.
 */

export type PostMeta = {
  slug: string;
  titel: string;
  beschreibung: string;
  datum: string;
  autor: string;
  kategorie: string;
  /** Kunde, über den der Artikel handelt — nur mit Freigabe gesetzt */
  kunde?: string;
  coverSlot: string;
  lesezeitMinuten: number;
  wortzahl: number;
};

export type Post = PostMeta & { inhalt: string };

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

/** ~200 Wörter pro Minute, aufgerundet — bewusst konservativ. */
const lesezeit = (text: string) => {
  const woerter = text.trim().split(/\s+/).filter(Boolean).length;
  return { woerter, minuten: Math.max(1, Math.ceil(woerter / 200)) };
};

async function ladePost(datei: string): Promise<Post> {
  const roh = await readFile(path.join(BLOG_DIR, datei), 'utf8');
  const { data, content } = matter(roh);
  const { woerter, minuten } = lesezeit(content);

  return {
    slug: datei.replace(/\.mdx$/, ''),
    titel: String(data.titel ?? 'Ohne Titel'),
    beschreibung: String(data.beschreibung ?? ''),
    datum: String(data.datum ?? ''),
    autor: String(data.autor ?? 'KLARTEXT.'),
    kategorie: String(data.kategorie ?? 'Allgemein'),
    kunde: data.kunde ? String(data.kunde) : undefined,
    coverSlot: String(data.coverSlot ?? 'blog/cover-01'),
    lesezeitMinuten: minuten,
    wortzahl: woerter,
    inhalt: content,
  };
}

export async function allePosts(): Promise<Post[]> {
  let dateien: string[] = [];
  try {
    dateien = (await readdir(BLOG_DIR)).filter((f) => f.endsWith('.mdx'));
  } catch {
    return [];   // noch kein Blog-Ordner: kein Fehler, nur leerer Index
  }
  const posts = await Promise.all(dateien.map(ladePost));
  return posts.sort((a, b) => b.datum.localeCompare(a.datum));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await allePosts();
  return posts.find((p) => p.slug === slug);
}

export async function kategorien(): Promise<string[]> {
  const posts = await allePosts();
  return [...new Set(posts.map((p) => p.kategorie))].sort();
}

/** Verwandte Artikel: gleiche Kategorie zuerst, dann der Rest. */
export async function verwandtePosts(slug: string, anzahl = 2): Promise<PostMeta[]> {
  const posts = await allePosts();
  const aktuell = posts.find((p) => p.slug === slug);
  if (!aktuell) return [];
  const andere = posts.filter((p) => p.slug !== slug);
  const gleich = andere.filter((p) => p.kategorie === aktuell.kategorie);
  const rest = andere.filter((p) => p.kategorie !== aktuell.kategorie);
  return [...gleich, ...rest].slice(0, anzahl);
}

/** Inhaltsverzeichnis ab 800 Wörtern, aus den Zwischentiteln der MDX-Datei. */
export function inhaltsverzeichnis(post: Post) {
  if (post.wortzahl < 800) return [];
  return post.inhalt
    .split('\n')
    .filter((z) => /^##\s+/.test(z))
    .map((z) => {
      const titel = z.replace(/^##\s+/, '').trim();
      return { titel, id: slugify(titel) };
    });
}

export const slugify = (s: string) =>
  s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
