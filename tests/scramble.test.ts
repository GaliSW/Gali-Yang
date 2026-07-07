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
