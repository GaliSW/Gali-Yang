// 抓取六個真實作品的截圖,存到 public/shots/
// 用法:node scripts/capture-shots.mjs(需要本機安裝 Google Chrome)
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const TARGETS = [
  { name: 'pos-cloud', url: 'https://sweet-pos.vercel.app/' },
  { name: 'woocommerce-crm', url: 'https://woocommerce-statistics-frontend-sme.vercel.app/' },
  { name: 'longevity', url: 'https://longevity-tan.vercel.app/' },
  { name: 'shuangtw-com', url: 'https://shuangtw.com' },
  { name: 'minghuangtw-com', url: 'https://minghuangtw.com/' },
  { name: 'sweetsquare-com-tw', url: 'https://sweetsquare.com.tw/' },
];

mkdirSync('public/shots', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

for (const t of TARGETS) {
  const page = await ctx.newPage();
  try {
    await page.goto(t.url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(2500); // 等 lazy 圖與動畫落定
    await page.screenshot({ path: `public/shots/${t.name}.jpg`, type: 'jpeg', quality: 82 });
    console.log(`ok  ${t.name}`);
  } catch (err) {
    console.error(`FAIL ${t.name}: ${err.message}`);
  } finally {
    await page.close();
  }
}
await browser.close();
