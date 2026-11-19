import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lightbulb, MapPin, Phone, Truck } from "lucide-react";
import { getCar, cheapestDay, type Car } from "@/lib/cars";
import { getLocation, locations, locationPath } from "@/lib/locations";
import { formatAED } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { site, waLink } from "@/lib/site";
import CarCard from "@/components/CarCard";
import { PageHeader } from "@/components/common";
import { WhatsAppIcon } from "@/components/icons";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => locations.map((l) => ({ slug: l.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const l = getLocation((await params).slug);
  if (!l) return {};
  return pageMeta({
    title: `Car Rental in ${l.name} – Delivery from ${formatAED(cheapestDay())}/day | Aldy Rent A Car`,
    description: `Rent a car with delivery in ${l.name}. ${l.intro[0].split(". ")[0]}. Economy and luxury cars, booked on WhatsApp.`.slice(0, 300),
    path: locationPath(l),
  });
}

export default async function LocationPage({ params }: Params) {
  const l = getLocation((await params).slug);
  if (!l) notFound();
  const popular = l.popular.map(getCar).filter((c): c is Car => !!c);
  const nearby = locations.filter((x) => x.group === l.group && x.slug !== l.slug).slice(0, 8);
  const wa = waLink(`Hello Aldy Rent A Car, I would like to rent a car with delivery to ${l.name}.`);
  const query = `?location=${encodeURIComponent(l.name)}`;

  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Locations", path: "/locations/" },
          { name: l.name, path: locationPath(l) },
        ]}
        eyebrow={l.group}
        title={`Car rental in ${l.name}`}
        intro={l.intro[0]}
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={wa} target="_blank" rel="noopener" className="btn-wa">
            <WhatsAppIcon className="size-4" /> Book delivery to {l.name}
          </a>
          <a href={site.phoneHref} className="btn-ghost">
            <Phone className="size-4" aria-hidden /> {site.phoneDisplay}
          </a>
        </div>
      </PageHeader>

      <section className="container-x grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="prose-aldy">
          <h2>Renting a car in {l.name}</h2>
          <p>{l.intro[1]}</p>
          <p>
            Choose any car from our fleet – from the {formatAED(cheapestDay())}-a-day Mitsubishi Attrage to the Rolls-Royce Phantom – then send us your dates on WhatsApp. We confirm availability, the
            delivery time and the final price before you pay anything.
          </p>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-line p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <Truck className="size-5 text-brand-600" aria-hidden /> Delivery to {l.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              We deliver and collect at your home, hotel or office in {l.name}. Delivery is available 24 hours a day; any delivery fee and the exact time are confirmed with your booking on WhatsApp.
            </p>
          </div>
          <div className="rounded-3xl bg-brand-50 p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <Lightbulb className="size-5 text-brand-600" aria-hidden /> Local tip
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/80">{l.tip}</p>
          </div>
        </div>
      </section>

      <section className="container-x">
        <h2 className="h-section">Popular cars in {l.name}</h2>
        <ul data-reveal-stagger className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((c) => (
            <li key={c.slug}>
              <CarCard car={c} query={query} />
            </li>
          ))}
        </ul>
        <Link href="/cars/" className="btn-ghost mt-8">
          See all cars
        </Link>
      </section>

      {nearby.length > 0 && (
        <section className="container-x mt-16">
          <h2 className="text-xl font-bold">Other areas we deliver to</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {nearby.map((n) => (
              <li key={n.slug}>
                <Link href={locationPath(n)} className="chip">
                  <MapPin className="size-3.5 text-accent-700" aria-hidden /> {n.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/locations/" className="flex items-center rounded-full px-4 py-2 text-sm font-semibold text-brand-600">
                All locations →
              </Link>
            </li>
          </ul>
        </section>
      )}
    </>
  );
}
