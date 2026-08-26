import { chromium } from "playwright";

const out = "blog/2026-08-28-radar-n3/charts";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1400, height: 900 },
  deviceScaleFactor: 2,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
});

const page = await ctx.newPage();
await page.goto("https://fred.stlouisfed.org/series/GASDESW", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(8000);

const candidates = [
  ".highcharts-container",
  "#container .highcharts-container",
  "[data-testid='graph']",
  ".series-plot",
  "#graph",
  "div.fred-graph",
  ".js-plot",
];
for (const sel of candidates) {
  const n = await page.locator(sel).count();
  console.log(sel, n);
}

const chart = page.locator(".highcharts-container").first();
if (await chart.count()) {
  await chart.screenshot({ path: `${out}/fred-diesel.png` });
  console.log("saved highcharts");
} else {
  const box = await page.locator("svg").first().screenshot({ path: `${out}/fred-diesel.png` });
  console.log("saved svg", box);
}

await page.close();
await browser.close();
