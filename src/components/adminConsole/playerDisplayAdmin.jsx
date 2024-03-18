import React from "react";
import styles from "./adminStyles.module.css";

function PlayerDisplayAdmin({ player }) {
  const [expState, setExpState] = React.useState(0)
  const [expAState, setExpAState] = React.useState(0)

  React.useEffect( ()=> {
    setExpState(player.exp)
    setExpAState(player.expA)
  }, [player])


  function handleClick(type, value) {
    if (type === 'exp') setExpState( (prev) => prev+value)
    if (type === 'expA') setExpAState( (prev) => prev+value)

  }

  return (
    <div className={styles.divContainerStyle}>
      <h1>{player?.nome ? player.nome : "Jogador Não Selecionado"}</h1>
      <div className={styles.expContainer}>
        <div>
          <span>Exp: {player?.exp ? expState : "N/A"}</span>
          <div>
            <button className={styles.btn} onClick={() => handleClick('exp',1)}>+</button>
            <button className={styles.btn} onClick={() => handleClick('exp',-1)}>-</button>
          </div>
        </div>
        <div>
          <span>Exp Arcana:{player?.expA ? expAState : "N/A"}</span>
          <div>
            <button className={styles.btn} onClick={() => handleClick('expA',1)}>+</button>
            <button className={styles.btn} onClick={() => handleClick('expA',-1)}>-</button>
          </div>
        </div>
      </div>
      <div>
        {player &&
          Object.keys(player?.vitalidade?.dano).map((key) => (
            <div key={key}>{key}: {player?.vitalidade?.dano[key]} </div>
          ))}{" "}
         max: {player?.vitalidade?.max}
      </div>
    </div>
  );
}

export default PlayerDisplayAdmin;
