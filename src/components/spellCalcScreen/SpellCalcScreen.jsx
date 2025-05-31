import React from "react";
import styles from "../../styles/spellcalc.module.css";
import InputGroup from "./inputGroup";
import InputCheckBox from "./inputCheckBox";

export default function SpellCalcScreen() {
  const [gnosis, setGnosis] = React.useState(1);
  const [nivelArcana, setNivelArcana] = React.useState(1);
  const [nivelRequerido, setNivelRequerido] = React.useState(1);
  const [magiasAtivas, setMagiasAtivas] = React.useState(0);
  const [spellType, setSpellType] = React.useState("improvisado");
  const [regente, setRegente] = React.useState(false);
  const [page, setPage] = React.useState(1);


  function toggleRadioBtn(e) {
    const inputValue = e.target.value;
    setSpellType(inputValue);
  }



  React.useEffect(() => {
    console.log(spellType);
  }, [spellType]);

  return (
    <div className={`container `}>
      <div className={styles.spellCalcHeader}>
        <h1>Dados do Desperto</h1>
      </div>
      <div className={styles.mageData}>
        <InputGroup
          label="Gnosis"
          id="gnosis"
          value={gnosis}
          setValue={setGnosis}
        />
        <InputGroup
          label="Nivel Arcana"
          id="nivelArcana"
          value={nivelArcana}
          setValue={setNivelArcana}
        />
        <InputGroup
          label="Nível Requerido"
          id="nivelRequerido"
          value={nivelRequerido}
          setValue={setNivelRequerido}
        />
        <InputGroup
          label="Magias Ativas"
          id="magiasAtiva"
          value={magiasAtivas}
          setValue={setMagiasAtivas}
          min={0}
        />
        <InputCheckBox
          label="Arcana é Regente?"
          id="regente"
          setValue={setRegente}
        />
        <fieldset className={`${styles.inputGroupSpellType} ${styles.options}`}>
          <legend>Tipo de Feitiço</legend>
          <div>
            <input
              type="radio"
              id="improvisado"
              name="spellType"
              value="improvisado"
              defaultChecked
              onChange={toggleRadioBtn}
            />
            <label htmlFor="improvisado">Improvisado</label>
          </div>

          <div>
            <input
              type="radio"
              id="praxis"
              name="spellType"
              value="praxis"
              onChange={toggleRadioBtn}
            />
            <label htmlFor="praxis">Praxis</label>
          </div>

          <div>
            <input
              type="radio"
              id="rote"
              name="spellType"
              value="rote"
              onChange={toggleRadioBtn}
            />
            <label htmlFor="rote">Clássico</label>
          </div>
        </fieldset>
      </div>
      <div className={styles.spellCalcFooter}>
        <button
          className={styles.button}
          onClick={() => {
            setPage((prev) => (prev === 1 ? 1 : prev - 1));
          }}
        >
          Back
        </button>
        <button
          className={styles.button}
          onClick={() => {
            setPage((prev) => (prev === 3 ? 3 : prev + 1));
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
