export { tiposYantra } from "./yantraModel";

export function evaluateCondition(condicao, context) {
  if (!condicao) return false;
  const { origem, chave, operador, valor } = condicao;
  let contextValue = 0;

  const normalizedOrigem = String(origem || "").toUpperCase().trim();
  const normalizedChave = String(chave || "").toLowerCase().trim();
  const normalizedOperador = String(operador || "").toUpperCase().trim();

  let normalizedValor = valor;

  if (normalizedOrigem === "FATOR_MAGIA") {
    // Procura a chave de forma case-insensitive e sem espaços nos fatores de magia do personagem
    if (context && context.fatoresMagia) {
      const actualKey = Object.keys(context.fatoresMagia).find(
        k => String(k).toLowerCase().trim() === normalizedChave
      );
      if (actualKey) {
        contextValue = context.fatoresMagia[actualKey];
      }
    }
  } else if (normalizedOrigem === "POOL_YANTRAS") {
    // Para POOL_YANTRAS, a chave é o tipo do Yantra (ex: Mudra, Mantra) ou o ID do Yantra (ex: -NtY...).
    const isActive = !!context.poolYantras?.some(
      y => String(y.tipo || "").toLowerCase().trim() === normalizedChave ||
           String(y.id || "").toLowerCase().trim() === normalizedChave
    );

    const toBool = (v) => {
      if (typeof v === "boolean") return v;
      const s = String(v ?? "").toLowerCase().trim();
      return s === "true" || s === "ativo";
    };

    contextValue = isActive;
    normalizedValor = toBool(valor);
  }

  const strVal = String(normalizedValor ?? "").toLowerCase().trim();
  const strCtx = String(contextValue ?? "").toLowerCase().trim();

  switch (normalizedOperador) {
    case "EQ":
      return strCtx === strVal;
    case "GE":
      return Number(contextValue) >= Number(valor);
    case "LE":
      return Number(contextValue) <= Number(valor);
    default:
      return false; // Operador desconhecido
  }
}

export function evaluateRequisitos(requisitosNode, context) {
  if (!requisitosNode || !requisitosNode.condicoes || requisitosNode.condicoes.length === 0) {
    return true; // Se não tem requisitos, passa automaticamente
  }

  const { operadorLogico = "AND", condicoes } = requisitosNode;
  const op = String(operadorLogico).toUpperCase().trim();

  if (op === "AND") {
    return condicoes.every(cond => {
      // Se cond tem operadorLogico ou condicoes internas, é um subgrupo (recursivo)
      if (cond.operadorLogico || Array.isArray(cond.condicoes)) {
        return evaluateRequisitos(cond, context);
      }
      return evaluateCondition(cond, context);
    });
  } else if (op === "OR") {
    return condicoes.some(cond => {
      if (cond.operadorLogico || Array.isArray(cond.condicoes)) {
        return evaluateRequisitos(cond, context);
      }
      return evaluateCondition(cond, context);
    });
  } else if (op === "NOT") {
    // Retorna verdadeiro apenas se NENHUMA das condições internas for verdadeira
    return !condicoes.some(cond => {
      if (cond.operadorLogico || Array.isArray(cond.condicoes)) {
        return evaluateRequisitos(cond, context);
      }
      return evaluateCondition(cond, context);
    });
  }

  // Fallback seguro caso seja um operador desconhecido
  return condicoes.every(cond => {
    if (cond.operadorLogico || Array.isArray(cond.condicoes)) {
      return evaluateRequisitos(cond, context);
    }
    return evaluateCondition(cond, context);
  });
}

export function validateYantra(yantraToEvaluate, context) {
  if (!yantraToEvaluate) return { isValid: true, reason: "" };

  // 1. Regra de Unicidade: Ferramenta Dedicada
  // Verifica se o yantra é uma Ferramenta Dedicada e já existe outra (com ID diferente) no pool
  if (yantraToEvaluate.tipo === "Ferramenta Dedicada") {
    const hasFerramentaDedicada = context.poolYantras?.some(
      y => y.tipo === "Ferramenta Dedicada" && y.id !== yantraToEvaluate.id
    );
    if (hasFerramentaDedicada) {
      return { isValid: false, reason: "Apenas uma Ferramenta Dedicada por magia." };
    }
  }

  // 2. Avaliação de Requisitos Recursivos
  if (yantraToEvaluate.requisitos && Object.keys(yantraToEvaluate.requisitos).length > 0) {
    const passed = evaluateRequisitos(yantraToEvaluate.requisitos, context);
    if (!passed) {
      return { isValid: false, reason: "Não atende aos requisitos do Yantra." };
    }
  }

  return { isValid: true, reason: "" };
}

export function extractYantraCosts(poolYantras) {
  if (!Array.isArray(poolYantras)) return {};

  const totalCosts = {
    SLOT_YANTRA: 0
  };

  poolYantras.forEach(yantraData => {
    totalCosts.SLOT_YANTRA += Number(yantraData.custoSlots) || 0;
  });

  return totalCosts;
}

export function calculateUsedSlots(poolYantras) {
  const costs = extractYantraCosts(poolYantras);
  return costs.SLOT_YANTRA || 0;
}
