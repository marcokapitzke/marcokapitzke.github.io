import { access, readFile, stat } from "node:fs/promises";
import { profile } from "../src/profile.mjs";

const requiredFiles = [
  "index.html",
  "src/profile.mjs",
  "src/render.mjs",
  "src/main.js",
  "src/styles.css",
  "public/favicon.svg",
  "public/og-card.svg",
  "public/portrait-marco-512.jpg",
  "public/CV_MK-13.pdf",
  "README.md",
  "PLAN.md",
  "DESIGN_BRIEF.md",
  "ITERATION_LOG.md"
];

const requiredSnippets = [
  profile.name,
  profile.email,
  profile.linkedIn,
  "Manufacturing Analytics",
  "ChemPhotoChem",
  "JungesChemieForum",
  "Download CV",
  "application/ld+json",
  "prefers-reduced-motion"
];

const forbiddenSnippets = [
  "Lorem ipsum",
  "TODO",
  "TBD",
  "placeholder",
  "Your Name",
  "example.com"
];

async function assertFile(path) {
  await access(path);
}

async function main() {
  for (const file of requiredFiles) {
    await assertFile(file);
  }

  const pdfStats = await stat("public/CV_MK-13.pdf");
  if (pdfStats.size < 10_000) {
    throw new Error("CV PDF appears too small or missing content.");
  }

  const html = await readFile("index.html", "utf8");
  const css = await readFile("src/styles.css", "utf8");
  const js = await readFile("src/main.js", "utf8");

  for (const snippet of requiredSnippets) {
    const haystack = snippet === "prefers-reduced-motion" ? css : html;
    if (!haystack.includes(snippet)) {
      throw new Error(`Missing required snippet: ${snippet}`);
    }
  }

  for (const snippet of forbiddenSnippets) {
    if (`${html}\n${css}\n${js}`.toLowerCase().includes(snippet.toLowerCase())) {
      throw new Error(`Forbidden placeholder-like text found: ${snippet}`);
    }
  }

  const localRefs = [...html.matchAll(/(?:href|src|content)="(public\/[^"]+|src\/[^"]+)"/g)].map(
    (match) => match[1]
  );

  for (const ref of localRefs) {
    await assertFile(ref.split("?")[0]);
  }

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  const hashRefs = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);

  for (const hash of hashRefs) {
    if (!ids.has(hash)) {
      throw new Error(`Broken in-page anchor: #${hash}`);
    }
  }

  const mailto = `mailto:${profile.email}`;
  if (!html.includes(mailto)) {
    throw new Error("Email mailto link missing.");
  }

  if (!html.includes('lang="en"')) {
    throw new Error("HTML language attribute missing.");
  }

  console.log("Site validation passed.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
