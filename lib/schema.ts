// JSON-LD builders (HANDOVER §9)
import type { Car } from "./cars";
import { carPath } from "./cars";
import { absoluteUrl, site } from "./site";

export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "@id": `${site.url}/#business`,
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    logo: absoluteUrl("/images/brand/icon-512.png"),
    image: absoluteUrl("/images/cars/rolls-royce-cullinan/1.webp"),
    telephone: "+971506771216",
    email: site.email,
    priceRange: "AED 99 – AED 5,500 per day",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: "Dubai",
      addressRegion: "Dubai",
      addressCountry: site.address.countryCode,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsUrl,
    areaServed: ["Dubai", "Sharjah", "Al Ain"],
    sameAs: Object.values(site.social),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function carSchema(car: Car) {
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "Car"],
    name: `${car.name} ${car.year}`,
    brand: { "@type": "Brand", name: car.make },
    model: car.name,
    vehicleModelDate: String(car.year),
    bodyType: car.bodyType,
    vehicleTransmission: car.transmission,
    seatingCapacity: car.seats,
    numberOfDoors: car.doors,
    fuelType: car.fuelType,
    description: car.tagline,
    image: car.images.slice(0, 4).map((i) => absoluteUrl(i.src)),
    url: absoluteUrl(carPath(car)),
    offers: {
      "@type": "Offer",
      priceCurrency: "AED",
      price: car.price.day,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: car.price.day,
        priceCurrency: "AED",
        unitCode: "DAY",
      },
      availability: "https://schema.org/InStock",
      url: absoluteUrl(carPath(car)),
      seller: { "@id": `${site.url}/#business` },
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema(p: { title: string; description: string; path: string; image: string; date: string; updated?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    image: absoluteUrl(p.image),
    datePublished: p.date,
    dateModified: p.updated ?? p.date,
    mainEntityOfPage: absoluteUrl(p.path),
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@id": `${site.url}/#business` },
  };
}
