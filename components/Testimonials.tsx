/*
  Home-page Google reviews: maps content/testimonials.ts onto the animated review section
  (components/ui/animated-testimonials.tsx). Renders nothing until there are at least 3 real reviews.
  No Review / AggregateRating schema (Google ignores self-serving reviews).
*/

import type { Review } from "@/content/testimonials";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

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
  if (reviews.length < 3) return null;

  return (
    <AnimatedTestimonials
      className="container-x mt-24 py-4"
      badgeText={`${rating} ★ on Google`}
      title="What our customers say"
      subtitle="Real reviews from people who rented with Aldy Rent A Car, taken from our Google Business listing."
      testimonials={reviews.map((r) => ({
        id: r.name + r.date,
        name: r.name,
        rating: r.rating,
        content: r.text,
        meta: `Google review · ${formatMonth(r.date)}`,
      }))}
      sourceIcon={<GoogleG className="size-5 shrink-0" />}
      action={
        <a href={reviewsUrl} target="_blank" rel="noopener" className="btn-ghost">
          <GoogleG /> Read all reviews on Google
        </a>
      }
    />
  );
}
