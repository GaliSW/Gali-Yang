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
