// One-off diagnostic: loads the production site in headless Edge, flick-scrolls
// into the Contact section, and reports whether the FooterBounce SVG path
// actually bends (d attribute changes) plus any page console output.
import puppeteer from "puppeteer-core";

const EXE =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const URL = "http://localhost:3100";

const browser = await puppeteer.launch({ executablePath: EXE, headless: true });
const page = await browser.newPage();
const logs = [];
page.on("console", (m) => logs.push(m.text()));
page.on("pageerror", (e) => logs.push("PAGEERROR: " + e.message));

await page.setViewport({ width: 1526, height: 800 });
await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 2500));

const grab = () =>
  page.evaluate(() =>
    [...document.querySelectorAll("path")]
      .map((p) => p.getAttribute("d"))
      .filter((d) => d && d.startsWith("M 0 0 Q")),
  );

const before = await grab();
console.log("PATH-BEFORE:", JSON.stringify(before));

// Fast flick scrolling (≈8800px/s) to build real scroll velocity.
for (let i = 0; i < 25; i++) {
  await page.evaluate(() => window.scrollBy(0, 220));
  await new Promise((r) => setTimeout(r, 25));
}
await new Promise((r) => setTimeout(r, 250));

const during = await grab();
console.log("PATH-DURING:", JSON.stringify(during));

// Give the elastic settle time to finish, then compare.
await new Promise((r) => setTimeout(r, 2500));
const after = await grab();
console.log("PATH-AFTER:", JSON.stringify(after));

console.log("PAGE-CONSOLE:\n" + logs.join("\n"));
await browser.close();
process.exit(0);