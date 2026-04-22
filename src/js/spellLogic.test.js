import { describe, it, expect } from 'vitest';
import * as logic from './spellLogic';

describe('spellLogic.js', () => {
  describe('calculateFreeReach', () => {
    it('should calculate free reach correctly for improvised spells', () => {
      // Practice level 1, Arcana level 1 -> 1 Reach
      expect(logic.calculateFreeReach(1, 1, 'improvisado')).toBe(1);
      // Practice level 1, Arcana level 3 -> 3 Reach
      expect(logic.calculateFreeReach(3, 1, 'improvisado')).toBe(3);
      // Practice level 2, Arcana level 3 -> 2 Reach
      expect(logic.calculateFreeReach(3, 2, 'improvisado')).toBe(2);
    });

    it('should calculate free reach correctly for rotes (Arcana level is effectively 5)', () => {
      // Practice level 1, Rote -> 5 Reach
      expect(logic.calculateFreeReach(1, 1, 'rote')).toBe(5);
    });
  });

  describe('calculateFactorPenalty', () => {
    it('should calculate penalties for standard factors', () => {
      // All at 1 -> 0 penalty
      expect(logic.calculateFactorPenalty({
        potencia: 1, duracao: 1, escala: 1, currentFP: 'potencia', nivelArcana: 1
      })).toBe(0);

      // Potencia 2 (not primary) -> -2 penalty
      expect(logic.calculateFactorPenalty({
        potencia: 2, duracao: 1, escala: 1, currentFP: 'duracao', nivelArcana: 1
      })).toBe(2);
    });

    it('should respect the primary factor (currentFP)', () => {
      // Potencia 2, Arcana 2, Primary is Potencia -> 0 penalty
      expect(logic.calculateFactorPenalty({
        potencia: 2, duracao: 1, escala: 1, currentFP: 'potencia', nivelArcana: 2
      })).toBe(0);

      // Potencia 3, Arcana 2, Primary is Potencia -> 2 penalty (only 1 level above Arcana)
      expect(logic.calculateFactorPenalty({
        potencia: 3, duracao: 1, escala: 1, currentFP: 'potencia', nivelArcana: 2
      })).toBe(2);
    });
  });

  describe('calculateDicePool', () => {
    it('should calculate basic dice pool', () => {
      // Gnosis 1 + Arcana 1 + Yantra 0 = 2
      expect(logic.calculateDicePool({
        gnose: 1, nivelArcana: 1, yantras: 0, dadosExtras: 0,
        isCombinado: 0, usouFV: false, factorPenalty: 0,
        tempoConjuracao: 1, tempoConjuracaoElevada: false, currentFP: 'potencia'
      })).toBe(2);
    });

    it('should apply Willpower (+3)', () => {
      expect(logic.calculateDicePool({
        gnose: 1, nivelArcana: 1, yantras: 0, dadosExtras: 0,
        isCombinado: 0, usouFV: true, factorPenalty: 0,
        tempoConjuracao: 1, tempoConjuracaoElevada: false, currentFP: 'potencia'
      })).toBe(5);
    });
  });

  describe('calculateManaCost', () => {
    it('should calculate base mana cost', () => {
      expect(logic.calculateManaCost({
        alcance: 'toque', regente: true, duracao: 1, duracaoElevada: false,
        manaOpcional: 0, paradoxDice: 0, mitigarTodoParadoxo: false, mitigarDadosParadoxo: 0
      })).toBe(0);
    });

    it('should add cost for sympathetic reach', () => {
      expect(logic.calculateManaCost({
        alcance: 'simpatico', regente: true, duracao: 1, duracaoElevada: false,
        manaOpcional: 0, paradoxDice: 0, mitigarTodoParadoxo: false, mitigarDadosParadoxo: 0
      })).toBe(1);
    });
  });

  describe('formatSpellFactors', () => {
    it('should format duration correctly', () => {
      const result = logic.formatSpellFactors({
        potencia: 1, duracao: 1, duracaoElevada: false,
        escala: 1, escalaElevada: false, gnose: 1,
        currentFP: 'potencia', tempoConjuracao: 1, tempoConjuracaoElevada: false
      });
      expect(result.duracao).toBe('1 Turno');
    });

    it('should format elevated duration', () => {
      const result = logic.formatSpellFactors({
        potencia: 1, duracao: 1, duracaoElevada: true,
        escala: 1, escalaElevada: false, gnose: 1,
        currentFP: 'potencia', tempoConjuracao: 1, tempoConjuracaoElevada: false
      });
      expect(result.duracao).toBe('1 Cena/Hora');
    });
  });
});
