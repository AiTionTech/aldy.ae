import Link from "next/link";
import manifest from "@/data/image-manifest.json";
import type { BlogPost } from "@/content/blog";
import { formatLongDate } from "@/lib/format";

const covers = manifest.blog as Record<string, { src: string; thumb: string; w: number; h: number }>;

/** Blog post card – used on /blog/ and the home page ("From the blog") */
export default function BlogCard({ post, headingLevel = "h2" }: { post: BlogPost; headingLevel?: "h2" | "h3" }) {
  const img = covers[post.slug];
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card transition-shadow hover:shadow-lift">
      {img && (
        <div className="overflow-hidden bg-sand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.thumb}
            alt=""
            width={600}
            height={Math.round((600 * img.h) / img.w)}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs text-muted">
          <time dateTime={post.date}>{formatLongDate(post.date)}</time> · {post.readMinutes} min read
        </p>
        <Heading className="mt-2 text-lg leading-snug font-bold">
          <Link href={`/blog/${post.slug}/`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </Heading>
        <p className="mt-2 text-sm leading-6 text-muted">{post.description}</p>
        <span className="mt-auto pt-4 text-sm font-semibold text-brand-600">Read more →</span>
      </div>
    </article>
  );
}
