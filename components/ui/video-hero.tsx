"use client";

/*
  Full-screen hero with a background video (idea from alfareedbm.com), built for speed:
  - the poster <img> is server-rendered and is the LCP element – the page never waits for the video
  - the <video> is only mounted after the page has loaded and the browser is idle, and never for
    prefers-reduced-motion, Data Saver or slow (2g/3g) connections
  - it pauses when scrolled off screen; no on-screen control (user choice) – reduced-motion visitors get the still poster
  - with no `video` prop (no clip added yet) it is a photo hero with the same overlay and layout
*/

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type HeroPoster = { src: string; srcSet?: string; w: number; h: number; alt?: string };
export type HeroVideo = { mp4: string; mp4Mobile?: string };

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

function shouldPlayVideo() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /(^|-)(2g|3g)$/.test(conn.effectiveType)) return false;
  return true;
}

export default function VideoHero({
  poster,
  video,
  children,
  footer,
  className,
}: {
  poster: HeroPoster;
  video?: HeroVideo;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false); // video element added to the DOM
  const [playing, setPlaying] = useState(false); // first frame is showing → fade in

  // mount the video only after load + idle, and only when it makes sense
  useEffect(() => {
    if (!video || !shouldPlayVideo()) return;
    let idle: number | undefined;
    let timer: number | undefined;
    const start = () => {
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(() => setMounted(true), { timeout: 3000 });
      else timer = window.setTimeout(() => setMounted(true), 800);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [video]);

  // pause off screen (saves battery and CPU), resume when the hero is visible again
  useEffect(() => {
    const el = root.current;
    const v = videoRef.current;
    if (!mounted || !el || !v) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  return (
    <section ref={root} className={cn("relative isolate -mt-[4.75rem] overflow-hidden bg-ink pt-[4.75rem] text-white", className)}>
      {/* background: poster (LCP) + optional video */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster.src}
          srcSet={poster.srcSet}
          sizes="100vw"
          alt=""
          width={poster.w}
          height={poster.h}
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover"
        />
        {mounted && video && (
          <video
            ref={videoRef}
            className={cn("absolute inset-0 size-full object-cover transition-opacity duration-1000", playing ? "opacity-100" : "opacity-0")}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={poster.src}
            onPlaying={() => setPlaying(true)}
          >
            {video.mp4Mobile && <source src={video.mp4Mobile} type="video/mp4" media="(max-width: 767px)" />}
            <source src={video.mp4} type="video/mp4" />
          </video>
        )}
        {/* dark overlay for white text (user choice: like alfareedbm.com) */}
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(36_32_27/0.45),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />
      </div>

      <div className="container-x relative flex min-h-[calc(86svh-4.75rem)] flex-col justify-center py-14 lg:py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">{children}</div>
      </div>

      {footer}
    </section>
  );
}
