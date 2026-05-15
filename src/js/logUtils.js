import { ref, push, set } from "firebase/database";

/**
 * Registra uma ação no histórico de logs para o narrador.
 * @param {object} database - Instância do Firebase Database.
 * @param {object} userData - Dados do usuário que realizou a ação.
 * @param {string} type - Tipo de recurso (Mana, FDV, Vitalidade).
 * @param {object} details - Detalhes da mudança { antes, depois, custo }.
 */
export function pushLog(database, userData, type, details) {
  if (!database || !userData) return;

  const logsRef = ref(database, "actionLogs");
  const newLogRef = push(logsRef);

  const timestamp = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const logEntry = {
    userName: userData.nome || "Desconhecido",
    type,
    timestamp,
    ...details,
  };

  set(newLogRef, logEntry).catch((err) => {
    console.error("Erro ao salvar log:", err);
  });
}
