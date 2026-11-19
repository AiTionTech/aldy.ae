import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site, waLink } from "@/lib/site";
import { FacebookIcon, InstagramIcon, LinkedInIcon, Logo, WhatsAppIcon, YouTubeIcon } from "./icons";

/*
  Dark footer (grey theme): brand row with WhatsApp button + socials, 4 link columns
  (4 on desktop, 2 on tablet, stacked on mobile), divider, bottom bar.
  Links go to real pages only (no empty pages – HANDOVER §13).
*/

// Instagram first, as in the brief. X / TikTok: add their URLs to site.social in lib/site.ts when Aldy has them.
const socials = [
  { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.social.youtube, label: "YouTube", Icon: YouTubeIcon },
  { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
];

const groups: { title: string; links: [href: string, label: string][] }[] = [
  {
    title: "Company",
    // TODO: add "Careers" once a careers page exists
    links: [
      ["/about/", "About us"],
      ["/contact/", "Contact"],
      ["/blog/", "Blog"],
      ["/locations/", "Delivery areas"],
    ],
  },
  {
    title: "Rentals",
    // TODO: add "SUV" and "Monthly rentals" once those pages / filters exist
    links: [
      ["/cars/economy/", "Economy cars"],
      ["/cars/luxury/", "Luxury cars"],
      ["/cars/", "All cars"],
      ["/locations/dubai-international-airport-dxb/", "Airport delivery"],
    ],
  },
  {
    title: "Support",
    links: [
      ["/faq/", "FAQs"],
      ["/terms/", "Rental terms"],
      ["/faq/#insurance", "Insurance"],
      ["/terms/#changes-and-cancellations", "Cancellation policy"],
    ],
  },
];

const link = "transition-colors duration-300 hover:text-accent-500";

export default function Footer() {
  return (
    <footer className="mt-24 bg-footer-bg text-footer-text">
      <div className="container-x pt-14 pb-10">
        {/* brand row */}
        <div data-reveal className="flex flex-col gap-6 border-b border-footer-line pb-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <Logo className="h-9 w-auto brightness-0 invert" />
            <p className="mt-4 text-sm leading-6">
              Economy and luxury car rental in Dubai. Choose your car online and book in seconds on WhatsApp – we deliver to your door, hotel or the airport.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <a href={waLink("Hello Aldy Rent A Car, I would like to rent a car.")} target="_blank" rel="noopener" className="btn-primary w-fit px-6 py-3.5">
              <WhatsAppIcon className="size-4" /> Chat on WhatsApp
            </a>
            <ul className="flex gap-2" aria-label="Aldy Rent A Car on social media">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${label} (opens in a new tab)`}
                    className="grid size-10 place-items-center rounded-full border border-footer-line text-footer-text transition-colors duration-300 hover:border-accent-500 hover:text-accent-500"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* link columns */}
        <div data-reveal-stagger className="grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <h2 className="text-sm font-semibold text-white">{g.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {g.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className={link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-sm font-semibold text-white">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={site.phoneHref} className={`flex items-start gap-2.5 ${link}`}>
                  <Phone className="mt-0.5 size-4 shrink-0" aria-hidden /> {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={waLink()} target="_blank" rel="noopener" className={`flex items-start gap-2.5 ${link}`}>
                  <WhatsAppIcon className="mt-0.5 size-4 shrink-0" /> WhatsApp {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className={`flex items-start gap-2.5 ${link}`}>
                  <Mail className="mt-0.5 size-4 shrink-0" aria-hidden /> {site.email}
                </a>
              </li>
              <li>
                <a href={site.mapsUrl} target="_blank" rel="noopener" className={`flex items-start gap-2.5 ${link}`}>
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    {site.address.line1}, {site.address.line2}, Dubai
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
                {/* TODO: show the office opening hours here once Aldy confirms them (add to lib/site.ts + lib/schema.ts) */}
                <span>24/7 support · 24-hour delivery</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-footer-line bg-footer-bottom">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-footer-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/privacy-policy/" className={link}>
              Privacy Policy
            </Link>
            <Link href="/terms/" className={link}>
              Terms &amp; Conditions
            </Link>
            {/* TODO: link "AiTion Labs" to the company website once the URL is confirmed */}
            <span>
              Powered by <span className="font-semibold text-footer-text">AiTion Labs</span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
