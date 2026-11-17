import { Clock, MapPin, Star } from "lucide-react";
import { pageMeta } from "@/lib/seo";
import { businessSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import ContactSection from "@/components/ContactSection";
import { JsonLd, PageHeader } from "@/components/common";
import { FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from "@/components/icons";

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
      <section className="container-x grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-surface p-6 sm:p-8">
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
              <Star className="size-4 fill-amber-500 text-amber-500" aria-hidden /> {site.googleRating} Google rating
            </a>
          </div>
        </div>
        <div className="rounded-3xl border border-line p-6 sm:p-8">
          <h2 className="text-xl font-bold">Follow us</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {[
              { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
              { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
              { href: site.social.youtube, label: "YouTube", Icon: YouTubeIcon },
              { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
            ].map(({ href, label, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener" className="flex items-center gap-3 rounded-2xl border border-line p-4 text-sm font-semibold hover:border-brand-300 hover:bg-brand-50/40">
                  <Icon className="size-5" /> {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <JsonLd data={businessSchema()} />
    </>
  );
}
