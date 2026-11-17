"use client";

/*
  Scroll-driven motion pieces adapted from the "Daytake" editorial landing page (GSAP + ScrollTrigger),
  rebuilt for aldy.ae: Aldy's own car photos and prices, the light "desert sunrise" theme, Tailwind classes
  instead of global CSS, no dark-mode toggle, no illustrative counters/creators/video.

  - MosaicHero  – tilted 3D wall of car photos that "unfurls" (straightens) as the visitor scrolls
  - CarLanes    – two tilted rows of car cards gliding in opposite directions (swipeable, pausable)
  - Reveal      – staggered slide-in for a group of cards

  Every effect is disabled for visitors with prefers-reduced-motion; the static layout still looks complete.
*/

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type MotionPhoto = { src: string; w: number; h: number };

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerT = typeof import("gsap/ScrollTrigger").ScrollTrigger;

/**
 * Loads GSAP + ScrollTrigger only once the browser is idle, then runs `setup`.
 * Keeps ~70 KB of animation code off the critical path – the page is fully laid out without it.
 * `setup` may return a cleanup function (e.g. matchMedia().revert).
 */
function useLazyGsap(setup: (gsap: Gsap, ScrollTrigger: ScrollTriggerT) => (() => void) | void) {
  const setupRef = useRef(setup);
  useEffect(() => {
    let cleanup: (() => void) | void;
    let cancelled = false;
    const start = () =>
      Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, s]) => {
        if (cancelled) return;
        g.gsap.registerPlugin(s.ScrollTrigger);
        cleanup = setupRef.current(g.gsap, s.ScrollTrigger);
      });
    const ric = typeof window.requestIdleCallback === "function";
    const handle = ric ? window.requestIdleCallback(start, { timeout: 2500 }) : window.setTimeout(start, 400);
    return () => {
      cancelled = true;
      if (ric) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      cleanup?.();
    };
  }, []);
}

/* ------------------------------------------------------------------ */
/* Mosaic hero                                                         */
/* ------------------------------------------------------------------ */

/**
 * Renders the photo wall next to (desktop) or below (mobile) the hero text passed as children.
 * `columns` = three columns of photos; each column is repeated once so the vertical travel never shows a gap.
 */
export function MosaicHero({ columns, children, footer, className }: { columns: MotionPhoto[][]; children: React.ReactNode; footer?: React.ReactNode; className?: string }) {
  const root = useRef<HTMLElement>(null);

  useLazyGsap((gsap, ScrollTrigger) => {
      const mm = gsap.matchMedia();
      mm.add({ reduce: "(prefers-reduced-motion: reduce)", wide: "(min-width: 1024px)", tall: "(min-height: 700px)" }, (ctx) => {
        const { reduce, wide, tall } = ctx.conditions as { reduce: boolean; wide: boolean; tall: boolean };
        if (reduce) return;
        const select = gsap.utils.selector(root);
        const pin = wide && tall;
        const headerOffset = () => (document.querySelector("header")?.getBoundingClientRect().height ?? 0) + 12;

        // The grid owns the 3D orientation; each column track owns its own vertical travel.
        const unfurl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: () => (pin ? `top ${headerOffset()}` : "top top"),
            end: () => (pin ? `+=${Math.round(innerHeight * 0.55)}` : "bottom top"),
            pin,
            pinSpacing: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        unfurl.fromTo(select("[data-mosaic-grid]"), { rotationX: 18, rotationY: -24, rotationZ: -12, z: -150 }, { rotationX: 3, rotationY: -3, rotationZ: -5, z: 0, duration: 1 }, 0);
        select("[data-mosaic-track]").forEach((track: HTMLElement, i: number) => {
          unfurl.fromTo(track, { yPercent: i === 1 ? -24 : -3 }, { yPercent: i === 1 ? -4 : -25, duration: 1 }, 0);
        });

        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      });
      return () => mm.revert();
  });

  return (
    <section ref={root} className={cn("bg-glow relative isolate overflow-hidden", className)}>
      <div className="relative grid lg:min-h-[640px] lg:items-center">
        {/* photo wall */}
        <div
          data-mosaic
          aria-hidden
          className="pointer-events-none relative order-2 -mx-[8%] h-[320px] lg:absolute lg:inset-y-0 lg:right-[-8%] lg:left-[46%] lg:order-none lg:mx-0 lg:h-auto"
          style={{ perspective: "1000px" }}
        >
          {/* edge fades as plain gradient overlays – CSS masks on a 3D layer are expensive on phones */}
          <div className="absolute inset-y-0 left-0 z-10 w-1/5 bg-gradient-to-r from-canvas to-transparent" />
          <div className="absolute inset-x-0 top-0 z-10 h-1/6 bg-gradient-to-b from-canvas to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-10 h-1/5 bg-gradient-to-t from-canvas to-transparent" />
          <div className="absolute inset-y-0 right-0 z-10 w-[12%] bg-gradient-to-l from-canvas to-transparent" />
          <div className="flex h-full items-center">
            <div
              data-mosaic-grid
              className="grid h-[640px] w-[110%] flex-none grid-cols-3 gap-2.5 lg:h-[880px] lg:gap-4"
              style={{ transformStyle: "preserve-3d", transform: "rotateX(18deg) rotateY(-24deg) rotateZ(-12deg) translateZ(-150px)" }}
            >
              {columns.map((column, ci) => (
                <div key={ci} className="min-w-0">
                  <div data-mosaic-track className="will-change-transform">
                    {[0, 1].map((copy) => (
                      <div key={copy} className="grid gap-2.5 pb-2.5 lg:gap-4 lg:pb-4">
                        {column.map((p, pi) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={p.src + copy}
                            src={p.src}
                            alt=""
                            width={p.w}
                            height={p.h}
                            loading={copy === 0 && pi < 2 ? "eager" : "lazy"}
                            decoding="async"
                            className="aspect-[0.9] w-full rounded-2xl bg-sand object-cover shadow-card"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* text */}
        <div className="container-x relative z-10 order-1 pt-10 pb-6 lg:order-none lg:pt-14 lg:pb-14">
          <div className="max-w-xl">{children}</div>
        </div>
      </div>
      {footer}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Gliding car lanes                                                   */
/* ------------------------------------------------------------------ */

export type LaneCar = { slug: string; name: string; price: string; tag: string; img: MotionPhoto & { alt: string } };

export function CarLanes({ rows, className }: { rows: LaneCar[][]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useLazyGsap((gsap) => {
    const el = strip.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    // entrance: cards slide in from the right as the section arrives (skipped if already on screen)
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (root.current && root.current.getBoundingClientRect().top < innerHeight) return;
      const select = gsap.utils.selector(root);
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: root.current, start: "top 92%", end: "top 45%", scrub: 0.45, invalidateOnRefresh: true },
      });
      select("[data-lane-group]").forEach((group: HTMLElement) => {
        tl.fromTo(group.querySelectorAll("[data-lane-card]"), { x: () => Math.min(innerWidth, 1300) * 0.6, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.65, stagger: 0.08 }, 0);
      });
    });

    // endless glide: each lane scrolls itself; a visitor's swipe/drag simply takes over for a moment
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tracks = gsap.utils.toArray<HTMLDivElement>("[data-lane]", el).map((lane, index) => ({
        lane,
        group: lane.firstElementChild as HTMLElement,
        direction: index === 0 ? 1 : -1,
        period: 0,
        position: 0,
        rendered: 0,
        resumeAt: 0,
      }));
      const measure = () =>
        tracks.forEach((t) => {
          const period = t.group.offsetWidth;
          if (period === t.period) return;
          t.position = t.period ? (t.position / t.period) * period : t.direction === 1 ? 0 : period;
          t.period = period;
          t.lane.scrollLeft = t.position;
          t.rendered = t.lane.scrollLeft;
        });
      const tick = (time: number, elapsed: number) => {
        if (document.hidden || root.current?.dataset.paused === "true") return;
        const inspecting = !!el.querySelector(":focus-visible") || el.matches(":active");
        for (const t of tracks) {
          if (t.lane.scrollLeft !== t.rendered) {
            // the visitor scrolled this lane – follow them, resume shortly after
            t.position = t.lane.scrollLeft;
            t.rendered = t.lane.scrollLeft;
            t.resumeAt = time + 0.8;
          }
          if (time < t.resumeAt || inspecting || !t.period) continue;
          t.position = gsap.utils.wrap(0, t.period, t.position + t.direction * Math.min(elapsed, 48) * 0.032);
          t.lane.scrollLeft = t.position;
          t.rendered = t.lane.scrollLeft;
        }
      };
      measure();
      const resize = new ResizeObserver(measure);
      tracks.forEach((t) => resize.observe(t.group));
      const view = new IntersectionObserver(([entry]) => {
        gsap.ticker.remove(tick);
        if (entry.isIntersecting) gsap.ticker.add(tick);
      });
      view.observe(el);
      return () => {
        resize.disconnect();
        view.disconnect();
        gsap.ticker.remove(tick);
      };
    });
    return () => mm.revert();
  });

  return (
    <div ref={root} data-paused={paused} className={cn("overflow-clip", className)}>
      <div ref={strip} className="py-5">
        <div className="-mx-8 grid rotate-2 gap-3">
          {rows.map((row, ri) => (
            <div
              key={ri}
              data-lane
              aria-label={ri === 0 ? "Cars, first row" : "Cars, second row"}
              className="no-scrollbar flex overflow-x-auto overflow-y-hidden py-2 [overflow-anchor:none] [overscroll-behavior-x:contain]"
            >
              {[0, 1, 2].map((copy) => (
                <div key={copy} data-lane-group className="flex flex-none gap-4 pr-4" aria-hidden={copy ? true : undefined}>
                  {row.map((car) => (
                    <div key={car.slug} data-lane-card className="w-[min(72vw,280px)] flex-none">
                      <Link
                        href={`/cars/${car.slug}/`}
                        tabIndex={copy ? -1 : undefined}
                        className="group relative block overflow-hidden rounded-2xl bg-sand shadow-card"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={car.img.src}
                          alt={copy ? "" : car.img.alt}
                          width={car.img.w}
                          height={car.img.h}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[1.5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                        <span className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/70 to-transparent" aria-hidden />
                        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-brand-700">{car.tag}</span>
                        <span className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-2 text-white">
                          <span className="text-sm font-semibold">{car.name}</span>
                          <span className="shrink-0 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold">{car.price}</span>
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="container-x mt-2 flex items-center justify-between text-xs text-muted">
        <span>Swipe the rows or tap a car to see prices and book.</span>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Resume car rows motion" : "Pause car rows motion"}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-medium hover:text-brand-700 motion-reduce:hidden"
        >
          {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal                                                              */
/* ------------------------------------------------------------------ */

/** Staggered slide-in for direct children marked with data-reveal */
export function Reveal({ children, className, as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "ul" | "ol" }) {
  const root = useRef<HTMLDivElement & HTMLUListElement & HTMLOListElement>(null);
  useLazyGsap((gsap) => {
      const mm = gsap.matchMedia();
      mm.add({ reduce: "(prefers-reduced-motion: reduce)", wide: "(min-width: 768px)" }, (ctx) => {
        const { reduce, wide } = ctx.conditions as { reduce: boolean; wide: boolean };
        // skip if already past (no flash of hidden cards) or reduced motion
        if (reduce || (root.current && root.current.getBoundingClientRect().top < innerHeight * 0.82)) return;
        const select = gsap.utils.selector(root);
        gsap
          .timeline({ defaults: { duration: 0.55, ease: "power3.out" }, scrollTrigger: { trigger: root.current, start: "top 82%", once: true } })
          .fromTo(select("[data-reveal]"), { opacity: 0.3, x: wide ? 28 : 12 }, { opacity: 1, x: 0, stagger: 0.13 }, 0)
          .fromTo(select("[data-reveal-icon]"), { scale: 0.55 }, { scale: 1, stagger: 0.13, ease: "back.out(1.5)" }, 0.08);
      });
      return () => mm.revert();
  });
  return (
    <Tag ref={root} className={className}>
      {children}
    </Tag>
  );
}
