/* Temporary diagnostic: verifies the hero intro plays end-to-end, including
 * the letter-by-letter scramble samples. Delete after use (cleanup pass). */
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
  await page.waitForSelector("[data-intro='letter']", { timeout: 30000 });

  /* Sample the single glyph during the scramble walk — every visible
   * sample must be exactly ONE character (one letter at a time). */
  const samples = [];
  for (let i = 0; i < 30; i++) {
    const text = await page
      .$eval("[data-intro='letter']", (el) => el.textContent)
      .catch(() => "<gone>");
    samples.push(text);
    await new Promise((r) => setTimeout(r, 100));
  }
  results.samples = samples;
  results.allSamplesSingleChar = samples.every(
    (s) => s === "<gone>" || s.length <= 1,
  );

  /* Final-state assertions. */
  results.overlayRemoved =
    (await page.$$("[data-intro='letter']")).length === 0;
  results.scrollUnlocked = await page.evaluate(
    () => document.body.style.overflow !== "hidden",
  );
  results.navVisible = await page.evaluate(() => {
    const el = document.querySelector("[data-intro='nav']");
    return el ? Number(getComputedStyle(el).opacity) > 0.9 : false;
  });
  results.heroContentVisible = await page.evaluate(() => {
    const selectors = [
      "[data-intro='eyebrow']",
      "[data-intro='wordmark']",
      "[data-intro='headline']",
      "[data-intro='paragraph']",
      "[data-intro='photo']",
    ];
    return selectors.every((s) => {
      const el = document.querySelector(s);
      return el ? Number(getComputedStyle(el).opacity) > 0.9 : false;
    });
  });
  results.primaryCtaFullOrange = await page.evaluate(() => {
    const el = document.querySelector("[data-intro='ctas'] > *");
    return el
      ? getComputedStyle(el).backgroundColor === "rgb(252, 125, 20)"
      : false;
  });
} finally {
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
