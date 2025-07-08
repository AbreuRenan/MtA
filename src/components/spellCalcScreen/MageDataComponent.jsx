import React from "react";
import styles from "../../styles/spellcalc.module.css";
import InputGroup from "../helpers/inputGroup";
import InputCheckBox from "../helpers/inputCheckBox";

export default function MageDataComponent(props) {
  const {
    gnose,
    setGnose,
    nivelArcana,
    setNivelArcana,
    nivelRequerido,
    setNivelRequerido,
    magiasAtivas,
    setMagiasAtivas,
    setSpellType,
    regente,
    setRegente,
    page,
    toggleRegente,
  } = props;

  function toggleRadioBtnSpellType(e) {
    const inputValue = e.target.value;
    setSpellType(inputValue);
  }

  return (
    <div className="page" data-page={page}>
      <div className={styles.spellCalcHeader}>
        <h1>Dados do Desperto</h1>
      </div>
      <div className={styles.mageData}>
        <span className={styles.columnName}>Informação do Mago</span>
        <span className={styles.columnName} >Nível</span>
        <InputGroup
          label="Gnose"
          id="gnose"
          value={gnose}
          setValue={setGnose}
        />
        <InputGroup
          label="Nível da Arcana"
          id="nivelArcana"
          value={nivelArcana}
          setValue={setNivelArcana}
        />
        <InputGroup
          label="Nível da Prática"
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
          defaultChecked={regente}
          onChange={toggleRegente}
          setValue={setRegente}
          value={regente}
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
              onChange={toggleRadioBtnSpellType}
            />
            <label htmlFor="improvisado">Improvisado</label>
          </div>
          {/* <div>
            <input
              type="radio"
              id="praxis"
              name="spellType"
              value="praxis"
              onChange={toggleRadioBtnSpellType}
              disabled
            />
            <label htmlFor="praxis">Praxis</label>
          </div> */}
          <div>
            <input
              type="radio"
              id="rote"
              name="spellType"
              value="rote"
              onChange={toggleRadioBtnSpellType}
            />
            <label htmlFor="rote">Clássico</label>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
