import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { AppContext } from '../AppContext';
import { BrowserRouter } from 'react-router-dom';
import DiceRollerComponent from './DiceRollerComponent';
import * as diceLogic from '../js/dice';

// Mock Firebase
vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  set: vi.fn(),
  push: vi.fn(() => ({ key: 'mock-key' })),
  onValue: vi.fn(),
  query: vi.fn(),
  limitToLast: vi.fn(),
}));

// Mock Assets
vi.mock('../assets/audio/diceRollRedux.mp3', () => ({ default: 'mock-audio' }));

describe('DiceRollerComponent', () => {
  const mockContext = {
    firestore: {},
    userData: { nome: 'Test Player', role: 'mago' },
    gameOpen: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock HTMLMediaElement properties/methods not available in JSDOM
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue();
    window.HTMLMediaElement.prototype.pause = vi.fn();
    window.HTMLMediaElement.prototype.load = vi.fn();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AppContext.Provider value={mockContext}>
          <DiceRollerComponent />
        </AppContext.Provider>
      </BrowserRouter>
    );
  };

  it('renders correctly and initializes with 0 dice', () => {
    const { getByLabelText } = renderComponent();
    const input = getByLabelText('Quantidade de Dados');
    expect(input.value).toBe('0');
  });

  it('increments dice count when +1 button is clicked', () => {
    const { getByText, getByLabelText } = renderComponent();
    const btnPlus1 = getByText('+1');
    fireEvent.click(btnPlus1);
    const input = getByLabelText('Quantidade de Dados');
    expect(input.value).toBe('1');
  });

  it('decrements dice count when -1 button is clicked', () => {
    const { getByText, getByLabelText } = renderComponent();
    const btnMinus1 = getByText('-1');
    // Set value to 2 first
    const input = getByLabelText('Quantidade de Dados');
    fireEvent.change(input, { target: { value: '2' } });
    fireEvent.click(btnMinus1);
    expect(input.value).toBe('1');
  });

  it('triggers roll and displays results when Rolar! is clicked', () => {
    const rollSpy = vi.spyOn(diceLogic, 'default').mockReturnValue({
      hash: '#test',
      date: '12:00:00',
      rolagem: [8, 5],
      sucessos: 1,
      falhas: 1,
      critFailDices: 0,
      successThreshold: 8,
      explosionTarget: 10
    });

    const { getByText, getAllByText } = renderComponent();
    const input = getByText('Quantidade de Dados').parentElement.parentElement.querySelector('input');
    fireEvent.change(input, { target: { value: '2' } });
    
    const rollBtn = getByText('Rolar!');
    fireEvent.click(rollBtn);

    expect(rollSpy).toHaveBeenCalledWith(2, 10);
    expect(getByText('Quantidade de Sucessos')).toBeDefined();
    expect(getByText('Quantidade de Falhas')).toBeDefined();
    
    // Check if dice values are rendered
    expect(getByText('8')).toBeDefined();
    expect(getByText('5')).toBeDefined();
  });

  it('respects explosion target 8 when checked', () => {
    const rollSpy = vi.spyOn(diceLogic, 'default');
    const { getByLabelText, getByText } = renderComponent();
    
    const check8 = getByLabelText('Explosão do 8');
    fireEvent.click(check8);
    
    const rollBtn = getByText('Rolar!');
    fireEvent.click(rollBtn);

    expect(rollSpy).toHaveBeenCalledWith(0, 8);
  });
});
