"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Car, ChevronRight, CircleHelp, Home, Info, MapPin, Menu, Phone, Send, X } from "lucide-react";
import { nav, site, waLink } from "@/lib/site";
import { Logo, WhatsAppIcon } from "./icons";
import type { NavCategory } from "./NavLinks";

const ICONS: Record<string, typeof Car> = { "/": Home, "/cars/": Car, "/locations/": MapPin, "/faq/": CircleHelp, "/blog/": BookOpen, "/about/": Info, "/contact/": Send };

export default function MobileMenu({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [{ href: "/", label: "Home" }, ...nav];
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-full bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50">
          <button className="animate-[fade-in_.2s_ease-out] absolute inset-0 bg-ink/25" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div
            className="animate-[slide-in_.28s_cubic-bezier(.2,.8,.2,1)] bg-glow absolute inset-y-2 right-2 flex w-[min(22rem,calc(100vw-1rem))] flex-col overflow-y-auto rounded-[2rem] border border-line bg-canvas p-5 shadow-lift"
            onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
          >
            <div className="flex items-center justify-between">
              <Logo className="h-7 w-auto" />
              <button onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full border border-line bg-white" aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>

            <nav aria-label="Mobile" className="mt-4">
              <ul className="space-y-1">
                {links.map((n) => {
                  const Icon = ICONS[n.href] ?? ChevronRight;
                  const on = active(n.href);
                  return (
                    <li key={n.href}>
                      <Link
                        href={n.href}
                        aria-current={on ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-base font-semibold transition-colors ${on ? "bg-white text-brand-700 shadow-card" : "hover:bg-white/70"}`}
                      >
                        <span className={`grid size-9 place-items-center rounded-xl ${on ? "bg-brand-50 text-brand-600" : "bg-white text-ink/70"}`}>
                          <Icon className="size-4" aria-hidden />
                        </span>
                        {n.label}
                        <ChevronRight className="ml-auto size-4 text-muted" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <ul className="mt-4 grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="block overflow-hidden rounded-2xl border border-line bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.img} alt="" width={200} height={113} loading="lazy" className="aspect-[16/9] w-full object-cover" />
                    <span className="block p-2.5">
                      <span className="block text-sm leading-tight font-semibold">{c.title}</span>
                      <span className="block text-xs text-muted">{c.text}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-2 pt-4">
              <a href={waLink("Hello Aldy Rent A Car, I would like to rent a car.")} target="_blank" rel="noopener" className="btn-wa w-full py-3.5">
                <WhatsAppIcon className="size-4" /> Book on WhatsApp
              </a>
              <a href={site.phoneHref} className="btn-ghost w-full py-3.5">
                <Phone className="size-4" aria-hidden /> {site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
