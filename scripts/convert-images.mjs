// Converts the original WordPress uploads to optimised WebP files.
// Usage: npm run images   (needs ./aldy_uploads and ./aldy_theme_assets locally – they are git-ignored)
// Output: public/images/** (committed) + data/image-manifest.json (width/height for every image)
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const UPLOADS = path.join(ROOT, "aldy_uploads");
const THEME = path.join(ROOT, "aldy_theme_assets/wp-content/themes/carrental/assets/img");
const OUT = path.join(ROOT, "public/images");

const cars = JSON.parse(await fs.readFile(path.join(ROOT, "data/cars.json"), "utf8"));

// Blog covers: new slug -> original file (the road-trips original is missing from the uploads zip)
const BLOG = {
  "a-guide-to-renting-a-luxury-car-in-dubai": "wp-content/uploads/2023/01/sonnie-hiles-PUBt7UPbJFY-unsplash-1-2.jpg",
  "road-trips-from-dubai": "wp-content/uploads/2023/09/rental-car-tips.webp",
  "quick-rental-car-tips": "wp-content/uploads/2023/09/marius-muresan-hcn12YN0ckM-unsplash-scaled.webp",
};

async function convert(src, dest, { width = 1600, quality = 80, thumb = true } = {}) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const img = sharp(src).rotate(); // respect EXIF orientation
  const encode = (q) => img.clone().resize({ width, withoutEnlargement: true }).webp({ quality: q }).toFile(dest);
  let out = await encode(quality);
  // keep big photos inside the 100–300 KB target
  for (const q of [72, 65]) {
    if (out.size <= 300 * 1024) break;
    out = await encode(q);
  }
  if (thumb) {
    // 600 = cards, 1000 = main photo on phones/tablets, 200 = gallery thumbnails
    for (const [w, q] of [[600, 75], [1000, 78], [200, 70]]) {
      await img.clone().resize({ width: w, withoutEnlargement: true }).webp({ quality: q }).toFile(dest.replace(/\.webp$/, `-${w}.webp`));
    }
  }
  return { w: out.width, h: out.height, kb: Math.round(out.size / 1024) };
}

const manifest = { cars: {}, blog: {}, hero: null, team: {} };
let total = 0;

for (const car of cars.filter((c) => c.status === "active")) {
  manifest.cars[car.slug] = [];
  for (const [i, rel] of car.images_old.entries()) {
    const n = i + 1;
    const dest = path.join(OUT, "cars", car.slug, `${n}.webp`);
    const r = await convert(path.join(UPLOADS, rel), dest);
    const base = `/images/cars/${car.slug}/${n}`;
    manifest.cars[car.slug].push({ src: `${base}.webp`, md: `${base}-1000.webp`, thumb: `${base}-600.webp`, mini: `${base}-200.webp`, w: r.w, h: r.h });
    total++;
    if (r.kb > 350) console.warn(`  large: ${car.slug}/${n}.webp ${r.kb} KB`);
  }
  console.log(`${car.slug}: ${car.images_old.length} images`);
}

for (const [slug, rel] of Object.entries(BLOG)) {
  const dest = path.join(OUT, "blog", `${slug}.webp`);
  const r = await convert(path.join(UPLOADS, rel), dest, { width: 1400 });
  manifest.blog[slug] = { src: `/images/blog/${slug}.webp`, md: `/images/blog/${slug}-1000.webp`, thumb: `/images/blog/${slug}-600.webp`, w: r.w, h: r.h };
  total++;
}

// Hero: Rolls-Royce Phantom studio shot on white → transparent cut-out (flood fill from the edges only,
// so white highlights on the car itself stay opaque). Avoids a costly CSS mix-blend-mode on the hero.
{
  const src = path.join(UPLOADS, cars.find((c) => c.slug === "rolls-royce-phantom").images_old[0]);
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const isBg = (i) => data[i] > 232 && data[i + 1] > 232 && data[i + 2] > 232;
  const seen = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p] || !isBg(p * 4)) continue;
    seen[p] = 1;
    data[p * 4 + 3] = 0;
    const x = p % W;
    if (x > 0) stack.push(p - 1);
    if (x < W - 1) stack.push(p + 1);
    if (p >= W) stack.push(p - W);
    if (p < W * (H - 1)) stack.push(p + W);
  }
  const cut = await sharp(data, { raw: info }).trim().png().toBuffer();
  const out = await sharp(cut).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 90 }).toFile(path.join(OUT, "hero-phantom.webp"));
  await sharp(cut).resize({ width: 640 }).webp({ quality: 78, alphaQuality: 85 }).toFile(path.join(OUT, "hero-phantom-640.webp"));
  manifest.hero = { src: "/images/hero-phantom.webp", thumb: "/images/hero-phantom-640.webp", w: out.width, h: out.height };
  console.log(`hero cut-out ${out.width}x${out.height} ${Math.round(out.size / 1024)} KB`);
}

// Team portraits for /about/: team_photos/<slug>.(jpg|jpeg|png|webp) → square crop around the face

{
  const dir = path.join(ROOT, "team_photos");
  const files = await fs.readdir(dir).catch(() => []);
  for (const file of files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
    const slug = path.basename(file, path.extname(file)).toLowerCase();
    const src = path.join(dir, file);
    await fs.mkdir(path.join(OUT, "team"), { recursive: true });
    // "attention" focuses the crop on the most interesting region (usually the face)
    const square = (size) => sharp(src).rotate().resize(size, size, { fit: "cover", position: sharp.strategy.attention });
    await square(800).webp({ quality: 80 }).toFile(path.join(OUT, "team", `${slug}.webp`));
    await square(400).webp({ quality: 78 }).toFile(path.join(OUT, "team", `${slug}-400.webp`));
    manifest.team[slug] = { src: `/images/team/${slug}.webp`, thumb: `/images/team/${slug}-400.webp`, w: 800, h: 800 };
    console.log(`team: ${slug}`);
  }
}

// Logo (black wordmark, transparent) + favicon / icons
await fs.mkdir(path.join(OUT, "brand"), { recursive: true });
await sharp(path.join(THEME, "footer-logo.png")).png().toFile(path.join(OUT, "brand/logo.png"));
// Favicon: the real Aldy favicon (white "a" on black) from the old site, copied unchanged (32×32).
const FAVICON = path.join(UPLOADS, "wp-content/uploads/2023/01/Favicon.png");
await fs.copyFile(FAVICON, path.join(ROOT, "app/icon.png"));
// Larger icons (Apple touch icon, structured-data logo): same design, but the 32 px original would be blurry,
// so the "a" is taken from the high-resolution logo and placed white-on-black like the original favicon.
{
  const logo = path.join(THEME, "footer-logo.png");
  const box = { left: 2, top: 23, width: 57, height: 57 }; // the "a" of the "aldy" wordmark
  const alpha = await sharp(logo).ensureAlpha().extract(box).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const raw = { width: alpha.info.width, height: alpha.info.height, channels: 1 };
  const glyph = await sharp({ create: { width: raw.width, height: raw.height, channels: 3, background: "#fff" } }).joinChannel(alpha.data, { raw }).png().toBuffer();
  for (const [size, file] of [[180, path.join(ROOT, "app/apple-icon.png")], [512, path.join(OUT, "brand/icon-512.png")]]) {
    const g = await sharp(glyph).resize({ width: Math.round(size * 0.72) }).toBuffer({ resolveWithObject: true });
    await sharp({ create: { width: size, height: size, channels: 3, background: "#000" } })
      .composite([{ input: g.data, left: Math.round((size - g.info.width) / 2), top: Math.round((size - g.info.height) / 2) }])
      .png()
      .toFile(file);
  }
}

await fs.writeFile(path.join(ROOT, "data/image-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Done: ${total} images -> public/images, manifest -> data/image-manifest.json`);
