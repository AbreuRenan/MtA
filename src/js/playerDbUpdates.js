// src/js/playerDbUpdates.js
import { ref, update } from "firebase/database";

export async function updateVitalidadeOnDB(
  database,
  userData,
  newDamageState,
  gameOpen
) {
  if (!database || !userData?.id) {
    console.error("Database ou userData.id não disponível para atualizar vitalidade.");
    return false;
  }
  const userRefInDB = ref(database, `users/${userData.id}`);
  const updates = {
    "vitalidade/dano": newDamageState,
  };

  if (gameOpen || userData.role === "narrador") {
    try {
      await update(userRefInDB, updates);
      return true;
    } catch (e) {
      console.error("Erro ao atualizar vitalidade no DB:", e);
      return false;
    }
  }
  return false;
}

export async function updateFvOnDB(
  database,
  userData,
  newFvUsado,
  gameOpen
) {
  if (!database || !userData?.id) {
    console.error("Database ou userData.id não disponível para atualizar Fv.");
    return false;
  }
  const userRefInDB = ref(database, `users/${userData.id}`);
  const updates = {
    "fv/usado": newFvUsado,
  };
  if (gameOpen || userData.role === "narrador") {
    try {
      await update(userRefInDB, updates);
      return true;
    } catch (e) {
      console.error("Erro ao atualizar FdV no DB:", e);
      return false;
    }
  }
  return false;
}

export async function updateManaOnDB(
  database,
  userData,
  newManaUsado,
  gameOpen
) {
  if (!database || !userData?.id) {
    console.error("Database ou userData.id não disponível para atualizar Mana.");
    return false;
  }
  const userRefInDB = ref(database, `users/${userData?.id}`);
  const updates = {
    "mana/usado": newManaUsado,
  };
  if (gameOpen || userData?.role === "narrador") {
    try {
      await update(userRefInDB, updates);
      return true;
    } catch (e) {
      console.error("Erro ao atualizar Mana no DB:", e);
      return false;
    }
  }
  return false;
}