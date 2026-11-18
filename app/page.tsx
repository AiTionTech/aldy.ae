import Link from "next/link";
import { ArrowRight, BadgeCheck, Briefcase, CalendarRange, Car as CarIcon, Check, Clock, Gem, House, MapPin, Plane, ShieldCheck, Sparkles, Truck, Wrench } from "lucide-react";
import { carsInCategory, cheapestDay, getCar, toCard, type Car } from "@/lib/cars";
import { locations, locationPath } from "@/lib/locations";
import { faqs } from "@/content/faqs";
import { formatAED } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import videoManifest from "@/data/video-manifest.json";
import { posts } from "@/content/blog";
import { reviews } from "@/content/testimonials";
import { businessSchema } from "@/lib/schema";
import { site, waLink } from "@/lib/site";
import FaqList from "@/components/FaqList";
import { Reveal } from "@/components/ui/car-motion";
import CarCard from "@/components/CarCard";
import VideoHero, { type HeroPoster, type HeroVideo } from "@/components/ui/video-hero";
import Testimonials from "@/components/Testimonials";
import BlogCard from "@/components/BlogCard";
import { Dunes, Squiggle } from "@/components/Decor";
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

const audiences = [
  { Icon: Plane, title: "Visitors & tourists", text: "Landing at DXB or Sharjah? Drive straight from the airport with your home licence or IDP.", href: "/cars/economy/", cta: "Economy cars" },
  { Icon: House, title: "Residents", text: "Monthly and long-term rentals cost far less per day – an easy alternative to buying.", href: "/cars/", cta: "Monthly prices" },
  { Icon: Briefcase, title: "Business & corporate", text: "Mercedes-Benz, Tesla and SUVs for client meetings, visiting teams and company use.", href: "/cars/mercedes-benz-c300/", cta: "Executive cars" },
  { Icon: Gem, title: "Weddings & events", text: "Rolls-Royce Phantom, Ghost and Cullinan for weddings, VIP guests and photo shoots.", href: "/cars/luxury/", cta: "Luxury cars" },
];

export default function Home() {
  // hero background: stock/Aldy video once added (npm run video), otherwise an on-location car photo
  const heroCar = getCar("toyota-land-cruiser")!.images[0];
  const hv = videoManifest.hero as { mp4: string; mp4Mobile: string; poster: string; posterSmall: string; w: number; h: number } | null;
  const heroPoster: HeroPoster = hv
    ? { src: hv.poster, srcSet: `${hv.posterSmall} 800w, ${hv.poster} ${hv.w}w`, w: hv.w, h: hv.h }
    : { src: heroCar.src, srcSet: `${heroCar.thumb} 600w, ${heroCar.md} 1000w, ${heroCar.src} ${heroCar.w}w`, w: heroCar.w, h: heroCar.h };
  const heroVideo: HeroVideo | undefined = hv ? { mp4: hv.mp4, mp4Mobile: hv.mp4Mobile } : undefined;
  const latestPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  // featured cars on the home page: a spread from everyday to luxury
  const featured = ["mazda-cx30", "toyota-corolla", "mitsubishi-xpander", "tesla-model-3-long-range", "toyota-land-cruiser", "rolls-royce-cullinan"]
    .map((slug) => getCar(slug))
    .filter((c): c is Car => Boolean(c))
    .map(toCard);
  const economyFrom = Math.min(...carsInCategory("economy").map((c) => c.price.day));
  const luxuryFrom = Math.min(...carsInCategory("luxury").map((c) => c.price.day));
  const homeFaqs = faqs.filter((f) => ["documents-required", "deposit", "fuel-salik", "minimum-age", "payment"].includes(f.slug));
  const topLocations = ["dubai-international-airport-dxb", "dubai-marina", "downtown", "business-bay", "jumeirah-village-circle", "al-barsha", "deira-city-center", "sharjah"]
    .map((s) => locations.find((l) => l.slug === s))
    .filter((l) => l != null);

  return (
    <>
      {/* HERO – background video under a dark overlay (idea from alfareedbm.com; components/ui/video-hero.tsx) */}
      <VideoHero
        poster={heroPoster}
        video={heroVideo}
        footer={<Dunes className="relative -mt-16" />}
      >
        <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
          Rent a car in Dubai,{" "}
          <span className="relative inline-block text-brand-300">
            delivered to you
            <Squiggle />
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">Economy to Rolls-Royce – book in one WhatsApp tap.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/cars/" className="btn-primary px-6 py-3.5">
            Browse Cars <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a href={waLink("Hello Aldy Rent A Car, I would like to rent a car.")} target="_blank" rel="noopener" className="btn-wa px-6 py-3.5">
            <WhatsAppIcon className="size-4" /> Chat on WhatsApp
          </a>
        </div>
        {/* keeps the hero the same height it had with the search bar (109 px desktop / 292 px phone) */}
        <div aria-hidden className="h-[292px] sm:h-[109px]" />
      </VideoHero>

      {/* TRUST POINTS – quiet line just below the hero */}
      <section className="bg-surface pt-2 pb-12">
        <div className="container-x">
          <div className="mx-auto max-w-4xl">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
              {["24-hour delivery", `${locations.length} delivery areas`, "Insurance included", "Pay on delivery"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="size-4 text-brand-600" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-surface pb-20">
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

      {/* CARS – featured car cards (same card as /cars/) */}
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
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <li key={c.slug}>
                <CarCard car={c} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHO WE RENT TO (idea from alfareedbm.com "Industries we serve") */}
      <section className="container-x mt-24">
        <SectionHeading eyebrow="Who we rent to" title="A car for every reason to be in Dubai" />
        <Reveal as="ul" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map(({ Icon, title, text, href, cta }, i) => (
            <li key={title} data-reveal className="group relative flex flex-col rounded-3xl border border-line bg-white p-6 shadow-card transition-shadow hover:shadow-lift">
              <div className="flex items-center justify-between">
                <span data-reveal-icon className={`grid size-12 place-items-center rounded-2xl ${i % 2 ? "bg-sea-50 text-sea-600" : "bg-brand-50 text-brand-600"}`}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="font-display text-3xl font-bold text-brand-500" aria-hidden>
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted">{text}</p>
              <Link href={href} className="mt-4 text-sm font-semibold text-brand-600 after:absolute after:inset-0 group-hover:text-brand-700">
                {cta} →
              </Link>
            </li>
          ))}
        </Reveal>
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

      {/* REVIEWS – real Google reviews only (content/testimonials.ts); hidden until 3+ are added */}
      <Testimonials reviews={reviews} rating={site.googleRating} reviewsUrl={site.mapsUrl} />

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

      {/* FROM THE BLOG (idea from alfareedbm.com "News & Insights") */}
      <section className="container-x mt-24">
        <SectionHeading
          eyebrow="From the blog"
          title="Tips for driving in the UAE"
          action={
            <Link href="/blog/" className="btn-ghost shrink-0">
              All articles <ArrowRight className="size-4" aria-hidden />
            </Link>
          }
        />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {latestPosts.map((p) => (
            <li key={p.slug}>
              <BlogCard post={p} headingLevel="h3" />
            </li>
          ))}
        </ul>
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
