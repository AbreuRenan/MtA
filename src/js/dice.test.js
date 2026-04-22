import { describe, it, expect } from 'vitest';
import roll from './dice';

describe('dice.js logic', () => {
  it('should return a valid roll object', () => {
    const result = roll(1);
    expect(result).toHaveProperty('hash');
    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('rolagem');
    expect(result).toHaveProperty('sucessos');
    expect(result.rolagem).toBeInstanceOf(Array);
    expect(result.rolagem.length).toBeGreaterThanOrEqual(1);
  });

  it('should calculate successes correctly for normal rolls (threshold 8)', () => {
    // We can't easily mock Math.random here without extra setup, 
    // but we can check if success logic holds for a single die.
    const result = roll(10); // 10 dice
    const manualSuccesses = result.rolagem.filter(v => v >= 8).length;
    expect(result.sucessos).toBe(manualSuccesses);
  });

  it('should handle chance die (0 or negative dice) with threshold 10', () => {
    const result = roll(0);
    expect(result.successThreshold).toBe(10);
    const manualSuccesses = result.rolagem.filter(v => v >= 10).length;
    expect(result.sucessos).toBe(manualSuccesses);
  });

  it('should handle explosion targets correctly', () => {
    const result = roll(10, 8); // 8-again
    expect(result.explosionTarget).toBe(8);
    // Since it's 8-again, any 8, 9, or 10 should cause an explosion.
    // The number of dice in rolagem should be >= 10.
    expect(result.rolagem.length).toBeGreaterThanOrEqual(10);
  });

  it('should handle extreme negative dice (<-5) as a failure string', () => {
    const result = roll(-10);
    expect(result.rolagem).toEqual(['-']);
    expect(result.sucessos).toBe(0);
  });
});
