import React from "react";
import styles from "./adminStyles.module.css";

function PlayerDisplayAdmin({ player }) {
  const [expState, setExpState] = React.useState(0)
  const [expAState, setExpAState] = React.useState(0)

  React.useEffect( ()=> {
    setExpState(player?.exp)
    setExpAState(player?.expA)
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
          <span>FV Max: {player?.fv?.max}</span>
        </div>
        <div>
          <span>FV Gasto: {player?.fv?.usado}</span>
        </div>
      </div>
      <div className={styles.manaContainer}>
        <div>
          <span>Mana Max: {player?.mana?.max}</span>
        </div>
        <div>
          <span>Mana Gasto: {player?.mana?.usado}</span>
        </div>
      </div>
      <hr />
      <div className={styles.dmgTxtContainer}>
      
        {player &&
          Object.keys(player?.vitalidade?.dano).map((key) => (
            <div key={key} className={styles.dmgItem}>{key}: {player?.vitalidade?.dano[key]} </div>
          ))}{" "}
         <div>
            Vitalidade max: {player?.vitalidade?.max}
         </div>
      </div>
    </div>
  );
}

export default PlayerDisplayAdmin;
