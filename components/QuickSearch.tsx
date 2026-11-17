"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { addDays, todayInDubai } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Category + dates → /cars/?category=…&from=…&to=… (dates carry through to the car page booking form) */
export default function QuickSearch({ dark = false }: { dark?: boolean }) {
  const router = useRouter();
  const [today, setToday] = useState("");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const t = todayInDubai();
    /* eslint-disable react-hooks/set-state-in-effect -- dates depend on the visitor's clock */
    setToday(t);
    setFrom(addDays(t, 1));
    setTo(addDays(t, 4));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (to <= from) return setError("Drop-off must be after pick-up.");
    if (from < today) return setError("Pick-up date can't be in the past.");
    const q = new URLSearchParams({ ...(category && { category }), from, to });
    router.push(`/cars/?${q.toString()}`);
  };

  return (
    <form onSubmit={submit} aria-label="Find a car" className="w-full">
      {/* slim search bar: three borderless fields with dividers, button at the end (stacks on phones) */}
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-3xl border sm:flex-row sm:items-center sm:rounded-full sm:p-1.5",
          dark ? "border-white/15 bg-ink/55 text-white shadow-lift [color-scheme:dark]" : "border-line bg-white shadow-card",
        )}
      >
        <div className="flex-1 px-5 py-3 sm:py-2">
          <label htmlFor="qs-cat" className={cn("block text-[11px] font-semibold tracking-wide uppercase", dark ? "text-white/60" : "text-muted")}>
            Car type
          </label>
          <select id="qs-cat" value={category} onChange={(e) => setCategory(e.target.value)} className={cn("mt-0.5 -ml-1 block w-full cursor-pointer bg-transparent text-sm font-medium focus:outline-none", dark ? "text-white [&>option]:text-ink" : "text-ink")}>
            <option value="">All cars</option>
            <option value="economy">Economy</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
        <span className={cn("mx-5 h-px sm:mx-0 sm:h-8 sm:w-px", dark ? "bg-white/15" : "bg-line")} aria-hidden />
        <div className="flex-1 px-5 py-3 sm:py-2">
          <label htmlFor="qs-from" className={cn("block text-[11px] font-semibold tracking-wide uppercase", dark ? "text-white/60" : "text-muted")}>
            Pick-up
          </label>
          <input
            id="qs-from"
            type="date"
            value={from}
            min={today || undefined}
            onChange={(e) => {
              setFrom(e.target.value);
              setError("");
              if (e.target.value >= to) setTo(addDays(e.target.value, 1));
            }}
            className={cn("mt-0.5 block w-full bg-transparent text-sm font-medium focus:outline-none", dark ? "text-white" : "text-ink")}
          />
        </div>
        <span className={cn("mx-5 h-px sm:mx-0 sm:h-8 sm:w-px", dark ? "bg-white/15" : "bg-line")} aria-hidden />
        <div className="flex-1 px-5 py-3 sm:py-2">
          <label htmlFor="qs-to" className={cn("block text-[11px] font-semibold tracking-wide uppercase", dark ? "text-white/60" : "text-muted")}>
            Drop-off
          </label>
          <input
            id="qs-to"
            type="date"
            value={to}
            min={from ? addDays(from, 1) : undefined}
            onChange={(e) => {
              setTo(e.target.value);
              setError("");
            }}
            className={cn("mt-0.5 block w-full bg-transparent text-sm font-medium focus:outline-none", dark ? "text-white" : "text-ink")}
          />
        </div>
        <div className="p-3 pt-1 sm:p-0">
          <button type="submit" className="btn-brand w-full px-6 py-3 sm:w-auto">
            <Search className="size-4" aria-hidden /> Find a car
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className={cn("mt-2 px-4 text-sm", dark ? "text-red-200" : "text-red-700")}>
          {error}
        </p>
      )}
    </form>
  );
}
