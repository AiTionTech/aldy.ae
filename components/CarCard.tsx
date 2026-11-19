import Link from "next/link";
import { ArrowRight, Fuel, Settings2, Users } from "lucide-react";
import type { CardCar } from "@/lib/cars";
import { carPath, categories } from "@/lib/cars";
import { formatAED } from "@/lib/format";
import CardPhotos from "./CardPhotos";

/*
  Slate car card (user asked for no white, "not too dark" – same slate as the About stat cards): photo (cross-fades through a few photos) with dark labels,
  one charcoal body with name, spec chips and the day/month price + "Book" button (no separate dark bar).
  The corner light circle stays inside the grey body (clipped – it never covers the photo).
*/
export default function CarCard({ car, priority = false, query = "" }: { car: CardCar; priority?: boolean; query?: string }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-brand-500 text-white shadow-card transition-[box-shadow,transform,border-color] duration-500 hover:-translate-y-1.5 hover:border-accent-500/60 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <CardPhotos images={car.images} priority={priority} />
        {/* soft shade at the top so the labels read on light photos */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/35 to-transparent" aria-hidden />
        <span className="absolute top-3 left-3 rounded-full bg-brand-500/90 px-3 py-1 text-xs font-semibold text-white">{categories[car.category].label}</span>
        {car.colours && (
          <span className="absolute top-3 right-3 flex gap-1 rounded-full bg-brand-500/90 px-2 py-1.5" role="img" aria-label={`Available in ${car.colours.length} colours`}>
            {car.colours.map((c) => (
              <span key={c.name} className="size-3 rounded-full ring-1 ring-white/40" style={{ background: c.swatch }} />
            ))}
          </span>
        )}
      </div>

      {/* one grey body; overflow-hidden keeps the corner light inside it (never over the photo) */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <span className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-125" aria-hidden />
        <div className="relative p-5 pb-4">
          <p className="text-xs font-semibold tracking-[0.12em] text-white/80 uppercase">
            {car.bodyType} · {car.year}
          </p>
          <h3 className="mt-1.5 text-lg font-bold">
            <Link href={`${carPath(car)}${query}`} className="after:absolute after:inset-0">
              {car.name}
            </Link>
          </h3>
          {/* spec chips */}
          <ul className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-white">
            {[
              { Icon: Users, text: `${car.seats} seats` },
              { Icon: Settings2, text: car.transmission },
              { Icon: Fuel, text: car.fuelType },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15 ring-inset">
                <Icon className="size-3.5 text-accent-500" aria-hidden /> {text}
              </li>
            ))}
          </ul>
        </div>

        {/* price row */}
        <div className="relative mx-5 mt-auto flex items-center justify-between gap-3 border-t border-white/15 py-4">
          <p>
            <span className="text-xl font-bold text-accent-500">{formatAED(car.price.day)}</span>
            <span className="text-sm text-white/85"> / day</span>
            {car.price.month != null && <span className="block text-xs text-white/80">{formatAED(car.price.month)} / month</span>}
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-xs font-semibold text-brand-700 transition-colors duration-300 group-hover:bg-accent-600">
            Book <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}
