import React from "react";
import styles from "../../styles/playerCompanion.module.css";

function PlayerCompanion() {
  const [damageTaken, setDamageTaken] = React.useState(0);
  const [vitalidadeBox, setVitalidadeBox] = React.useState([0, 0, 0, 0]);

    React.useEffect( ()=> {
        let totalBoxMarked = 0
        const danoObj = {contusivo: 0, letal: 0, agravado: 0}
         
        vitalidadeBox.filter( box => {
            if (box === 1) danoObj.contusivo++
            if (box === 2) danoObj.letal++
            if (box === 3) danoObj.agravado++
            if (box > 0) totalBoxMarked++
        } )
        setDamageTaken(danoObj)
    }, [vitalidadeBox]) 
    console.log(damageTaken)



  function handleVitClick(e) {
    const boxIndex = Number(e.target.getAttribute("index"));
    const newVitState = vitalidadeBox.map((box, index) => {
      if (index === boxIndex) {
        if (box >= 3) return 0;
        return box + 1;
      }
      return box;
    });
    setVitalidadeBox(newVitState);
  }




  return (
    <div>
      <div className="vitalidadeContainer">
        <span>Vitalidade</span>
        <div
          style={{ display: "flex", margin: "10px 0"}}
        >
          {vitalidadeBox.map((box, index) => {
            const classNames = ["", "contusivo", "letal", "agravado"];
            return (
              <div
                key={index}
                index={index}
                className={`${styles.vitalityBoxStyle} ${classNames[box]}`}
                value={box}
                onChange={handleVitClick}
                onClick={handleVitClick}
              ></div>
            );
          })}
        </div>
          <div style={{margin: '5px 0 20px 0'}}>{`{ contusivo:${damageTaken.contusivo} letal:${damageTaken.letal} agravado: ${damageTaken.agravado} }`}</div>
      </div>
    </div>
  );
}

export default PlayerCompanion;
