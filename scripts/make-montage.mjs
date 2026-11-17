// Builds a cinematic montage clip (slow zoom on each photo + crossfades) from still images,
// to be used as the hero video source. Output goes to hero_source/ (git-ignored); then run
//   npm run video -- hero_source/<name>.mp4 0 <duration printed below> "<source>" "<licence>"
//
// Usage: node scripts/make-montage.mjs <output name> <image1> <image2> ...   (paths relative to the repo)
// Example (current hero – Aldy's Rolls-Royce photos):
//   node scripts/make-montage.mjs rolls-royce-montage \
//     aldy_uploads/wp-content/uploads/2023/02/Phantom-6.png aldy_uploads/wp-content/uploads/2023/02/Cullinan-3.jpg ...
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const [name, ...images] = process.argv.slice(2);
if (!name || images.length < 2) {
  console.error("Usage: node scripts/make-montage.mjs <output name> <image1> <image2> [...]");
  process.exit(1);
}
const SHOT = 3.6; // seconds per photo (incl. transition)
const FADE = 0.8; // crossfade length
const FPS = 30;
const frames = Math.round(SHOT * FPS);

const outDir = path.join(process.cwd(), "hero_source");
await fs.mkdir(outDir, { recursive: true });
const out = path.join(outDir, `${name}.mp4`);

// single still per input – zoompan (d = frames) expands it into a SHOT-second clip
const inputs = images.flatMap((img) => ["-i", img]);
const parts = [];
images.forEach((_, i) => {
  // alternate gentle push-in / pull-back so the montage feels alive but calm
  const zoom = i % 2 === 0 ? `1+0.0011*on` : `1.12-0.0011*on`;
  parts.push(
    `[${i}:v]scale=3840:2160:force_original_aspect_ratio=increase,crop=3840:2160,` +
      `zoompan=z='${zoom}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=${FPS},setsar=1,format=yuv420p[v${i}]`,
  );
});
let last = "v0";
for (let i = 1; i < images.length; i++) {
  const offset = (i * (SHOT - FADE)).toFixed(2);
  const label = i === images.length - 1 ? "vout" : `x${i}`;
  parts.push(`[${last}][v${i}]xfade=transition=fade:duration=${FADE}:offset=${offset}[${label}]`);
  last = label;
}
const duration = (images.length * SHOT - (images.length - 1) * FADE).toFixed(1);

execFileSync(
  ffmpeg,
  ["-hide_banner", "-loglevel", "error", "-y", ...inputs, "-filter_complex", parts.join(";"), "-map", "[vout]", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", out],
  { stdio: "inherit" },
);
console.log(`Montage written: ${path.relative(process.cwd(), out)} (${duration} s)`);
