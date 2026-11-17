"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { addDays, todayInDubai } from "@/lib/format";

/** Category + dates → /cars/?category=…&from=…&to=… (dates carry through to the car page booking form) */
export default function QuickSearch() {
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
    <form onSubmit={submit} className="rounded-3xl border border-line bg-white p-3 shadow-lift sm:p-4" aria-label="Find a car">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="qs-cat" className="label">
            Car type
          </label>
          <select id="qs-cat" value={category} onChange={(e) => setCategory(e.target.value)} className="field">
            <option value="">All cars</option>
            <option value="economy">Economy</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
        <div>
          <label htmlFor="qs-from" className="label">
            Pick-up date
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
            className="field"
          />
        </div>
        <div>
          <label htmlFor="qs-to" className="label">
            Drop-off date
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
            className="field"
          />
        </div>
        <button type="submit" className="btn-brand h-[46px] px-6">
          <Search className="size-4" aria-hidden /> Find a car
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 px-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
