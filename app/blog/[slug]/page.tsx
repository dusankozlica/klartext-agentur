import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import PlaceholderImage from '@/components/ui/PlaceholderImage';
import JsonLd from '@/components/seo/JsonLd';
import {
  allePosts, getPost, inhaltsverzeichnis, verwandtePosts, slugify,
} from '@/lib/content/blog';
import { articleSchema, breadcrumbSchema } from '@/lib/seo/schema';

export async function generateStaticParams() {
  const posts = await allePosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.titel,
    description: post.beschreibung,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

/** Zwischentitel bekommen eine ID, damit das Inhaltsverzeichnis verlinken kann. */
const mdxKomponenten = {
  h2: (props: React.ComponentProps<'h2'>) => (
    <h2
      id={typeof props.children === 'string' ? slugify(props.children) : undefined}
      className="sec-title mt-[var(--s-9)] mb-[var(--s-5)] scroll-mt-[100px] text-[clamp(1.5rem,3vw,2.2rem)]"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<'p'>) => (
    <p className="body-measure mb-[var(--s-5)]" {...props} />
  ),
  ul: (props: React.ComponentProps<'ul'>) => (
    <ul className="body-measure mb-[var(--s-5)] list-disc pl-[var(--s-6)]" {...props} />
  ),
  a: (props: React.ComponentProps<'a'>) => (
    <a className="underline underline-offset-4" {...props} />
  ),
};

export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const toc = inhaltsverzeichnis(post);
  const verwandt = await verwandtePosts(post.slug);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Start', pfad: '/' },
        { name: 'Blog', pfad: '/blog' },
        { name: post.titel, pfad: `/blog/${post.slug}` },
      ])} />
      <JsonLd data={articleSchema(post)} />

      <article>
        <header className="section bg-[var(--cream)] pt-[calc(var(--sec-y)+40px)]">
          <div className="wrap">
            <p className="eyebrow">{post.kategorie}</p>
            <h1 className="display display--sm">
              <span className="line"><span className="line__i">{post.titel}</span></span>
            </h1>
            <p className="mt-[var(--s-6)] text-[0.9rem] opacity-70">
              <time dateTime={post.datum}>{post.datum}</time>
              {' · '}{post.autor}
              {' · '}{post.lesezeitMinuten} Min. Lesezeit
              {post.kunde ? ` · ${post.kunde}` : ''}
            </p>
          </div>
        </header>

        <div className="bg-[var(--paper)]">
          <div className="wrap py-[var(--sec-y)]">
            <PlaceholderImage
              slot={post.coverSlot}
              alt=""
              sizes="(max-width: 900px) 100vw, 1360px"
              className="mb-[var(--s-9)] aspect-video"
            />

            <div className="grid gap-[var(--s-8)] md:grid-cols-[4fr_8fr]">
              {toc.length > 0 ? (
                <nav aria-label="Inhalt" className="self-start md:sticky md:top-[120px]">
                  <p className="eyebrow">Inhalt</p>
                  <ul className="grid gap-[var(--s-2)] text-[0.95rem]">
                    {toc.map((t) => (
                      <li key={t.id}>
                        <a href={`#${t.id}`} className="opacity-70 underline-offset-4 hover:underline hover:opacity-100">
                          {t.titel}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : <div />}

              <div>
                <MDXRemote source={post.inhalt} components={mdxKomponenten} />
              </div>
            </div>
          </div>
        </div>
      </article>

      {verwandt.length > 0 && (
        <section className="section bg-[var(--cream-tint)]">
          <div className="wrap">
            <h2 className="sec-title">Weiterlesen</h2>
            <ul className="border-t border-current/20">
              {verwandt.map((v) => (
                <li key={v.slug} className="border-b border-current/20">
                  <Link href={`/blog/${v.slug}`} className="flex flex-wrap items-baseline justify-between gap-[var(--s-4)] py-[var(--s-5)] transition-colors hover:text-[var(--violet)]">
                    <span className="font-[family-name:var(--font-display)] text-[1.3rem] font-semibold tracking-[-0.02em]">
                      {v.titel}
                    </span>
                    <span className="text-[0.9rem] opacity-70">{v.kategorie}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section bg-[var(--violet)] text-[var(--cream)]" data-nav="dark">
        <div className="wrap">
          <h2 className="sec-title">Passt das auf Ihre Situation?</h2>
          <p className="body-measure mb-[var(--s-7)]">
            30 Minuten, ohne Kosten. Danach wissen Sie, ob wir zueinander passen.
          </p>
          <Link className="btn btn--primary" href="/kontakt">Erstgespräch buchen</Link>
        </div>
      </section>
    </>
  );
}
