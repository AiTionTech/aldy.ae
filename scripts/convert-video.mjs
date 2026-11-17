// Turns a source clip into the home-page hero video (muted, looping, web-optimised) + poster images.
//
// Usage:
//   npm run video -- <input.mp4> [start seconds = 0] [duration seconds = 14] [source URL] [licence]
// Example (stock clip):
//   npm run video -- hero_source/dubai-road.mp4 3 14 "https://www.pexels.com/video/xxxxx/" "Pexels License"
//
// Writes public/video/hero-1280.mp4, hero-720.mp4, hero-poster.webp (1600 px), hero-poster-800.webp
// and data/video-manifest.json (read by app/page.tsx). Keep originals in hero_source/ (git-ignored).
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";

const [input, startArg = "0", durArg = "14", sourceUrl = "", licence = ""] = process.argv.slice(2);
if (!input) {
  console.error("Usage: npm run video -- <input video> [start s] [duration s] [source URL] [licence]");
  process.exit(1);
}
const ROOT = process.cwd();
const OUT = path.join(ROOT, "public/video");
await fs.mkdir(OUT, { recursive: true });
const start = String(Number(startArg) || 0);
const dur = String(Number(durArg) || 14);

const run = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });

// H.264 (plays everywhere, incl. iOS), no audio, moov atom up front so playback starts while downloading.
// Short crossfade-free loop: we just trim; pick a start/duration where the end matches the start reasonably.
const encode = (width, crf, maxrate, file) =>
  run([
    "-ss", start, "-t", dur, "-i", input,
    "-an",
    "-vf", `scale='min(${width},iw)':-2:flags=lanczos,fps=30,format=yuv420p`,
    "-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-crf", String(crf),
    "-maxrate", maxrate, "-bufsize", maxrate.replace("k", "") * 2 + "k",
    "-movflags", "+faststart",
    path.join(OUT, file),
  ]);

console.log("Encoding 1280 px …");
encode(1280, 28, "1800k", "hero-1280.mp4");
console.log("Encoding 720 px (phones) …");
encode(720, 30, "900k", "hero-720.mp4");

// poster = first frame of the trimmed clip, so the fade from poster → video is seamless
const frame = path.join(OUT, "poster-frame.png");
run(["-ss", start, "-i", input, "-frames:v", "1", frame]);
const posterMeta = await sharp(frame).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 72 }).toFile(path.join(OUT, "hero-poster.webp"));
await sharp(frame).resize({ width: 800 }).webp({ quality: 70 }).toFile(path.join(OUT, "hero-poster-800.webp"));
await fs.rm(frame);

const size = async (f) => Math.round((await fs.stat(path.join(OUT, f))).size / 1024);
const manifest = {
  hero: {
    mp4: "/video/hero-1280.mp4",
    mp4Mobile: "/video/hero-720.mp4",
    poster: "/video/hero-poster.webp",
    posterSmall: "/video/hero-poster-800.webp",
    w: posterMeta.width,
    h: posterMeta.height,
    source: sourceUrl || null,
    licence: licence || null,
    trimmed: { start: Number(start), duration: Number(dur) },
  },
};
await fs.writeFile(path.join(ROOT, "data/video-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
for (const f of ["hero-1280.mp4", "hero-720.mp4", "hero-poster.webp", "hero-poster-800.webp"]) console.log(`  ${f}: ${await size(f)} KB`);
console.log("Done → data/video-manifest.json. Rebuild the site to use the new video.");
