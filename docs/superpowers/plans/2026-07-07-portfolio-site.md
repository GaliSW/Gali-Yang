# 極端實驗型接案作品集 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建置 narrowdesign 式極端實驗型接案開發者作品集:全站統一 3D 翻轉板塊切換、anime.js 創意動效、WebGL 粒子與 shader 畫廊、中英雙語、/info 靜態替代版。

**Architecture:** Next.js 15 App Router(SSG)為骨架;首頁是「板塊卡片組(FlipDeck)」— 純函式狀態機(flip-machine)決定板塊/內部步驟,CSS 3D 動畫執行翻轉,anime.js 負責板塊落定後的 stagger 進場與創意動效,R3F 負責 hero 粒子場與 Systems shader 平面。WebGL 管空間、anime.js 管介面,互不操作對方物件。

**Tech Stack:** Next.js 15 + TypeScript、Tailwind v4、anime.js v4、react-three-fiber v9 + drei、three、lenis(僅 /work 詳情頁)、next-intl v4、vitest + @testing-library/react。

## Global Constraints

- 專案根目錄:`/Users/apple/portfolio`(git 已初始化,規格在 `docs/superpowers/specs/2026-07-07-portfolio-design.md`)
- 不使用 Vite 作為 app bundler(vitest 內部依賴不算)
- 深色單主題鎖定;`/info` 例外為淺色。禁止 pure black `#000000`
- Design tokens(唯一色彩來源):bg `#0F172A`、deep `#0A101F`、raise `#16203A`、fg `#F8FAFC`、muted `#8A94A8`、accent `#22C55E`、line `rgba(148,163,184,0.18)`
- 字型:Space Grotesk(display)、Archivo(body en)、Noto Sans TC(中文)、JetBrains Mono(metadata),一律 `next/font/google`,禁止 `<link>` 載入
- 全站唯一彩色 = accent 綠;全站禁止 em-dash(`—`)出現在可見文案
- 翻轉 easing:出場 `cubic-bezier(0.83,0,0.17,1)`、入場 `cubic-bezier(0.16,1,0.3,1)`,單次總長約 1.2s
- 所有動效必須尊重 `prefers-reduced-motion`(翻轉改瞬切、WebGL 換靜態海報、自動動畫關閉)
- 品牌暫用字:`YOURNAME` / `hello@yourname.dev`(規格第 9 節未定項)
- 語言:`/zh`(預設)與 `/en`;所有可見文案放 `src/messages/{zh,en}.json`,元件內不得寫死文案
- anime.js v4 named imports:`import { animate, stagger, svg, createSpring } from 'animejs'`
- 每個 Task 結尾必須 commit;commit message 用 conventional commits(feat/test/chore/docs)

## File Structure

```
portfolio/
├─ package.json / next.config.ts / tsconfig.json / postcss.config.mjs / vitest.config.ts
├─ src/
│  ├─ middleware.ts                     # next-intl locale 路由
│  ├─ i18n/routing.ts  i18n/request.ts  # locale 定義與 message 載入
│  ├─ messages/zh.json  messages/en.json
│  ├─ content/projects.ts               # 六個真實作品的型別化資料(雙語欄位)
│  ├─ lib/flip-machine.ts               # 板塊翻轉狀態機(純函式,核心測試對象)
│  ├─ lib/scramble.ts                   # 文字擾亂純函式
│  ├─ lib/use-reduced-motion.ts         # reduced-motion hook
│  ├─ lib/use-stagger-in.ts             # 板塊落定後 anime.js stagger 進場
│  ├─ app/[locale]/layout.tsx           # 字型、theme、html lang
│  ├─ app/[locale]/page.tsx             # 首頁:組裝 FlipDeck
│  ├─ app/[locale]/info/page.tsx        # 靜態替代版(淺色)
│  ├─ app/[locale]/work/[slug]/page.tsx # 專案詳情(Lenis)
│  ├─ app/sitemap.ts
│  ├─ components/FlipDeck.tsx           # 板塊控制器(wheel/touch/鍵盤 → 狀態機 → CSS 翻轉)
│  ├─ components/TransitionLink.tsx     # 路由翻轉轉場連結
│  ├─ components/Magnetic.tsx           # 磁吸包裝元件
│  ├─ components/ScrambleTitle.tsx      # hover 文字擾亂
│  ├─ components/LogoIntro.tsx          # 開場 SVG 線條描繪
│  ├─ components/sections/{Gate,Hero,Systems,ClientSites,About,Contact}.tsx
│  └─ components/gl/ParticleField.tsx  gl/ProjectPlane.tsx  gl/device.ts
└─ tests/                               # vitest 測試
```

---

### Task 1: 腳手架(Next.js 15 + Tailwind v4)

**Files:**
- Create: 整個 Next.js 專案骨架(create-next-app 產生後併入現有 git repo)

**Interfaces:**
- Produces: 可執行的 `npm run dev` / `npm run build`;Tailwind v4 已接好(`src/app/globals.css` 含 `@import "tailwindcss";`)

- [ ] **Step 1: 在暫存目錄產生腳手架並併入專案**

```bash
cd /Users/apple
npx create-next-app@latest portfolio-scaffold --ts --app --tailwind --src-dir --no-eslint --import-alias "@/*" --use-npm --yes
rsync -a --exclude .git portfolio-scaffold/ portfolio/
rm -rf portfolio-scaffold
cd /Users/apple/portfolio
```

- [ ] **Step 2: 驗證建置**

Run: `npm run build`
Expected: `✓ Compiled successfully`,產出 `.next/`

- [ ] **Step 3: 移除範本雜訊**

刪除 `src/app/page.tsx` 內容替換為極簡佔位(下個 task 會被 locale 結構取代)、刪除 `public/*.svg` 範本圖示。

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: Next.js 15 + Tailwind v4 腳手架"
```

---

### Task 2: vitest 測試環境

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`, `tests/smoke.test.ts`
- Modify: `package.json`(scripts + devDependencies)

**Interfaces:**
- Produces: `npm test` 可跑;之後所有 task 的測試都用 `npm test -- <file>` 執行

- [ ] **Step 1: 安裝測試依賴**

```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: 寫設定檔**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
```

`tests/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

`package.json` scripts 加入:`"test": "vitest run"`。

- [ ] **Step 3: 冒煙測試先失敗再通過**

`tests/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('vitest 環境', () => {
  it('可以執行測試', () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `npm test`
Expected: `1 passed`

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "test: vitest + testing-library 環境"
```

---

### Task 3: Design tokens、字型與全域樣式

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/fonts.ts`

**Interfaces:**
- Produces: Tailwind 類別 `bg-bg / bg-deep / bg-raise / text-fg / text-muted / text-accent / border-line`;CSS 變數 `--font-display / --font-body / --font-tc / --font-mono`;`.flip-out` / `.flip-in` 全域翻轉動畫類別

- [ ] **Step 1: 寫 tokens 與翻轉動畫 CSS**

`src/app/globals.css` 全文替換:
```css
@import "tailwindcss";

@theme {
  --color-bg: #0F172A;
  --color-deep: #0A101F;
  --color-raise: #16203A;
  --color-fg: #F8FAFC;
  --color-muted: #8A94A8;
  --color-accent: #22C55E;
  --color-line: rgba(148, 163, 184, 0.18);
  --font-display: var(--font-space-grotesk), var(--font-noto-tc), sans-serif;
  --font-body: var(--font-archivo), var(--font-noto-tc), sans-serif;
  --font-mono-brand: var(--font-jetbrains), monospace;
}

html { background: var(--color-bg); color: var(--color-fg); }
body { font-family: var(--font-body); line-height: 1.6; }
::selection { background: var(--color-accent); color: var(--color-deep); }

/* 全站統一翻轉語言(規格 5.1) */
.flip-out {
  animation: flipOut 0.6s cubic-bezier(0.83, 0, 0.17, 1) forwards;
  transform-origin: 50% 100%;
}
.flip-in {
  animation: flipIn 0.95s cubic-bezier(0.16, 1, 0.3, 1) both;
  transform-origin: 50% 0%;
}
.flip-out-rev { animation-name: flipOutRev; transform-origin: 50% 0%; }
.flip-in-rev { animation-name: flipInRev; transform-origin: 50% 100%; }
@keyframes flipOut { to { transform: perspective(1300px) rotateX(-74deg) translateY(-4%); opacity: 0; } }
@keyframes flipIn { from { transform: perspective(1300px) rotateX(58deg); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes flipOutRev { to { transform: perspective(1300px) rotateX(74deg) translateY(4%); opacity: 0; } }
@keyframes flipInRev { from { transform: perspective(1300px) rotateX(-58deg); opacity: 0; } to { transform: none; opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .flip-out, .flip-in, .flip-out-rev, .flip-in-rev { animation: none; }
}
```

- [ ] **Step 2: 字型模組**

`src/lib/fonts.ts`:
```ts
import { Space_Grotesk, Archivo, Noto_Sans_TC, JetBrains_Mono } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-space-grotesk' });
export const archivo = Archivo({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-archivo' });
export const notoTC = Noto_Sans_TC({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-noto-tc' });
export const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains' });

export const fontClasses = [spaceGrotesk.variable, archivo.variable, notoTC.variable, jetbrains.variable].join(' ');
```

- [ ] **Step 3: 驗證建置**

Run: `npm run build`
Expected: 成功(fonts.ts 尚未被引用也不影響)

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: design tokens、翻轉動畫類別與 next/font 字型"
```

---

### Task 4: 雙語路由(next-intl)

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/middleware.ts`, `src/messages/zh.json`, `src/messages/en.json`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`
- Modify: `next.config.ts`
- Delete: `src/app/page.tsx`, `src/app/layout.tsx`(移入 `[locale]`)
- Test: `tests/i18n.test.tsx`

**Interfaces:**
- Produces: `useTranslations(ns)` 可在元件取字;`Link/redirect/usePathname/useRouter` 來自 `@/i18n/routing`;messages 兩檔 key 結構一致

- [ ] **Step 1: 安裝與設定**

```bash
npm i next-intl
```

`src/i18n/routing.ts`:
```ts
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({ locales: ['zh', 'en'], defaultLocale: 'zh' });
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

`src/i18n/request.ts`:
```ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return { locale, messages: (await import(`../messages/${locale}.json`)).default };
});
```

`src/middleware.ts`:
```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);
export const config = { matcher: '/((?!api|_next|_vercel|.*\\..*).*)' };
```

`next.config.ts`:
```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const nextConfig: NextConfig = {};
export default withNextIntl(nextConfig);
```

- [ ] **Step 2: 初版 messages(之後 task 逐步擴充,兩檔 key 必須同構)**

`src/messages/zh.json`:
```json
{
  "site": { "brand": "YOURNAME", "title": "YOURNAME:接案開發者", "description": "電商網站與客製系統,加上一點讓人停下來的介面。" },
  "hero": { "line1": "熟悉的介面,", "line2": "出乎意料的行為。", "line3": "Interfaces, unexpected.", "sub": "接案開發者。電商網站與客製系統,加上一點讓人停下來的介面。" }
}
```

`src/messages/en.json`:
```json
{
  "site": { "brand": "YOURNAME", "title": "YOURNAME: Freelance Developer", "description": "E-commerce sites, custom systems, and interfaces worth pausing for." },
  "hero": { "line1": "Familiar interfaces,", "line2": "unexpected behavior.", "line3": "介面實驗中。", "sub": "Freelance developer. E-commerce sites, custom systems, and interfaces worth pausing for." }
}
```

- [ ] **Step 3: locale layout 與首頁佔位**

`src/app/[locale]/layout.tsx`:
```tsx
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { fontClasses } from '@/lib/fonts';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html lang={locale === 'zh' ? 'zh-Hant' : 'en'} className={fontClasses}>
      <body className="bg-bg text-fg antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

`src/app/[locale]/page.tsx`(佔位,Task 9 重寫):
```tsx
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('site');
  return <main className="min-h-dvh grid place-items-center">{t('brand')}</main>;
}
```

刪除舊的 `src/app/page.tsx` 與 `src/app/layout.tsx`。

- [ ] **Step 4: 寫測試(兩語言 key 同構 + 渲染)**

`tests/i18n.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import zh from '@/messages/zh.json';
import en from '@/messages/en.json';

function keysOf(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? keysOf(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

describe('i18n messages', () => {
  it('zh 與 en 的 key 結構完全一致', () => {
    expect(keysOf(zh).sort()).toEqual(keysOf(en).sort());
  });
  it('可見文案不含 em-dash', () => {
    expect(JSON.stringify(zh) + JSON.stringify(en)).not.toMatch(/[—–]/);
  });
});
```

Run: `npm test -- tests/i18n.test.tsx`
Expected: 2 passed

- [ ] **Step 5: 建置驗證 + Commit**

Run: `npm run build`
Expected: 產出 `/zh` 與 `/en` 靜態頁

```bash
git add -A && git commit -m "feat: next-intl 雙語路由(/zh /en)"
```

---

### Task 5: 作品內容資料層

**Files:**
- Create: `src/content/projects.ts`
- Test: `tests/projects.test.ts`

**Interfaces:**
- Produces:
```ts
type Localized = { zh: string; en: string };
type SystemProject = { slug: string; kind: 'system'; tag: Localized; name: Localized; blurb: Localized; url: string; palette: [string, string, string] };
type ClientSite = { kind: 'client'; name: Localized; domain: string; platform: 'WordPress' | 'Duda'; note: Localized };
export const systems: SystemProject[];   // 3 筆
export const clientSites: ClientSite[];  // 3 筆
export function getSystem(slug: string): SystemProject | undefined;
```

- [ ] **Step 1: 寫失敗測試**

`tests/projects.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { systems, clientSites, getSystem } from '@/content/projects';

describe('作品資料', () => {
  it('有 3 個自研系統與 3 個接案網站', () => {
    expect(systems).toHaveLength(3);
    expect(clientSites).toHaveLength(3);
  });
  it('slug 可查詢且唯一', () => {
    const slugs = systems.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(3);
    expect(getSystem('pos-cloud')?.name.zh).toContain('POS');
    expect(getSystem('nope')).toBeUndefined();
  });
  it('每筆都有雙語欄位與有效網址', () => {
    for (const s of systems) {
      expect(s.name.zh).toBeTruthy();
      expect(s.name.en).toBeTruthy();
      expect(s.url).toMatch(/^https:\/\//);
    }
    for (const c of clientSites) expect(['WordPress', 'Duda']).toContain(c.platform);
  });
});
```

Run: `npm test -- tests/projects.test.ts`
Expected: FAIL(模組不存在)

- [ ] **Step 2: 實作資料(規格第 4 節的真實內容)**

`src/content/projects.ts`:
```ts
export type Localized = { zh: string; en: string };
export type SystemProject = {
  slug: string; kind: 'system'; tag: Localized; name: Localized;
  blurb: Localized; url: string; palette: [string, string, string];
};
export type ClientSite = {
  kind: 'client'; name: Localized; domain: string;
  platform: 'WordPress' | 'Duda'; note: Localized;
};

export const systems: SystemProject[] = [
  {
    slug: 'pos-cloud', kind: 'system',
    tag: { zh: 'SYSTEM / 零售', en: 'SYSTEM / RETAIL' },
    name: { zh: 'POS Cloud 雲端櫃位系統', en: 'POS Cloud' },
    blurb: {
      zh: '雲端 POS:員工前台收銀,店長進入管理後台。角色權限、櫃位管理、交易流程一手打造。',
      en: 'Cloud POS: staff checkout up front, manager console in back. Roles, counters, and transactions built from scratch.',
    },
    url: 'https://sweet-pos.vercel.app/',
    palette: ['#0d2b1c', '#123a5c', '#22C55E'],
  },
  {
    slug: 'woocommerce-crm', kind: 'system',
    tag: { zh: 'SYSTEM / 數據分析', en: 'SYSTEM / ANALYTICS' },
    name: { zh: 'WooCommerce CRM', en: 'WooCommerce CRM' },
    blurb: {
      zh: '電商資料統計分析儀表板:把 WooCommerce 商店的銷售與客戶數據變成看得懂的決策依據。',
      en: 'An analytics dashboard that turns WooCommerce sales and customer data into decisions.',
    },
    url: 'https://woocommerce-statistics-frontend-sme.vercel.app/',
    palette: ['#101c3f', '#22C55E', '#0d3327'],
  },
  {
    slug: 'longevity', kind: 'system',
    tag: { zh: 'WEB / 行銷 LANDING PAGE', en: 'WEB / MARKETING LANDING' },
    name: { zh: 'Longevity', en: 'Longevity' },
    blurb: {
      zh: '行銷用 landing page:從視覺到轉換流程自己寫,不靠模板,載入快、動效準。',
      en: 'A marketing landing page written from scratch: no templates, fast loads, precise motion.',
    },
    url: 'https://longevity-tan.vercel.app/',
    palette: ['#06251a', '#1c2f55', '#34d399'],
  },
];

export const clientSites: ClientSite[] = [
  { kind: 'client', name: { zh: 'Shuāng 雙', en: 'Shuāng' }, domain: 'shuangtw.com', platform: 'WordPress', note: { zh: '無鋼圈內衣電商', en: 'Wireless lingerie e-commerce' } },
  { kind: 'client', name: { zh: '銘皇農場', en: 'Minghuang Farm' }, domain: 'minghuangtw.com', platform: 'WordPress', note: { zh: '山葵農產電商', en: 'Wasabi farm e-commerce' } },
  { kind: 'client', name: { zh: 'Sweet Square 麟肆壹', en: 'Sweet Square' }, domain: 'sweetsquare.com.tw', platform: 'Duda', note: { zh: '牛軋糖電商', en: 'Nougat e-commerce' } },
];

export function getSystem(slug: string): SystemProject | undefined {
  return systems.find((s) => s.slug === slug);
}
```

- [ ] **Step 3: 測試通過 + Commit**

Run: `npm test -- tests/projects.test.ts`
Expected: 3 passed

```bash
git add -A && git commit -m "feat: 六個真實作品的型別化內容資料"
```

---

### Task 6: /info 靜態替代版

**Files:**
- Create: `src/app/[locale]/info/page.tsx`
- Modify: `src/messages/zh.json`, `src/messages/en.json`(新增 `info` 命名空間)
- Test: `tests/info.test.tsx`

**Interfaces:**
- Consumes: `systems`, `clientSites`(Task 5)
- Produces: `/zh/info` 與 `/en/info`,淺色、零動效、內容與主體驗等價

- [ ] **Step 1: messages 加入 info 命名空間**

`zh.json` 加:
```json
"info": {
  "title": "YOURNAME:接案開發者",
  "lede": "這是本站的靜態版本,內容與互動版完全相同。",
  "systemsHead": "自研系統",
  "clientsHead": "接案網站",
  "contact": "聯絡"
}
```
`en.json` 加:
```json
"info": {
  "title": "YOURNAME: Freelance Developer",
  "lede": "This is the static version of this site. Content is identical to the interactive one.",
  "systemsHead": "Systems",
  "clientsHead": "Client Sites",
  "contact": "Contact"
}
```

- [ ] **Step 2: 寫失敗測試**

`tests/info.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import zh from '@/messages/zh.json';
import InfoContent from '@/app/[locale]/info/info-content';

describe('/info 靜態版', () => {
  it('列出全部六個作品與聯絡方式', () => {
    render(
      <NextIntlClientProvider locale="zh" messages={zh}>
        <InfoContent locale="zh" />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText(/POS Cloud/)).toBeInTheDocument();
    expect(screen.getByText(/WooCommerce CRM/)).toBeInTheDocument();
    expect(screen.getByText(/Longevity/)).toBeInTheDocument();
    expect(screen.getByText(/Shuāng/)).toBeInTheDocument();
    expect(screen.getByText(/銘皇農場/)).toBeInTheDocument();
    expect(screen.getByText(/Sweet Square/)).toBeInTheDocument();
    expect(screen.getByText(/hello@yourname.dev/)).toBeInTheDocument();
  });
});
```

Run: `npm test -- tests/info.test.tsx`
Expected: FAIL(info-content 不存在)

- [ ] **Step 3: 實作(拆成可測試的 content 元件 + page 殼)**

`src/app/[locale]/info/info-content.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { systems, clientSites } from '@/content/projects';

export default function InfoContent({ locale }: { locale: 'zh' | 'en' }) {
  const t = useTranslations('info');
  return (
    <main className="min-h-dvh bg-[#F4F6FA] text-[#1A2233] px-6 py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-[#5A6478]">{t('lede')}</p>
        <h2 className="mt-10 text-lg font-semibold">{t('systemsHead')}</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          {systems.map((s) => (
            <li key={s.slug}>
              <a className="text-[#0B7A3E] underline" href={s.url}>{s.name[locale]}</a>
              :{s.blurb[locale]}
            </li>
          ))}
        </ul>
        <h2 className="mt-10 text-lg font-semibold">{t('clientsHead')}</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          {clientSites.map((c) => (
            <li key={c.domain}>
              <a className="text-[#0B7A3E] underline" href={`https://${c.domain}`}>{c.name[locale]}</a>
              :{c.note[locale]}({c.platform})
            </li>
          ))}
        </ul>
        <p className="mt-10">{t('contact')}:<a className="text-[#0B7A3E] underline" href="mailto:hello@yourname.dev">hello@yourname.dev</a></p>
      </div>
    </main>
  );
}
```

`src/app/[locale]/info/page.tsx`:
```tsx
import { setRequestLocale } from 'next-intl/server';
import InfoContent from './info-content';

export default async function InfoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <InfoContent locale={locale as 'zh' | 'en'} />;
}
```

- [ ] **Step 4: 測試通過、建置、Commit**

Run: `npm test -- tests/info.test.tsx` → PASS;`npm run build` → 成功

```bash
git add -A && git commit -m "feat: /info 靜態替代版(淺色、零動效、內容等價)"
```

---

### Task 7: 板塊翻轉狀態機(核心邏輯)

**Files:**
- Create: `src/lib/flip-machine.ts`
- Test: `tests/flip-machine.test.ts`

**Interfaces:**
- Produces:
```ts
export type FlipState = { section: number; step: number; locked: boolean; direction: 1 | -1 };
export type SectionDef = { id: string; steps: number };
export type FlipEvent = { type: 'advance' } | { type: 'retreat' } | { type: 'settle' } | { type: 'enter' };
export const initialState: FlipState; // { section: 0, step: 0, locked: false, direction: 1 }
export function flipReducer(state: FlipState, sections: SectionDef[], event: FlipEvent): FlipState;
```
- 規則:`advance` 在 locked 時無效;板塊內還有 step 就先走 step(不鎖),走完才翻下一板塊並 `locked=true`;`retreat` 反向同理(回到上一板塊時 step 落在該板塊最後一步);`settle` 解鎖;`enter` 等同從 section 0(閘門)advance;最後一板塊 advance、第一板塊 step0 retreat 皆無效

- [ ] **Step 1: 寫失敗測試(完整覆蓋規則)**

`tests/flip-machine.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { flipReducer, initialState, type SectionDef } from '@/lib/flip-machine';

const sections: SectionDef[] = [
  { id: 'gate', steps: 1 }, { id: 'hero', steps: 1 }, { id: 'systems', steps: 3 },
  { id: 'clients', steps: 1 }, { id: 'about', steps: 1 }, { id: 'contact', steps: 1 },
];

describe('flip-machine', () => {
  it('advance 翻到下一板塊並鎖定', () => {
    const s = flipReducer(initialState, sections, { type: 'advance' });
    expect(s).toEqual({ section: 1, step: 0, locked: true, direction: 1 });
  });
  it('locked 時 advance/retreat 無效', () => {
    const locked = { section: 1, step: 0, locked: true, direction: 1 as const };
    expect(flipReducer(locked, sections, { type: 'advance' })).toEqual(locked);
    expect(flipReducer(locked, sections, { type: 'retreat' })).toEqual(locked);
  });
  it('settle 解鎖', () => {
    const s = flipReducer({ section: 1, step: 0, locked: true, direction: 1 }, sections, { type: 'settle' });
    expect(s.locked).toBe(false);
  });
  it('systems 板塊內部先走 step,不鎖定', () => {
    const inSystems = { section: 2, step: 0, locked: false, direction: 1 as const };
    const s1 = flipReducer(inSystems, sections, { type: 'advance' });
    expect(s1).toEqual({ section: 2, step: 1, locked: false, direction: 1 });
    const s2 = flipReducer(s1, sections, { type: 'advance' });
    expect(s2.step).toBe(2);
    const s3 = flipReducer(s2, sections, { type: 'advance' });
    expect(s3).toEqual({ section: 3, step: 0, locked: true, direction: 1 });
  });
  it('retreat 回上一板塊時 step 落在最後一步', () => {
    const s = flipReducer({ section: 3, step: 0, locked: false, direction: 1 }, sections, { type: 'retreat' });
    expect(s).toEqual({ section: 2, step: 2, locked: true, direction: -1 });
  });
  it('板塊內 retreat 先退 step', () => {
    const s = flipReducer({ section: 2, step: 2, locked: false, direction: -1 }, sections, { type: 'retreat' });
    expect(s).toEqual({ section: 2, step: 1, locked: false, direction: -1 });
  });
  it('邊界:最後板塊 advance、第一板塊 retreat 無效', () => {
    const last = { section: 5, step: 0, locked: false, direction: 1 as const };
    expect(flipReducer(last, sections, { type: 'advance' })).toEqual(last);
    expect(flipReducer(initialState, sections, { type: 'retreat' })).toEqual(initialState);
  });
});
```

Run: `npm test -- tests/flip-machine.test.ts`
Expected: FAIL(模組不存在)

- [ ] **Step 2: 實作**

`src/lib/flip-machine.ts`:
```ts
export type FlipState = { section: number; step: number; locked: boolean; direction: 1 | -1 };
export type SectionDef = { id: string; steps: number };
export type FlipEvent = { type: 'advance' } | { type: 'retreat' } | { type: 'settle' } | { type: 'enter' };

export const initialState: FlipState = { section: 0, step: 0, locked: false, direction: 1 };

export function flipReducer(state: FlipState, sections: SectionDef[], event: FlipEvent): FlipState {
  if (event.type === 'settle') return { ...state, locked: false };
  if (state.locked) return state;

  if (event.type === 'enter' || event.type === 'advance') {
    const cur = sections[state.section];
    if (state.step < cur.steps - 1) return { ...state, step: state.step + 1, direction: 1 };
    if (state.section < sections.length - 1)
      return { section: state.section + 1, step: 0, locked: true, direction: 1 };
    return state;
  }

  if (event.type === 'retreat') {
    if (state.step > 0) return { ...state, step: state.step - 1, direction: -1 };
    if (state.section > 0) {
      const prev = sections[state.section - 1];
      return { section: state.section - 1, step: prev.steps - 1, locked: true, direction: -1 };
    }
    return state;
  }
  return state;
}
```

- [ ] **Step 3: 測試通過 + Commit**

Run: `npm test -- tests/flip-machine.test.ts`
Expected: 7 passed

```bash
git add -A && git commit -m "feat: 板塊翻轉狀態機(step 內部平移 + 板塊翻轉鎖定)"
```

---

### Task 8: 六個板塊元件(靜態版)

**Files:**
- Create: `src/components/sections/Gate.tsx`, `Hero.tsx`, `Systems.tsx`, `ClientSites.tsx`, `About.tsx`, `Contact.tsx`
- Modify: `src/messages/zh.json`, `src/messages/en.json`(補 `gate/works/about/contact` 命名空間,結構見下)
- Test: `tests/sections.test.tsx`

**Interfaces:**
- Consumes: `systems`, `clientSites`
- Produces: 每個板塊元件的 props 統一為 `{ active: boolean; step?: number; locale: 'zh'|'en' }`;Gate 額外收 `{ onEnter: () => void; onRead: () => void }`;可進場元素標 `data-stagger` 屬性(Task 9 的 stagger 目標)

- [ ] **Step 1: 補 messages(兩檔同步,en 為對應翻譯)**

`zh.json` 新增:
```json
"gate": { "head": "這個網站是一場互動實驗。", "body": "包含大量動態與 3D 空間移動。若你偏好安靜的閱讀,我們準備了完整的靜態版本。", "enter": "進入體驗 ENTER", "read": "閱讀靜態版 READ" },
"works": { "systemsHead": "Systems", "systemsSub": "自研系統。從零打造的核心產品,前後端都是自己的程式碼。", "clientsHead": "Client Sites", "clientsSub": "接案作品。Duda 與 WordPress 電商架站,快速、穩定、好維護。", "view": "觀看專案 VIEW" },
"about": { "label": "ABOUT / 關於", "head": "電商用最快的方式上線,系統用自己的程式碼打造。", "p1": "接案開發者。客戶的電商官網用 Duda 或 WordPress 快速穩定地架起來;需要量身打造的系統,從資料庫到介面都自己寫。這個網站本身,就是我前端能力的證明。", "caps": [{ "t": "自研系統", "d": "資料庫到介面" }, { "t": "Duda / WordPress", "d": "電商快速架站" }, { "t": "Next.js / React", "d": "架構與效能" }, { "t": "WebGL / anime.js", "d": "本站就是示範" }] },
"contact": { "email": "hello@yourname.dev", "line": "有案子想聊?寫信給我。" }
```
`en.json` 對應翻譯(結構相同;`i18n.test.tsx` 會驗證同構)。

- [ ] **Step 2: 寫失敗測試**

`tests/sections.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import zh from '@/messages/zh.json';
import Gate from '@/components/sections/Gate';
import Systems from '@/components/sections/Systems';

const wrap = (ui: React.ReactNode) => (
  <NextIntlClientProvider locale="zh" messages={zh}>{ui}</NextIntlClientProvider>
);

describe('板塊元件', () => {
  it('Gate 的兩顆按鈕觸發 callback', () => {
    const onEnter = vi.fn(); const onRead = vi.fn();
    render(wrap(<Gate active locale="zh" onEnter={onEnter} onRead={onRead} />));
    fireEvent.click(screen.getByRole('button', { name: /進入體驗/ }));
    fireEvent.click(screen.getByRole('button', { name: /閱讀靜態版/ }));
    expect(onEnter).toHaveBeenCalledOnce();
    expect(onRead).toHaveBeenCalledOnce();
  });
  it('Systems 依 step 顯示對應專案', () => {
    const { rerender } = render(wrap(<Systems active step={0} locale="zh" />));
    expect(screen.getByText(/POS Cloud/)).toBeVisible();
    rerender(wrap(<Systems active step={2} locale="zh" />));
    expect(screen.getByText(/Longevity/)).toBeVisible();
  });
});
```

Run: `npm test -- tests/sections.test.tsx`
Expected: FAIL

- [ ] **Step 3: 實作六個板塊(佈局比照核准視覺稿 v3)**

`src/components/sections/Gate.tsx`:
```tsx
'use client';
import { useTranslations } from 'next-intl';

type Props = { active: boolean; locale: 'zh' | 'en'; onEnter: () => void; onRead: () => void };

export default function Gate({ onEnter, onRead }: Props) {
  const t = useTranslations('gate');
  return (
    <div className="grid min-h-dvh place-items-center bg-deep px-6 text-center">
      <div className="max-w-md">
        <h2 data-stagger className="text-3xl font-medium tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{t('head')}</h2>
        <p data-stagger className="mt-4 text-sm text-muted">{t('body')}</p>
        <div data-stagger className="mt-8 flex flex-wrap justify-center gap-4">
          <button onClick={onEnter} className="cursor-pointer rounded-sm border border-accent bg-accent px-7 py-3 font-mono text-sm font-semibold text-[#06130A] transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('enter')}</button>
          <button onClick={onRead} className="cursor-pointer rounded-sm border border-line px-7 py-3 font-mono text-sm text-fg transition hover:border-muted focus-visible:outline-2 focus-visible:outline-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('read')}</button>
        </div>
      </div>
    </div>
  );
}
```

`src/components/sections/Hero.tsx`(WebGL 佔位底,Task 11 掛粒子場):
```tsx
'use client';
import { useTranslations } from 'next-intl';

type Props = { active: boolean; locale: 'zh' | 'en'; gl?: React.ReactNode };

export default function Hero({ gl }: Props) {
  const t = useTranslations('hero');
  return (
    <div className="relative min-h-dvh overflow-hidden bg-deep">
      <div className="absolute inset-0">{gl}</div>
      <div className="relative z-10 px-8 pt-28 pb-16">
        <h1 className="max-w-[11ch] text-[clamp(44px,8.5vw,108px)] font-semibold leading-[1.02] tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
          <span data-stagger className="block">{t('line1')}</span>
          <span data-stagger className="block pl-[0.9em] text-accent">{t('line2')}</span>
          <span data-stagger className="block">{t('line3')}</span>
        </h1>
        <p data-stagger className="mt-8 max-w-[40ch] text-muted">{t('sub')}</p>
      </div>
    </div>
  );
}
```

`src/components/sections/Systems.tsx`(step 驅動內部平移;Task 12 把 `.tex` 換 shader):
```tsx
'use client';
import { useTranslations } from 'next-intl';
import { systems } from '@/content/projects';

type Props = { active: boolean; step?: number; locale: 'zh' | 'en'; gl?: React.ReactNode };

export default function Systems({ step = 0, locale }: Props) {
  const t = useTranslations('works');
  return (
    <div className="min-h-dvh overflow-hidden bg-bg px-8 py-16">
      <h2 className="text-4xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{t('systemsHead')}</h2>
      <p className="mt-1 text-sm text-muted">{t('systemsSub')}</p>
      <div className="mt-10 flex transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${step * 100}%)` }}>
        {systems.map((s, i) => (
          <article key={s.slug} className="grid w-full shrink-0 grid-cols-1 items-center gap-8 md:grid-cols-12" aria-hidden={i !== step}>
            <div className="md:col-span-7">
              <div className="tex aspect-[16/10] rounded border border-line"
                style={{ background: `linear-gradient(115deg, ${s.palette[0]}, ${s.palette[1]} 45%, ${s.palette[2]} 75%, #0A101F 95%)` }} />
            </div>
            <div className="md:col-span-5">
              <span className="font-mono text-xs tracking-widest text-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>{s.tag[locale]}</span>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{s.name[locale]}</h3>
              <p className="mt-3 max-w-[42ch] text-sm text-muted">{s.blurb[locale]}</p>
              <a href={s.url} className="mt-5 inline-block border-b border-accent pb-1 font-mono text-xs text-fg hover:text-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('view')} →</a>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 flex gap-2" aria-hidden>
        {systems.map((s, i) => (
          <span key={s.slug} className={`h-px w-10 ${i === step ? 'bg-accent' : 'bg-line'}`} />
        ))}
      </div>
    </div>
  );
}
```

`src/components/sections/ClientSites.tsx`:
```tsx
'use client';
import { useTranslations } from 'next-intl';
import { clientSites } from '@/content/projects';

type Props = { active: boolean; locale: 'zh' | 'en' };

export default function ClientSites({ locale }: Props) {
  const t = useTranslations('works');
  return (
    <div className="min-h-dvh bg-bg px-8 py-20">
      <h2 data-stagger className="text-4xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{t('clientsHead')}</h2>
      <p data-stagger className="mt-1 text-sm text-muted">{t('clientsSub')}</p>
      <div data-stagger className="mt-10 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-3">
        {clientSites.map((c) => (
          <a key={c.domain} href={`https://${c.domain}`} className="block bg-bg p-6 transition-colors hover:bg-raise focus-visible:outline-2 focus-visible:outline-accent">
            <b className="font-medium">{c.name[locale]}</b>
            <span className="mt-2 block font-mono text-[11px] tracking-wider text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>
              {c.domain.toUpperCase()} · {c.platform.toUpperCase()} / {c.note[locale]}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
```

`src/components/sections/About.tsx`:
```tsx
'use client';
import { useTranslations } from 'next-intl';

type Props = { active: boolean; locale: 'zh' | 'en' };

export default function About(_: Props) {
  const t = useTranslations('about');
  const caps = t.raw('caps') as { t: string; d: string }[];
  return (
    <div className="grid min-h-dvh grid-cols-1 gap-10 bg-deep px-8 py-24 md:grid-cols-3">
      <span data-stagger className="font-mono text-xs tracking-widest text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('label')}</span>
      <div className="md:col-span-2">
        <h2 data-stagger className="text-[clamp(26px,4vw,44px)] font-medium leading-snug tracking-tight" style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}>{t('head')}</h2>
        <p data-stagger className="mt-6 max-w-[58ch] text-muted">{t('p1')}</p>
        <ul data-stagger className="mt-9 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
          {caps.map((c) => (
            <li key={c.t} className="bg-deep p-5 font-mono text-sm transition-colors hover:bg-raise" style={{ fontFamily: 'var(--font-mono-brand)' }}>
              {c.t}<small className="mt-1 block text-[11px] text-muted">{c.d}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

`src/components/sections/Contact.tsx`:
```tsx
'use client';
import { useTranslations } from 'next-intl';

type Props = { active: boolean; locale: 'zh' | 'en' };

export default function Contact(_: Props) {
  const t = useTranslations('contact');
  return (
    <div className="flex min-h-dvh flex-col justify-center bg-bg px-8 py-20">
      <h2 data-stagger className="text-[clamp(40px,7.5vw,96px)] font-semibold leading-none tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
        <a href={`mailto:${t('email')}`} className="bg-gradient-to-r from-accent to-accent bg-[length:0%_4px] bg-[position:0_96%] bg-no-repeat transition-all duration-500 hover:bg-[length:100%_4px] hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">{t('email')}</a>
      </h2>
      <p data-stagger className="mt-8 border-t border-line pt-5 font-mono text-xs text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('line')}</p>
    </div>
  );
}
```

- [ ] **Step 4: 測試通過 + Commit**

Run: `npm test`
Expected: 全部通過(含 i18n 同構測試,確認 en.json 有補齊)

```bash
git add -A && git commit -m "feat: 六個板塊元件(靜態版,data-stagger 標記)"
```

---

### Task 9: FlipDeck 控制器與首頁組裝

**Files:**
- Create: `src/components/FlipDeck.tsx`, `src/lib/use-reduced-motion.ts`, `src/lib/use-stagger-in.ts`
- Modify: `src/app/[locale]/page.tsx`
- Test: `tests/use-reduced-motion.test.ts`

**Interfaces:**
- Consumes: `flipReducer`(Task 7)、六個板塊元件(Task 8)
- Produces: `<FlipDeck locale />` 完整首頁體驗;`useReducedMotion(): boolean`;`useStaggerIn(active: boolean): RefObject<HTMLDivElement | null>`(active 變 true 時對容器內 `[data-stagger]` 跑 anime.js stagger)

- [ ] **Step 1: 安裝 anime.js 並寫 reduced-motion hook 測試**

```bash
npm i animejs
```

`tests/use-reduced-motion.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

describe('useReducedMotion', () => {
  it('反映 matchMedia 結果', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    }));
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});
```

Run: `npm test -- tests/use-reduced-motion.test.ts` → FAIL

- [ ] **Step 2: 實作兩個 hooks**

`src/lib/use-reduced-motion.ts`:
```ts
'use client';
import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = matchMedia(QUERY);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => matchMedia(QUERY).matches,
    () => false,
  );
}
```

`src/lib/use-stagger-in.ts`:
```ts
'use client';
import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { useReducedMotion } from './use-reduced-motion';

export function useStaggerIn(active: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!active || reduce || !ref.current) return;
    const els = ref.current.querySelectorAll('[data-stagger]');
    if (!els.length) return;
    const anim = animate(els, {
      opacity: [0, 1], translateY: [24, 0],
      delay: stagger(70, { start: 350 }), duration: 650, ease: 'outExpo',
    });
    return () => anim.cancel();
  }, [active, reduce]);
  return ref;
}
```

Run: `npm test -- tests/use-reduced-motion.test.ts` → PASS

- [ ] **Step 3: 實作 FlipDeck**

`src/components/FlipDeck.tsx`:
```tsx
'use client';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import { flipReducer, initialState, type FlipEvent, type SectionDef } from '@/lib/flip-machine';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { useStaggerIn } from '@/lib/use-stagger-in';
import Gate from './sections/Gate';
import Hero from './sections/Hero';
import Systems from './sections/Systems';
import ClientSites from './sections/ClientSites';
import About from './sections/About';
import Contact from './sections/Contact';

const SECTIONS: SectionDef[] = [
  { id: 'gate', steps: 1 }, { id: 'hero', steps: 1 }, { id: 'systems', steps: 3 },
  { id: 'clients', steps: 1 }, { id: 'about', steps: 1 }, { id: 'contact', steps: 1 },
];
const WHEEL_THRESHOLD = 80;
const TOUCH_THRESHOLD = 50;

export default function FlipDeck({ locale }: { locale: 'zh' | 'en' }) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [state, rawDispatch] = useReducer(
    (s: typeof initialState, e: FlipEvent) => flipReducer(s, SECTIONS, e), initialState);
  const prevSection = useRef(state.section);
  const wheelAcc = useRef(0);
  const touchY = useRef(0);

  const dispatch = useCallback((e: FlipEvent) => rawDispatch(e), []);

  useEffect(() => {
    if (reduce) return; // reduced-motion:一般文件流,不劫持
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAcc.current += e.deltaY;
      if (Math.abs(wheelAcc.current) > WHEEL_THRESHOLD) {
        dispatch({ type: wheelAcc.current > 0 ? 'advance' : 'retreat' });
        wheelAcc.current = 0;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); dispatch({ type: 'advance' }); }
      if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); dispatch({ type: 'retreat' }); }
    };
    const onTouchStart = (e: TouchEvent) => { touchY.current = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) > TOUCH_THRESHOLD) dispatch({ type: dy > 0 ? 'advance' : 'retreat' });
    };
    addEventListener('wheel', onWheel, { passive: false });
    addEventListener('keydown', onKey);
    addEventListener('touchstart', onTouchStart, { passive: true });
    addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      removeEventListener('wheel', onWheel);
      removeEventListener('keydown', onKey);
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchend', onTouchEnd);
    };
  }, [dispatch, reduce]);

  useEffect(() => { prevSection.current = state.section; }, [state.section]);

  const sectionProps = (i: number) => ({
    active: state.section === i, locale, step: state.section === i ? state.step : 0,
  });
  const bodies = [
    <Gate key="gate" {...sectionProps(0)} onEnter={() => dispatch({ type: 'enter' })} onRead={() => router.push('/info')} />,
    <Hero key="hero" {...sectionProps(1)} />,
    <Systems key="systems" {...sectionProps(2)} />,
    <ClientSites key="clients" {...sectionProps(3)} />,
    <About key="about" {...sectionProps(4)} />,
    <Contact key="contact" {...sectionProps(5)} />,
  ];

  if (reduce) return <main>{bodies.slice(1)}<div className="hidden">{bodies[0]}</div></main>;

  return (
    <main className="fixed inset-0 overflow-hidden" aria-live="polite">
      {SECTIONS.map((def, i) => {
        const isCur = i === state.section;
        const isPrev = state.locked && i === prevSection.current && prevSection.current !== state.section;
        if (!isCur && !isPrev) return null;
        const cls = state.locked
          ? isCur
            ? state.direction === 1 ? 'flip-in' : 'flip-in flip-in-rev'
            : state.direction === 1 ? 'flip-out' : 'flip-out flip-out-rev'
          : '';
        return (
          <SectionShell key={def.id} className={cls} active={isCur}
            onSettled={isCur ? () => dispatch({ type: 'settle' }) : undefined}>
            {bodies[i]}
          </SectionShell>
        );
      })}
    </main>
  );
}

function SectionShell({ children, className, active, onSettled }: {
  children: React.ReactNode; className: string; active: boolean; onSettled?: () => void;
}) {
  const ref = useStaggerIn(active);
  return (
    <div ref={ref} className={`absolute inset-0 ${className}`}
      onAnimationEnd={(e) => { if (e.animationName.startsWith('flipIn')) onSettled?.(); }}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: 首頁組裝**

`src/app/[locale]/page.tsx` 全文替換:
```tsx
import { setRequestLocale } from 'next-intl/server';
import FlipDeck from '@/components/FlipDeck';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FlipDeck locale={locale as 'zh' | 'en'} />;
}
```

- [ ] **Step 5: 手動驗證 + Commit**

Run: `npm run dev`,手動確認:滾輪/方向鍵在六板塊間翻轉、可反向、Systems 內部三步平移、閘門按鈕運作、翻轉落定後文字 stagger 進場、系統 reduced-motion 開啟時變成一般直排文件流。

```bash
git add -A && git commit -m "feat: FlipDeck 全站翻轉控制器與首頁組裝"
```

---

### Task 10: 創意動效(scramble、磁吸、開場描繪)

**Files:**
- Create: `src/lib/scramble.ts`, `src/components/ScrambleTitle.tsx`, `src/components/Magnetic.tsx`, `src/components/LogoIntro.tsx`
- Modify: `src/components/sections/Hero.tsx`(標題掛 scramble)、`src/components/sections/Gate.tsx`(按鈕包磁吸)、`src/components/FlipDeck.tsx`(首次載入播 LogoIntro)
- Test: `tests/scramble.test.ts`

**Interfaces:**
- Produces:
```ts
export function scrambleFrame(target: string, progress: number, pool: string, rand: () => number): string;
// progress 0..1;前 floor(progress*len) 字保留原字,其餘從 pool 隨機
<ScrambleTitle text={string} className? />   // hover 觸發 350ms 擾亂重組
<Magnetic strength?={number}>{children}</Magnetic>  // 滑鼠靠近 spring 位移
<LogoIntro onDone={() => void} />            // SVG 幾何字標描繪後淡出
```

- [ ] **Step 1: 寫 scramble 失敗測試**

`tests/scramble.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { scrambleFrame } from '@/lib/scramble';

const pool = 'ABC';
const fixedRand = () => 0; // 永遠取 pool[0]

describe('scrambleFrame', () => {
  it('progress=1 回傳原文', () => {
    expect(scrambleFrame('出乎意料', 1, pool, fixedRand)).toBe('出乎意料');
  });
  it('progress=0 全部來自 pool', () => {
    expect(scrambleFrame('WXYZ', 0, pool, fixedRand)).toBe('AAAA');
  });
  it('progress=0.5 前半保留', () => {
    expect(scrambleFrame('WXYZ', 0.5, pool, fixedRand)).toBe('WXAA');
  });
  it('空白字元不擾亂', () => {
    expect(scrambleFrame('A B', 0, pool, fixedRand)).toBe('A B'.replace(/[^ ]/g, 'A'));
  });
});
```

Run: `npm test -- tests/scramble.test.ts` → FAIL

- [ ] **Step 2: 實作 scramble 與元件**

`src/lib/scramble.ts`:
```ts
export function scrambleFrame(target: string, progress: number, pool: string, rand: () => number): string {
  const chars = Array.from(target);
  const keep = Math.floor(progress * chars.length);
  return chars
    .map((ch, i) => (i < keep || ch === ' ' ? ch : pool[Math.floor(rand() * pool.length)]))
    .join('');
}
```

`src/components/ScrambleTitle.tsx`:
```tsx
'use client';
import { useRef, useState } from 'react';
import { scrambleFrame } from '@/lib/scramble';
import { useReducedMotion } from '@/lib/use-reduced-motion';

const POOL = 'アイウエオ01<>/*+#=△▲◼';
const DURATION = 350;

export default function ScrambleTitle({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const raf = useRef(0);
  const reduce = useReducedMotion();

  const play = () => {
    if (reduce) return;
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION);
      setDisplay(scrambleFrame(text, p, POOL, Math.random));
      if (p < 1) raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
  };

  return <span className={className} onMouseEnter={play}>{display}</span>;
}
```

`src/components/Magnetic.tsx`:
```tsx
'use client';
import { useRef } from 'react';
import { animate, createSpring } from 'animejs';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export default function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    animate(ref.current, {
      translateX: (e.clientX - r.left - r.width / 2) * strength,
      translateY: (e.clientY - r.top - r.height / 2) * strength,
      duration: 300, ease: 'outQuad',
    });
  };
  const onLeave = () => {
    if (reduce || !ref.current) return;
    animate(ref.current, { translateX: 0, translateY: 0, ease: createSpring({ stiffness: 120, damping: 12 }) });
  };
  return <div ref={ref} className="inline-block" onMouseMove={onMove} onMouseLeave={onLeave}>{children}</div>;
}
```

`src/components/LogoIntro.tsx`(簡單幾何字標:方框 + 斜線 + 底線,非手繪複雜路徑):
```tsx
'use client';
import { useEffect, useRef } from 'react';
import { animate, stagger, svg } from 'animejs';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export default function LogoIntro({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { onDone(); return; }
    const paths = ref.current!.querySelectorAll('path, line, rect');
    const drawables = svg.createDrawable(paths as NodeListOf<SVGPathElement>);
    const draw = animate(drawables, {
      draw: ['0 0', '0 1'], duration: 1100, delay: stagger(140), ease: 'inOutQuad',
      onComplete: () => {
        animate(ref.current!, { opacity: [1, 0], duration: 450, ease: 'outQuad', onComplete: onDone });
      },
    });
    return () => draw.cancel();
  }, [onDone, reduce]);

  return (
    <div ref={ref} className="fixed inset-0 z-50 grid place-items-center bg-deep">
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="#22C55E" strokeWidth="2" aria-label="YOURNAME">
        <rect x="14" y="14" width="72" height="72" />
        <line x1="14" y1="86" x2="86" y2="14" />
        <line x1="30" y1="70" x2="70" y2="70" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 3: 接線**

Hero 標題三行改用 `<ScrambleTitle text={t('line1')} />`(其餘兩行同);Gate 兩顆按鈕各包 `<Magnetic>`;FlipDeck 加 `const [intro, setIntro] = useState(true);`,`return` 最外層加 `{intro && <LogoIntro onDone={() => setIntro(false)} />}`(reduce 時 LogoIntro 立即 onDone)。

- [ ] **Step 4: 測試 + 手動驗證 + Commit**

Run: `npm test` → 全部通過;`npm run dev` 確認開場描繪一次後消失、hero 標題 hover 擾亂、閘門按鈕磁吸回彈。

```bash
git add -A && git commit -m "feat: 開場 SVG 描繪、標題 scramble、磁吸物理(anime.js)"
```

---

### Task 11: WebGL 粒子場 Hero

**Files:**
- Create: `src/components/gl/ParticleField.tsx`, `src/components/gl/device.ts`
- Modify: `src/components/FlipDeck.tsx`(Hero 掛 `gl` prop,dynamic import)
- Test: `tests/device.test.ts`

**Interfaces:**
- Produces: `shouldLoadGL(nav: { deviceMemory?: number }, isMobile: boolean, reduce: boolean): boolean`;`<ParticleField />`(R3F Canvas,滑鼠位移粒子,DPR 上限 1.5)

- [ ] **Step 1: 安裝 + 裝置分級測試**

```bash
npm i three @react-three/fiber @react-three/drei
npm i -D @types/three
```

`tests/device.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { shouldLoadGL } from '@/components/gl/device';

describe('shouldLoadGL(規格 5.3)', () => {
  it('reduced-motion 一律不載', () => {
    expect(shouldLoadGL({ deviceMemory: 8 }, false, true)).toBe(false);
  });
  it('桌機預設載入', () => {
    expect(shouldLoadGL({}, false, false)).toBe(true);
  });
  it('手機需 deviceMemory >= 4', () => {
    expect(shouldLoadGL({ deviceMemory: 2 }, true, false)).toBe(false);
    expect(shouldLoadGL({ deviceMemory: 4 }, true, false)).toBe(true);
    expect(shouldLoadGL({}, true, false)).toBe(false);
  });
});
```

Run: `npm test -- tests/device.test.ts` → FAIL

- [ ] **Step 2: 實作 device.ts**

`src/components/gl/device.ts`:
```ts
export function shouldLoadGL(
  nav: { deviceMemory?: number }, isMobile: boolean, reduce: boolean,
): boolean {
  if (reduce) return false;
  if (!isMobile) return true;
  return (nav.deviceMemory ?? 0) >= 4;
}
```

Run: `npm test -- tests/device.test.ts` → PASS

- [ ] **Step 3: 實作 ParticleField**

`src/components/gl/ParticleField.tsx`:
```tsx
'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const COUNT = 1600;
const SPREAD = 14;

function Points() {
  const geo = useRef<THREE.BufferGeometry>(null);
  const { pointer, viewport } = useThree();
  const base = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const cols = Math.ceil(Math.sqrt(COUNT));
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = ((i % cols) / cols - 0.5) * SPREAD;
      arr[i * 3 + 1] = (Math.floor(i / cols) / cols - 0.5) * (SPREAD * 0.6);
      arr[i * 3 + 2] = 0;
    }
    return arr;
  }, []);
  const positions = useMemo(() => base.slice(), [base]);

  useFrame(() => {
    const mx = (pointer.x * viewport.width) / 2;
    const my = (pointer.y * viewport.height) / 2;
    for (let i = 0; i < COUNT; i++) {
      const ox = base[i * 3], oy = base[i * 3 + 1];
      const dx = ox - mx, dy = oy - my;
      const d = Math.hypot(dx, dy);
      const f = Math.max(0, 1 - d / 2.4);
      const tx = ox + (dx / (d || 1)) * f * 1.1;
      const ty = oy + (dy / (d || 1)) * f * 1.1;
      positions[i * 3] += (tx - positions[i * 3]) * 0.09;
      positions[i * 3 + 1] += (ty - positions[i * 3 + 1]) * 0.09;
    }
    if (geo.current) geo.current.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#8A94A8" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export default function ParticleField() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 50 }} gl={{ antialias: false, powerPreference: 'low-power' }}>
      <Points />
    </Canvas>
  );
}
```

- [ ] **Step 4: 接進 FlipDeck(dynamic import + 裝置分級)**

FlipDeck 內:
```tsx
import dynamic from 'next/dynamic';
import { shouldLoadGL } from './gl/device';
const ParticleField = dynamic(() => import('./gl/ParticleField'), { ssr: false });
// 元件內:
const [glOk, setGlOk] = useState(false);
useEffect(() => {
  const isMobile = matchMedia('(max-width: 768px)').matches;
  setGlOk(shouldLoadGL(navigator as { deviceMemory?: number }, isMobile, reduce));
}, [reduce]);
// Hero 改為:
<Hero key="hero" {...sectionProps(1)} gl={glOk ? <ParticleField /> : null} />
```

- [ ] **Step 5: 手動驗證 + Commit**

`npm run dev`:hero 粒子跟隨滑鼠推開、翻轉時不掉幀(DevTools Performance 檢查 60fps)、開啟系統 reduce motion 後 canvas 不載入。

```bash
git add -A && git commit -m "feat: R3F 粒子場 hero(dynamic import + 裝置分級)"
```

---

### Task 12: Systems shader 平面

**Files:**
- Create: `src/components/gl/ProjectPlane.tsx`
- Modify: `src/components/sections/Systems.tsx`(`gl` prop 有值時用 shader 平面取代漸層 div)、`src/components/FlipDeck.tsx`(傳 `gl` 旗標)

**Interfaces:**
- Consumes: `SystemProject.palette`(Task 5)
- Produces: `<ProjectPlane palette={[string,string,string]} />`(R3F Canvas 內流動漸層 shader,uTime 驅動)

- [ ] **Step 1: 實作 shader 平面**

`src/components/gl/ProjectPlane.tsx`:
```tsx
'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const frag = /* glsl */ `
  uniform float uTime; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv;
    float w1 = 0.5 + 0.5 * sin(p.x * 3.2 + uTime * 0.35 + p.y * 2.1);
    float w2 = 0.5 + 0.5 * sin(p.y * 4.1 - uTime * 0.22 + p.x * 1.4);
    vec3 col = mix(uA, uB, w1);
    col = mix(col, uC, w2 * 0.55);
    float grid = step(0.96, fract(p.x * 14.0)) + step(0.96, fract(p.y * 9.0));
    col += grid * 0.03;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plane({ palette }: { palette: [string, string, string] }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uA: { value: new THREE.Color(palette[0]) },
    uB: { value: new THREE.Color(palette[1]) },
    uC: { value: new THREE.Color(palette[2]) },
  }), [palette]);
  useFrame((_, dt) => { if (mat.current) mat.current.uniforms.uTime.value += dt; });
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  );
}

export default function ProjectPlane({ palette }: { palette: [string, string, string] }) {
  return (
    <Canvas dpr={[1, 1.5]} orthographic camera={{ zoom: 100 }} gl={{ antialias: false }}>
      <Plane palette={palette} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Systems 接 gl prop**

`Systems.tsx` 的 `.tex` div 改為:
```tsx
<div className="aspect-[16/10] overflow-hidden rounded border border-line">
  {gl ? <ProjectPlaneLazy palette={s.palette} /> : (
    <div className="h-full w-full" style={{ background: `linear-gradient(115deg, ${s.palette[0]}, ${s.palette[1]} 45%, ${s.palette[2]} 75%, #0A101F 95%)` }} />
  )}
</div>
```
檔案頂部:
```tsx
import dynamic from 'next/dynamic';
const ProjectPlaneLazy = dynamic(() => import('@/components/gl/ProjectPlane'), { ssr: false });
```
Props 改 `{ active, step, locale, gl }: Props & { gl?: boolean }`;FlipDeck 傳 `<Systems key="systems" {...sectionProps(2)} gl={glOk} />`。只渲染 `i === step` 的 Canvas(其餘 aria-hidden 平面維持 CSS 漸層)避免三個 WebGL context 同時存在:`{gl && i === step ? <ProjectPlaneLazy .../> : <div .../>}`。

- [ ] **Step 3: 手動驗證 + Commit**

`npm run dev`:Systems 三步平移時當前平面是流動 shader、非當前是靜態漸層;2D fallback 裝置(reduce 或低階手機)全部靜態漸層。

```bash
git add -A && git commit -m "feat: Systems shader 流動平面(單一 active canvas)"
```

---

### Task 13: 專案詳情頁與路由翻轉轉場

**Files:**
- Create: `src/app/[locale]/work/[slug]/page.tsx`, `src/components/TransitionLink.tsx`, `src/app/[locale]/template.tsx`
- Modify: `src/components/sections/Systems.tsx`(VIEW 連結改 TransitionLink 指向 `/work/[slug]`)、`src/messages/{zh,en}.json`(`work` 命名空間)
- Test: `tests/work-page.test.tsx`

**Interfaces:**
- Consumes: `getSystem(slug)`(Task 5)
- Produces: `/[locale]/work/[slug]` 靜態頁(generateStaticParams = 3 slugs × 2 locales);`<TransitionLink href>`:點擊先播 `.flip-out` 再導航;`template.tsx` 讓每次路由進場播 `.flip-in`

- [ ] **Step 1: 安裝 lenis 並寫失敗測試**

```bash
npm i lenis
```

`tests/work-page.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import zh from '@/messages/zh.json';
import WorkContent from '@/app/[locale]/work/[slug]/work-content';

describe('專案詳情頁', () => {
  it('渲染指定專案的名稱、描述與外部連結', () => {
    render(
      <NextIntlClientProvider locale="zh" messages={zh}>
        <WorkContent slug="pos-cloud" locale="zh" />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole('heading', { name: /POS Cloud/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sweet-pos/ })).toHaveAttribute('href', 'https://sweet-pos.vercel.app/');
  });
});
```

Run: `npm test -- tests/work-page.test.tsx` → FAIL

- [ ] **Step 2: messages 補 work 命名空間**

`zh.json`:
```json
"work": { "visit": "造訪網站", "back": "回到首頁", "roleLabel": "角色", "role": "設計、前端、後端,一人完成" }
```
`en.json`:
```json
"work": { "visit": "Visit site", "back": "Back to home", "roleLabel": "Role", "role": "Design, frontend, backend. One pair of hands." }
```

- [ ] **Step 3: 實作詳情頁(content 元件 + page 殼 + Lenis)**

`src/app/[locale]/work/[slug]/work-content.tsx`:
```tsx
'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { useTranslations } from 'next-intl';
import { getSystem } from '@/content/projects';
import { Link } from '@/i18n/routing';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export default function WorkContent({ slug, locale }: { slug: string; locale: 'zh' | 'en' }) {
  const t = useTranslations('work');
  const reduce = useReducedMotion();
  const project = getSystem(slug)!;

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis();
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, [reduce]);

  return (
    <main className="min-h-dvh bg-bg px-8 py-16">
      <Link href="/" className="font-mono text-xs text-muted hover:text-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>← {t('back')}</Link>
      <div className="mt-10 aspect-[16/7] rounded border border-line"
        style={{ background: `linear-gradient(115deg, ${project.palette[0]}, ${project.palette[1]} 45%, ${project.palette[2]} 75%, #0A101F 95%)` }} />
      <span className="mt-10 block font-mono text-xs tracking-widest text-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>{project.tag[locale]}</span>
      <h1 className="mt-3 max-w-[16ch] text-[clamp(32px,5vw,64px)] font-semibold leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{project.name[locale]}</h1>
      <p className="mt-5 max-w-[58ch] text-muted">{project.blurb[locale]}</p>
      <dl className="mt-8 border-t border-line pt-5">
        <dt className="font-mono text-xs text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('roleLabel')}</dt>
        <dd className="mt-1 text-sm">{t('role')}</dd>
      </dl>
      <a href={project.url} className="mt-10 inline-block border-b border-accent pb-1 font-mono text-sm hover:text-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>
        {t('visit')}:{new URL(project.url).host} →
      </a>
    </main>
  );
}
```

`src/app/[locale]/work/[slug]/page.tsx`:
```tsx
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { systems, getSystem } from '@/content/projects';
import WorkContent from './work-content';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => systems.map((s) => ({ locale, slug: s.slug })));
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!getSystem(slug)) notFound();
  return <WorkContent slug={slug} locale={locale as 'zh' | 'en'} />;
}
```

- [ ] **Step 4: 路由翻轉轉場**

`src/components/TransitionLink.tsx`:
```tsx
'use client';
import { useRouter } from '@/i18n/routing';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export default function TransitionLink({ href, children, className }: {
  href: string; children: React.ReactNode; className?: string;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  return (
    <a href={href} className={className}
      onClick={(e) => {
        e.preventDefault();
        if (reduce) { router.push(href); return; }
        const page = document.getElementById('page-root');
        if (!page) { router.push(href); return; }
        page.classList.add('flip-out');
        setTimeout(() => router.push(href), 560);
      }}>
      {children}
    </a>
  );
}
```

`src/app/[locale]/template.tsx`(每次路由進場翻入):
```tsx
'use client';
export default function Template({ children }: { children: React.ReactNode }) {
  return <div id="page-root" className="flip-in">{children}</div>;
}
```

`Systems.tsx` 的 VIEW 連結改:
```tsx
<TransitionLink href={`/work/${s.slug}`} className="mt-5 inline-block border-b border-accent pb-1 font-mono text-xs text-fg hover:text-accent">{t('view')} →</TransitionLink>
```

- [ ] **Step 5: 測試、建置、Commit**

Run: `npm test` → PASS;`npm run build` → 產出 6 個 work 靜態頁;`npm run dev` 手動確認:VIEW 點擊先翻出再翻入詳情頁、詳情頁 Lenis 平滑捲動、「回到首頁」正常。

```bash
git add -A && git commit -m "feat: /work/[slug] 詳情頁 + 路由翻轉轉場 + Lenis"
```

---

### Task 14: SEO、語言切換與 pre-flight 驗收

**Files:**
- Create: `src/app/sitemap.ts`, `src/components/LangSwitch.tsx`
- Modify: `src/app/[locale]/layout.tsx`(metadata + LangSwitch 常駐)、`src/messages/{zh,en}.json`(`a11y` 命名空間)
- Test: `tests/sitemap.test.ts`

**Interfaces:**
- Produces: `generateMetadata`(title/description/og 依 locale)、`/sitemap.xml`、右上角常駐語言切換與 /info 連結

- [ ] **Step 1: sitemap 失敗測試**

`tests/sitemap.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';

describe('sitemap', () => {
  it('涵蓋兩語言的首頁、/info 與三個 work 頁(共 10 條)', () => {
    const entries = sitemap();
    expect(entries).toHaveLength(10);
    const urls = entries.map((e) => e.url);
    expect(urls).toContain('https://yourname.dev/zh');
    expect(urls).toContain('https://yourname.dev/en/work/pos-cloud');
    expect(urls).toContain('https://yourname.dev/zh/info');
  });
});
```

Run: `npm test -- tests/sitemap.test.ts` → FAIL

- [ ] **Step 2: 實作 sitemap 與 metadata**

`src/app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { systems } from '@/content/projects';

const BASE = 'https://yourname.dev'; // 規格未定項:網域確定後改此常數

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((l) => [
    { url: `${BASE}/${l}` },
    { url: `${BASE}/${l}/info` },
    ...systems.map((s) => ({ url: `${BASE}/${l}/work/${s.slug}` })),
  ]);
}
```

`layout.tsx` 加:
```tsx
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: { title: t('title'), description: t('description') },
  };
}
```

- [ ] **Step 3: 語言切換元件**

messages 補 `a11y`:zh `{ "langSwitch": "切換語言", "staticVersion": "靜態版" }`、en `{ "langSwitch": "Switch language", "staticVersion": "Static version" }`。

`src/components/LangSwitch.tsx`:
```tsx
'use client';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

export default function LangSwitch({ locale }: { locale: 'zh' | 'en' }) {
  const t = useTranslations('a11y');
  const pathname = usePathname();
  const other = locale === 'zh' ? 'en' : 'zh';
  return (
    <nav aria-label={t('langSwitch')} className="fixed right-5 top-5 z-40 flex gap-4 font-mono text-xs" style={{ fontFamily: 'var(--font-mono-brand)' }}>
      <Link href={pathname} locale={other} className="text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
        {other === 'zh' ? '中' : 'EN'}
      </Link>
      <Link href="/info" className="text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">{t('staticVersion')}</Link>
    </nav>
  );
}
```
`layout.tsx` body 內 children 前加 `<LangSwitch locale={locale as 'zh' | 'en'} />`。

- [ ] **Step 4: 全量驗收(規格第 7 節 + pre-flight)**

Run: `npm test` → 全部通過
Run: `npm run build` → 成功,靜態頁完整(2 locale × [home, info, 3 work])
手動 checklist(`npm run dev`):
- 六板塊翻轉順暢可反向;Systems 內部三步;鍵盤方向鍵可操作
- 系統 reduced-motion 開啟:文件流呈現、無翻轉、無 WebGL、無自動動畫
- 375px 視窗:單欄、無水平捲軸;`/info` 兩語言內容完整
- Lighthouse(`npx lighthouse http://localhost:3000/zh --view`):LCP < 2.5s、CLS < 0.1
- 文案 grep 驗證:`grep -rn '—' src/messages/` → 無結果

- [ ] **Step 5: Commit + 部署準備**

```bash
git add -A && git commit -m "feat: SEO metadata、sitemap、語言切換與驗收"
```

部署:`npx vercel`(需使用者登入 Vercel 帳號;或推 GitHub 後在 Vercel dashboard 連結 repo)。

---

## Self-Review 紀錄

1. **Spec coverage:** 規格 1-8 節全對應:定位/文案(T4/T8)、技術架構(T1/T2/T9/T11)、資訊架構四路由(T6/T9/T13)、六作品資料(T5)、翻轉統一語言含板塊間/入口/路由(T3/T7/T9/T13)、首頁創意動效四項(T10=描繪/scramble/磁吸,T9=stagger)、tokens/字型(T3)、reduced-motion 與裝置分級(T9/T11)、SEO/驗收(T14)。
2. **Placeholder scan:** 無 TBD/TODO;en.json 翻譯在 T8 Step 1 已註明由 i18n 同構測試把關。
3. **Type consistency:** `FlipState/SectionDef/FlipEvent`(T7)與 FlipDeck(T9)一致;`SystemProject.palette` 型別 `[string,string,string]` 在 T5/T12/T13 一致;`useStaggerIn(active)` 簽名 T9 定義、T9 SectionShell 使用。
