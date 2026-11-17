// Lightweight inline-SVG decorations that give the theme its "desert" character.

/** Soft sand dunes – sits at the bottom of a section */
export function Dunes({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden className={`pointer-events-none block h-16 w-full sm:h-24 ${className}`}>
      <path d="M0 80 C 240 20, 420 20, 640 60 S 1080 120, 1440 50 L1440 120 L0 120 Z" fill="var(--color-sand)" opacity="0.55" />
      <path d="M0 100 C 300 60, 520 70, 760 92 S 1200 110, 1440 84 L1440 120 L0 120 Z" fill="var(--color-surface)" />
    </svg>
  );
}

/** Hand-drawn underline for highlighted words in headings */
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden className={`absolute -bottom-2 left-0 h-3 w-full sm:h-4 ${className}`}>
      <path d="M3 12 C 60 4, 120 4, 170 9 S 260 15, 297 6" fill="none" stroke="var(--color-brand-300)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** Small sun mark used as a bullet / accent */
export function SunDot({ className = "size-2.5" }: { className?: string }) {
  return <span aria-hidden className={`inline-block rounded-full bg-gradient-to-br from-brand-300 to-brand-500 ${className}`} />;
}
