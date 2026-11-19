import Link from "next/link";
import { ArrowRight, Car as CarIcon, Clock, ShieldCheck, Sparkles, Truck, Wrench } from "lucide-react";
import { cheapestDay, getCar, toCard, type Car } from "@/lib/cars";
import { faqs } from "@/content/faqs";
import { formatAED } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import videoManifest from "@/data/video-manifest.json";
import { reviews } from "@/content/testimonials";
import { businessSchema } from "@/lib/schema";
import { site, waLink } from "@/lib/site";
import FaqList from "@/components/FaqList";
import CarCard from "@/components/CarCard";
import VideoHero, { type HeroPoster, type HeroVideo } from "@/components/ui/video-hero";
import Testimonials from "@/components/Testimonials";
import { Squiggle } from "@/components/Decor";
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
  { Icon: Clock, title: "24-hour delivery", text: "Day or night, to your home, hotel or the airport." },
  { Icon: ShieldCheck, title: "Insurance included", text: "Third-party liability and collision damage waiver." },
  { Icon: Sparkles, title: "Cars in top condition", text: "Recent models, cleaned and checked every rental." },
  { Icon: Wrench, title: "24/7 support", text: "A real team, a call or WhatsApp away." },
];

export default function Home() {
  // hero background: stock/Aldy video once added (npm run video), otherwise an on-location car photo
  const heroCar = getCar("toyota-land-cruiser")!.images[0];
  const hv = videoManifest.hero as { mp4: string; mp4Mobile: string; poster: string; posterSmall: string; w: number; h: number } | null;
  const heroPoster: HeroPoster = hv
    ? { src: hv.poster, srcSet: `${hv.posterSmall} 800w, ${hv.poster} ${hv.w}w`, w: hv.w, h: hv.h }
    : { src: heroCar.src, srcSet: `${heroCar.thumb} 600w, ${heroCar.md} 1000w, ${heroCar.src} ${heroCar.w}w`, w: heroCar.w, h: heroCar.h };
  const heroVideo: HeroVideo | undefined = hv ? { mp4: hv.mp4, mp4Mobile: hv.mp4Mobile } : undefined;
  // featured cars on the home page: a spread from everyday to luxury
  const featured = ["mazda-cx30", "toyota-corolla", "mitsubishi-xpander", "tesla-model-3-long-range", "toyota-land-cruiser", "rolls-royce-cullinan"]
    .map((slug) => getCar(slug))
    .filter((c): c is Car => Boolean(c))
    .map(toCard);
  const homeFaqs = faqs.filter((f) => ["documents-required", "deposit", "fuel-salik", "minimum-age"].includes(f.slug));

  return (
    <>
      {/* HERO – background video under a dark overlay (idea from alfareedbm.com; components/ui/video-hero.tsx) */}
      <VideoHero poster={heroPoster} video={heroVideo}>
        {/* entrance: headline moves only (keeps LCP), subtitle + buttons rise in after it (globals.css .hero-in-*) */}
        <h1 className="hero-in-1 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
          Rent a car in Dubai,{" "}
          <span className="relative inline-block text-accent-500">
            delivered to you
            <Squiggle />
          </span>
        </h1>
        <p className="hero-in-2 mt-6 max-w-xl text-lg leading-8 text-white/85">Economy to Rolls-Royce – book in one WhatsApp tap.</p>
        <div className="hero-in-3 mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/cars/" className="group/btn btn-primary px-6 py-3.5">
            Browse Cars <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />
          </Link>
          <a href={waLink("Hello Aldy Rent A Car, I would like to rent a car.")} target="_blank" rel="noopener" className="btn-wa px-6 py-3.5">
            <WhatsAppIcon className="size-4" /> Chat on WhatsApp
          </a>
        </div>
        {/* keeps the hero the same height it had with the search bar (109 px desktop / 292 px phone) */}
        <div aria-hidden className="h-[292px] sm:h-[109px]" />
      </VideoHero>

      {/* CARS – featured car cards (same card as /cars/); photos change on their own */}
      <section className="pt-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our fleet"
            title="Find your next car"
            intro="Daily, weekly and monthly prices. Weekly and monthly rentals cost much less per day."
            action={
              <Link href="/cars/" className="group/btn btn-ghost shrink-0">
                View all cars <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />
              </Link>
            }
          />
          <ul data-reveal-stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <li key={c.slug}>
                <CarCard car={c} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS – dark section (idea from alfareedbm.com "Industries we serve"): numbered sand circles on a line */}
      <section className="relative mt-24 overflow-hidden bg-charcoal py-20 text-white">
        {/* soft decorative rings */}
        <span className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full border border-white/5" aria-hidden />
        <span className="pointer-events-none absolute -top-10 -right-10 size-52 rounded-full border border-white/5" aria-hidden />
        <div className="container-x relative">
          <div data-reveal className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-accent-500 uppercase before:h-px before:w-6 before:bg-accent-500">How it works</p>
            <h2 className="h-section mt-2 text-white">Booked in three simple steps</h2>
            <p className="mt-3 text-white/70">No account, no online payment – just pick a car and message us.</p>
          </div>

          {/* steps one below the other: number circle on the left, card on the right, vertical line joining them */}
          <div className="relative mx-auto mt-12 max-w-4xl">
            <div data-reveal-line data-vertical className="absolute top-8 bottom-8 left-8 w-px bg-accent-500/40" aria-hidden />
            <ol data-reveal-stagger className="relative space-y-6">
              {steps.map(({ Icon, title, text }, i) => (
                <li key={title} className="group relative flex items-center gap-5 sm:gap-8">
                  <span className="relative grid size-16 shrink-0 place-items-center rounded-full bg-accent-500 font-display text-xl font-bold text-brand-700 ring-8 ring-charcoal transition-transform duration-500 group-hover:scale-110">
                    0{i + 1}
                  </span>
                  <div className="relative flex flex-1 items-start gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 transition-[transform,background-color,border-color,box-shadow] duration-500 group-hover:-translate-y-1 group-hover:translate-x-2 group-hover:border-accent-500/50 group-hover:bg-white/[0.08] group-hover:shadow-[0_18px_40px_-20px_rgb(0_0_0/0.6)] sm:items-center sm:gap-5 sm:p-6">
                    {/* sand bar that grows down the left edge on hover */}
                    <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-accent-500 transition-transform duration-500 group-hover:scale-y-100" aria-hidden />
                    <Icon className="mt-0.5 size-6 shrink-0 text-accent-500 transition-transform duration-500 group-hover:scale-125 sm:mt-0" aria-hidden />
                    <div>
                      <h3 className="text-lg font-bold">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/70">{text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* why Aldy – one compact row */}
          <ul data-reveal-stagger className="mt-14 grid gap-x-6 gap-y-5 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-accent-500" aria-hidden />
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/70">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* REVIEWS – real Google reviews only (content/testimonials.ts); hidden until 3+ are added */}
      <Testimonials reviews={reviews} rating={site.googleRating} reviewsUrl={site.mapsUrl} />

      {/* FAQ */}
      <section className="container-x mt-24 grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading eyebrow="FAQ" title="Good to know before you rent" />
          <Link href="/faq/" data-reveal className="btn-ghost mt-6">
            All questions <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div data-reveal>
          <FaqList items={homeFaqs} />
        </div>
      </section>

      <JsonLd data={businessSchema()} />
    </>
  );
}
