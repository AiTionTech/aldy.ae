import rawCars from "@/data/cars.json";
import manifest from "@/data/image-manifest.json";
import { carContent, jacColours } from "@/content/cars";
import type { Prices } from "./pricing";

export type Category = "economy" | "luxury";

export const categories: Record<Category, { label: string; title: string; intro: string }> = {
  economy: {
    label: "Economy",
    title: "Economy & everyday cars",
    intro:
      "Reliable, fuel-efficient cars for daily driving, business trips and monthly rentals – from compact sedans to SUVs and executive saloons.",
  },
  luxury: {
    label: "Luxury",
    title: "Luxury cars",
    intro:
      "Rolls-Royce Phantom, Ghost and Cullinan for weddings, VIP guests, events and unforgettable trips around Dubai.",
  },
};

export type CarImage = { src: string; md: string; thumb: string; mini: string; w: number; h: number; alt: string };
export type CarColour = { name: string; swatch: string; images: CarImage[] };

export type Car = {
  slug: string;
  name: string;
  make: string;
  year: number;
  category: Category;
  bodyType: string;
  engine?: string;
  fuelType: "Petrol" | "Electric";
  transmission: string;
  seats: number;
  doors: number;
  bags: number | null;
  price: Prices;
  deposit: number | null; // null = "on request"
  minDays: number;
  extraKmFee: string | null;
  included: string[];
  highlights: string[];
  tagline: string;
  description: string[];
  images: CarImage[];
  colours?: CarColour[];
  featured: boolean;
};

type RawCar = (typeof rawCars)[number];
type ManifestImage = { src: string; md: string; thumb: string; mini: string; w: number; h: number };
const carImages = manifest.cars as Record<string, ManifestImage[]>;

function imagesFor(slug: string, label: string): CarImage[] {
  return (carImages[slug] ?? []).map((img, i) => ({
    ...img,
    alt: i === 0 ? `${label} – front view` : `${label} – photo ${i + 1}`,
  }));
}

const titleCase = (s: string) => s.replace(/\b([a-z])/g, (m) => m.toUpperCase());

function normaliseIncluded(list: string[]) {
  return [...new Set(list.map((i) => titleCase(i.toLowerCase()).replace("Damage Waiver", "Damage Waiver (CDW)")))];
}

function toCar(r: RawCar): Car {
  const c = carContent[r.slug];
  if (!c) throw new Error(`content/cars.ts is missing an entry for "${r.slug}"`);
  const isRolls = r.make === "Rolls-Royce";
  const label = `${c.name} ${r.year}`;
  return {
    slug: r.slug,
    name: c.name,
    make: r.make === "Mercedes" ? "Mercedes-Benz" : r.make,
    year: r.year,
    category: r.category as Category,
    bodyType: c.bodyType,
    engine: c.engine,
    fuelType: c.fuelType,
    transmission: r.transmission,
    seats: r.slug === "toyota-land-cruiser" ? 7 : r.seats,
    doors: r.doors,
    bags: r.bags,
    price: { day: r.price_aed.day, week: r.price_aed.week, month: r.price_aed.month },
    // Rolls-Royce deposit was never published on the old site – show "on request" until Aldy confirms
    deposit: isRolls ? null : r.deposit_aed,
    minDays: r.min_days,
    extraKmFee: r.extra_km_fee ? r.extra_km_fee.replace(/\s*\/\s*Extra Km/i, " per extra km") : null,
    included: normaliseIncluded(r.included.length ? r.included : ["Third Party Liability"]),
    highlights: c.highlights,
    tagline: c.tagline,
    description: c.description,
    images: imagesFor(r.slug, label),
    featured: !!c.featured,
  };
}

const colourSlugs = new Set<string>(jacColours.map((c) => c.slug).filter((s) => s !== "jac-j7"));

function buildCars(): Car[] {
  const active = rawCars.filter((r) => r.status === "active");
  const list = active.filter((r) => !colourSlugs.has(r.slug)).map(toCar);
  // Merge the JAC J7 colour listings into one car (HANDOVER §8.5)
  const jac = list.find((c) => c.slug === "jac-j7");
  if (jac) {
    jac.colours = jacColours.map((col) => ({
      name: col.name,
      swatch: col.swatch,
      images: imagesFor(col.slug, `JAC J7 ${jac.year} ${col.name.toLowerCase()}`),
    }));
    jac.images = jac.colours[0].images;
  }
  return list.sort((a, b) => b.price.day - a.price.day);
}

export const cars: Car[] = buildCars();

export const getCar = (slug: string) => cars.find((c) => c.slug === slug);
export const carsInCategory = (cat: Category) => cars.filter((c) => c.category === cat);
export const featuredCars = () => cars.filter((c) => c.featured);
export const makes = () => [...new Set(cars.map((c) => c.make))].sort();
export const carPath = (c: Pick<Car, "slug">) => `/cars/${c.slug}/`;

/** Cars similar in price/category for "You may also like" */
export function relatedCars(car: Car, n = 3): Car[] {
  return cars
    .filter((c) => c.slug !== car.slug)
    .sort((a, b) => {
      const sameA = a.category === car.category ? 0 : 1;
      const sameB = b.category === car.category ? 0 : 1;
      return sameA - sameB || Math.abs(a.price.day - car.price.day) - Math.abs(b.price.day - car.price.day);
    })
    .slice(0, n);
}

/** Minimal shape for car cards – keeps the client payload small when cards render inside client components */
export type CardCar = Pick<Car, "slug" | "name" | "make" | "year" | "category" | "bodyType" | "seats" | "transmission" | "fuelType" | "price"> & {
  images: CarImage[];
  colours?: { name: string; swatch: string }[];
};
export const toCard = (c: Car): CardCar => ({
  slug: c.slug,
  name: c.name,
  make: c.make,
  year: c.year,
  category: c.category,
  bodyType: c.bodyType,
  seats: c.seats,
  transmission: c.transmission,
  fuelType: c.fuelType,
  price: c.price,
  images: c.images.slice(0, 1),
  colours: c.colours?.map(({ name, swatch }) => ({ name, swatch })),
});

/** What the gallery + booking widget need on the client */
export type ShowcaseCar = Pick<Car, "slug" | "name" | "year" | "price" | "minDays" | "images" | "colours">;
export const toShowcase = (c: Car): ShowcaseCar => ({
  slug: c.slug,
  name: c.name,
  year: c.year,
  price: c.price,
  minDays: c.minDays,
  images: c.images,
  colours: c.colours,
});

export const cheapestDay =(list: Car[] = cars) => Math.min(...list.map((c) => c.price.day));
