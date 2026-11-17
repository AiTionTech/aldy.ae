"use client";

/*
  Google-review slider (layout idea from alfareedbm.com testimonials): quote mark, stars, review text,
  reviewer + date + source. CSS scroll-snap track with prev/next + dots; auto-advances every 6 s,
  pausing on hover/focus, when off screen, and entirely for prefers-reduced-motion.
  Renders nothing until there are at least 3 real reviews in content/testimonials.ts.
*/

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import type { Review } from "@/content/testimonials";
import { SectionHeading } from "./common";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const formatMonth = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y && m ? `${MONTHS[m - 1]} ${y}` : ym;
};

function GoogleG({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9" />
    </svg>
  );
}

export default function Testimonials({ reviews, rating, reviewsUrl }: { reviews: Review[]; rating: number; reviewsUrl: string }) {
  const track = useRef<HTMLUListElement>(null);
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const hold = useRef(false); // hover / focus / off screen

  const cards = () => Array.from(track.current?.children ?? []) as HTMLElement[];

  const goTo = useCallback((i: number) => {
    const list = Array.from(track.current?.children ?? []) as HTMLElement[];
    const t = track.current;
    if (!t || !list.length) return;
    const idx = (i + list.length) % list.length;
    t.scrollTo({ left: list[idx].offsetLeft - t.offsetLeft, behavior: "smooth" });
  }, []);

  // keep the active dot in sync with manual swipes
  const onScroll = () => {
    const t = track.current;
    if (!t) return;
    const list = cards();
    let best = 0;
    list.forEach((c, i) => {
      if (Math.abs(c.offsetLeft - t.offsetLeft - t.scrollLeft) < Math.abs(list[best].offsetLeft - t.offsetLeft - t.scrollLeft)) best = i;
    });
    setActive(best);
  };

  // auto-advance
  useEffect(() => {
    if (reviews.length < 3 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (hold.current = !e.isIntersecting));
    if (section.current) io.observe(section.current);
    const id = window.setInterval(() => {
      if (hold.current || document.hidden) return;
      const t = track.current;
      if (!t) return;
      const atEnd = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4;
      goTo(atEnd ? 0 : active + 1);
    }, 6000);
    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, [reviews.length, active, goTo]);

  if (reviews.length < 3) return null;

  return (
    <section
      ref={section}
      className="container-x mt-24"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      onMouseEnter={() => (hold.current = true)}
      onMouseLeave={() => (hold.current = false)}
      onFocus={() => (hold.current = true)}
      onBlur={() => (hold.current = false)}
    >
      <SectionHeading
        eyebrow="Customer reviews"
        title="What our customers say"
        action={
          <a href={reviewsUrl} target="_blank" rel="noopener" className="btn-ghost shrink-0">
            <GoogleG /> {rating} ★ · Read all reviews on Google
          </a>
        }
      />

      <ul
        ref={track}
        onScroll={onScroll}
        className="no-scrollbar mt-10 -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 sm:mx-0 sm:px-0"
      >
        {reviews.map((r, i) => (
          <li
            key={r.name + r.date}
            aria-roledescription="slide"
            aria-label={`Review ${i + 1} of ${reviews.length}`}
            className="relative flex w-[85%] flex-none snap-start flex-col overflow-hidden rounded-3xl border border-line bg-white p-7 shadow-card sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)]"
          >
            {/* decorative corners + quote mark */}
            <span className="absolute top-0 left-0 size-10 rounded-br-3xl border-r-2 border-b-2 border-brand-100" aria-hidden />
            <span className="absolute right-0 bottom-0 size-10 rounded-tl-3xl border-t-2 border-l-2 border-sea-100" aria-hidden />
            <Quote className="absolute top-5 right-6 size-10 text-brand-100" aria-hidden />

            <div className="flex gap-0.5 text-brand-500" aria-label={`${r.rating} out of 5 stars`} role="img">
              {Array.from({ length: 5 }, (_, s) => (
                <Star key={s} className={`size-4 ${s < r.rating ? "fill-current" : "text-line"}`} aria-hidden />
              ))}
            </div>
            <blockquote className="mt-4 line-clamp-6 flex-1 text-base leading-7 text-ink/85">“{r.text}”</blockquote>
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-xs text-muted">
                  Google review · {formatMonth(r.date)}
                </p>
              </div>
              <GoogleG className="size-5" />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous review" className="grid size-10 place-items-center rounded-full border border-line bg-white hover:border-brand-300">
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <div className="flex gap-0.5">
          {reviews.map((r, i) => (
            <button
              key={r.name + r.date + "-dot"}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show review ${i + 1}`}
              aria-current={i === active}
              className="group grid h-6 min-w-6 place-items-center"
            >
              <span className={`block h-2 rounded-full transition-all ${i === active ? "w-6 bg-brand-600" : "w-2 bg-line group-hover:bg-brand-200"}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => goTo(active + 1)} aria-label="Next review" className="grid size-10 place-items-center rounded-full border border-line bg-white hover:border-brand-300">
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </section>
  );
}
