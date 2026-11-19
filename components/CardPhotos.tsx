"use client";

/*
  Car-card photo that cross-fades through a few photos on its own.
  - photo 1 is server-rendered exactly like before (LCP / CLS unchanged)
  - the other photos are only mounted once the card is on screen, and each is preloaded before it fades in
  - pauses off screen, on hover and in a hidden tab; off entirely for prefers-reduced-motion
  - cards start at different moments so a grid doesn't change all at once
*/

import { useEffect, useRef, useState } from "react";
import type { CarImage } from "@/lib/cars";

const INTERVAL = 3500;

/** resolves once the photo is downloaded + decoded (false if it failed) */
const preload = (src: string) => {
  const im = new Image();
  im.src = src;
  return im.decode().then(
    () => true,
    () => false,
  );
};

/** stable 0–1500 ms offset per car */
const offsetFor = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 1500;

export default function CardPhotos({ images, priority = false }: { images: CarImage[]; priority?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false); // extra photos in the DOM
  const visible = useRef(false);
  const hover = useRef(false);
  const count = images.length;

  useEffect(() => {
    const el = box.current;
    if (!el || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    let cancelled = false;
    let current = 0;

    const tick = async () => {
      if (cancelled) return;
      if (visible.current && !hover.current && !document.hidden) {
        const next = (current + 1) % count;
        const ok = await preload(images[next].thumb);
        if (cancelled) return;
        current = next; // a failed photo is skipped next time round
        if (ok) setActive(next);
      }
      timer = window.setTimeout(tick, INTERVAL);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        if (e.isIntersecting) setMounted(true);
      },
      { rootMargin: "100px" },
    );
    io.observe(el);
    // the card link's overlay sits above the photo, so listen on the whole card
    const card = el.closest("article") ?? el;
    const on = () => (hover.current = true);
    const off = () => (hover.current = false);
    card.addEventListener("pointerenter", on);
    card.addEventListener("pointerleave", off);
    card.addEventListener("focusin", on);
    card.addEventListener("focusout", off);
    timer = window.setTimeout(tick, INTERVAL + offsetFor(images[0].thumb));

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      io.disconnect();
      card.removeEventListener("pointerenter", on);
      card.removeEventListener("pointerleave", off);
      card.removeEventListener("focusin", on);
      card.removeEventListener("focusout", off);
    };
  }, [images, count]);

  const first = images[0];
  if (!first) return null;

  return (
    <div ref={box} className="absolute inset-0">
      {images.map((img, i) =>
        i === 0 || mounted ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.thumb}
            src={img.thumb}
            alt={i === active ? img.alt : ""}
            aria-hidden={i === active ? undefined : true}
            width={600}
            height={Math.round((600 * img.h) / img.w)}
            loading={i === 0 && !priority ? "lazy" : "eager"}
            fetchPriority={i === 0 && priority ? "high" : "auto"}
            decoding="async"
            className={`absolute inset-0 size-full object-cover transition-[opacity,scale] duration-700 group-hover:scale-[1.03] ${i === active ? "opacity-100" : "opacity-0"}`}
          />
        ) : null,
      )}
      {count > 1 && (
        <span className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden>
          {images.map((img, i) => (
            <span key={img.thumb} className={`h-1.5 rounded-full bg-white shadow-sm transition-all duration-300 ${i === active ? "w-4" : "w-1.5 opacity-60"}`} />
          ))}
        </span>
      )}
    </div>
  );
}
