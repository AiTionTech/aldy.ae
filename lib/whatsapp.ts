import { formatAED, formatDate } from "./format";
import type { Estimate } from "./pricing";
import { absoluteUrl, waLink } from "./site";

export type BookingDetails = {
  carName: string;
  year: number;
  carPath: string; // e.g. /cars/mazda-cx30/
  colour?: string;
  from: string; // yyyy-mm-dd
  to: string;
  days: number;
  location?: string;
  estimate: Estimate | null;
  name?: string;
};

/** Message format from HANDOVER §6.4 */
export function buildBookingMessage(b: BookingDetails): string {
  const price =
    b.estimate == null ? "—" : b.estimate.kind === "ask" ? "Please send me the price" : formatAED(b.estimate.total);
  const lines = [
    "Hello Aldy Rent A Car, I would like to book:",
    `Car: ${b.carName} (${b.year})`,
    ...(b.colour ? [`Colour: ${b.colour}`] : []),
    `Pick-up: ${formatDate(b.from)}`,
    `Drop-off: ${formatDate(b.to)} (${b.days} ${b.days === 1 ? "day" : "days"})`,
    `Pick-up location: ${b.location?.trim() || "____"}`,
    `Estimated price: ${price}`,
    `Name: ${b.name?.trim() || "____"}`,
    `Page: ${absoluteUrl(b.carPath)}`,
  ];
  return lines.join("\n");
}

export const bookingLink = (b: BookingDetails) => waLink(buildBookingMessage(b));

/** Short enquiry used by "Ask for price" and generic CTAs */
export const enquiryLink = (subject?: string) =>
  waLink(subject ? `Hello Aldy Rent A Car, I have a question about ${subject}.` : "Hello Aldy Rent A Car, I would like to rent a car.");
