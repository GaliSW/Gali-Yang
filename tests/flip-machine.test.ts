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
