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
