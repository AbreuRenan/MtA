import React from "react";
import styles from "../../styles/spellcalc.module.css";
import InputGroup from "./inputGroup";
import InputCheckBox from "./inputCheckBox";

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
        spellType,
        setSpellType,
        regente,
        setRegente,
        page,
        setPage,
        onChangeToggle
    } = props;
    
  function toggleRadioBtn(e) {
    const inputValue = e.target.value;
    setSpellType(inputValue);
  }

  // function onChangeToggle(e) {
  //   const isChecked = e.target.checked;
  //   setRegente(isChecked);
  // }

  return (
    <div className="page" data-page={page}>
      <div className={styles.spellCalcHeader}>
        <h1>Dados do Desperto</h1>
      </div>
      <div className={styles.mageData}>
        <InputGroup
          label="Gnose"
          id="gnose"
          value={gnose}
          setValue={setGnose}
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
          defaultChecked={regente}
          onChange={onChangeToggle}
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
    </div>
  );
}
