const aed = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** "AED 3,250" */
export const formatAED = (n: number) => `AED ${aed.format(n)}`;

/** "20 Nov 2026" from an ISO date (yyyy-mm-dd), timezone-safe */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (!y || !m || !d) return iso;
  return `${d} ${months[m - 1]} ${y}`;
}

/** Today's date in Dubai (UTC+4) as yyyy-mm-dd */
export function todayInDubai(now = new Date()): string {
  const dubai = new Date(now.getTime() + 4 * 3_600_000);
  return dubai.toISOString().slice(0, 10);
}

export function addDays(iso: string, n: number): string {
  const t = Date.parse(`${iso}T00:00:00Z`) + n * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/** Long readable date for blog posts: "24 January 2023" */
export function formatLongDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
