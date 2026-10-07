#!/usr/bin/env node
/**
 * Builds the GitHub Pages artifact into ./_site.
 *
 * The two Next.js static exports (lumiere/, monrion-travel/) were built with
 * basePath "/<name>" and therefore reference "/<name>/_next/...". Under
 * GitHub Pages the site lives at "/<repo>/", so those absolute paths must be
 * prefixed. The source folders stay untouched (so `node server.js` keeps working
 * at the domain root); the rewrite is applied only to the copy in _site.
 *
 * Usage: node scripts/build-pages.mjs [basePrefix]   (default: /menu-projetos)
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, "_site");
const base = (process.argv[2] ?? "/menu-projetos").replace(/\/$/, "");

const copy = ["index.html", "aurion", "joes-coffee", "le-cercle", "lumiere", "monrion-travel", "docs/screenshots"];
const nextApps = ["lumiere", "monrion-travel"];
const textExt = new Set([".html", ".txt", ".js", ".css", ".json"]);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const p of copy) cpSync(join(root, p), join(out, p), { recursive: true });
writeFileSync(join(out, ".nojekyll"), "");

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

let rewritten = 0;
for (const app of nextApps) {
  // "/app/..." (and the JSON-escaped form) -> "<base>/app/..."; never touch an already-prefixed path.
  const re = new RegExp(`(?<!${base.replace(/\//g, "\/")})(["'(=,\[ ])/${app}/`, "g");
  for (const file of walk(join(out, app))) {
    if (!textExt.has(extname(file))) continue;
    const src = readFileSync(file, "utf8");
    const dst = src.replace(re, `$1${base}/${app}/`);
    if (dst !== src) { writeFileSync(file, dst); rewritten++; }
  }
}
console.log(`Built ${out} (base "${base}", ${rewritten} files rewritten)`);
