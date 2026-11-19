// Single source of truth for business details (HANDOVER §3). Change here, not in components.
export const site = {
  name: "Aldy Rent A Car",
  legalName: "Aldy Rent A Car LLC",
  url: "https://aldy.ae",
  phoneDisplay: "+971 50 677 1216",
  phoneHref: "tel:+971506771216",
  whatsappNumber: "971506771216",
  email: "info@aldy.ae",
  address: {
    line1: "Prime Executive Business Center, Office No 78",
    line2: "Al Fajer Business Centre Building, Garhoud",
    city: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    full: "Prime Executive Business Center, Al Fajer Business Centre Building, Office No 78, Garhoud, Dubai",
  },
  // Approximate coordinates for Al Garhoud – confirm the exact pin with Aldy
  geo: { lat: 25.2435, lng: 55.3462 },
  mapsUrl: "https://goo.gl/maps/X7bTbzSXR8eg3u6Q7",
  googleRating: 4.8,
  // Office opening hours are not known – the old site only promised 24-hour delivery and 24/7 support.
  // Add `openingHours` (e.g. "Mo-Su 09:00-21:00") here and in lib/schema.ts once Aldy confirms.
  support: "24/7 support and 24-hour car delivery",
  social: {
    facebook: "https://www.facebook.com/aldyrentacar",
    instagram: "https://www.instagram.com/aldyrentacar/",
    youtube: "https://youtube.com/@AldyRentACar",
    linkedin: "https://www.linkedin.com/company/aldy-rent-a-car/",
    // TODO: add `x` and `tiktok` URLs here if Aldy has these accounts – the footer shows every entry automatically
  },
  // Mileage rule shown everywhere (old site also showed "4500 km / month" – awaiting confirmation)
  kmRule: "250 km per day",
  minAge: 23,
} as const;

// Main menu (user choice 19 Nov 2026): Locations is left out because the booking form already has the area
// picker, and Blog moved to the footer. Both pages stay live and are linked from the footer.
export const nav = [
  { href: "/", label: "Home" },
  { href: "/cars/", label: "Cars" },
  { href: "/faq/", label: "FAQ" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

export const waLink = (text?: string) =>
  `https://wa.me/${site.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const absoluteUrl = (path: string) => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
