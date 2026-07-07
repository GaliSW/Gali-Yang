export type Localized = { zh: string; en: string };
export type SystemProject = {
  slug: string; kind: 'system'; tag: Localized; name: Localized;
  blurb: Localized; url: string; palette: [string, string, string];
  shot: string;
};
export type ClientSite = {
  kind: 'client'; name: Localized; domain: string;
  platform: 'WordPress' | 'Duda'; note: Localized;
  shot: string;
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
    shot: '/shots/pos-cloud.jpg',
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
    shot: '/shots/woocommerce-crm.jpg',
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
    shot: '/shots/longevity.jpg',
  },
];

export const clientSites: ClientSite[] = [
  { kind: 'client', name: { zh: 'Shuāng 雙', en: 'Shuāng' }, domain: 'shuangtw.com', platform: 'WordPress', note: { zh: '無鋼圈內衣電商', en: 'Wireless lingerie e-commerce' }, shot: '/shots/shuangtw-com.jpg' },
  { kind: 'client', name: { zh: '銘皇農場', en: 'Minghuang Farm' }, domain: 'minghuangtw.com', platform: 'WordPress', note: { zh: '山葵農產電商', en: 'Wasabi farm e-commerce' }, shot: '/shots/minghuangtw-com.jpg' },
  { kind: 'client', name: { zh: 'Sweet Square 麟肆壹', en: 'Sweet Square' }, domain: 'sweetsquare.com.tw', platform: 'Duda', note: { zh: '牛軋糖電商', en: 'Nougat e-commerce' }, shot: '/shots/sweetsquare-com-tw.jpg' },
];

export function getSystem(slug: string): SystemProject | undefined {
  return systems.find((s) => s.slug === slug);
}
