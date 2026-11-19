import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, DoorOpen, FileText, Fuel, Gauge, Luggage, Settings2, ShieldCheck, Users, Wallet } from "lucide-react";
import { cars, carsInCategory, categories, getCar, relatedCars, toShowcase, type Car, type Category } from "@/lib/cars";
import { locationNames } from "@/lib/locations";
import { formatAED } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { carSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { enquiryLink } from "@/lib/whatsapp";
import CarCard from "@/components/CarCard";
import CarShowcase from "@/components/CarShowcase";
import { Breadcrumbs, JsonLd, PageHeader } from "@/components/common";

type Params = { params: Promise<{ slug: string }> };

const isCategory = (s: string): s is Category => s in categories;

export const dynamicParams = false;

export function generateStaticParams() {
  return [...Object.keys(categories), ...cars.map((c) => c.slug)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (isCategory(slug)) {
    const list = carsInCategory(slug);
    const from = Math.min(...list.map((c) => c.price.day));
    return pageMeta({
      title:
        slug === "luxury"
          ? `Luxury Car Rental Dubai – Rolls-Royce from ${formatAED(from)}/day | Aldy Rent A Car`
          : `Economy Car Rental Dubai – from ${formatAED(from)}/day | Aldy Rent A Car`,
      description:
        slug === "luxury"
          ? `Rent a Rolls-Royce Phantom, Ghost or Cullinan in Dubai from ${formatAED(from)} a day. Delivered to your hotel or home – book on WhatsApp.`
          : `Affordable car rental in Dubai from ${formatAED(from)} a day: ${list.slice(-4).map((c) => c.name).join(", ")} and more. Daily, weekly and monthly rates.`,
      path: `/cars/${slug}/`,
      image: list[0]?.images[0]?.src,
    });
  }
  const car = getCar(slug);
  if (!car) return {};
  return pageMeta({
    title: `Rent ${car.name} ${car.year} in Dubai – ${formatAED(car.price.day)}/day | Aldy Rent A Car`,
    description: `${car.tagline} Rent the ${car.name} ${car.year} in Dubai from ${formatAED(car.price.day)} a day${
      car.price.month ? ` or ${formatAED(car.price.month)} a month` : ""
    }. Book on WhatsApp with delivery to your door.`,
    path: `/cars/${car.slug}/`,
    image: car.images[0]?.src,
  });
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  if (isCategory(slug)) return <CategoryPage category={slug} />;
  const car = getCar(slug);
  if (!car) notFound();
  return <CarPage car={car} />;
}

function CategoryPage({ category }: { category: Category }) {
  const meta = categories[category];
  const list = carsInCategory(category);
  const other: Category = category === "luxury" ? "economy" : "luxury";
  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Cars", path: "/cars/" },
          { name: meta.label, path: `/cars/${category}/` },
        ]}
        eyebrow={`${list.length} cars`}
        title={category === "luxury" ? "Luxury car rental in Dubai" : "Economy car rental in Dubai"}
        intro={meta.intro}
      />
      <section className="container-x py-12">
        <h2 className="sr-only">{meta.title}</h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => (
            <li key={c.slug}>
              <CarCard car={c} priority={i < 3} />
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={`/cars/${other}/`} className="btn-ghost">
            See {categories[other].label.toLowerCase()} cars
          </Link>
          <Link href="/cars/" className="btn-ghost">
            All cars
          </Link>
        </div>
      </section>
    </>
  );
}

const DOCUMENTS = {
  "UAE residents": ["UAE driving licence", "Emirates ID", "Passport copy with visa"],
  Tourists: ["Passport with entry stamp / visit visa", "Home country driving licence", "International Driving Permit (if required)"],
};

function CarPage({ car }: { car: Car }) {
  const specs = [
    { Icon: Users, label: "Seats", value: car.seats },
    { Icon: DoorOpen, label: "Doors", value: car.doors },
    { Icon: Settings2, label: "Gearbox", value: car.transmission },
    { Icon: Fuel, label: "Fuel", value: car.fuelType },
    ...(car.bags ? [{ Icon: Luggage, label: "Bags", value: car.bags }] : []),
    ...(car.engine ? [{ Icon: Gauge, label: "Engine", value: car.engine }] : []),
  ];
  const priceRows: [string, number | null][] = [
    ["Daily", car.price.day],
    ["Weekly", car.price.week],
    ["Monthly", car.price.month],
  ];
  const related = relatedCars(car);

  return (
    <>
      <div className="container-x pt-6 pb-4">
        <Breadcrumbs
          items={[
            { name: "Cars", path: "/cars/" },
            { name: categories[car.category].label, path: `/cars/${car.category}/` },
            { name: car.name, path: `/cars/${car.slug}/` },
          ]}
        />
        <div className="mt-5">
          <p className="eyebrow">
            {car.bodyType} · {car.year}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            {car.name} <span className="text-muted">{car.year}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-muted">{car.tagline}</p>
        </div>
      </div>

      <div className="container-x pb-6">
        <CarShowcase car={toShowcase(car)} locations={locationNames()}>
          {/* Specs */}
          <section className="mt-10" aria-labelledby="specs">
            <h2 id="specs" className="text-xl font-bold">
              Specifications
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map(({ Icon, label, value }) => (
                <li key={label} className="flex items-center gap-3 rounded-2xl border border-line p-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">{label}</span>
                    <span className="block truncate text-sm font-semibold">{value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Prices */}
          <section className="mt-10" aria-labelledby="prices">
            <h2 id="prices" className="text-xl font-bold">
              Prices
            </h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-line">
                  {priceRows.map(([label, p]) => (
                    <tr key={label}>
                      <th scope="row" className="bg-canvas px-4 py-3 text-left font-medium text-muted">
                        {label}
                      </th>
                      <td className="px-4 py-3 text-right font-semibold">
                        {p != null ? (
                          `${formatAED(p)} / ${label === "Daily" ? "day" : label === "Weekly" ? "week" : "month"}`
                        ) : (
                          <a href={enquiryLink(`the ${label.toLowerCase()} price for the ${car.name}`)} target="_blank" rel="noopener" className="text-wa underline underline-offset-2">
                            Ask for price
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="bg-canvas px-4 py-3 text-left font-medium text-muted">
                      Security deposit
                    </th>
                    <td className="px-4 py-3 text-right font-semibold">{car.deposit != null ? formatAED(car.deposit) : "On request"}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="bg-canvas px-4 py-3 text-left font-medium text-muted">
                      Minimum rental
                    </th>
                    <td className="px-4 py-3 text-right font-semibold">
                      {car.minDays} {car.minDays === 1 ? "day" : "days"}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="bg-canvas px-4 py-3 text-left font-medium text-muted">
                      Mileage
                    </th>
                    <td className="px-4 py-3 text-right font-semibold">
                      {site.kmRule}
                      {car.extraKmFee && <span className="block text-xs font-normal text-muted">{car.extraKmFee}</span>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted">Prices in UAE dirhams. Fuel and Salik tolls are not included. The deposit is refunded after the rental.</p>
          </section>

          {/* About */}
          <section className="mt-10" aria-labelledby="about-car">
            <h2 id="about-car" className="text-xl font-bold">
              About the {car.name}
            </h2>
            <div className="prose-aldy mt-3">
              {car.description.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </section>

          <div data-reveal-stagger className="mt-6 grid gap-6 sm:grid-cols-2">
            <section className="rounded-2xl border border-line p-5" aria-labelledby="features">
              <h2 id="features" className="flex items-center gap-2 font-bold">
                <Gauge className="size-4 text-brand-600" aria-hidden /> Features
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {car.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden /> {h}
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-2xl border border-line p-5" aria-labelledby="included">
              <h2 id="included" className="flex items-center gap-2 font-bold">
                <ShieldCheck className="size-4 text-brand-600" aria-hidden /> Included
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {[...car.included, "Delivery to your location (fee may apply)", "24/7 roadside support"].map((h) => (
                  <li key={h} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden /> {h}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-line p-5" aria-labelledby="docs">
            <h2 id="docs" className="flex items-center gap-2 font-bold">
              <FileText className="size-4 text-brand-600" aria-hidden /> Documents required
            </h2>
            <div className="mt-3 grid gap-5 text-sm sm:grid-cols-2">
              {Object.entries(DOCUMENTS).map(([who, list]) => (
                <div key={who}>
                  <h3 className="font-semibold">{who}</h3>
                  <ul className="mt-2 space-y-1.5 text-muted">
                    {list.map((d) => (
                      <li key={d}>• {d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted">
              <Wallet className="size-3.5" aria-hidden /> Minimum driver age {site.minAge}. GCC nationals: national ID and driving licence.{" "}
              <Link href="/faq/" className="font-medium text-brand-600 underline">
                More in our FAQ
              </Link>
            </p>
          </section>
        </CarShowcase>
      </div>

      <section className="container-x mt-16" aria-labelledby="related">
        <h2 id="related" className="h-section">
          You may also like
        </h2>
        <ul data-reveal-stagger className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((c) => (
            <li key={c.slug}>
              <CarCard car={c} />
            </li>
          ))}
        </ul>
      </section>

      <JsonLd data={carSchema(car)} />
    </>
  );
}
