import React from 'react';
import { ref, update } from "firebase/database";
import { AppContext } from '../../AppContext';


export default function useUpdateVitalidade() {
    const { userData, gameOpen, database } = React.useContext(AppContext)
    const [ value, setValue] = React.useState(0);
    
    async function updateVitalidadeOnDB(
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
    

 return [value, setValue]
}