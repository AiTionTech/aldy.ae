"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { nav } from "@/lib/site";

export type NavCategory = { href: string; title: string; text: string; img: string };

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

/** Desktop navigation: active-page pill + "Cars" drop-down (opens on hover and keyboard focus, no JS needed) */
export default function NavLinks({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-0.5 rounded-full bg-surface/80 p-1">
        {nav.map((n) => {
          const active = isActive(pathname, n.href);
          const cls = `flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            active ? "bg-white text-brand-700 shadow-card" : "text-ink/75 hover:bg-white/70 hover:text-ink"
          }`;
          if (n.href !== "/cars/")
            return (
              <li key={n.href}>
                <Link href={n.href} className={cls} aria-current={active ? "page" : undefined}>
                  {n.label}
                </Link>
              </li>
            );
          return (
            <li key={n.href} className="group relative">
              <Link href={n.href} className={cls} aria-current={active ? "page" : undefined}>
                {n.label}
                <ChevronDown className="size-3.5 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" aria-hidden />
              </Link>
              {/* drop-down */}
              <div className="invisible absolute top-full left-1/2 z-50 w-[30rem] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="rounded-3xl border border-line bg-white p-3 shadow-lift">
                  <ul className="grid grid-cols-2 gap-2">
                    {categories.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="group/item block overflow-hidden rounded-2xl bg-surface transition hover:bg-brand-50">
                          <span className="block aspect-[16/9] overflow-hidden bg-sand">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={c.img} alt="" width={200} height={113} loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover/item:scale-105" />
                          </span>
                          <span className="block p-3">
                            <span className="block text-sm font-semibold">{c.title}</span>
                            <span className="block text-xs text-muted">{c.text}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href="/cars/" className="mt-2 flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50">
                    Browse all cars <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
