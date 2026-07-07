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
