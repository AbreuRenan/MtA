import { ref, update } from "firebase/database";
import { pushLog } from "./logUtils";

export async function updateUserDbAttribute(
  database, 
  userData, 
  attributePath, 
  newValue, 
  logConfig = null
) {
  if (!database || !userData?.id) {
    console.error(`Database ou userData.id não disponível para atualizar ${attributePath}.`);
    return false;
  }
  
  const userRefInDB = ref(database, `users/${userData.id}`);
  const updates = { [attributePath]: newValue };

  try {
    await update(userRefInDB, updates);
    if (logConfig) {
      pushLog(database, userData, logConfig.action, logConfig.details);
    }
    return true;
  } catch (e) {
    console.error(`Erro ao atualizar ${attributePath} no DB:`, e);
    return false;
  }
}