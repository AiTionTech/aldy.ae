"use client";

/*
  Site-wide scroll reveals (landing-page-design B7). Mounted once in app/layout.tsx.
  Adds .is-in to [data-reveal], [data-reveal-stagger] and [data-reveal-line] elements the first time they
  enter the viewport (never replays). Elements already on screen are revealed straight away.
  CSS lives in app/globals.css; nothing is hidden unless <html> has the .reveal class
  (added by the inline script in the layout only when JS runs and reduced motion is off).
  Re-scans after client-side navigation and when new content is added (e.g. car filters).
*/

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not(.is-in), [data-reveal-stagger]:not(.is-in), [data-reveal-line]:not(.is-in)";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("reveal")) return;
    root.dataset.revealReady = "1"; // tells the boot script's safety timer that reveals are running

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    // tracked per effect run (not on the element): after a route change or a dev re-mount the old observer is
    // gone, so elements that stay on screen (e.g. the footer) must be observed again by the new one
    const watched = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        if (el.hasAttribute("data-reveal-stagger")) {
          Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(i)));
        }
        io.observe(el);
      });
    };

    scan();
    // new cards (filters, colour picker) → watch them too
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}

/**
 * Inline script for <head>: enables reveals only when JS runs and motion is allowed.
 * Safety net: if ScrollReveal has not started 4 s after load (script error, blocked JS), show everything.
 */
export const revealBootScript = `try{var d=document.documentElement;if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("reveal");addEventListener("load",function(){setTimeout(function(){if(!d.dataset.revealReady)d.classList.remove("reveal")},4000)})}}catch(e){}`;
