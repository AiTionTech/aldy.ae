"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { CalendarDays, Info, Phone } from "lucide-react";
import { estimatePrice, rentalDays, type Prices } from "@/lib/pricing";
import { addDays, formatAED, todayInDubai } from "@/lib/format";
import { bookingLink } from "@/lib/whatsapp";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

type Props = {
  carName: string;
  year: number;
  carPath: string;
  price: Prices;
  minDays: number;
  locations: string[];
  colour?: string;
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export default function BookingWidget({ carName, year, carPath, price, minDays, locations, colour }: Props) {
  const id = useId();
  const [today, setToday] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  // Dates depend on "today" and the URL – set them on the client only (the page is static HTML)
  useEffect(() => {
    const t = todayInDubai();
    const q = new URLSearchParams(window.location.search);
    const qf = q.get("from") ?? "";
    const qt = q.get("to") ?? "";
    const f = ISO.test(qf) && qf >= t ? qf : addDays(t, 1);
    const d = ISO.test(qt) && qt > f ? qt : addDays(f, Math.max(minDays, 3));
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from URL/clock */
    setToday(t);
    setFrom(f);
    setTo(d);
    const ql = q.get("location");
    if (ql && locations.includes(ql)) setLocation(ql);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [minDays, locations]);

  const days = from && to ? rentalDays(from, to) : 0;

  const error = useMemo(() => {
    if (!from || !to) return "Choose your pick-up and drop-off dates.";
    if (today && from < today) return "Pick-up date can't be in the past.";
    if (to <= from) return "Drop-off must be after pick-up.";
    if (days < minDays) return `Minimum rental for this car is ${minDays} ${minDays === 1 ? "day" : "days"}.`;
    return null;
  }, [from, to, today, days, minDays]);

  const estimate = error ? null : estimatePrice(price, days);

  const href = error
    ? undefined
    : bookingLink({ carName, year, carPath, colour, from, to, days, location, name, estimate });

  const onFromChange = (v: string) => {
    setFrom(v);
    if (v && (!to || to <= v)) setTo(addDays(v, Math.max(minDays, 1)));
  };

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-baseline justify-between gap-2">
        <p>
          <span className="text-2xl font-bold">{formatAED(price.day)}</span>
          <span className="text-sm text-muted"> / day</span>
        </p>
        <p className="text-xs text-muted">
          Min. {minDays} {minDays === 1 ? "day" : "days"}
        </p>
      </div>

      <form
        className="mt-5 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setShowErrors(true);
          if (href) window.open(href, "_blank", "noopener");
        }}
        noValidate
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${id}-from`} className="label">
              Pick-up date
            </label>
            <input id={`${id}-from`} type="date" className="field px-3" value={from} min={today || undefined} onChange={(e) => onFromChange(e.target.value)} required />
          </div>
          <div>
            <label htmlFor={`${id}-to`} className="label">
              Drop-off date
            </label>
            <input id={`${id}-to`} type="date" className="field px-3" value={to} min={from ? addDays(from, 1) : undefined} onChange={(e) => setTo(e.target.value)} required />
          </div>
        </div>

        <div>
          <label htmlFor={`${id}-loc`} className="label">
            Pick-up location <span className="font-normal">(optional)</span>
          </label>
          <select id={`${id}-loc`} className="field" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Choose an area…</option>
            <option value="Aldy office, Garhoud">Aldy office, Garhoud</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${id}-name`} className="label">
            Your name <span className="font-normal">(optional)</span>
          </label>
          <input id={`${id}-name`} type="text" className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sara Ahmed" maxLength={60} />
        </div>

        <div aria-live="polite" className="min-h-6">
          {error && (showErrors || (from && to)) ? (
            <p className="flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden /> {error}
            </p>
          ) : estimate ? (
            <div className="rounded-2xl bg-surface p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted">
                  <CalendarDays className="size-4" aria-hidden /> {days} {days === 1 ? "day" : "days"}
                </span>
                <span className="text-lg font-bold">{estimate.kind === "price" ? formatAED(estimate.total) : "Ask for price"}</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {estimate.kind === "price"
                  ? `Estimated price${estimate.basis !== "daily" ? ` (${estimate.basis} rate)` : ""} – final price confirmed on WhatsApp`
                  : "We'll send you our best long-term price on WhatsApp"}
              </p>
            </div>
          ) : null}
        </div>

        <button type="submit" className="btn-wa w-full py-3.5 text-base" aria-disabled={!!error}>
          <WhatsAppIcon className="size-5" /> Book on WhatsApp
        </button>
        <a href={site.phoneHref} className="btn-ghost w-full">
          <Phone className="size-4" aria-hidden /> Call {site.phoneDisplay}
        </a>
        <p className="text-center text-xs text-muted">No payment online – pay when you receive the car.</p>
      </form>
    </div>
  );
}
