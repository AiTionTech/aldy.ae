// Post-build checks on ./out (run: npm run verify). Exits 1 on any failure.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const errors = [];
const warn = [];

const htmlFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "_next" && e.name !== "images") walk(p);
    } else if (e.name === "index.html") htmlFiles.push(p);
  }
})(OUT);

const route = (f) => {
  const rel = path.relative(OUT, path.dirname(f)).split(path.sep).join("/");
  return rel ? `/${rel}/` : "/";
};
const isErrorPage = (r) => r === "/404/" || r === "/_not-found/";
const exists = (url) => {
  const clean = url.replace(/^\//, "").replace(/\/$/, "");
  return fs.existsSync(path.join(OUT, clean, "index.html")) || (clean === "" && fs.existsSync(path.join(OUT, "index.html")));
};

// 1. Every redirect target exists
const redirects = fs
  .readFileSync(path.join(OUT, "_redirects"), "utf8")
  .split("\n")
  .filter((l) => l.trim() && !l.startsWith("#"));
for (const line of redirects) {
  const [from, to, status] = line.trim().split(/\s+/);
  if (!["301", "302"].includes(status)) errors.push(`_redirects: bad status in "${line}"`);
  if (!exists(to)) errors.push(`_redirects: target ${to} (from ${from}) does not exist`);
  if (exists(from) && !from.includes("*")) errors.push(`_redirects: source ${from} is also a real page (redirect will shadow it)`);
}

// 2. Per-page checks
const titles = new Map();
const descriptions = new Map();
const BANNED = [/\bDBC\b/, /quarries@/i, /Editors[’'] Choice/i, /toll[ -]free/i, /Frequently Ask Questions/, /Secure transaction/i, /Trusted payments?/i, /lorem ipsum/i, /\bTODO\b/];

for (const f of htmlFiles) {
  const r = route(f);
  const html = fs.readFileSync(f, "utf8");
  const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1 && r !== "/404/" && r !== "/_not-found/") errors.push(`${r}: ${h1} <h1> elements`);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!title) errors.push(`${r}: missing <title>`);
  else if (isErrorPage(r)) {
    /* Next emits the 404 page twice – skip uniqueness checks */
  }
  else (titles.get(title) ?? titles.set(title, []).get(title)).push(r);
  if (!desc) errors.push(`${r}: missing meta description`);
  else if (!isErrorPage(r)) (descriptions.get(desc) ?? descriptions.set(desc, []).get(desc)).push(r);
  if (r !== "/_not-found/" && r !== "/404/" && !html.includes('rel="canonical"')) errors.push(`${r}: missing canonical`);
  for (const b of BANNED) if (b.test(text)) errors.push(`${r}: contains banned text ${b}`);
  if (/NaN|undefined|AED null/.test(text)) errors.push(`${r}: contains NaN/undefined/null in visible text`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      errors.push(`${r}: invalid JSON-LD`);
    }
  }
  // internal links resolve
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = m[1];
    if (href.startsWith("/_next") || /\.(png|svg|webp|xml|txt|ico)$/.test(href)) {
      if (!href.startsWith("/_next") && !fs.existsSync(path.join(OUT, href))) errors.push(`${r}: broken asset link ${href}`);
      continue;
    }
    if (!exists(href)) errors.push(`${r}: broken link ${href}`);
  }
  for (const m of html.matchAll(/<img [^>]*src="(\/[^"]+)"/g)) if (!fs.existsSync(path.join(OUT, m[1]))) errors.push(`${r}: missing image ${m[1]}`);
  if (Buffer.byteLength(html) > 250_000) warn.push(`${r}: HTML is ${Math.round(Buffer.byteLength(html) / 1024)} KB`);
}
for (const [t, rs] of titles) if (rs.length > 1) errors.push(`Duplicate <title> "${t}" on ${rs.join(", ")}`);
for (const [, rs] of descriptions) if (rs.length > 1) errors.push(`Duplicate description on ${rs.join(", ")}`);

// 3. Sitemap ↔ pages
const sitemap = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>https:\/\/aldy\.ae([^<]*)<\/loc>/g)].map((m) => m[1]);
for (const u of sitemapUrls) if (!exists(u)) errors.push(`sitemap: ${u} does not exist`);
const pages = htmlFiles.map(route).filter((r) => !["/404/", "/_not-found/"].includes(r));
for (const p of pages) if (!sitemapUrls.includes(p)) warn.push(`sitemap: ${p} not listed`);

console.log(`Checked ${htmlFiles.length} pages, ${redirects.length} redirects, ${sitemapUrls.length} sitemap URLs.`);
warn.forEach((w) => console.warn("warn:", w));
if (errors.length) {
  errors.forEach((e) => console.error("FAIL:", e));
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log("All checks passed.");
