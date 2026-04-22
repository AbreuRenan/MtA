import { describe, it, expect } from 'vitest';
import { spellReducer, initialState } from './spellReducer';

describe('spellReducer', () => {
  it('should return initial state by default', () => {
    const state = spellReducer(initialState, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('should handle SET_VALUE action', () => {
    const action = { type: 'SET_VALUE', payload: { key: 'potencia', value: 5 } };
    const state = spellReducer(initialState, action);
    
    expect(state.potencia).toBe(5);
    // Ensure other state is untouched
    expect(state.gnose).toBe(initialState.gnose);
  });

  it('should handle RESET action', () => {
    // Set some dirty state
    const dirtyState = { ...initialState, potencia: 10, gnose: 5, usouFV: true };
    const state = spellReducer(dirtyState, { type: 'RESET' });
    
    expect(state).toEqual(initialState);
  });

  it('should handle LOAD_STATE action', () => {
    const loadedData = { page: 2, gnose: 3, potencia: 4 };
    const state = spellReducer(initialState, { type: 'LOAD_STATE', payload: loadedData });
    
    expect(state.page).toBe(2);
    expect(state.gnose).toBe(3);
    expect(state.potencia).toBe(4);
    // Unloaded data remains at previous state (initial in this case)
    expect(state.nivelArcana).toBe(1);
  });
});
