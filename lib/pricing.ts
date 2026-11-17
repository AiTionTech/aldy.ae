export type Prices = { day: number; week: number | null; month: number | null };

export type Estimate =
  | { kind: "price"; total: number; basis: "daily" | "weekly" | "monthly" }
  | { kind: "ask" }; // the tier needed for this length has no published price

/** Whole rental days between two ISO dates (yyyy-mm-dd). Each started 24 h counts as a day. */
export function rentalDays(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / 86_400_000);
}

/**
 * Estimated rental price (HANDOVER §6.3):
 *  - under 7 days: days × day price (never more than one week's price)
 *  - 7–27 days: weekly rate pro-rated per day (never more than one month's price)
 *  - 28–30 days: one month; longer: monthly rate pro-rated per day
 */
export function estimatePrice(p: Prices, days: number): Estimate | null {
  if (days < 1) return null;
  if (days < 7) {
    const total = p.week != null ? Math.min(days * p.day, p.week) : days * p.day;
    return { kind: "price", total, basis: "daily" };
  }
  if (days < 28) {
    if (p.week == null) return { kind: "ask" };
    const prorated = Math.round((days * p.week) / 7);
    const total = p.month != null ? Math.min(prorated, p.month) : prorated;
    return { kind: "price", total, basis: "weekly" };
  }
  if (p.month == null) return { kind: "ask" };
  const total = days <= 30 ? p.month : Math.round((days * p.month) / 30);
  return { kind: "price", total, basis: "monthly" };
}
