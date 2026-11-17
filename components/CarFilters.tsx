"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { CardCar } from "@/lib/cars";
import { formatAED } from "@/lib/format";
import CarCard from "./CarCard";

type Sort = "price-asc" | "price-desc";

const PRICE_STEPS = [150, 250, 600, 6000];

export default function CarFilters({ cars, makes }: { cars: CardCar[]; makes: string[] }) {
  const [category, setCategory] = useState<"" | "economy" | "luxury">("");
  const [make, setMake] = useState("");
  const [max, setMax] = useState(0);
  const [sort, setSort] = useState<Sort>("price-asc");
  const [dateQuery, setDateQuery] = useState("");

  // Read filters passed from the home-page search (static page → client only)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const c = q.get("category");
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from URL */
    if (c === "economy" || c === "luxury") setCategory(c);
    const m = q.get("make");
    if (m && makes.includes(m)) setMake(m);
    const from = q.get("from");
    const to = q.get("to");
    if (from && to) setDateQuery(`?${new URLSearchParams({ from, to }).toString()}`);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [makes]);

  type Cat = "" | "economy" | "luxury";
  // one predicate for every filter combination – used for the list AND for the option counts
  const count = (cat: Cat, mk: string, mx: number) =>
    cars.filter((c) => (!cat || c.category === cat) && (!mk || c.make === mk) && (!mx || c.price.day <= mx)).length;

  const list = useMemo(() => {
    const out = cars.filter((c) => (!category || c.category === category) && (!make || c.make === make) && (!max || c.price.day <= max));
    return out.sort((a, b) => (sort === "price-asc" ? a.price.day - b.price.day : b.price.day - a.price.day));
  }, [cars, category, make, max, sort]);

  // only offer makes that exist with the current category + price (e.g. no Rolls-Royce under Economy)
  const makeOptions = makes.map((m) => ({ m, n: count(category, m, max) })).filter((o) => o.n > 0 || o.m === make);

  // switching category drops a make/price that would leave zero cars
  const selectCategory = (cat: Cat) => {
    const mk = make && count(cat, make, max) > 0 ? make : "";
    const mx = max && count(cat, mk, max) > 0 ? max : 0;
    setCategory(cat);
    setMake(mk);
    setMax(mx);
  };
  const selectMake = (mk: string) => {
    setMake(mk);
    if (max && count(category, mk, max) === 0) setMax(0);
  };

  const active = !!(category || make || max);
  const reset = () => {
    setCategory("");
    setMake("");
    setMax(0);
  };

  return (
    <>
      <div className="sticky top-[5.25rem] z-20 -mx-4 border-b border-line bg-canvas/95 px-4 py-3 sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="hidden size-4 text-muted sm:block" aria-hidden />
          <div role="group" aria-label="Category" className="flex rounded-full bg-surface p-1">
            {(
              [
                ["", "All"],
                ["economy", "Economy"],
                ["luxury", "Luxury"],
              ] as const
            ).map(([v, l]) => (
              <button
                key={l}
                type="button"
                onClick={() => selectCategory(v)}
                aria-pressed={category === v}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${category === v ? "bg-white shadow-card" : "text-muted hover:text-ink"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="f-make">
            Make
          </label>
          <select id="f-make" value={make} onChange={(e) => selectMake(e.target.value)} className="field w-auto rounded-full py-2 pr-8">
            <option value="">All makes ({count(category, "", max)})</option>
            {makeOptions.map(({ m, n }) => (
              <option key={m} value={m}>
                {m} ({n})
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="f-max">
            Maximum price per day
          </label>
          <select id="f-max" value={max} onChange={(e) => setMax(Number(e.target.value))} className="field w-auto rounded-full py-2 pr-8">
            <option value={0}>Any price</option>
            {PRICE_STEPS.slice(0, -1).map((p) => {
              const n = count(category, make, p);
              return (
                <option key={p} value={p} disabled={n === 0 && max !== p}>
                  Up to {formatAED(p)}/day ({n})
                </option>
              );
            })}
          </select>
          <label className="sr-only" htmlFor="f-sort">
            Sort
          </label>
          <select id="f-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field w-auto rounded-full py-2 pr-8 sm:ml-auto">
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-muted" aria-live="polite">
        <p>
          Showing <strong className="text-ink">{list.length}</strong> of {cars.length} cars
        </p>
        {active && (
          <button type="button" onClick={reset} className="flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700">
            <X className="size-4" aria-hidden /> Clear filters
          </button>
        )}
      </div>

      <h2 className="sr-only">Available cars</h2>
      {list.length ? (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => (
            <li key={c.slug}>
              <CarCard car={c} priority={i < 3} query={dateQuery} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-line p-10 text-center">
          <p className="font-semibold">No cars match these filters.</p>
          <button type="button" onClick={reset} className="btn-ghost mt-4">
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
