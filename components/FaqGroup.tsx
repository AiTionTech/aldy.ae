"use client";

/*
  Wrapper for FaqList: only one answer open at a time.
  The <details> elements also share a `name` (native exclusive accordion, works without JS in current
  browsers); this listener is the fallback for older browsers. It also opens the question named in the
  URL hash (e.g. /faq/#insurance) and scrolls it into view.
*/

import { useEffect, useRef } from "react";

export default function FaqGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // "toggle" does not bubble – listen in the capture phase
    const onToggle = (e: Event) => {
      const opened = e.target as HTMLDetailsElement;
      if (!(opened instanceof HTMLDetailsElement) || !opened.open) return;
      el.querySelectorAll("details[open]").forEach((d) => d !== opened && d.removeAttribute("open"));
    };
    el.addEventListener("toggle", onToggle, true);

    const openFromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const target = id ? el.querySelector<HTMLDetailsElement>(`details[id="${CSS.escape(id)}"]`) : null;
      if (!target) return;
      target.open = true;
      target.scrollIntoView({ block: "start" });
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);

    return () => {
      el.removeEventListener("toggle", onToggle, true);
      window.removeEventListener("hashchange", openFromHash);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
