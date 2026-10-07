#!/usr/bin/env node
/**
 * Captures a hero screenshot of every demo site into docs/screenshots/*.png
 * using headless Chromium via Playwright.
 *
 * Prerequisites:  npm i -D playwright   (plus a browser: `npx playwright install chromium`,
 *                 or set BROWSER_CHANNEL=msedge / chrome to use an installed one)
 * Usage:          node server.js &        # in another terminal (serves on :5182)
 *                 node scripts/screenshots.mjs [baseUrl]   (default http://127.0.0.1:5182)
 * The committed .jpg files were made from these PNGs with ImageMagick:
 *                 magick in.png -resize 1100x -strip -quality 80 out.jpg
 */
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://127.0.0.1:5182").replace(/\/$/, "");
const sites = ["aurion", "joes-coffee", "le-cercle", "lumiere", "monrion-travel"];
const out = fileURLToPath(new URL("../docs/screenshots/", import.meta.url));
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || undefined });
for (const site of sites) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/${site}/`, { waitUntil: "load" });
  await page.waitForTimeout(3500); // let fonts, remote photos and intro animations settle
  await page.screenshot({ path: `${out}${site}.png` });
  console.log("captured", site);
  await page.close();
}
await browser.close();
