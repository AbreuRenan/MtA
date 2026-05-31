import { describe, it, expect } from 'vitest';
import { evaluateRequisitos, evaluateCondition, validateYantra } from './yantraLogic';

describe('yantraLogic.js', () => {
  describe('evaluateCondition', () => {
    it('should evaluate FATOR_MAGIA EQ correctly', () => {
      const cond = {
        origem: "FATOR_MAGIA",
        chave: "Forças",
        operador: "EQ",
        valor: "3"
      };
      const context = {
        fatoresMagia: {
          "Forças": 3
        }
      };
      expect(evaluateCondition(cond, context)).toBe(true);
    });

    it('should evaluate FATOR_MAGIA GE correctly', () => {
      const cond = {
        origem: "FATOR_MAGIA",
        chave: "Gnosis",
        operador: "GE",
        valor: "2"
      };
      const context = {
        fatoresMagia: {
          "Gnosis": 3
        }
      };
      expect(evaluateCondition(cond, context)).toBe(true);
    });

    it('should handle missing keys as 0', () => {
      const cond = {
        origem: "FATOR_MAGIA",
        chave: "Espaço",
        operador: "EQ",
        valor: "0"
      };
      const context = {
        fatoresMagia: {}
      };
      expect(evaluateCondition(cond, context)).toBe(true);
    });

    it('should handle case-insensitive and whitespace in chave', () => {
      const cond = {
        origem: "fator_magia",
        chave: " forças  ",
        operador: "eq",
        valor: "3"
      };
      const context = {
        fatoresMagia: {
          "Forças": 3
        }
      };
      expect(evaluateCondition(cond, context)).toBe(true);
    });

    it('should handle case-insensitive POOL_YANTRAS', () => {
      const cond = {
        origem: "POOL_YANTRAS",
        chave: "mudra",
        operador: "EQ",
        valor: "ATIVO"
      };
      const context = {
        poolYantras: [{ tipo: "Mudra" }]
      };
      expect(evaluateCondition(cond, context)).toBe(true);
    });
  });

  describe('evaluateRequisitos', () => {
    it('should evaluate AND logic correctly when all conditions pass', () => {
      const req = {
        operadorLogico: "AND",
        condicoes: [
          { origem: "FATOR_MAGIA", chave: "Forças", operador: "GE", valor: "2" },
          { origem: "FATOR_MAGIA", chave: "Gnosis", operador: "GE", valor: "2" }
        ]
      };
      const context = {
        fatoresMagia: {
          "Forças": 3,
          "Gnosis": 2
        }
      };
      expect(evaluateRequisitos(req, context)).toBe(true);
    });

    it('should evaluate OR logic correctly when at least one condition passes', () => {
      const req = {
        operadorLogico: "OR",
        condicoes: [
          { origem: "FATOR_MAGIA", chave: "Forças", operador: "EQ", valor: "2" },
          { origem: "FATOR_MAGIA", chave: "Forças", operador: "EQ", valor: "3" }
        ]
      };
      const context = {
        fatoresMagia: {
          "Forças": 3
        }
      };
      expect(evaluateRequisitos(req, context)).toBe(true);
    });

    it('should evaluate OR logic with case-insensitivity and trim', () => {
      const req = {
        operadorLogico: " or  ",
        condicoes: [
          { origem: "fator_magia", chave: " forças ", operador: "eq", valor: "2" },
          { origem: "fator_magia", chave: " forças ", operador: "eq", valor: "3" }
        ]
      };
      const context = {
        fatoresMagia: {
          "Forças": 3
        }
      };
      expect(evaluateRequisitos(req, context)).toBe(true);
    });

    it('should handle complex nested groups', () => {
      const req = {
        operadorLogico: "AND",
        condicoes: [
          {
            operadorLogico: "OR",
            condicoes: [
              { origem: "FATOR_MAGIA", chave: "Forças", operador: "EQ", valor: "2" },
              { origem: "FATOR_MAGIA", chave: "Forças", operador: "EQ", valor: "3" }
            ]
          },
          { origem: "FATOR_MAGIA", chave: "Gnosis", operador: "GE", valor: "2" }
        ]
      };
      const context = {
        fatoresMagia: {
          "Forças": 3,
          "Gnosis": 2
        }
      };
      expect(evaluateRequisitos(req, context)).toBe(true);
    });

    it('should evaluate NOT logic correctly when none of the conditions pass', () => {
      const req = {
        operadorLogico: "NOT",
        condicoes: [
          { origem: "FATOR_MAGIA", chave: "Forças", operador: "GE", valor: "5" },
          { origem: "FATOR_MAGIA", chave: "Gnosis", operador: "GE", valor: "4" }
        ]
      };
      const context = {
        fatoresMagia: {
          "Forças": 3,
          "Gnosis": 2
        }
      };
      expect(evaluateRequisitos(req, context)).toBe(true);
    });

    it('should evaluate NOT logic as false if any condition passes', () => {
      const req = {
        operadorLogico: "NOT",
        condicoes: [
          { origem: "FATOR_MAGIA", chave: "Forças", operador: "GE", valor: "2" },
          { origem: "FATOR_MAGIA", chave: "Gnosis", operador: "GE", valor: "4" }
        ]
      };
      const context = {
        fatoresMagia: {
          "Forças": 3,
          "Gnosis": 2
        }
      };
      expect(evaluateRequisitos(req, context)).toBe(false);
    });

    it('should check for specific Yantra ID in POOL_YANTRAS', () => {
      const cond = {
        origem: "POOL_YANTRAS",
        chave: "-nty12345",
        operador: "EQ",
        valor: "ATIVO"
      };
      const context = {
        poolYantras: [{ id: "-nty12345", tipo: "Mudra" }]
      };
      expect(evaluateCondition(cond, context)).toBe(true);
    });

    it('should evaluate POOL_YANTRAS correctly with boolean primitive true', () => {
      const cond = {
        origem: "POOL_YANTRAS",
        chave: "Mudra",
        operador: "EQ",
        valor: true
      };
      const context = {
        poolYantras: [{ tipo: "Mudra" }]
      };
      expect(evaluateCondition(cond, context)).toBe(true);
    });

    it('should evaluate POOL_YANTRAS correctly with boolean primitive false', () => {
      const cond = {
        origem: "POOL_YANTRAS",
        chave: "Mantra",
        operador: "EQ",
        valor: false
      };
      const context = {
        poolYantras: [{ tipo: "Mudra" }]
      };
      expect(evaluateCondition(cond, context)).toBe(true);
    });

    it('should evaluate POOL_YANTRAS correctly with boolean string true', () => {
      const cond = {
        origem: "POOL_YANTRAS",
        chave: "Mudra",
        operador: "EQ",
        valor: "true"
      };
      const context = {
        poolYantras: [{ tipo: "Mudra" }]
      };
      expect(evaluateCondition(cond, context)).toBe(true);
    });

    it('should evaluate POOL_YANTRAS correctly with boolean string false', () => {
      const cond = {
        origem: "POOL_YANTRAS",
        chave: "Mantra",
        operador: "EQ",
        valor: "false"
      };
      const context = {
        poolYantras: [{ tipo: "Mudra" }]
      };
      expect(evaluateCondition(cond, context)).toBe(true);
    });
  });
});
