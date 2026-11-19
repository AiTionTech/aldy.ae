"use client";

/*
  Animated review section (adapted from the 21st.dev "AnimatedTestimonials" block):
  heading + dots on the left, stacked review cards on the right that cross-fade / slide.
  Changes from the original for aldy.ae:
  - `motion/react` (already a dependency) with LazyMotion + `m` to keep home-page JS small
  - theme tokens instead of shadcn defaults (`muted` is a text colour in this theme)
  - cards stacked in one grid cell, so the height follows the longest review (no overflow)
  - no "trusted companies" logo cloud and no demo people – real reviews only
  - auto-rotate pauses on hover / focus / off screen / hidden tab, and is off for reduced motion
  - inactive cards are `inert` + aria-hidden so screen readers only read the visible review
*/

import { LazyMotion, MotionConfig, domAnimation, m, useInView, useReducedMotion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string | number;
  name: string;
  rating: number; // 1–5
  content: string;
  /** line under the name, e.g. "Google review · Mar 2026" */
  meta?: string;
  avatar?: string;
}

export interface AnimatedTestimonialsProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  testimonials?: Testimonial[];
  autoRotateInterval?: number;
  /** extra element under the dots, e.g. a "Read all reviews" link */
  action?: ReactNode;
  /** small icon shown next to the reviewer (e.g. Google "G") */
  sourceIcon?: ReactNode;
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const; // = --ease-smooth

// "hidden" is only ever applied after hydration (see `phase`), so the server HTML is always visible
const containerVariants = {
  hidden: { opacity: 1, transition: { duration: 0 } },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20, transition: { duration: 0 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function AnimatedTestimonials({
  title = "What our customers say",
  subtitle,
  badgeText,
  testimonials = [],
  autoRotateInterval = 6000,
  action,
  sourceIcon,
  className,
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const hold = useRef(false); // hover / focus
  const seen = useInView(sectionRef, { once: true, amount: 0.2 });
  const onScreen = useInView(sectionRef, { amount: 0.1 });
  const reduced = useReducedMotion();
  const count = testimonials.length;
  // entrance: visible by default (no-JS / SSR); hide + animate in only when still below the fold
  const [phase, setPhase] = useState<"hidden" | "visible">("visible");

  useEffect(() => {
    const el = sectionRef.current;
    if (reduced || !el || el.getBoundingClientRect().top < window.innerHeight * 0.82) return;
    setPhase("hidden");
  }, [reduced]);

  useEffect(() => {
    if (reduced || autoRotateInterval <= 0 || count <= 1 || !onScreen) return;
    const id = window.setInterval(() => {
      if (hold.current || document.hidden) return;
      setActiveIndex((i) => (i + 1) % count);
    }, autoRotateInterval);
    return () => window.clearInterval(id);
  }, [reduced, autoRotateInterval, count, onScreen]);

  if (count === 0) return null;

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <section
          ref={sectionRef}
          aria-roledescription="carousel"
          aria-label="Customer reviews"
          onMouseEnter={() => (hold.current = true)}
          onMouseLeave={() => (hold.current = false)}
          onFocus={() => (hold.current = true)}
          onBlur={() => (hold.current = false)}
          className={cn("overflow-hidden", className)}
        >
          <m.div
            initial={false}
            animate={seen ? "visible" : phase}
            variants={containerVariants}
            className="grid w-full grid-cols-[minmax(0,1fr)] items-center gap-12 md:grid-cols-2 lg:gap-20"
          >
            {/* Left: heading, dots, action */}
            <m.div variants={itemVariants} className="flex min-w-0 flex-col justify-center">
              {badgeText && (
                <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                  <Star className="size-3.5 fill-current" aria-hidden />
                  {badgeText}
                </p>
              )}
              <h2 className="h-section mt-4">{title}</h2>
              {subtitle && <p className="mt-4 max-w-xl text-pretty text-muted md:text-lg/relaxed">{subtitle}</p>}

              <div className="mt-8 flex flex-wrap items-center gap-1">
                {testimonials.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Show review ${i + 1} of ${count}`}
                    aria-current={activeIndex === i}
                    className="group grid h-6 min-w-6 place-items-center"
                  >
                    <span
                      className={cn(
                        "block h-2.5 rounded-full transition-all duration-300",
                        activeIndex === i ? "w-10 bg-brand-600" : "w-2.5 bg-line group-hover:bg-brand-200",
                      )}
                    />
                  </button>
                ))}
              </div>

              {action && <div className="mt-8">{action}</div>}
            </m.div>

            {/* Right: stacked cards (all in one grid cell) */}
            <m.div variants={itemVariants} className="relative mx-2 w-full min-w-0 justify-self-center sm:mx-6 md:max-w-lg md:justify-self-end">
              <span className="absolute -bottom-5 -left-5 size-24 rounded-3xl bg-brand-100" aria-hidden />
              <span className="absolute -top-5 -right-5 size-24 rounded-3xl bg-brand-50" aria-hidden />

              <div className="relative grid grid-cols-[minmax(0,1fr)]">
                {testimonials.map((t, i) => {
                  const active = activeIndex === i;
                  return (
                    <m.figure
                      key={t.id}
                      aria-roledescription="slide"
                      aria-label={`Review ${i + 1} of ${count}`}
                      aria-hidden={!active}
                      inert={!active}
                      className="min-w-0 [grid-area:1/1]"
                      initial={false}
                      animate={{ opacity: active ? 1 : 0, x: active ? 0 : 60, scale: active ? 1 : 0.94 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      style={{ zIndex: active ? 10 : 0, pointerEvents: active ? "auto" : "none" }}
                    >
                      {/* slate card with white text (same style as the About page stat cards) */}
                      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-brand-500 p-6 text-white shadow-card">
                        <span className="absolute -top-10 -right-10 size-36 rounded-full bg-white/10" aria-hidden />
                        <Quote className="absolute top-5 right-6 size-8 text-white/30" aria-hidden />
                        <div className="flex gap-1 text-accent-500" role="img" aria-label={`${t.rating} out of 5 stars`}>
                          {Array.from({ length: 5 }, (_, s) => (
                            <Star key={s} className={cn("size-4", s < t.rating ? "fill-current" : "text-white/30")} aria-hidden />
                          ))}
                        </div>

                        <blockquote className="mt-4 flex-1">
                          <p className="relative text-base leading-relaxed whitespace-pre-line text-pretty text-white/95">“{t.content}”</p>
                        </blockquote>

                        <Separator className="my-4 bg-white/20" />

                        <figcaption className="flex items-center gap-4">
                          <Avatar className="size-10 border border-white/25">
                            {t.avatar && <AvatarImage src={t.avatar} alt="" />}
                            <AvatarFallback className="bg-white/15 font-display font-semibold text-white">{t.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">{t.name}</p>
                            {t.meta && <p className="text-sm text-white/80">{t.meta}</p>}
                          </div>
                          {sourceIcon && <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white">{sourceIcon}</span>}
                        </figcaption>
                      </div>
                    </m.figure>
                  );
                })}
              </div>
            </m.div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}

export default AnimatedTestimonials;
