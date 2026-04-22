import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useDiceRoll from './useDiceRoll';

describe('useDiceRoll', () => {
  it('should return a success when rolling above or equal to threshold', () => {
    // Mock Math.random to return 0.7 (8) which is a success but NOT an explosion
    vi.spyOn(Math, 'random').mockReturnValue(0.7);

    const { result } = renderHook(() => useDiceRoll());

    let rollResult;
    act(() => {
      rollResult = result.current.roll(1);
    });

    expect(rollResult.sucessos).toBe(1);
    expect(rollResult.rolagem).toContain(8);
    
    vi.restoreAllMocks();
  });

  it('should handle chance die (numberOfDices <= 0)', () => {
    const randomSpy = vi.spyOn(Math, 'random');
    
    // Mock Math.random to return 0.99 (10) -> Success on chance die
    randomSpy.mockReturnValue(0.99);

    const { result } = renderHook(() => useDiceRoll());

    let rollResult;
    act(() => {
      // Use a non-exploding target for chance die to avoid infinite loop 
      // although makeRoll for chance die uses Math.max(1, numberOfDices)
      // wait, useDiceRoll line 11: let dicesToRoll = Math.max(1, numberOfDices)
      // So if numberOfDices is 0, it rolls 1 die.
      // But successThreshold is 10.
      rollResult = result.current.roll(0, 11); // Set explosion target to 11 to avoid explosion
    });

    expect(rollResult.sucessos).toBe(1);
    
    // Mock Math.random to return 0.7 (8) -> Failure on chance die
    randomSpy.mockReturnValue(0.7);

    act(() => {
      rollResult = result.current.roll(0, 11);
    });

    expect(rollResult.sucessos).toBe(0);
    
    vi.restoreAllMocks();
  });

  it('should handle explosions (10-again)', () => {
    const randomSpy = vi.spyOn(Math, 'random');
    // First roll: 0.99 (10) -> Explodes
    // Second roll: 0.7 (8) -> No explosion
    // mockReturnValue(0.5) ensures any subsequent rolls don't explode
    randomSpy.mockReturnValue(0.5)
             .mockReturnValueOnce(0.99)
             .mockReturnValueOnce(0.7);

    const { result } = renderHook(() => useDiceRoll());

    let rollResult;
    act(() => {
      rollResult = result.current.roll(1);
    });

    expect(rollResult.rolagem).toHaveLength(2);
    expect(rollResult.sucessos).toBe(2);
    
    vi.restoreAllMocks();
  });
});
