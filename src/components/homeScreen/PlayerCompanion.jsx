import React from "react";
import styles from "../../styles/playerCompanion.module.css";
import { AppContext } from "../../AppContext";
import RenderPlayerUtilsBox from "./RenderPlayerUtilsBox";

function PlayerCompanion() {
  const { userData } = React.useContext(AppContext);
  const [damageTaken, setDamageTaken] = React.useState(0);
  const [vitalidadeBox, setVitalidadeBox] = React.useState([0]);
  const [manaBox, setManaBox] = React.useState([0]);
  const [fvBox, setFvBox] = React.useState([0]);

  const firebasePlayerDataScheema = {
    nome: userData.nome,
    vitalidade: {
        max: 7,
        dano: {
            contusivo: 0,
            letal: 0,
            agravado: 0
        }
    },
    mana: {
        max: 0,
        atual: 0
    },
    fv: {
        max: 5,
        atual: 5
    }
  }

  React.useEffect(()=>{
    setVitalidadeBox(Array.from({length: firebasePlayerDataScheema.vitalidade.max}, () => 0))
    setManaBox(Array.from({length: firebasePlayerDataScheema.mana.max}, () => 0))
    setFvBox(Array.from({length: firebasePlayerDataScheema.fv.max}, () => 0))
  },[])

  React.useEffect(() => {
    let totalBoxMarked = 0;
    const danoObj = { contusivo: 0, letal: 0, agravado: 0 };

    vitalidadeBox.filter((box) => {
      if (box === 1) danoObj.contusivo++;
      if (box === 2) danoObj.letal++;
      if (box === 3) danoObj.agravado++;
      if (box > 0) totalBoxMarked++;
    });
    setDamageTaken(danoObj);
  }, [vitalidadeBox]);

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
        <div style={{ display: "flex", margin: "10px 0" }}>
            <RenderPlayerUtilsBox boxToRender={vitalidadeBox} />
        </div>
        <div
          style={{ margin: "5px 0 20px 0" }}
        >{JSON.stringify(damageTaken)}</div>
        <div>{JSON.stringify(firebasePlayerDataScheema)}</div>
      </div>
    </div>
  );
}

export default PlayerCompanion;
