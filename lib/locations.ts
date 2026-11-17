import raw from "@/data/locations.json";
import { locationContent, type LocationContent, type LocationGroup } from "@/content/locations";

export type Location = { name: string; slug: string } & LocationContent;

export const locations: Location[] = raw.map((l) => {
  const c = locationContent[l.slug];
  if (!c) throw new Error(`content/locations.ts is missing "${l.slug}"`);
  return { name: l.name.replace("Jumeirah beach residence", "Jumeirah Beach Residence (JBR)").replace("Burj al Arab", "Burj Al Arab").replace("Nad al Sheba", "Nad Al Sheba").replace("Souk al Marfa", "Souk Al Marfa").replace("Showroom Umm Ramool", "Umm Ramool"), slug: l.slug, ...c };
});

export const groupOrder: LocationGroup[] = ["Airports", "Dubai neighbourhoods", "Dubai landmarks & malls", "Sharjah", "Al Ain"];

export const locationsByGroup = () =>
  groupOrder.map((g) => ({ group: g, items: locations.filter((l) => l.group === g).sort((a, b) => a.name.localeCompare(b.name)) }));

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
export const locationPath = (l: Pick<Location, "slug">) => `/locations/${l.slug}/`;

/** Names for the pick-up location dropdown */
export const locationNames = () => [...locations.map((l) => l.name)].sort((a, b) => a.localeCompare(b));
