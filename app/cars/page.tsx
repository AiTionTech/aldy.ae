import { cars, cheapestDay, makes, toCard } from "@/lib/cars";
import { formatAED } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import CarFilters from "@/components/CarFilters";
import { PageHeader } from "@/components/common";

export const metadata = pageMeta({
  title: `Rent a Car in Dubai – ${cars.length} Cars from ${formatAED(cheapestDay())}/day | Aldy Rent A Car`,
  description: `Browse all ${cars.length} rental cars in Dubai – economy sedans, SUVs, Tesla, Mercedes-Benz and Rolls-Royce. Compare daily, weekly and monthly prices and book on WhatsApp.`,
  path: "/cars/",
});

export default function CarsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Cars", path: "/cars/" }]}
        eyebrow="Our fleet"
        title="Rent a car in Dubai"
        intro={`From the ${formatAED(cheapestDay())}-a-day Mitsubishi Attrage to the Rolls-Royce Phantom. Pick a car, choose your dates and send your booking on WhatsApp.`}
      />
      <section className="container-x py-8">
        <CarFilters cars={cars.map(toCard)} makes={makes()} />
      </section>
    </>
  );
}
