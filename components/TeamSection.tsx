import manifest from "@/data/image-manifest.json";
import { team } from "@/content/team";
import { site } from "@/lib/site";
import { LinkedInIcon } from "./icons";
import { SectionHeading } from "./common";
import { Reveal } from "./ui/car-motion";

type Photo = { src: string; thumb: string; w: number; h: number };
const photos = (manifest as { team?: Record<string, Photo> }).team ?? {};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

/** "Meet the team" for /about/ – real managers from content/team.ts; renders nothing while the list is empty */
export default function TeamSection() {
  if (!team.length) return null;
  return (
    <section className="container-x pb-6" aria-labelledby="team-title">
      <div id="team-title">
        <SectionHeading eyebrow="Our team" title="Meet the people behind Aldy" intro="Talk to the team that runs Aldy Rent A Car day to day." />
      </div>
      <Reveal as="ul" className={`mt-10 grid gap-6 ${team.length > 1 ? "sm:grid-cols-2" : ""} ${team.length > 2 ? "lg:grid-cols-3" : "max-w-4xl"}`}>
        {team.map((m, i) => {
          const photo = photos[m.slug];
          return (
            <li key={m.slug} data-reveal className="flex flex-col items-center rounded-[2rem] border border-line bg-white p-7 text-center shadow-card sm:flex-row sm:items-center sm:gap-6 sm:text-left">
              <div className="relative shrink-0">
                {/* tilted pastel backplate (theme accent) */}
                <span className={`absolute inset-0 rounded-[2rem] ${i % 2 ? "-rotate-6 bg-sea-100" : "rotate-6 bg-brand-100"}`} aria-hidden />
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.thumb}
                    srcSet={`${photo.thumb} 400w, ${photo.src} 800w`}
                    sizes="160px"
                    alt={`${m.name}, ${m.role} at ${site.name}`}
                    width={400}
                    height={400}
                    loading="lazy"
                    className="relative size-36 rounded-[2rem] object-cover sm:size-40"
                  />
                ) : (
                  <span className="relative grid size-36 place-items-center rounded-[2rem] bg-surface font-display text-4xl font-bold text-brand-700 sm:size-40" aria-hidden>
                    {initials(m.name)}
                  </span>
                )}
              </div>
              <div className="mt-6 sm:mt-0">
                <h3 className="text-xl font-bold">{m.name}</h3>
                <p className="mt-0.5 text-sm font-semibold text-brand-600">{m.role}</p>
                {m.bio && <p className="mt-3 text-sm leading-6 text-muted">{m.bio}</p>}
                {m.linkedin && (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${m.name} on LinkedIn`}
                    className="mt-4 inline-grid size-10 place-items-center rounded-full border border-line text-ink/70 hover:border-brand-300 hover:text-brand-700"
                  >
                    <LinkedInIcon className="size-4" />
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </Reveal>
    </section>
  );
}
