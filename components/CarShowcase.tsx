"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ShowcaseCar } from "@/lib/cars";
import BookingWidget from "./BookingWidget";

/** Gallery + colour picker + booking widget. Server-rendered details are passed as children (left column). */
export default function CarShowcase({ car, locations, children }: { car: ShowcaseCar; locations: string[]; children: React.ReactNode }) {
  const [colourIdx, setColourIdx] = useState(0);
  const [active, setActive] = useState(0);
  const colour = car.colours?.[colourIdx];
  const images = colour?.images ?? car.images;
  const img = images[Math.min(active, images.length - 1)];

  const go = (d: number) => setActive((a) => (a + d + images.length) % images.length);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <div className="min-w-0">
        <div className="relative overflow-hidden rounded-3xl bg-sand">
          {img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.src}
              src={img.src}
              srcSet={`${img.thumb} 600w, ${img.md} 1000w, ${img.src} ${img.w}w`}
              sizes="(min-width: 1280px) 800px, (min-width: 1024px) 60vw, 100vw"
              alt={img.alt}
              width={img.w}
              height={img.h}
              fetchPriority="high"
              className="aspect-[4/3] w-full object-cover"
            />
          )}
          {images.length > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-card hover:bg-white">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-card hover:bg-white">
                <ChevronRight className="size-5" />
              </button>
              <span className="absolute right-3 bottom-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink">
                {active + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        {images.length > 1 && (
          <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Photos">
            {images.map((im, i) => (
              <li key={im.src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === active}
                  className={`block overflow-hidden rounded-xl ring-2 transition ${i === active ? "ring-brand-500" : "ring-transparent opacity-70 hover:opacity-100"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.mini} alt="" width={96} height={72} loading="lazy" decoding="async" className="h-[72px] w-24 object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {car.colours && (
          <fieldset className="mt-5">
            <legend className="text-sm font-semibold">
              Colour: <span className="font-normal text-muted">{colour?.name}</span>
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {car.colours.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    setColourIdx(i);
                    setActive(0);
                  }}
                  aria-pressed={i === colourIdx}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${i === colourIdx ? "border-brand-300 bg-brand-50 font-semibold text-brand-700" : "border-line bg-white hover:border-brand-300"}`}
                >
                  <span className="size-4 rounded-full ring-1 ring-ink/20" style={{ background: c.swatch }} aria-hidden />
                  {c.name}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-10 lg:hidden" id="book">
          <BookingWidget
            carName={car.name}
            year={car.year}
            carPath={`/cars/${car.slug}/`}
            price={car.price}
            minDays={car.minDays}
            locations={locations}
            colour={colour?.name}
          />
        </div>

        {children}
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <BookingWidget
            carName={car.name}
            year={car.year}
            carPath={`/cars/${car.slug}/`}
            price={car.price}
            minDays={car.minDays}
            locations={locations}
            colour={colour?.name}
          />
        </div>
      </aside>
    </div>
  );
}
