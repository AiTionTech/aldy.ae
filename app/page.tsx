import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarRange, Car as CarIcon, Clock, MapPin, ShieldCheck, Sparkles, Star, Truck, Wrench } from "lucide-react";
import { cars, carsInCategory, categories, cheapestDay, getCar, type Car } from "@/lib/cars";
import { locations, locationPath } from "@/lib/locations";
import { faqs } from "@/content/faqs";
import { formatAED } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import manifest from "@/data/image-manifest.json";
import { businessSchema } from "@/lib/schema";
import { site, waLink } from "@/lib/site";
import FaqList from "@/components/FaqList";
import QuickSearch from "@/components/QuickSearch";
import { CarLanes, MosaicHero, Reveal, type LaneCar } from "@/components/ui/car-motion";
import { Dunes, Squiggle, SunDot } from "@/components/Decor";
import { JsonLd, SectionHeading } from "@/components/common";
import { WhatsAppIcon } from "@/components/icons";

export const metadata = pageMeta({
  title: `Car Rental Dubai from ${formatAED(cheapestDay())}/day – Economy & Luxury Cars | Aldy Rent A Car`,
  description: `Rent a car in Dubai from ${formatAED(cheapestDay())} a day – Toyota, Mazda, Tesla, Mercedes-Benz and Rolls-Royce. Book in seconds on WhatsApp with delivery to your home, hotel or the airport.`,
  path: "/",
});

const steps = [
  { Icon: CarIcon, title: "Choose your car", text: "Browse our fleet, compare daily, weekly and monthly prices and pick your dates." },
  { Icon: WhatsAppIcon, title: "Send it on WhatsApp", text: "One tap sends your car, dates and location to our team. We confirm availability and the final price." },
  { Icon: Truck, title: "We deliver", text: "Your car arrives at your home, hotel, office or the airport. Pay on delivery – no online payment." },
];

const reasons = [
  { Icon: Clock, title: "24-hour delivery", text: "Day or night, we bring the car to you across Dubai and Sharjah.", tone: "brand" },
  { Icon: Wrench, title: "24/7 support", text: "Breakdown or question? Our team is a call or WhatsApp away.", tone: "sea" },
  { Icon: Sparkles, title: "Cars in top condition", text: "Recent models, cleaned and checked before every rental.", tone: "sea" },
  { Icon: ShieldCheck, title: "Insurance included", text: "Third-party liability and collision damage waiver on our listed cars.", tone: "brand" },
] as const;

const plans = [
  { Icon: Clock, tag: "1 day +", title: "Daily & weekly", text: "A weekend, a business trip or a holiday. Rent from one or two days, with lower rates once you reach a week.", bg: "bg-brand-50", icon: "bg-white text-brand-600" },
  { Icon: CalendarRange, tag: "28 days +", title: "Monthly", text: "For residents and long-stay visitors. Monthly prices cost far less per day, and you only need a few documents.", bg: "bg-sea-50", icon: "bg-white text-sea-600" },
  { Icon: BadgeCheck, tag: "3 months +", title: "Long term", text: "An affordable alternative to buying, with servicing, maintenance and 24/7 support included.", bg: "bg-surface", icon: "bg-white text-brand-600" },
];

export default function Home() {
  // photo wall: real on-location photos (the Rolls-Royce studio cut-outs would look out of place)
  const wall = ["mazda-cx30", "tesla-model-3-long-range", "toyota-land-cruiser", "mercedes-benz-c300", "jac-j7-red", "mitsubishi-xpander", "nissan-sunny", "jac-j7", "toyota-corolla", "mitsubishi-attrage", "jac-j7-black", "mg5"]
    .map((slug) => (manifest.cars as Record<string, { thumb: string; w: number; h: number }[]>)[slug]?.[0])
    .filter((p) => p != null)
    .map((p) => ({ src: p.thumb, w: 600, h: Math.round((600 * p.h) / p.w) }));
  const mosaic = [wall.slice(0, 4), wall.slice(4, 8), wall.slice(8, 12)];
  const lane = (c: Car): LaneCar => ({
    slug: c.slug,
    name: c.name,
    price: `${formatAED(c.price.day)}/day`,
    tag: categories[c.category].label,
    img: { src: c.images[0].thumb, w: 600, h: Math.round((600 * c.images[0].h) / c.images[0].w), alt: c.images[0].alt },
  });
  const byPrice = [...cars].sort((a, b) => a.price.day - b.price.day);
  const laneRows = [byPrice.filter((_, i) => i % 2 === 0).map(lane), byPrice.filter((_, i) => i % 2 === 1).map(lane)];
  const economyFrom = Math.min(...carsInCategory("economy").map((c) => c.price.day));
  const luxuryFrom = Math.min(...carsInCategory("luxury").map((c) => c.price.day));
  const homeFaqs = faqs.filter((f) => ["documents-required", "deposit", "fuel-salik", "minimum-age", "payment"].includes(f.slug));
  const topLocations = ["dubai-international-airport-dxb", "dubai-marina", "downtown", "business-bay", "jumeirah-village-circle", "al-barsha", "deira-city-center", "sharjah"]
    .map((s) => locations.find((l) => l.slug === s))
    .filter((l) => l != null);

  return (
    <>
      {/* HERO – tilted photo wall that straightens as you scroll (components/ui/car-motion.tsx) */}
      <MosaicHero
        columns={mosaic}
        footer={
          <>
            <div className="container-x relative z-10 pt-2 pb-4">
              <QuickSearch />
            </div>
            <Dunes className="-mt-10" />
          </>
        }
      >
        <a href={site.mapsUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold shadow-card">
          <span className="flex text-brand-500" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="size-3.5 fill-current" />
            ))}
          </span>
          {site.googleRating} rating on Google
        </a>
        <h1 className="mt-6 text-[2.6rem] leading-[1.02] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl">
          Rent a car in Dubai,{" "}
          <span className="relative inline-block text-brand-600">
            delivered to you
            <Squiggle />
          </span>
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
          From the {formatAED(cheapestDay())}-a-day Attrage to the Rolls-Royce Phantom. Pick your car and dates, send them in one WhatsApp tap, and we bring the keys to your door.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/cars/" className="btn-primary px-6 py-3.5">
            Browse {cars.length} cars <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a href={waLink("Hello Aldy Rent A Car, I would like to rent a car.")} target="_blank" rel="noopener" className="btn-wa px-6 py-3.5">
            <WhatsAppIcon className="size-4" /> Chat with us
          </a>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink/80">
          {["24-hour delivery", `${locations.length} delivery areas`, "Pay on delivery"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <SunDot /> {t}
            </li>
          ))}
        </ul>
      </MosaicHero>

      {/* CATEGORIES */}
      <section className="bg-surface pt-4 pb-20">
        <div className="container-x grid gap-5 sm:grid-cols-2">
          {[
            { href: "/cars/economy/", title: "Economy & everyday", text: "Sedans, SUVs, Tesla and Mercedes-Benz – for a day or a month.", from: economyFrom, img: getCar("mazda-cx30")!.images[0], contain: false },
            { href: "/cars/luxury/", title: "Luxury", text: "Rolls-Royce Phantom, Ghost and Cullinan for weddings, VIPs and special days.", from: luxuryFrom, img: getCar("rolls-royce-cullinan")!.images[0], contain: true },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="group overflow-hidden rounded-[2rem] border border-line bg-white shadow-card transition-shadow hover:shadow-lift">
              <div className={`relative aspect-[16/9] overflow-hidden ${c.contain ? "bg-brand-50" : "bg-sand"}`}>
                {c.contain && <div className="bg-sun absolute -right-10 -bottom-24 size-80 rounded-full" aria-hidden />}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.contain ? c.img.md : c.img.thumb}
                  alt=""
                  width={600}
                  height={450}
                  loading="lazy"
                  className={`relative size-full transition-transform duration-500 group-hover:scale-105 ${c.contain ? "scale-110 object-contain" : "object-cover"}`}
                />
                <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-card">From {formatAED(c.from)} / day</span>
              </div>
              <div className="flex items-end justify-between gap-4 p-6">
                <div>
                  <h2 className="text-2xl font-bold">{c.title}</h2>
                  <p className="mt-1 text-sm text-muted">{c.text}</p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <ArrowRight className="size-5" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CARS – gliding rows (components/ui/car-motion.tsx) */}
      <section className="pt-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our fleet"
            title="Find your next car"
            intro="Daily, weekly and monthly prices. Weekly and monthly rentals cost much less per day."
            action={
              <Link href="/cars/" className="btn-ghost shrink-0">
                View all cars <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
        </div>
        <CarLanes rows={laneRows} className="mt-6" />
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mt-24 overflow-hidden bg-sea-50 py-20">
        <div className="bg-sun absolute -top-40 -right-40 size-[28rem] rounded-full opacity-60" aria-hidden />
        <div className="container-x relative">
          <SectionHeading eyebrow="How it works" title="Booked in three simple steps" />
          <div className="relative mt-12">
          <div className="absolute top-7 right-[calc(33.333%-1.25rem)] left-7 hidden border-t-2 border-dashed border-sea-200 md:block" aria-hidden />
          <ol className="relative grid gap-6 md:grid-cols-3">
            {steps.map(({ Icon, title, text }, i) => (
              <li key={title} className="relative">
                <span className="relative mx-auto grid size-14 place-items-center rounded-full bg-white text-brand-600 shadow-card ring-4 ring-sea-50 md:mx-0">
                  <Icon className="size-6" />
                  <span className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">{i + 1}</span>
                </span>
                <div className="mt-5 rounded-3xl bg-white/80 p-6 text-center shadow-card md:text-left">
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="container-x mt-24 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Why Aldy"
            title="Car rental without the hassle"
            intro="A Dubai rental company in Garhoud, minutes from the airport. Clear prices, no online payment and a real team on WhatsApp."
          />
          <Link href="/about/" className="btn-ghost mt-6">
            About us <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <Reveal as="ul" className="grid gap-4 sm:grid-cols-2">
          {reasons.map(({ Icon, title, text, tone }) => (
            <li key={title} data-reveal className="rounded-3xl border border-line bg-white p-6 shadow-card">
              <span data-reveal-icon className={`grid size-11 place-items-center rounded-2xl ${tone === "brand" ? "bg-brand-50 text-brand-600" : "bg-sea-50 text-sea-600"}`}>
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted">{text}</p>
            </li>
          ))}
        </Reveal>
      </section>

      {/* PLANS */}
      <section className="container-x mt-24">
        <SectionHeading
          eyebrow="Flexible plans"
          title="Rent for a day, a month or longer"
          action={
            <a href={waLink("Hello Aldy Rent A Car, I would like a price for a monthly rental.")} target="_blank" rel="noopener" className="btn-ghost shrink-0">
              Ask for a monthly price <ArrowRight className="size-4" aria-hidden />
            </a>
          }
        />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map(({ Icon, tag, title, text, bg, icon }) => (
            <li key={title} className={`relative overflow-hidden rounded-[2rem] p-7 ${bg}`}>
              <div className="flex items-center justify-between">
                <span className={`grid size-12 place-items-center rounded-2xl shadow-card ${icon}`}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-ink/70">{tag}</span>
              </div>
              <h3 className="mt-6 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* LOCATIONS */}
      <section className="container-x mt-24">
        <div className="bg-glow relative overflow-hidden rounded-[2rem] border border-line bg-white p-6 sm:p-10">
          <SectionHeading
            eyebrow="Delivery"
            title="We deliver across Dubai and Sharjah"
            intro={`Car delivery to ${locations.length} areas, including both airports, Dubai Marina, Downtown and Sharjah.`}
            action={
              <Link href="/locations/" className="btn-ghost shrink-0">
                All locations <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <ul className="mt-8 flex flex-wrap gap-2">
            {topLocations.map((l) => (
              <li key={l.slug}>
                <Link href={locationPath(l)} className="chip">
                  <MapPin className="size-3.5 text-sea-600" aria-hidden /> {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x mt-24 grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading eyebrow="FAQ" title="Good to know before you rent" />
          <Link href="/faq/" className="btn-ghost mt-6">
            All questions <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <FaqList items={homeFaqs} />
      </section>

      {/* CTA */}
      <section className="container-x mt-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-50 via-sun-1 to-brand-100 px-6 py-12 sm:px-12 sm:py-16">
          <div className="bg-sun absolute -right-16 -bottom-32 size-96 rounded-full" aria-hidden />
          <div className="absolute top-8 right-1/3 hidden size-4 rounded-full bg-sea-200 sm:block" aria-hidden />
          <div className="relative max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Ready to drive? Send us your dates.</h2>
            <p className="mt-4 text-ink/70">Our team replies on WhatsApp with availability and your final price – usually within minutes.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={waLink("Hello Aldy Rent A Car, I would like to rent a car.")} target="_blank" rel="noopener" className="btn-wa px-6 py-3.5">
                <WhatsAppIcon className="size-4" /> WhatsApp {site.phoneDisplay}
              </a>
              <a href={site.phoneHref} className="btn-ghost px-6 py-3.5">
                Call us
              </a>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={businessSchema()} />
    </>
  );
}
