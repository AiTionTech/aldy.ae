import { Clock, MapPin, Star } from "lucide-react";
import { pageMeta } from "@/lib/seo";
import { businessSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import ContactSection from "@/components/ContactSection";
import { JsonLd, PageHeader } from "@/components/common";

export const metadata = pageMeta({
  title: "Contact Aldy Rent A Car – WhatsApp, Phone & Office in Garhoud, Dubai",
  description: `Call or WhatsApp ${site.phoneDisplay}, email ${site.email} or visit our office in Al Fajer Business Centre, Garhoud, Dubai.`,
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader crumbs={[{ name: "Contact", path: "/contact/" }]} eyebrow="Contact" title="Get in touch" intro="Message us on WhatsApp for the quickest reply, or call, email or visit our office in Garhoud." />
      <ContactSection className="pt-14 pb-10" />
      <section className="container-x">
        <div data-reveal className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <MapPin className="size-5 text-brand-600" aria-hidden /> Our office
          </h2>
          <address className="mt-3 leading-7 text-muted not-italic">
            {site.legalName}
            <br />
            {site.address.line1}
            <br />
            {site.address.line2}
            <br />
            Dubai, United Arab Emirates
          </address>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted">
            <Clock className="size-4" aria-hidden /> {site.support}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={site.mapsUrl} target="_blank" rel="noopener" className="btn-primary">
              Open in Google Maps
            </a>
            <a href={site.mapsUrl} target="_blank" rel="noopener" className="btn-ghost">
              <Star className="size-4 fill-accent-500 text-accent-500" aria-hidden /> {site.googleRating} Google rating
            </a>
          </div>
        </div>
      </section>
      <JsonLd data={businessSchema()} />
    </>
  );
}
