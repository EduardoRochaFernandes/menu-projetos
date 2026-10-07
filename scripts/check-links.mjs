#!/usr/bin/env node
/**
 * Offline link checker for the built Pages artifact (./_site).
 * Verifies that every local reference in HTML (src, href, poster, data-video,
 * srcset) and CSS (url(...)) resolves to a file, including under the
 * "/<repo>/" sub-path used by GitHub Pages. External URLs are not fetched.
 *
 * Usage: node scripts/check-links.mjs [basePrefix]   (default: /menu-projetos)
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const site = fileURLToPath(new URL("../_site", import.meta.url));
const base = (process.argv[2] ?? "/menu-projetos").replace(/\/$/, "");
const skip = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i; // http:, mailto:, tel:, data:, //cdn, #anchor

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

function refsOf(file, text) {
  const refs = [];
  if (extname(file) === ".html") {
    // (?<![\w-]) keeps "data-src" placeholders (resolved by JS at runtime) out of the check.
    for (const m of text.matchAll(/(?<![\w-])(?:src|href|poster|data-video)\s*=\s*"([^"]*)"/g)) refs.push(m[1]);
    for (const m of text.matchAll(/(?<![\w-])srcset\s*=\s*"([^"]*)"/g)) for (const part of m[1].split(",")) refs.push(part.trim().split(/\s+/)[0]);
  } else if (extname(file) === ".css") {
    for (const m of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) refs.push(m[1]);
  }
  return refs;
}

let checked = 0;
const missing = [];
for (const file of walk(site)) {
  if (![".html", ".css"].includes(extname(file))) continue;
  const text = readFileSync(file, "utf8");
  for (const raw of refsOf(file, text)) {
    if (!raw || skip.test(raw)) continue;
    const clean = decodeURIComponent(raw.split("#")[0].split("?")[0]);
    if (!clean) continue;
    let target;
    if (clean.startsWith("/")) {
      if (!clean.startsWith(base + "/")) { missing.push(`${file.replace(site, "")}: "${raw}" is root-absolute but outside ${base}/`); continue; }
      target = join(site, clean.slice(base.length));
    } else {
      target = resolve(dirname(file), clean);
    }
    checked++;
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
    if (!existsSync(target)) missing.push(`${file.replace(site, "")}: "${raw}" -> not found`);
  }
}
console.log(`Checked ${checked} local references.`);
if (missing.length) {
  console.error(`\n${missing.length} broken reference(s):\n` + missing.map((m) => "  " + m).join("\n"));
  process.exit(1);
}
console.log("No broken local links.");
