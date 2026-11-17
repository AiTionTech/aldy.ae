import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lightbulb } from "lucide-react";
import manifest from "@/data/image-manifest.json";
import { getPost, posts } from "@/content/blog";
import { formatLongDate } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";
import { waLink } from "@/lib/site";
import { Breadcrumbs, JsonLd } from "@/components/common";
import { WhatsAppIcon } from "@/components/icons";

type Params = { params: Promise<{ slug: string }> };
const covers = manifest.blog as Record<string, { src: string; md: string; thumb: string; w: number; h: number }>;

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  return pageMeta({ title: `${p.title} | Aldy Rent A Car`, description: p.description, path: `/blog/${p.slug}/`, image: covers[p.slug]?.src, type: "article" });
}

export default async function PostPage({ params }: Params) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const img = covers[p.slug];
  const path = `/blog/${p.slug}/`;
  const others = posts.filter((x) => x.slug !== p.slug);

  return (
    <article>
      <header className="container-x max-w-3xl pt-8">
        <Breadcrumbs
          items={[
            { name: "Blog", path: "/blog/" },
            { name: p.title, path },
          ]}
        />
        <h1 className="mt-6 text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">{p.title}</h1>
        <p className="mt-3 text-sm text-muted">
          <time dateTime={p.date}>{formatLongDate(p.date)}</time>
          {p.updated && (
            <>
              {" "}
              · Updated <time dateTime={p.updated}>{formatLongDate(p.updated)}</time>
            </>
          )}{" "}
          · {p.readMinutes} min read
        </p>
      </header>
      {img && (
        <div className="container-x mt-8 max-w-4xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            srcSet={`${img.thumb} 600w, ${img.md} 1000w, ${img.src} ${img.w}w`}
            sizes="(min-width: 896px) 896px, 100vw"
            alt=""
            width={img.w}
            height={img.h}
            className="aspect-[2/1] w-full rounded-3xl object-cover"
          />
        </div>
      )}
      <div className="prose-aldy container-x mt-10 max-w-3xl text-base leading-8">
        {p.body.map((b, i) =>
          "p" in b ? (
            <p key={i}>{b.p}</p>
          ) : "h2" in b ? (
            <h2 key={i}>{b.h2}</h2>
          ) : "list" in b ? (
            <ul key={i}>
              {b.list.map((li) => {
                const [head, ...rest] = li.split(" – ");
                return <li key={li}>{rest.length ? <><strong>{head}</strong> – {rest.join(" – ")}</> : li}</li>;
              })}
            </ul>
          ) : (
            <p key={i} className="flex gap-3 rounded-2xl bg-brand-50 p-5 text-ink">
              <Lightbulb className="mt-1 size-5 shrink-0 text-brand-600" aria-hidden /> {b.tip}
            </p>
          ),
        )}

        <div className="not-prose mt-10 flex flex-col gap-3 rounded-3xl border border-line p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold">Need a car for your trip?</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/cars/" className="btn-ghost no-underline">
              Browse cars
            </Link>
            <a href={waLink()} target="_blank" rel="noopener" className="btn-wa text-white no-underline">
              <WhatsAppIcon className="size-4" /> WhatsApp us
            </a>
          </div>
        </div>
      </div>

      <section className="container-x mt-16 max-w-3xl">
        <h2 className="text-xl font-bold">More from the blog</h2>
        <ul className="mt-4 space-y-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/blog/${o.slug}/`} className="block rounded-2xl border border-line p-4 font-semibold hover:border-brand-300 hover:bg-brand-50/40">
                {o.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <JsonLd data={articleSchema({ title: p.title, description: p.description, path, image: img?.src ?? "/images/brand/icon-512.png", date: p.date, updated: p.updated })} />
    </article>
  );
}
