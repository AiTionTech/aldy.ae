// Builds a CSV of every image on the site for the client to check (which photo, where it is used,
// alt text, size, link to the live file, and the original file it came from).
// Usage: npm run images:csv [-- <base url>]   → reports/aldy-images.csv (opens in Excel / Google Sheets)
// Default base URL = the Cloudflare test deploy; pass https://aldy.ae after the DNS switch.
import fs from "node:fs";
import path from "node:path";
import { cars, carPath, categories } from "../lib/cars";
import { posts } from "../content/blog";
import manifest from "../data/image-manifest.json";
import videoManifest from "../data/video-manifest.json";

const BASE = (process.argv[2] ?? "https://aldy-pages-dev.aitiontechsl.workers.dev").replace(/\/$/, "");
const ROOT = process.cwd();
const raw: { slug: string; images_old: string[] }[] = JSON.parse(fs.readFileSync(path.join(ROOT, "data/cars.json"), "utf8"));
const original = (folderSlug: string, n: number) => raw.find((r) => r.slug === folderSlug)?.images_old[n - 1] ?? "";
const kb = (p: string) => {
  try {
    return Math.round(fs.statSync(path.join(ROOT, "public", p)).size / 1024);
  } catch {
    return "";
  }
};

const header = [
  "No",
  "Section",
  "Car / page",
  "Colour",
  "Photo no",
  "Where it is shown",
  "Alt text (description for Google & screen readers)",
  "Width px",
  "Height px",
  "File size KB",
  "Image URL",
  "Page URL",
  "Original file (old website)",
  "Our note",
  "CLIENT: Correct? (Yes / No)",
  "CLIENT: Change needed (replace / remove / reorder / new alt text)",
];
const rows: (string | number)[][] = [];
const add = (r: Omit<Record<string, string | number>, never>) => rows.push([rows.length + 1, ...header.slice(1).map((h) => r[h] ?? "")]);

// known notes per car (from the audit / CLAUDE.md "still open")
const carNote: Record<string, string> = {
  "rolls-royce-phantom": "Some Rolls-Royce photos look like manufacturer press images – please confirm Aldy may use them, or send own photos",
  "rolls-royce-ghost": "Some Rolls-Royce photos look like manufacturer press images – please confirm Aldy may use them, or send own photos",
  "rolls-royce-cullinan": "Some Rolls-Royce photos look like manufacturer press images – please confirm Aldy may use them, or send own photos",
  "jac-j7-black": "On the old site these files were named \"White\" – please confirm they show the BLACK car",
};

for (const car of cars) {
  const groups = car.colours?.length ? car.colours.map((c) => ({ colour: c.name, images: c.images })) : [{ colour: "", images: car.images }];
  for (const { colour, images } of groups) {
    images.forEach((img, i) => {
      const n = i + 1;
      const folder = img.src.split("/")[3]; // /images/cars/<folder>/<n>.webp
      const firstColour = !colour || colour === car.colours?.[0]?.name;
      const where = !firstColour
        ? `Car page gallery when "${colour}" is picked${n === 1 ? " (main photo)" : ""}`
        : n === 1
          ? "Main photo on car page + first photo on car cards"
          : n <= 4
            ? "Car page gallery + rotating photo on car cards"
            : "Car page gallery";
      add({
        Section: `Car – ${categories[car.category].label}`,
        "Car / page": `${car.name} ${car.year}`,
        Colour: colour,
        "Photo no": n,
        "Where it is shown": where,
        "Alt text (description for Google & screen readers)": img.alt,
        "Width px": img.w,
        "Height px": img.h,
        "File size KB": kb(img.src),
        "Image URL": BASE + img.src,
        "Page URL": BASE + carPath(car),
        "Original file (old website)": original(folder, n),
        "Our note": carNote[folder] ?? "",
      });
    });
  }
}

const blogOriginal: Record<string, string> = {
  "a-guide-to-renting-a-luxury-car-in-dubai": "wp-content/uploads/2023/01/sonnie-hiles-PUBt7UPbJFY-unsplash-1-2.jpg",
  "road-trips-from-dubai": "wp-content/uploads/2023/09/rental-car-tips.webp",
  "quick-rental-car-tips": "wp-content/uploads/2023/09/marius-muresan-hcn12YN0ckM-unsplash-scaled.webp",
};
const blogCovers = manifest.blog as Record<string, { src: string; w: number; h: number }>;
for (const p of posts) {
  const c = blogCovers[p.slug];
  if (!c) continue;
  add({
    Section: "Blog",
    "Car / page": p.title,
    "Photo no": 1,
    "Where it is shown": "Blog post cover + blog list card",
    "Alt text (description for Google & screen readers)": "(decorative – the post title is shown next to it)",
    "Width px": c.w,
    "Height px": c.h,
    "File size KB": kb(c.src),
    "Image URL": BASE + c.src,
    "Page URL": `${BASE}/blog/${p.slug}/`,
    "Original file (old website)": blogOriginal[p.slug] ?? "",
    "Our note": /unsplash/i.test(blogOriginal[p.slug] ?? "")
      ? "Unsplash stock photo (free licence)"
      : p.slug === "road-trips-from-dubai"
        ? "Original cover was missing from the uploads – this is a stand-in image, please confirm or send a better one"
        : "",
  });
}

const hv = videoManifest.hero;
if (hv) {
  add({
    Section: "Home page",
    "Car / page": "Hero video – still image (shown before the video plays)",
    "Photo no": 1,
    "Where it is shown": "Top of the home page, behind the headline",
    "Alt text (description for Google & screen readers)": "(decorative background)",
    "Width px": hv.w,
    "Height px": hv.h,
    "File size KB": kb(hv.poster),
    "Image URL": BASE + hv.poster,
    "Page URL": `${BASE}/`,
    "Original file (old website)": hv.source,
    "Our note": "Montage of the Rolls-Royce photos – replace with Aldy's own video when available",
  });
  add({
    Section: "Home page",
    "Car / page": "Hero background video",
    "Where it is shown": "Top of the home page (plays muted, on loop)",
    "File size KB": kb(hv.mp4),
    "Image URL": BASE + hv.mp4,
    "Page URL": `${BASE}/`,
    "Original file (old website)": hv.source,
    "Our note": "Same as above – confirm the Rolls-Royce photos may be used",
  });
}

for (const [file, where, note] of [
  ["/images/brand/logo.png", "Header and footer logo", "Aldy logo from the old website theme"],
  ["/images/brand/icon-512.png", "App icon / Google logo for the business", "Built from the logo's \"a\""],
] as const) {
  add({ Section: "Logo", "Car / page": "Aldy Rent A Car logo", "Where it is shown": where, "File size KB": kb(file), "Image URL": BASE + file, "Page URL": `${BASE}/`, "Our note": note });
}

// "merged" look: name, section, page URL and note only on the first row of each car / page,
// colour only where it changes (CSV can't hold real merged cells)
const col = (h: string) => header.indexOf(h);
const GROUP = col("Car / page");
const ONCE = ["Section", "Car / page", "Page URL"].map(col);
const SAME = ["Colour", "Our note"].map(col); // blank only when equal to the row above
// walk backwards so the row above still holds its original values
for (let i = rows.length - 1; i > 0; i--) {
  const [prev, cur] = [rows[i - 1], rows[i]];
  if (prev[GROUP] !== cur[GROUP]) continue;
  for (const c of SAME) if (prev[c] === cur[c]) cur[c] = "";
  for (const c of ONCE) cur[c] = "";
}

const esc = (v: string | number) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const out = path.join(ROOT, "reports/aldy-images.csv");
fs.mkdirSync(path.dirname(out), { recursive: true });
// BOM so Excel opens the "–" and other characters correctly
fs.writeFileSync(out, "﻿" + [header, ...rows].map((r) => r.map(esc).join(",")).join("\r\n") + "\r\n");
console.log(`${rows.length} rows → ${path.relative(ROOT, out)} (links start with ${BASE})`);
