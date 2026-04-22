import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import DiceResult from './DiceResult';

// Mock styles module
vi.mock('../../styles/diceRoller.module.css', () => ({
  default: {
    rollDisplayArea: 'rollDisplayArea'
  }
}));

describe('DiceResult', () => {
  it('renders the roll value', () => {
    const { getByText } = render(<DiceResult value={8} index={0} explosionTarget={10} successThreshold={8} />);
    expect(getByText('8')).toBeDefined();
  });

  it('applies correct success style (bd) for a success roll', () => {
    const { container } = render(<DiceResult value={8} index={0} explosionTarget={10} successThreshold={8} />);
    const span = container.querySelector('span');
    expect(span.className).toContain('bd');
  });

  it('applies explosion style (gd) and aura for an exploding roll', () => {
    const { container } = render(<DiceResult value={10} index={0} explosionTarget={10} successThreshold={8} />);
    const span = container.querySelector('span');
    const parentDiv = container.firstChild;
    expect(span.className).toContain('gd');
    expect(parentDiv.className).toContain('aura');
  });

  it('applies critical fail style (rd) for a 1', () => {
    const { container } = render(<DiceResult value={1} index={0} explosionTarget={10} successThreshold={8} />);
    const span = container.querySelector('span');
    expect(span.className).toContain('rd');
  });

  it('applies normal failure style (yd) for a roll between 1 and threshold', () => {
    const { container } = render(<DiceResult value={5} index={0} explosionTarget={10} successThreshold={8} />);
    const span = container.querySelector('span');
    expect(span.className).toContain('yd');
  });
});
