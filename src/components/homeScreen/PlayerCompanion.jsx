import React from "react";
import styles from "../../styles/playerCompanion.module.css";
import { AppContext } from "../../AppContext";
import RenderPlayerUtilsBox from "./RenderPlayerUtilsBox";
import { ref, set, update } from "firebase/database";

function PlayerCompanion() {
  const { userData, setUserData, saveLocalData, database } =
    React.useContext(AppContext);
  const [damageTaken, setDamageTaken] = React.useState(0);
  const [vitalidadeBox, setVitalidadeBox] = React.useState([0]);
  const [manaBox, setManaBox] = React.useState([0]);
  const [fvBox, setFvBox] = React.useState([0]);
  const firebasePlayerDataScheema = {
    nome: userData.nome,
    vitalidade: {
      max: userData?.vitalidade.max,
      dano: {
        contusivo: userData?.vitalidade.dano.contusivo,
        letal: userData?.vitalidade.dano.letal,
        agravado: userData?.vitalidade.dano.agravado,
      },
    },
    mana: {
      max: userData?.mana?.max,
      atual: userData?.mana?.atual,
    },
    fv: {
      max: userData?.fv?.max,
      atual: userData?.fv?.atual,
    },
  };
  React.useEffect(() => {
    let danoObjc = userData.vitalidade.dano;
    setVitalidadeBox(
      Array.from({ length: firebasePlayerDataScheema.vitalidade.max }, () => {
        if (danoObjc.agravado > 0) {danoObjc.agravado--; return 3}
        else if (danoObjc.letal > 0)  {danoObjc.letal--; return 2}
        else if (danoObjc.contusivo > 0)  {danoObjc.contusivo--; return 1}
        else return 0
    })
    );
    setManaBox(
      Array.from({ length: firebasePlayerDataScheema.mana.max }, () => 0)
    );
    setFvBox(Array.from({ length: firebasePlayerDataScheema.fv.max }, () => 0));
  }, []);

  React.useEffect(() => {
    const danoObj = userData.vitalidade.dano;
    danoObj.contusivo = vitalidadeBox.filter( (item) => item === 1).length
    danoObj.letal = vitalidadeBox.filter( (item) => item === 2).length
    danoObj.agravado = vitalidadeBox.filter( (item) => item === 3).length
    setDamageTaken((prev) => danoObj);
  }, [vitalidadeBox]);

  async function updatateVitOnDB() {
    const userRefInDB = ref(database, `users/${userData.id}`);
    const newDmgData = {
      vitalidade: {
        max: userData.vitalidade.max,
        dano: damageTaken,
      },
    };

    const response = await update(userRefInDB, newDmgData).then(()=> true).catch(e => e)
    if(response) {
      const newUserData = userData
      userData.vitalidade.dano = damageTaken;
      saveLocalData(newUserData);
    }
  }


  function handleBoxClick(
    e,
    boxStateToChange,
    setterOfTheBox,
    maxOfMark,
    boxType = false
  ) {
    const boxIndex = Number(e.target.getAttribute("index"));
    const newBoxToChangeState = boxStateToChange.map((box, index) => {
      if (index === boxIndex) {
        if (box >= maxOfMark) return 0;
        console.log(box)
        return box + 1;
      }
      return box;
    });
    setterOfTheBox(newBoxToChangeState);
    updatateVitOnDB();
  }

  return (
    <div>
      <RenderPlayerUtilsBox
        boxToRender={vitalidadeBox}
        type={"Vitalidade"}
        clickHandler={(e) =>
          handleBoxClick(e, vitalidadeBox, setVitalidadeBox, 3, "vitalidade")
        }
      />
      <RenderPlayerUtilsBox
        boxToRender={fvBox}
        type={"Força de Vontade"}
        clickHandler={(e) => handleBoxClick(e, fvBox, setFvBox, 1)}
      />
      <RenderPlayerUtilsBox
        boxToRender={manaBox}
        type={"Mana"}
        clickHandler={(e) => handleBoxClick(e, manaBox, setManaBox, 1)}
      />
    </div>
  );
}

export default PlayerCompanion;
