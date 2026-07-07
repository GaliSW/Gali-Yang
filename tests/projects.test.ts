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
