import React from "react";
import { AppContext } from "../../AppContext";

import audioURL from "../../assets/audio/diceRollRedux.mp3";
import { set, ref, push } from "firebase/database";
import RollDisplay from "./RollDisplay";
import RollHistory from "./RollHistory";
import styles from "../../styles/diceRoller.module.css";
import useDiceRoll from "../hooks/useDiceRoll";

function DiceRoller() {
  const { firestore, userData, gameOpen } = React.useContext(AppContext);
  const [totalOfDices, setTotalOfDices] = React.useState(1);
  const [isRollDisabled, setIsRollDisabled] = React.useState(false);
  const [explosionTarget, setExplosionTarget] = React.useState(10);
  const audioRef = React.useRef(null);
  const { roll, result } = useDiceRoll();

  React.useEffect(() => {
    if (result && firestore) {
      const rollHistoryDBRef = ref(firestore, "rollsHistory/");
      const newReg = push(rollHistoryDBRef);
      set(newReg, {
        user: userData?.nome,
        date: result.date,
        roll: result.rolagem,
        sucessos: result.sucessos,
      });
    }
  }, [result]);



  const handleAudioEnd = () => setIsRollDisabled(false);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("ended", handleAudioEnd);
      return () => audio.removeEventListener("ended", handleAudioEnd);
    }
  }, []);

  const doRoll = () => {
    const rollResult = roll(totalOfDices, explosionTarget);
    setIsRollDisabled(true);
    audioRef.current?.play();
  };

  const modifyDiceVal = (value) => {
    setTotalOfDices((prev) => Math.max(-5, prev + value));
  };

  return (
    <div className={`${styles.bg} container`}>
      <div className={`${styles.grid}`}>
        <div className={styles.btnControlsRow}>
          <button className={styles.btnVal} onClick={() => modifyDiceVal(-5)}>
            -5
          </button>
          <button className={styles.btnVal} onClick={() => modifyDiceVal(-1)}>
            -1
          </button>
          <input
            type="number"
            value={totalOfDices}
            className={styles.inputVal}
            onChange={(e) => setTotalOfDices(Number(e.target.value))}
          />
          <button className={styles.btnVal} onClick={() => modifyDiceVal(+1)}>
            +1
          </button>
          <button className={styles.btnVal} onClick={() => modifyDiceVal(+5)}>
            +5
          </button>
        </div>

        {/* Opções de explosão */}
        <div className={styles.options}>
          <div>
            <input
              type="checkbox"
              checked={explosionTarget === 8}
              onChange={() => setExplosionTarget(8)}
            />
            <label>Explosão no 8</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={explosionTarget === 9}
              onChange={() => setExplosionTarget(9)}
            />
            <label>Explosão no 9</label>
          </div>
        </div>

        {/* Botão de rolagem */}
        <button
          className={styles.rollBtn}
          onClick={doRoll}
          disabled={isRollDisabled}
        >
          Rolar!
        </button>
      </div>

      {/* Exibição do resultado */}
      <RollDisplay rolls={result?.rolagem} />

      {/* Áudio (oculto) */}
      <audio ref={audioRef} src={audioURL} />

      {/* Histórico */}
      <RollHistory />
    </div>
  );
}

// Componente para exibir os dados rolados


export default DiceRoller;
