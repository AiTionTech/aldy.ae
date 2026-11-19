"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./icons";
import MobileMenu from "./MobileMenu";
import NavLinks, { type NavCategory } from "./NavLinks";

/**
 * Sticky header: logo on the left, menu on the right, no phone/WhatsApp buttons (they live in the sticky
 * contact bar and the mobile menu). White text always. Charcoal bar on every page – except over the home
 * video hero ([data-hero]), where it stays transparent until the hero has scrolled away.
 */
export default function HeaderShell({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // home page: transparent over the video hero, charcoal once the hero has scrolled away
  const [overHero, setOverHero] = useState(pathname === "/");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      setOverHero(!!hero && window.scrollY < hero.offsetHeight - 64);
    };
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  const onDark = true; // white text everywhere: over the dark hero video and on the charcoal bar

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        overHero ? "bg-transparent" : "bg-charcoal",
        !overHero && scrolled && "shadow-[0_8px_24px_-12px_rgb(0_0_0/0.45)]",
      )}
    >
      <div className="container-x flex h-16 items-center gap-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Aldy Rent A Car – home">
          <Logo className="h-7 w-auto brightness-0 invert" />
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
