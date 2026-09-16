/* Temporary diagnostic: verifies the intro overlay's dot glyph (size, color,
 * halo ring) and that the letter walk spells the name one letter at a time.
 * Delete after use (cleanup pass). */
import puppeteer from "puppeteer-core";

const BASE = process.env.CHECK_URL ?? "http://localhost:3100";
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--disable-gpu", "--no-first-run", "--no-default-browser-check"],
});

const results = {};
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  page.on("pageerror", (e) => console.log("PAGE-ERROR:", e.message));

  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector("[data-intro='dot']", { timeout: 30000 });

  /* Dot geometry + color. */
  results.dotStyle = await page.$eval("[data-intro='dot']", (el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      width: Math.round(r.width),
      height: Math.round(r.height),
      radius: cs.borderRadius,
      background: cs.backgroundColor,
      boxShadow: cs.boxShadow,
    };
  });

  /* Letter walk: collect the distinct glyphs shown over ~2.2s. */
  const shown = [];
  for (let i = 0; i < 44; i++) {
    const text = await page
      .$eval("[data-intro='letter']", (el) => el.textContent)
      .catch(() => "<gone>");
    if (text !== "<gone>" && shown[shown.length - 1] !== text) shown.push(text);
    if (text === "<gone>") {
      shown.push("<gone>");
      break;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  results.walk = shown;
  results.spellsName =
    shown.join("").replace(/\u00A0/g, " ") === "JIHAD CHAALAN" ||
    shown.join("").replace(/\u00A0/g, " ").startsWith("JIHAD CHAALAN");

  /* Hand-off. */
  results.overlayRemoved = (await page.$$("[data-intro='dot']")).length === 0;
  results.scrollUnlocked = await page.evaluate(
    () => document.body.style.overflow !== "hidden",
  );
} finally {
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}