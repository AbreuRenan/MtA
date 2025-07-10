import React from "react";
import styles from "../../styles/playerCompanion.module.css";
import { AppContext } from "../../AppContext";
import RenderPlayerUtilsBox from "./RenderPlayerUtilsBox";
import { ref, set, update } from "firebase/database";

export default function PlayerCompanion() {
  const { userData, gameOpen, database } =
    React.useContext(AppContext);
  const [vitalidadeBoxes, setVitalidadeBoxes] = React.useState([0]);
  const [manaBoxes, setManaBoxes] = React.useState([0]);
  const [fvBoxes, setFvBoxes] = React.useState([0]);

  // const firebasePlayerDataScheema = {
  //   nome: userData.nome,
  //   vitalidade: {
  //     max: userData?.vitalidade?.max,
  //     dano: {
  //       contusivo: userData?.vitalidade.dano.contusivo,
  //       letal: userData?.vitalidade.dano.letal,
  //       agravado: userData?.vitalidade.dano.agravado,
  //     },
  //   },
  //   mana: {
  //     max: userData?.mana?.max,
  //     usado: userData?.mana?.usado,
  //   },
  //   fv: {
  //     max: userData?.fv?.max,
  //     usado: userData?.fv?.usado,
  //   },
  // };

  const renderVitalityBoxes = React.useCallback(
    (vitalidadeData, maxVitalidade) => {
      let currentDano = { ...vitalidadeData.dano };
      return Array.from({ length: maxVitalidade }, () => {
        if (currentDano.agravado > 0) {
          currentDano.agravado--;
          return 3;
        } else if (currentDano.letal > 0) {
          currentDano.letal--;
          return 2;
        } else if (currentDano.contusivo > 0) {
          currentDano.contusivo--;
          return 1;
        } else return 0;
      });
    },
    []
  );

  const renderSimpleBoxes = React.useCallback((usado, max) => {
    let countUsado = usado;
    return Array.from({ length: max }, () => {
      if (countUsado > 0) {
        countUsado--;
        return 1;
      } else return 0;
    });
  }, []); // Dependências vazias

  React.useEffect(() => {
    if (userData && userData.vitalidade && userData.mana && userData.fv) {
      setVitalidadeBoxes(renderVitalityBoxes(userData.vitalidade, userData.vitalidade.max));
      setManaBoxes(renderSimpleBoxes(userData.mana.usado, userData.mana.max));
      setFvBoxes(renderSimpleBoxes(userData.fv.usado, userData.fv.max));
    }
  }, [userData, renderVitalityBoxes, renderSimpleBoxes]);

  const updateVitalidadeOnDB = React.useCallback(
    async (newDamageState) => {
      const userRefInDB = ref(database, `users/${userData.id}`);
      const updates = {
        "vitalidade/dano": newDamageState,
      };

      if (gameOpen || userData.role === "narrador") {
        try {
          await update(userRefInDB, updates);
        } catch (e) {
          console.error("Erro ao atualizar vitalidade no DB:", e);
        }
      }
    },
    [database, userData?.id, userData?.role, gameOpen]
  );

  const updateFvOnDB = React.useCallback(
    async (newFvUsado) => {
      const userRefInDB = ref(database, `users/${userData.id}`);
      const updates = {
        "fv/usado": newFvUsado,
        // 'fv/max': userData.fv.max, // Inclua se precisar atualizar também o max aqui, mas AdminConsole já faz isso
      };
      if (gameOpen || userData.role === "narrador") {
        try {
          await update(userRefInDB, updates);
        } catch (e) {
          console.error("Erro ao atualizar FdV no DB:", e);
        }
      }
    },
    [database, userData?.id, userData?.role, gameOpen]
  );

  const updateManaOnDB = React.useCallback(
    async (newManaUsado) => {
      const userRefInDB = ref(database, `users/${userData?.id}`);
      const updates = {
        "mana/usado": newManaUsado,
      };
      if (gameOpen || userData?.role === "narrador") {
        try {
          await update(userRefInDB, updates);
        } catch (e) {
          console.error("Erro ao atualizar Mana no DB:", e);
        }
      }
    },
    [database, userData?.id, userData?.role, gameOpen]
  );

  function handleBoxClick(e, boxesArrayToChange, setterOfTheBoxArray, maxOfMarks, boxType) {
    const boxIndex = Number(e.target.getAttribute("index"));
    const newBoxToChangeState = boxesArrayToChange.map((box, index) => {
      if (index === boxIndex) {
        if (box >= maxOfMarks) return 0;
        return box + 1;
      }
      return box;
    });
    
    setterOfTheBoxArray(newBoxToChangeState);

    if (boxType === "vitalidade") {
      const newDanoObj = {
        contusivo: newBoxToChangeState.filter((item) => item === 1).length,
        letal: newBoxToChangeState    .filter((item) => item === 2).length,
        agravado: newBoxToChangeState .filter((item) => item === 3).length,
      };
      updateVitalidadeOnDB(newDanoObj);

    } else if (boxType === "fv") {
      const newFvUsado = newBoxToChangeState.filter((item) => item === 1).length;
      updateFvOnDB(newFvUsado);

    } else if (boxType === "mana") {
      const newManaUsado = newBoxToChangeState.filter((item) => item === 1).length;
      updateManaOnDB(newManaUsado);
    }
  }

  return (
    <div>
       <h2 className={styles.playerTitle}>Olá {userData.nome}</h2>
       <div className={styles.playerStats}>
        <p>Vitalidade: {userData.vitalidade.max}</p>
        <p>Vontade: {userData.fv.usado}/{userData.fv.max}</p>
        <p>Mana: {userData.mana.usado}/{userData.mana.max}</p>
       </div>
      <RenderPlayerUtilsBox
        boxToRender={vitalidadeBoxes}
        type={"Vitalidade"}
        clickHandler={(e) =>
          handleBoxClick(e, vitalidadeBoxes, setVitalidadeBoxes, 3, "vitalidade")
        }
      />
      <RenderPlayerUtilsBox
        boxToRender={fvBoxes}
        type={"Força de Vontade"}
        clickHandler={(e) => handleBoxClick(e, fvBoxes, setFvBoxes, 1, "fv")}
      />
      <RenderPlayerUtilsBox
        boxToRender={manaBoxes}
        type={"Mana"}
        clickHandler={(e) => handleBoxClick(e, manaBoxes, setManaBoxes, 1, "mana")}
      />
      <br />
      <hr />
      <br />
      {/* <div className={styles.expContainer}>
        <div>Exp: {userData.exp ? userData.exp : 0}</div>
        <div>Exp Arcana: {userData.expA ? userData.expA : 0}</div>
      </div> */}
    </div>
  );
}