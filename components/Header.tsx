import Link from "next/link";
import { Phone } from "lucide-react";
import { site, waLink } from "@/lib/site";
import { carsInCategory, getCar } from "@/lib/cars";
import { formatAED } from "@/lib/format";
import { Logo, WhatsAppIcon } from "./icons";
import MobileMenu from "./MobileMenu";
import NavLinks, { type NavCategory } from "./NavLinks";

function navCategories(): NavCategory[] {
  const from = (c: "economy" | "luxury") => formatAED(Math.min(...carsInCategory(c).map((x) => x.price.day)));
  return [
    { href: "/cars/economy/", title: "Economy & everyday", text: `From ${from("economy")} / day`, img: getCar("mazda-cx30")?.images[0]?.mini ?? "" },
    { href: "/cars/luxury/", title: "Luxury", text: `From ${from("luxury")} / day`, img: getCar("rolls-royce-ghost")?.images[0]?.mini ?? "" },
  ];
}

/** Floating "pill" header – sticky, light, with active-page highlight and a Cars drop-down */
export default function Header() {
  const categories = navCategories();
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 rounded-full border border-line/80 bg-white/95 pr-2 pl-5 shadow-card sm:pl-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Aldy Rent A Car – home">
          <Logo className="h-7 w-auto" />
          <span className="hidden border-l border-line pl-2.5 text-[10px] leading-tight font-semibold tracking-[0.14em] text-muted uppercase sm:block">
            Rent A Car
            <br />
            Dubai
          </span>
        </Link>

        <NavLinks categories={categories} />

        <div className="flex items-center gap-1.5">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink/85 transition-colors hover:bg-brand-50 hover:text-brand-700 md:flex"
            aria-label={`Call ${site.phoneDisplay}`}
          >
            <span className="grid size-8 place-items-center rounded-full bg-brand-50 text-brand-600">
              <Phone className="size-4" aria-hidden />
            </span>
            <span className="hidden xl:inline">{site.phoneDisplay}</span>
          </a>
          <a href={waLink("Hello Aldy Rent A Car, I would like to rent a car.")} target="_blank" rel="noopener" className="btn-wa hidden px-4 py-2.5 sm:inline-flex">
            <WhatsAppIcon className="size-4" />
            Book on WhatsApp
          </a>
          <MobileMenu categories={categories} />
        </div>
      </div>
    </header>
  );
}
