"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./icons";
import MobileMenu from "./MobileMenu";
import NavLinks, { type NavCategory } from "./NavLinks";

/**
 * Transparent, sticky header: logo on the left, menu on the right, no phone/WhatsApp buttons (they live in the
 * sticky contact bar and the mobile menu). Over the dark home-page video it uses white text; once the
 * page is scrolled it gets a soft ivory background so the links stay readable over light content.
 */
export default function HeaderShell({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const onDark = pathname === "/" && !scrolled; // home page: transparent over the video hero

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled ? "bg-canvas/95 shadow-[0_1px_0_var(--color-line)]" : "bg-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center gap-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Aldy Rent A Car – home">
          <Logo className={cn("h-7 w-auto transition", onDark && "brightness-0 invert")} />
          <span
            className={cn(
              "hidden border-l pl-2.5 text-[10px] leading-tight font-semibold tracking-[0.14em] uppercase transition-colors sm:block",
              onDark ? "border-white/30 text-white/75" : "border-line text-muted",
            )}
          >
            Rent A Car
            <br />
            Dubai
          </span>
        </Link>

        <div className="ml-auto hidden lg:block">
          <NavLinks categories={categories} onDark={onDark} />
        </div>

        <div className="ml-auto lg:hidden">
          <MobileMenu categories={categories} />
        </div>
      </div>
    </header>
  );
}
