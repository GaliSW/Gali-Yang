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
