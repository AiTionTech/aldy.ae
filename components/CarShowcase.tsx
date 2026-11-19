"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ShowcaseCar } from "@/lib/cars";
import BookingWidget from "./BookingWidget";

/** Gallery + colour picker + booking widget. Server-rendered details are passed as children (left column). */
export default function CarShowcase({ car, locations, children }: { car: ShowcaseCar; locations: string[]; children: React.ReactNode }) {
  const [colourIdx, setColourIdx] = useState(0);
  const [active, setActive] = useState(0);
  const colour = car.colours?.[colourIdx];
  const images = colour?.images ?? car.images;

  // photos rendered so far (stacked + cross-faded); the first one is server-rendered
  const [seen, setSeen] = useState<string[]>([]);
  const gallery = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLUListElement>(null);
  const auto = useRef(true); // stops for good once the visitor browses
  const hold = useRef(false); // hover / focus
  const visible = useRef(true);

  const show = (i: number) => {
    setSeen((s) => (s.includes(images[i].src) ? s : [...s, images[i].src]));
    setActive(i);
  };
  const go = (d: number) => show((active + d + images.length) % images.length);
  const userGo = (fn: () => void) => {
    auto.current = false;
    fn();
  };

  // auto-advance every 4 s (preloads the next photo first)
  useEffect(() => {
    const el = gallery.current;
    if (!el || images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    io.observe(el);
    let cancelled = false;
    let timer = 0;
    const tick = () => {
      if (cancelled || !auto.current) return;
      if (hold.current || !visible.current || document.hidden) {
        timer = window.setTimeout(tick, 4000);
        return;
      }
      const next = (active + 1) % images.length;
      const n = images[next];
      const im = new Image();
      im.sizes = "(min-width: 1280px) 800px, (min-width: 1024px) 60vw, 100vw";
      im.srcset = `${n.thumb} 600w, ${n.md} 1000w, ${n.src} ${n.w}w`;
      im.src = n.src;
      // switch only once the photo is decoded, so the fade never shows an empty frame
      im.decode().then(
        () => !cancelled && auto.current && show(next),
        () => !cancelled && auto.current && show(next),
      );
    };
    timer = window.setTimeout(tick, 4000);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-arm after every change of photo
  }, [active, images]);

  // keep the active thumbnail visible inside the strip (never scrolls the page)
  useEffect(() => {
    const t = strip.current;
    const li = t?.children[active] as HTMLElement | undefined;
    if (!t || !li) return;
    if (li.offsetLeft < t.scrollLeft || li.offsetLeft + li.offsetWidth > t.scrollLeft + t.clientWidth) {
      t.scrollTo({ left: li.offsetLeft - 8, behavior: "smooth" });
    }
  }, [active]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <div className="min-w-0">
        {/* ONE frame size for every car and photo: 4:3, as wide as the column allows, height within the screen
            (100svh − header). 98 of the 118 photos are 4:3 and fill it exactly; the few other shapes (blue JAC J7,
            Rolls-Royce) are centre-cropped to fit (user choice 19 Nov 2026). Replace them with 4:3 photos when possible. */}
        <div
          ref={gallery}
          className="relative grid overflow-hidden rounded-3xl bg-sand lg:max-w-[calc((100svh-7rem)*4/3)]"
          onMouseEnter={() => (hold.current = true)}
          onMouseLeave={() => (hold.current = false)}
          onFocus={() => (hold.current = true)}
          onBlur={() => (hold.current = false)}
        >
          {images.map((im, i) =>
            i === 0 || seen.includes(im.src) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={im.src}
                src={im.src}
                srcSet={`${im.thumb} 600w, ${im.md} 1000w, ${im.src} ${im.w}w`}
                sizes="(min-width: 1280px) 800px, (min-width: 1024px) 60vw, 100vw"
                alt={i === active ? im.alt : ""}
                aria-hidden={i === active ? undefined : true}
                width={im.w}
                height={im.h}
                fetchPriority={i === 0 ? "high" : "auto"}
                className={`aspect-[4/3] w-full object-cover object-center transition-opacity duration-700 [grid-area:1/1] ${i === active ? "opacity-100" : "opacity-0"}`}
              />
            ) : null,
          )}
          {images.length > 1 && (
            <>
              <button type="button" onClick={() => userGo(() => go(-1))} aria-label="Previous photo" className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-card hover:bg-white">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={() => userGo(() => go(1))} aria-label="Next photo" className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-card hover:bg-white">
                <ChevronRight className="size-5" />
              </button>
              <span className="absolute right-3 bottom-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink">
                {active + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        {images.length > 1 && (
          <ul ref={strip} className="no-scrollbar relative mt-3 flex gap-2 overflow-x-auto pb-1 lg:max-w-[calc((100svh-7rem)*4/3)]" aria-label="Photos">
            {images.map((im, i) => (
              <li key={im.src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => userGo(() => show(i))}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === active}
                  className={`block overflow-hidden rounded-xl ring-2 transition ${i === active ? "ring-accent-500" : "ring-transparent opacity-70 hover:opacity-100"}`}
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
                    auto.current = false;
                    setColourIdx(i);
                    setActive(0);
                    setSeen([]);
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
