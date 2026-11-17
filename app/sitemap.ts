import type { MetadataRoute } from "next";
import { cars, categories } from "@/lib/cars";
import { locations } from "@/lib/locations";
import { posts } from "@/content/blog";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-16");
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });
  return [
    entry("/", 1, "weekly"),
    entry("/cars/", 0.9, "weekly"),
    ...Object.keys(categories).map((c) => entry(`/cars/${c}/`, 0.8, "weekly")),
    ...cars.map((c) => entry(`/cars/${c.slug}/`, 0.8)),
    entry("/locations/", 0.7),
    ...locations.map((l) => entry(`/locations/${l.slug}/`, 0.6)),
    entry("/faq/", 0.6),
    entry("/blog/", 0.5),
    ...posts.map((p) => ({ ...entry(`/blog/${p.slug}/`, 0.5, "yearly"), lastModified: new Date(p.updated ?? p.date) })),
    entry("/about/", 0.5, "yearly"),
    entry("/contact/", 0.6, "yearly"),
    entry("/terms/", 0.2, "yearly"),
    entry("/privacy-policy/", 0.2, "yearly"),
  ];
}
