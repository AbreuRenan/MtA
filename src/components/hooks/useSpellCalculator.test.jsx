import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useSpellCalculator from './useSpellCalculator';

const mockUserData = {
  mana: { max: 10, usado: 0 },
  fv: { max: 10, usado: 0 }
};


describe('useSpellCalculator', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSpellCalculator(mockUserData));
    
    expect(result.current.gnose).toBe(1);
    expect(result.current.nivelArcana).toBe(1);
    expect(result.current.spellType).toBe('improvisado');
  });

  it('should calculate free reach (elevações grátis) correctly', () => {
    const { result } = renderHook(() => useSpellCalculator(mockUserData));
    
    // Default: Arcana 1, Required 1, Improvisado
    // Formula: nivelArcana - nivelRequerido + 1 = 1 - 1 + 1 = 1
    expect(result.current.calcularElevacoesGratis()).toBe(1);

    act(() => {
      result.current.setNivelArcana(3);
      result.current.setNivelRequerido(1);
    });
    // 3 - 1 + 1 = 3
    expect(result.current.calcularElevacoesGratis()).toBe(3);
  });

  it('should calculate paradox pool correctly', () => {
    const { result } = renderHook(() => useSpellCalculator(mockUserData));
    
    act(() => {
      result.current.setGnose(3); // Gnosis 3 -> 2 dice per excess reach (ceil(3/2) = 2)
      result.current.setNivelArcana(1);
      result.current.setNivelRequerido(1);
      // Free reach = 1
      
      // Add excess reach
      result.current.setPotenciaElevada(true); // +1
      result.current.setDuracaoElevada(true); // +1
      // Total reach = 2. Excess = 2 - 1 = 1.
      // Paradox = 1 * 2 = 2 dice.
    });

    expect(result.current.calcularDadosParadoxo()).toBe(2);
  });

  it('should calculate dice pool correctly', () => {
    const { result } = renderHook(() => useSpellCalculator(mockUserData));
    
    act(() => {
      result.current.setGnose(3);
      result.current.setNivelArcana(2);
      result.current.setYantras(2);
      // Pool = Gnose + Arcana + Yantras = 3 + 2 + 2 = 7
    });

    expect(result.current.calcularParadaDeDados()).toBe(7);

    act(() => {
      result.current.setUsouFdV(true); // +3 dice
    });

    expect(result.current.paradaDeDados).toBe(10);
  });

  it('should calculate custoMana correctly based on reach and options', () => {
    const { result } = renderHook(() => useSpellCalculator(mockUserData));
    
    act(() => {
      // Base is 0
      result.current.setAlcance("simpatico"); // +1 mana
      result.current.setRegente(false); // +1 mana
      result.current.setManaOpcional(2); // +2 mana
    });

    expect(result.current.custoMana).toBe(4);
  });

  it('should calculate total elevations (custoElevacoes) correctly', () => {
    const { result } = renderHook(() => useSpellCalculator(mockUserData));
    
    act(() => {
      result.current.setPotenciaElevada(true);
      result.current.setEscalaElevada(true);
      result.current.setExtraElevacoes(2);
    });

    expect(result.current.custoElevacoes).toBe(4);
  });

  it('should calculate mitigated paradox correctly', () => {
    const { result } = renderHook(() => useSpellCalculator(mockUserData));
    
    act(() => {
      result.current.setGnose(3);
      result.current.setNivelArcana(1);
      result.current.setNivelRequerido(1);
      // Free reach = 1
      result.current.setPotenciaElevada(true);
      result.current.setDuracaoElevada(true);
      // Excess = 1, Paradox = 2
    });

    // Verify raw paradox first
    expect(result.current.calcularDadosParadoxo()).toBe(2);
    expect(result.current.totalDadosParadoxo).toBe(2);

    act(() => {
      // Mitigate 1 die using mana
      result.current.setMitigarDadosParadoxoMana(1);
    });

    // Total should now be 1
    expect(result.current.totalDadosParadoxo).toBe(1);
    // Mana cost should have increased by 1
    expect(result.current.custoMana).toBe(1);
  });

  it('should fully reset state on resetCalculadora', () => {
    const { result } = renderHook(() => useSpellCalculator(mockUserData));
    
    act(() => {
      result.current.setGnose(5);
      result.current.setPotenciaElevada(true);
      result.current.setUsouFdV(true);
    });

    expect(result.current.gnose).toBe(5);
    expect(result.current.potenciaElevada).toBe(true);
    expect(result.current.custoVontade).toBe(1);

    act(() => {
      result.current.resetCalculadora();
    });

    expect(result.current.gnose).toBe(1);
    expect(result.current.potenciaElevada).toBe(false);
    expect(result.current.custoVontade).toBe(0);
  });
});
