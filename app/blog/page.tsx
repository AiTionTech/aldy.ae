import { posts } from "@/content/blog";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/common";
import BlogCard from "@/components/BlogCard";

export const metadata = pageMeta({
  title: "Dubai Car Rental Blog – Tips, Road Trips & Guides | Aldy Rent A Car",
  description: "Practical car rental tips, road trips from Dubai and a guide to renting a luxury car – from the team at Aldy Rent A Car.",
  path: "/blog/",
});


export default function BlogIndex() {
  return (
    <>
      <PageHeader crumbs={[{ name: "Blog", path: "/blog/" }]} eyebrow="Blog" title="Tips and guides for driving in the UAE" />
      <section className="container-x py-12">
        <ul className="grid gap-8 md:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <BlogCard post={p} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
