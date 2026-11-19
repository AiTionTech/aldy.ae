import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbSchema } from "@/lib/schema";

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be inlined; content is generated from our own data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          {items.map((it, i) => (
            <li key={it.path} className="flex items-center gap-1">
              <ChevronRight className="size-3.5" aria-hidden />
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-ink">
                  {it.name}
                </span>
              ) : (
                <Link href={it.path} className="hover:text-ink">
                  {it.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(items)} />
    </>
  );
}

export function PageHeader({
  crumbs,
  eyebrow,
  title,
  intro,
  children,
}: {
  crumbs: { name: string; path: string }[];
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-white">
      <div className="container-x py-10 sm:py-14">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <p className="hero-in-2 eyebrow mt-6">{eyebrow}</p>}
        <h1 className={`hero-in-1 ${eyebrow ? "mt-2" : "mt-6"} max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-5xl`}>{title}</h1>
        {intro && <div className="hero-in-3 mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">{intro}</div>}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, action }: { eyebrow?: string; title: string; intro?: string; action?: React.ReactNode }) {
  return (
    <div data-reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="h-section mt-2">{title}</h2>
        {intro && <p className="mt-3 text-muted">{intro}</p>}
      </div>
      {action}
    </div>
  );
}
