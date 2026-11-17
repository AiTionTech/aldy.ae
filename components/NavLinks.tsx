"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

export type NavCategory = { href: string; title: string; text: string; img: string };

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

/**
 * Desktop navigation (right-aligned): current page underlined in coral, a soft pill that slides behind
 * the hovered/focused link, and a "Cars" drop-down that opens on hover and keyboard focus.
 * `onDark` = header is transparent over the dark home-page video.
 */
export default function NavLinks({ categories, onDark }: { categories: NavCategory[]; onDark: boolean }) {
  const pathname = usePathname();
  // sliding hover highlight: position/width of the hovered link, relative to the wrapper
  const [hover, setHover] = useState<{ left: number; width: number } | null>(null);
  const track = (e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
    const li = e.currentTarget;
    setHover({ left: li.offsetLeft, width: li.offsetWidth });
  };
  return (
    <nav aria-label="Main" className="hidden lg:block">
      <div className="relative" onMouseLeave={() => setHover(null)} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHover(null)}>
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 rounded-full transition-[left,width,opacity] duration-300 ease-out",
            onDark ? "bg-white/15 ring-1 ring-white/25 ring-inset" : "bg-brand-50 ring-1 ring-brand-100 ring-inset",
            hover ? "opacity-100" : "opacity-0",
          )}
          style={hover ? { left: hover.left, width: hover.width } : undefined}
        />
      <ul className="relative flex items-center gap-1">
        {nav.map((n) => {
          const active = isActive(pathname, n.href);
          const cls = cn(
            "relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-[color,transform] duration-200 hover:-translate-y-px",
            "after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand-500 after:transition-transform",
            active ? "after:scale-x-100" : "after:scale-x-0",
            onDark ? (active ? "text-white" : "text-white/80 hover:text-white") : active ? "text-brand-700" : "text-ink/75 hover:text-ink",
          );
          if (n.href !== "/cars/")
            return (
              <li key={n.href} onMouseEnter={track} onFocus={track}>
                <Link href={n.href} className={cls} aria-current={active ? "page" : undefined}>
                  {n.label}
                </Link>
              </li>
            );
          return (
            <li key={n.href} className="group relative" onMouseEnter={track} onFocus={track}>
              <Link href={n.href} className={cls} aria-current={active ? "page" : undefined}>
                {n.label}
                <ChevronDown className="size-3.5 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" aria-hidden />
              </Link>
              {/* drop-down (aligned left so it never runs off the screen edge) */}
              <div className="invisible absolute top-full left-0 z-50 w-[30rem] pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="rounded-3xl border border-line bg-white p-3 text-ink shadow-lift">
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
      </div>
    </nav>
  );
}
