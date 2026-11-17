import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

type PageMeta = {
  title: string; // full title – kept unique per page
  description: string;
  path: string; // e.g. /cars/mazda-cx30/
  image?: string; // absolute path under /public
  type?: "website" | "article";
};

const DEFAULT_IMAGE = "/images/cars/rolls-royce-cullinan/1.webp";

export function pageMeta({ title, description, path, image = DEFAULT_IMAGE, type = "website" }: PageMeta): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type,
      url: absoluteUrl(path),
      siteName: site.name,
      title,
      description,
      locale: "en_AE",
      images: [{ url: absoluteUrl(image) }],
    },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(image)] },
  };
}
