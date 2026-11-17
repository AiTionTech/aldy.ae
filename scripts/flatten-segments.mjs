// Next 16 static export writes segment-prefetch payloads as nested folders
//   out/cars/mazda-cx30/__next.cars/$d$slug/__PAGE__.txt
// but the client router requests them as flat, dot-joined files
//   /cars/mazda-cx30/__next.cars.$d$slug.__PAGE__.txt
// Without this step every <Link> prefetch 404s on a static host. Runs automatically after `npm run build`.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
let count = 0;

function flatten(segDir, prefix, targetDir) {
  for (const e of fs.readdirSync(segDir, { withFileTypes: true })) {
    const name = `${prefix}.${e.name}`;
    const p = path.join(segDir, e.name);
    if (e.isDirectory()) flatten(p, name, targetDir);
    else {
      fs.copyFileSync(p, path.join(targetDir, name));
      count++;
    }
  }
}

(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const p = path.join(dir, e.name);
    if (e.name.startsWith("__next.")) flatten(p, e.name, dir);
    else if (e.name !== "_next" && e.name !== "images") walk(p);
  }
})(OUT);

console.log(`flatten-segments: wrote ${count} prefetch files`);
