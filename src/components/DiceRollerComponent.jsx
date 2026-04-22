import React from "react";
import roll from "../js/dice";
import DiceResult from "./diceScreenComponents/DiceResult";

import styles from "../styles/diceRoller.module.css";
import audioURL from "../assets/audio/diceRollRedux.mp3";

import { set, ref, push } from "firebase/database";
import RollHistory from "./diceScreenComponents/RollHistory";
import { AppContext } from "../AppContext";
import { useSearchParams } from "react-router-dom";

function DiceRollerComponent() {
  const { firestore, userData, gameOpen } = React.useContext(AppContext);
  const [totalOfDices, setTotalOfDices] = React.useState(0);
  const [DisableRoll, setDisableRoll] = React.useState(gameOpen ? false : true);
  const [rollReturn, setRollReturn] = React.useState(null);
  
  const [explosion8, setExplosion8] = React.useState(false);
  const [explosion9, setExplosion9] = React.useState(false);

  const audioRef = React.useRef(null);
  const containerRef = React.useRef(null);

  const rollHistoryDBRef = ref(firestore, "rollsHistory/");

  const [searchParams] = useSearchParams();
  const paradaDeDados = searchParams.get('paradaDeDados');
  const paradaDeDadosNumero = parseInt(paradaDeDados, 10);

  React.useEffect(() => {
    if (userData?.role === "narrador") {
      setDisableRoll(false);
    } else {
      setDisableRoll(!gameOpen);
    }
  }, [gameOpen, userData]);

  React.useEffect(() => {
    function saveRollOnFirebase({ hash, date, rolagem, sucessos }) {
      const newReg = push(rollHistoryDBRef);
      set(newReg, {
        user: userData?.nome,
        date: date,
        roll: [...rolagem],
        sucessos
      });
    }
    if (rollReturn) saveRollOnFirebase(rollReturn);
  }, [rollReturn]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("ended", stopDiceSound);
      return () => {
        audio.removeEventListener("ended", stopDiceSound);
      };
    }
  }, []);

  React.useEffect( ()=> {
    if (paradaDeDadosNumero) setTotalOfDices(paradaDeDadosNumero) 
  }, [paradaDeDadosNumero])

  function stopDiceSound() {
    setDisableRoll(false);
    if (containerRef.current) {
        containerRef.current.scrollTop = 0;
    }
  }

  function modifyDiceVal({ target }) {
    const val = Number(target.value);
    setTotalOfDices((prev) => {
      if (prev + val < -5) return -5;
      return prev + val;
    });
  }

  function handleChange({ target }) {
    const val = Number(target.value);
    setTotalOfDices(val);
  }

  function doRoll() {
    let explosionTarget = 10;
    if (explosion8) explosionTarget = 8;
    else if (explosion9) explosionTarget = 9;

    const result = roll(totalOfDices, explosionTarget);
    setDisableRoll(true);
    setRollReturn(result);
    if (audioRef.current) {
        audioRef.current.play();
    }
  }

  return (
    <div ref={containerRef} className={`${styles.bg} container`}>
      <div className={`${styles.grid}`}>
        <center>
          <label htmlFor="numberDados">Quantidade de Dados</label>
        </center>
        <div className={`${styles.btnControlsRow}`}>
          <button
            value={-5}
            onClick={modifyDiceVal}
            className={`${styles.btnVal}`}
          >
            -5
          </button>
          <button
            value={-1}
            onClick={modifyDiceVal}
            className={`${styles.btnVal}`}
          >
            -1
          </button>
          <input
            id="numberDados"
            name="numberDados"
            type="number"
            value={totalOfDices}
            onChange={handleChange}
            className={`${styles.inputVal}`}
          />
          <button
            value={+1}
            onClick={modifyDiceVal}
            className={`${styles.btnVal}`}
          >
            +1
          </button>
          <button
            value={+5}
            onClick={modifyDiceVal}
            className={`${styles.btnVal}`}
          >
            +5
          </button>
        </div>
        <div className={`${styles.options}`}>
          <div>
            <input
              id="explod8"
              name="explod8"
              type="checkbox"
              checked={explosion8}
              onChange={(e) => {
                  setExplosion8(e.target.checked);
                  if (e.target.checked) setExplosion9(false);
              }}
              className="targetNumExplosion"
            />
            <label htmlFor="explod8">Explosão do 8</label>
          </div>
          <div>
            <input
              id="explod9"
              name="explod9"
              type="checkbox"
              checked={explosion9}
              onChange={(e) => {
                  setExplosion9(e.target.checked);
                  if (e.target.checked) setExplosion8(false);
              }}
              className="targetNumExplosion"
            />
            <label htmlFor="explod9">Explosão do 9</label>
          </div>
        </div>
        <button
          onClick={doRoll}
          className={`${styles.rollBtn}`}
          disabled={DisableRoll}
        >
          Rolar!
        </button>
      </div>
      <audio ref={audioRef} id="diceSound" src={audioURL}></audio>
      
      <div id="rollDisplayArea" className={`${styles.rollDisplayArea}`}>
          {rollReturn && rollReturn.rolagem.map((val, idx) => (
              <DiceResult 
                key={`${rollReturn.hash}-${idx}`}
                value={val}
                index={idx}
                explosionTarget={rollReturn.explosionTarget}
                successThreshold={rollReturn.successThreshold}
              />
          ))}

          {rollReturn && (
              rollReturn.sucessos === 0 && rollReturn.critFailDices > 0 ? (
                  <div className="falhaCrit">
                      <span>Falha Crítica!!!</span>
                  </div>
              ) : (
                  <>
                    <div className="qtdFalha">
                        <span>{rollReturn.falhas}</span>
                        <span>Quantidade de Falhas</span>
                    </div>
                    <div className="qtdSucesso">
                        <span>{rollReturn.sucessos}</span>
                        <span>Quantidade de Sucessos</span>
                    </div>
                  </>
              )
          )}
      </div>

      <div className={`${styles.lastRolls}`}>
        <span>Ultimas Rolagens</span>
        <i>filtro</i>
      </div>
      <RollHistory />
    </div>
  );
}

export default DiceRollerComponent;
