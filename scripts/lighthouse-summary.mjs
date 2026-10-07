#!/usr/bin/env node
/**
 * Prints a Markdown table of the Lighthouse CI scores found in ./.lighthouseci.
 * In GitHub Actions the output is appended to the job summary.
 */
import { appendFileSync, existsSync, readdirSync, readFileSync } from "node:fs";

const dir = ".lighthouseci";
if (!existsSync(dir)) process.exit(0);

const rows = ["| Page | Performance | Accessibility | Best practices | SEO |", "|---|---|---|---|---|"];
for (const f of readdirSync(dir).filter((name) => /^lhr-.*\.json$/.test(name)).sort()) {
  const report = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
  const score = (key) => Math.round((report.categories[key]?.score ?? 0) * 100);
  const page = new URL(report.finalUrl).pathname;
  rows.push(`| ${page} | ${score("performance")} | ${score("accessibility")} | ${score("best-practices")} | ${score("seo")} |`);
}

const md = `## Lighthouse (advisory, one run per page, default mobile profile)\n\n${rows.join("\n")}\n`;
console.log(md);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
