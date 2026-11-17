import Link from "next/link";
import manifest from "@/data/image-manifest.json";
import { posts } from "@/content/blog";
import { formatLongDate } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/common";

export const metadata = pageMeta({
  title: "Dubai Car Rental Blog – Tips, Road Trips & Guides | Aldy Rent A Car",
  description: "Practical car rental tips, road trips from Dubai and a guide to renting a luxury car – from the team at Aldy Rent A Car.",
  path: "/blog/",
});

const covers = manifest.blog as Record<string, { src: string; thumb: string; w: number; h: number }>;

export default function BlogIndex() {
  return (
    <>
      <PageHeader crumbs={[{ name: "Blog", path: "/blog/" }]} eyebrow="Blog" title="Tips and guides for driving in the UAE" />
      <section className="container-x py-12">
        <ul className="grid gap-8 md:grid-cols-3">
          {posts.map((p) => {
            const img = covers[p.slug];
            return (
              <li key={p.slug}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card">
                  {img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.thumb} alt="" width={600} height={Math.round((600 * img.h) / img.w)} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs text-muted">
                      <time dateTime={p.date}>{formatLongDate(p.date)}</time> · {p.readMinutes} min read
                    </p>
                    <h2 className="mt-2 text-lg leading-snug font-bold">
                      <Link href={`/blog/${p.slug}/`} className="after:absolute after:inset-0">
                        {p.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted">{p.description}</p>
                    <span className="mt-auto pt-4 text-sm font-semibold text-brand-600">Read more →</span>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
