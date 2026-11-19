import Link from "next/link";
import { MapPin, Plane } from "lucide-react";
import { locations, locationsByGroup, locationPath } from "@/lib/locations";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/common";

export const metadata = pageMeta({
  title: `Car Rental Delivery Locations in Dubai & Sharjah (${locations.length} Areas) | Aldy Rent A Car`,
  description:
    "We deliver rental cars across Dubai and Sharjah – DXB and Sharjah airports, Dubai Marina, Downtown, Business Bay, JVC, Al Barsha and more. Find your area.",
  path: "/locations/",
});

export default function LocationsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Locations", path: "/locations/" }]}
        eyebrow={`${locations.length} delivery areas`}
        title="Car rental delivery across Dubai and Sharjah"
        intro="Tell us where you are and we'll bring the car to you – your home, hotel, office or the airport. Choose your area to see popular cars and local tips."
      />
      <section className="container-x space-y-12 py-12">
        {locationsByGroup().map(({ group, items }) =>
          items.length ? (
            <div key={group}>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                {group === "Airports" ? <Plane className="size-5 text-brand-600" aria-hidden /> : <MapPin className="size-5 text-brand-600" aria-hidden />}
                {group}
              </h2>
              <ul data-reveal-stagger className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((l) => (
                  <li key={l.slug}>
                    <Link href={locationPath(l)} className="group block h-full rounded-2xl border border-line p-4 transition hover:border-brand-300 hover:bg-brand-50/40 hover:shadow-card">
                      <span className="font-semibold">Car rental in {l.name}</span>
                      <span className="mt-1 line-clamp-2 block text-sm text-muted">{l.intro[0]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null,
        )}
      </section>
    </>
  );
}
