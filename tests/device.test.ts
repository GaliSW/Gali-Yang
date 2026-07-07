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
