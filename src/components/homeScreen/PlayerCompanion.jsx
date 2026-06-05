import React from "react";
import styles from "../../styles/playerCompanion.module.css";
import { AppContext } from "../../AppContext";
import RenderPlayerUtilsBox from "./RenderPlayerUtilsBox";
import { ref, set, update } from "firebase/database";
import { pushLog } from "../../js/logUtils";
import { updateUserDbAttribute } from "../../js/playerDbUpdates";

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
    let countDisponivel = max - usado;
    return Array.from({ length: max }, () => {
      if (countDisponivel > 0) {
        countDisponivel--;
        return 1;
      } else return 0;
    });
  }, []);

  React.useEffect(() => {
    if (userData && userData.vitalidade && userData.mana && userData.fv) {
      setVitalidadeBoxes(renderVitalityBoxes(userData.vitalidade, userData.vitalidade.max));
      setManaBoxes(renderSimpleBoxes(userData.mana.usado, userData.mana.max));
      setFvBoxes(renderSimpleBoxes(userData.fv.usado, userData.fv.max));
    }
  }, [userData, renderVitalityBoxes, renderSimpleBoxes]);

  const updateVitalidadeOnDB = React.useCallback(
    async (newDamageState) => {
      await updateUserDbAttribute(database, userData, "vitalidade/dano", newDamageState, {
        action: "Vitalidade",
        details: {
          antes: JSON.stringify(userData.vitalidade.dano),
          depois: JSON.stringify(newDamageState)
        }
      });
    },
    [database, userData]
  );

  const updateFvOnDB = React.useCallback(
    async (newFvUsado) => {
      const fvMax = userData.fv.max;
      await updateUserDbAttribute(database, userData, "fv/usado", newFvUsado, {
        action: "Vontade",
        details: {
          antes: fvMax - (userData.fv.usado || 0),
          depois: fvMax - newFvUsado
        }
      });
    },
    [database, userData]
  );

  const updateManaOnDB = React.useCallback(
    async (newManaUsado) => {
      const manaMax = userData.mana.max;
      await updateUserDbAttribute(database, userData, "mana/usado", newManaUsado, {
        action: "Mana",
        details: {
          antes: manaMax - (userData.mana.usado || 0),
          depois: manaMax - newManaUsado
        }
      });
    },
    [database, userData]
  );

  const isBlocked = !gameOpen && userData?.role !== "narrador";

  function handleBoxClick(e, boxesArrayToChange, setterOfTheBoxArray, maxOfMarks, boxType) {
    if (isBlocked) return;

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
      const availableFv = newBoxToChangeState.filter((item) => item === 1).length;
      const newFvUsado = newBoxToChangeState.length - availableFv;
      updateFvOnDB(newFvUsado);

    } else if (boxType === "mana") {
      const availableMana = newBoxToChangeState.filter((item) => item === 1).length;
      const newManaUsado = newBoxToChangeState.length - availableMana;
      updateManaOnDB(newManaUsado);
    }
  }

  return (
    <div>
       <h2 className={styles.playerTitle}>Olá {userData.nome}</h2>
       <div className={styles.playerStats}>
        <p>Vitalidade: {userData.vitalidade.max}</p>
        <p>Vontade: {userData.fv.max - userData.fv.usado}/{userData.fv.max}</p>
        <p>Mana: {userData.mana.max - userData.mana.usado}/{userData.mana.max}</p>
       </div>
      <RenderPlayerUtilsBox
        boxToRender={vitalidadeBoxes}
        type={"Vitalidade"}
        clickHandler={(e) =>
          handleBoxClick(e, vitalidadeBoxes, setVitalidadeBoxes, 3, "vitalidade")
        }
        disabled={isBlocked}
      />
      <RenderPlayerUtilsBox
        boxToRender={fvBoxes}
        type={"Força de Vontade"}
        clickHandler={(e) => handleBoxClick(e, fvBoxes, setFvBoxes, 1, "fv")}
        disabled={isBlocked}
      />
      <RenderPlayerUtilsBox
        boxToRender={manaBoxes}
        type={"Mana"}
        clickHandler={(e) => handleBoxClick(e, manaBoxes, setManaBoxes, 1, "mana")}
        disabled={isBlocked}
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