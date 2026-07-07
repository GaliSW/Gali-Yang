# 極端實驗型接案開發者作品集 — 設計規格

- 日期:2026-07-07
- 狀態:已核准(視覺稿 v3,見同目錄 `2026-07-07-portfolio-mockup-v3.html`)
- 參考:narrowdesign.com(體驗哲學與翻轉轉場)、anime.js v4(動效引擎)

## 1. 定位與設計讀取

**接案開發者的官方網站,受眾是潛在客戶。** 說服邏輯:「我自己的網站做成這樣,就是我前端能力的證明」。

- 業務內容:電商網站用 Duda / WordPress 快速架站;客製系統從資料庫到介面自己開發
- 體驗定位:極端實驗(narrowdesign 等級),進站有體驗警告與靜態替代版雙入口
- 核心哲學:「設計熟悉的東西,讓它做出乎意料的行為,讓人有感覺」
- 設計 dials:variance 10 / motion 10 / density 3
- 語言:中英雙語(zh 為主、en 為輔),`/zh` 與 `/en` 路由

## 2. 技術架構

| 層 | 選擇 | 備註 |
|---|---|---|
| 框架 | Next.js 15 App Router + TypeScript | SSG,部署 Vercel(不用 Vite,與 Next.js 互斥) |
| WebGL | react-three-fiber + drei + postprocessing | 全部 dynamic import,client 元件隔離 |
| DOM/SVG 動效 | anime.js v4 | timeline、SVG drawable、spring、text stagger |
| 捲動 | Lenis | 唯一 scroll 來源,進度值同時餵給 R3F 攝影機與 anime.js onScroll |
| 樣式 | Tailwind v4 | |
| 雙語 | next-intl | 兩語言完整 SEO |
| 內容 | 型別化 TS 內容檔 | 專案數量少,不用 CMS |

**分工原則:WebGL 管空間,anime.js 管介面。** 兩者只透過 Lenis scroll 進度值溝通,不互相操作對方物件,避免搶 frame。

## 3. 資訊架構

- `/`(主體驗):入口閘門 → WebGL Hero → Systems 自研系統 → Client Sites 接案索引 → About → Contact
- `/work/[slug]`:專案詳情,由畫廊平面 shared-element 轉場進入,內頁回歸可讀性
- `/info`:靜態替代版(純 HTML、淺色、零動效,內容與主體驗完全等價;無障礙與 SEO 保險)
- 語言切換常駐角落

## 4. 作品內容(真實資料)

### Systems / 自研(大型 3D 平面呈現)
| 專案 | 網址 | 描述 |
|---|---|---|
| POS Cloud 雲端櫃位系統 | sweet-pos.vercel.app | 員工前台收銀 + 店長後台,角色權限、櫃位管理 |
| WooCommerce CRM | woocommerce-statistics-frontend-sme.vercel.app | 電商銷售與客戶數據統計分析儀表板 |
| Longevity | longevity-tan.vercel.app | 行銷用 landing page,自己寫、不靠模板 |

### Client Sites / 接案電商(緊湊索引牆)
| 品牌 | 網址 | 平台 |
|---|---|---|
| Shuāng 雙 | shuangtw.com | WordPress / 無鋼圈內衣電商 |
| 銘皇農場 | minghuangtw.com | WordPress / 山葵農產電商 |
| Sweet Square 麟肆壹 | sweetsquare.com.tw | Duda / 牛軋糖電商 |

視覺素材策略:專案影像以 shader 扭曲貼圖呈現(色彩流動、噪聲扭曲),初期用網站截圖或生成圖,之後換真實截圖只是換貼圖。

## 5. 動效系統

### 5.1 入口翻轉轉場(核准的招牌動效)
narrow 式 3D 翻轉:點「進入體驗」後,目前畫面像卡片向後翻倒(rotateX,transform-origin 底部),主體驗場景從另一面翻起。實作版由 WebGL 攝影機翻轉整個空間;easing 參考 `cubic-bezier(0.83,0,0.17,1)` 出、`(0.16,1,0.3,1)` 入,總長約 1.2s。頁面間路由轉場沿用同一翻轉語言。

### 5.2 各區段動效規格
- **Hero**:R3F 粒子場回應滑鼠;巨型中英標題以 anime.js stagger 逐行升起;scroll 時攝影機向前推進、穿過標題進入作品區
- **Systems 畫廊**:專案是 3D 空間中的傾斜平面,scroll 掠過時逐一浮現,hover 轉正,點擊放大成詳情頁首圖(shared element)
- **Client 索引牆**:格狀清單,hover 亮起(背景 `--bg-raise`)
- **About**:標題逐字浮現(SplitText 式),能力格子 hover 亮起
- **Contact**:巨型信箱 CTA,滑鼠靠近有磁吸位移(anime.js spring),底線展開動效

### 5.3 降級
`prefers-reduced-motion`:關閉 Lenis 與自動動畫、WebGL 換靜態海報、翻轉轉場改瞬切。行動裝置:預設 2D fallback(靜態貼圖 + anime.js 動效);偵測到高效能裝置(`deviceMemory ≥ 4` 且非省電模式)才載入輕量 WebGL 場景。

## 6. 設計 Tokens

深色單主題鎖定(不做淺色版;`/info` 例外為淺色純內容頁)。

| Token | 值 | 用途 |
|---|---|---|
| background | `#0F172A` | 主底 |
| deep | `#0A101F` | 深層底(hero、about) |
| raise | `#16203A` | hover 亮起 |
| foreground | `#F8FAFC` | 前景文字 |
| muted | `#8A94A8` | 次要文字 |
| accent | `#22C55E` | 全站唯一彩色 |
| line | `rgba(148,163,184,0.18)` | 邊線 |

字型:Space Grotesk(display,600)+ Archivo(body)+ Noto Sans TC(中文)+ 等寬字型(metadata)。display 字級 clamp(44px → 108px),body 行寬 ≤ 58ch,行高 1.6。

## 7. 效能與無障礙

- WebGL 元件 dynamic import;canvas 掛載前 hero 文字已由 server 渲染(LCP 保障)
- DPR 上限 + 裝置分級;桌機 scroll 目標 60fps
- 驗收:LCP < 2.5s、CLS < 0.1、reduced-motion 版完整可用、zh/en 皆可建置、`/info` 內容與主體驗等價
- 鍵盤可操作:入口雙按鈕、語言切換、所有連結皆有 focus 樣式

## 8. 實作階段(每階段有驗證)

1. 腳手架 + tokens + 雙語路由 → 驗證:zh/en 皆可建置部署
2. 靜態內容與排版(不動)+ `/info` → 驗證:`/info` 完整可讀、SEO meta 齊全
3. anime.js 介面動效層(標題升起、hover、磁吸、翻轉轉場 CSS 版)→ 驗證:reduced-motion 降級正常
4. WebGL:粒子 Hero + 畫廊平面 + 攝影機翻轉轉場 → 驗證:60fps、手機 fallback
5. 打磨:shared element 轉場、詳情頁、pre-flight checklist → 驗證:Lighthouse 達標

## 9. 未定項(實作時補)

- 品牌名稱與網域(視覺稿暫用 YOURNAME / hello@yourname.dev)
- 真實聯絡信箱與社群連結
- 專案詳情頁的深度內容(目前僅有一句描述)
