import React from "react";
import styles from "../../styles/playerCompanion.module.css";
import { AppContext } from "../../AppContext";
import RenderPlayerUtilsBox from "./RenderPlayerUtilsBox";
import { ref, set, update } from "firebase/database";

function PlayerCompanion() {
  const { userData, gameOpen, saveLocalData, database } =
    React.useContext(AppContext);
  const [damageTaken, setDamageTaken] = React.useState(0);
  const [vitalidadeBox, setVitalidadeBox] = React.useState([0]);
  const [manaBox, setManaBox] = React.useState([0]);
  const [fvBox, setFvBox] = React.useState([0]);
  const firebasePlayerDataScheema = {
    nome: userData.nome,
    vitalidade: {
      max: userData?.vitalidade?.max,
      dano: {
        contusivo: userData?.vitalidade.dano.contusivo,
        letal: userData?.vitalidade.dano.letal,
        agravado: userData?.vitalidade.dano.agravado,
      },
    },
    mana: {
      max: userData?.mana?.max,
      usado: userData?.mana?.usado,
    },
    fv: {
      max: userData?.fv?.max,
      usado: userData?.fv?.usado,
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
    let manaObj = userData.mana.usado;
    setManaBox(
      Array.from({ length: firebasePlayerDataScheema.mana.max }, () => {
        if (manaObj > 0) {manaObj--; return 1}
        else return 0
      })
    );
    let fvObj = userData.fv.usado
    setFvBox(Array.from({ length: firebasePlayerDataScheema.fv.max }, () => {
      if(fvObj > 0) {fvObj--; return 1}
      else return 0
    }));
  }, []);



  async function updatateVitOnDB() {
    const userRefInDB = ref(database, `users/${userData.id}`);
    const newDmgData = {
      vitalidade: {
        max: userData.vitalidade.max,
        dano: damageTaken,
      },
    };
    if(gameOpen || userData.role === "narrador") {
      const response = await update(userRefInDB, newDmgData).then(()=> true).catch(e => e)
      if(response) {
        const newUserData = userData
        userData.vitalidade.dano = damageTaken;
        saveLocalData(newUserData);
      }
    }
  }

  async function updatateFvOnDB(fv){
    const userRefInDB = ref(database, `users/${userData.id}`);
    const newFVData = {
      fv: {
        max: userData.fv.max,
        usado: fv,
      },
    };
    if(gameOpen || userData.role === "narrador"){
      const response = await update(userRefInDB, newFVData).then( ()=> true).catch(e => console.log(e))
      if (response) {
        const newUserData = userData;
        userData.fv.usado = fv;
        saveLocalData(newUserData);
      }
    }

  }

  async function updatateManaOnDB(m){
    const userRefInDB = ref(database, `users/${userData.id}`);
    const newFVData = {
      mana: {
        max: userData.mana.max,
        usado: m,
      },
    };
    if(gameOpen || userData.role === "narrador") {
      const response = await update(userRefInDB, newFVData).then( ()=> true).catch(e => console.log(e))
      if (response) {
        const newUserData = userData;
        userData.mana.usado = m;
        saveLocalData(newUserData);
      }
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
        return box + 1;
      }
      return box;
    });
    setterOfTheBox(newBoxToChangeState);
  }

  React.useEffect(() => {
    const danoObj = userData.vitalidade.dano;
    danoObj.contusivo = vitalidadeBox.filter( (item) => item === 1).length
    danoObj.letal = vitalidadeBox.filter( (item) => item === 2).length
    danoObj.agravado = vitalidadeBox.filter( (item) => item === 3).length
    setDamageTaken((prev) => danoObj);

    updatateVitOnDB()
  }, [vitalidadeBox]);

  React.useEffect(() => {
    const fvObj = fvBox.filter( (item) => item === 1).length
    updatateFvOnDB(fvObj)
  }, [fvBox]);

  React.useEffect(() => {
    const manaObj = manaBox.filter( (item) => item === 1).length
    updatateManaOnDB(manaObj)
  }, [manaBox]);


  return (
    <div style={{marginBottom: '50px'}}>
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
        clickHandler={(e) => handleBoxClick(e, fvBox, setFvBox, 1,'fv')}
      />
      <RenderPlayerUtilsBox
        boxToRender={manaBox}
        type={"Mana"}
        clickHandler={(e) => handleBoxClick(e, manaBox, setManaBox, 1, 'mana')}
      />
    </div>
  );
}

export default PlayerCompanion;
