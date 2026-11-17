import Link from "next/link";
import { ArrowRight, HeartHandshake, MapPin, ShieldCheck, Truck } from "lucide-react";
import { cars } from "@/lib/cars";
import { locations } from "@/lib/locations";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/common";

export const metadata = pageMeta({
  title: "About Aldy Rent A Car – Car Rental Company in Garhoud, Dubai",
  description:
    "Aldy Rent A Car LLC is a Dubai car rental company in Garhoud offering economy and luxury cars, simple WhatsApp booking and delivery across Dubai and Sharjah.",
  path: "/about/",
});

const values = [
  { Icon: HeartHandshake, title: "Customers first", text: "Clear prices, honest advice and a real person on the other end of WhatsApp." },
  { Icon: ShieldCheck, title: "Safety and comfort", text: "Recent models, cleaned and checked before every rental, with insurance included." },
  { Icon: Truck, title: "We come to you", text: "Delivery and collection at your home, hotel, office or the airport – 24 hours a day." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "About", path: "/about/" }]}
        eyebrow="About us"
        title="A Dubai car rental company that puts customers first"
        intro={`${site.legalName} rents economy and luxury cars to residents, visitors and businesses across Dubai and Sharjah.`}
      />
      <section className="container-x grid gap-12 py-14 lg:grid-cols-[1.3fr_1fr]">
        <div className="prose-aldy text-base leading-8">
          <p>
            From our office in Al Garhoud, minutes from Dubai International Airport, we help people get on the road quickly – whether that means an economical sedan for a month of commuting, a
            family SUV for a holiday or a Rolls-Royce for a wedding day.
          </p>
          <p>
            Our fleet covers everyday cars such as the Toyota Corolla, Nissan Sunny and Mitsubishi Attrage, comfortable SUVs like the Mazda CX-30 and Toyota Land Cruiser, executive cars including
            the Mercedes-Benz C300 and Tesla Model 3, and the Rolls-Royce Phantom, Ghost and Cullinan.
          </p>
          <p>
            We keep booking simple. Choose a car on our website, pick your dates and send the details to us on WhatsApp. We confirm availability and the final price, then deliver the car to you. You
            pay when you receive it – there is no online payment and no account to create.
          </p>
          <h2>Where we operate</h2>
          <p>
            We deliver to {locations.length} areas across Dubai and Sharjah, including both international airports. See all our <Link href="/locations/">delivery locations</Link>.
          </p>
        </div>
        <div className="space-y-4">
          {values.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-line p-6">
              <Icon className="size-6 text-brand-600" aria-hidden />
              <h2 className="mt-3 font-bold">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
            </div>
          ))}
          <div className="bg-glow rounded-3xl border border-line bg-sea-50 p-6">
            <p className="flex items-center gap-2 text-sm text-ink/70">
              <MapPin className="size-4" aria-hidden /> {site.address.full}
            </p>
            <Link href="/cars/" className="btn-primary mt-5">
              Browse our {cars.length} cars <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
