import Link from "next/link";
import { Fuel, Settings2, Users } from "lucide-react";
import type { CardCar } from "@/lib/cars";
import { carPath, categories } from "@/lib/cars";
import { formatAED } from "@/lib/format";

export default function CarCard({ car, priority = false, query = "" }: { car: CardCar; priority?: boolean; query?: string }) {
  const img = car.images[0];
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card transition-shadow hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img.thumb}
            alt={img.alt}
            width={600}
            height={Math.round((600 * img.h) / img.w)}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold">
          {categories[car.category].label}
        </span>
        {car.colours && (
          <span className="absolute top-3 right-3 flex gap-1 rounded-full bg-white/90 px-2 py-1.5" role="img" aria-label={`Available in ${car.colours.length} colours`}>
            {car.colours.map((c) => (
              <span key={c.name} className="size-3 rounded-full ring-1 ring-ink/15" style={{ background: c.swatch }} />
            ))}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-muted">
          {car.bodyType} · {car.year}
        </p>
        <h3 className="mt-1 text-lg font-bold">
          <Link href={`${carPath(car)}${query}`} className="after:absolute after:inset-0">
            {car.name}
          </Link>
        </h3>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <li className="flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden /> {car.seats} seats
          </li>
          <li className="flex items-center gap-1.5">
            <Settings2 className="size-3.5" aria-hidden /> {car.transmission}
          </li>
          <li className="flex items-center gap-1.5">
            <Fuel className="size-3.5" aria-hidden /> {car.fuelType}
          </li>
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p>
            <span className="text-xl font-bold">{formatAED(car.price.day)}</span>
            <span className="text-sm text-muted"> / day</span>
            {car.price.month != null && <span className="block text-xs text-muted">{formatAED(car.price.month)} / month</span>}
          </p>
          <span className="rounded-full bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">Book</span>
        </div>
      </div>
    </article>
  );
}
