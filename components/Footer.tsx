import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { cars, carPath } from "@/lib/cars";
import { FacebookIcon, InstagramIcon, LinkedInIcon, Logo, WhatsAppIcon, YouTubeIcon } from "./icons";
import { waLink } from "@/lib/site";
import { Dunes } from "./Decor";

const socials = [
  { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.social.youtube, label: "YouTube", Icon: YouTubeIcon },
  { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
];

export default function Footer() {
  const popular = cars.filter((c) => c.featured).slice(0, 6);
  return (
    <footer className="mt-24">
      <Dunes />
      <div className="bg-surface pb-24 md:pb-0">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="h-9 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
            Economy and luxury car rental in Dubai. Choose your car online and book in seconds on WhatsApp – we deliver to your door, hotel or the airport.
          </p>
          <ul className="mt-5 flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener" aria-label={label} className="grid size-10 place-items-center rounded-full border border-line bg-white text-ink/80 hover:text-ink">
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Popular cars</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {popular.map((c) => (
              <li key={c.slug}>
                <Link href={carPath(c)} className="hover:text-ink">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/cars/" className="font-semibold text-brand-600 hover:text-brand-700">
                View all cars →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {[
              ["/cars/economy/", "Economy cars"],
              ["/cars/luxury/", "Luxury cars"],
              ["/locations/", "Delivery locations"],
              ["/faq/", "FAQ"],
              ["/blog/", "Blog"],
              ["/about/", "About us"],
              ["/contact/", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <a href={site.phoneHref} className="flex items-start gap-2.5 hover:text-ink">
                <Phone className="mt-0.5 size-4 shrink-0" aria-hidden /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={waLink()} target="_blank" rel="noopener" className="flex items-start gap-2.5 hover:text-ink">
                <WhatsAppIcon className="mt-0.5 size-4 shrink-0" /> WhatsApp us
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-start gap-2.5 hover:text-ink">
                <Mail className="mt-0.5 size-4 shrink-0" aria-hidden /> {site.email}
              </a>
            </li>
            <li>
              <a href={site.mapsUrl} target="_blank" rel="noopener" className="flex items-start gap-2.5 hover:text-ink">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  {site.address.line1}, {site.address.line2}, Dubai
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p className="flex gap-4">
            <Link href="/terms/" className="hover:text-ink">
              Terms &amp; conditions
            </Link>
            <Link href="/privacy-policy/" className="hover:text-ink">
              Privacy policy
            </Link>
          </p>
        </div>
      </div>
      </div>
    </footer>
  );
}
