import React from "react";
import styles from "../../styles/spellcalc.module.css";
import InputGroup from "./inputGroup";
import InputCheckBox from "./inputCheckBox";

export default function SpellDataComponent(props) {
  const {
    potencia,
    setPotencia,
    duracao,
    setDuracao,
    escala,
    setEscala,
    alcance,
    setAlcance,
    tempoConjuracao,
    setTempoConjuracao,
    page,
    setPage,
    custoMana,
    setCustoMana,
    custoVontade,
    setCustoVontade,
    custoElevacoes,
    setCustoElevacoes,
  } = props;

  function toggleRadioBtn(e) {
    const inputValue = e.target.value;
    setAlcance(inputValue);
  }

  function toggleElevacaoCheckBox(e) {
    if (e.target.checked) {
      setCustoElevacoes((prev) => prev + 1);
    } else {
      setCustoElevacoes((prev) => (prev > 0 ? prev - 1 : 0));
    }
  }

  React.useEffect(() => {
    console.log("Elevations Cost:", custoElevacoes);
  }, [custoElevacoes]);

  return (
    <div className="page" data-page={page}>
      <div className={styles.spellCalcHeader}>
        <h1>Fatores do Fetiço</h1>
      </div>
      <div className={`${styles.spellData}`}>
        <InputGroup
          label="Potência"
          id="potencia"
          value={potencia}
          setValue={setPotencia}
        >
          <label htmlFor="potenciaElevada" className={styles.labelElevada}>
            Elevada?
            <input
              type="checkbox"
              id="potenciaElevada"
              name="potenciaElevada"
              value="potenciaElevada"
              onChange={toggleElevacaoCheckBox}
              className={styles.checkboxElevada}
            />
          </label>
        </InputGroup>

        <InputGroup
          label="Duração"
          id="duracao"
          value={duracao}
          setValue={setDuracao}
        >
          <label htmlFor="potenciaElevada" className={styles.labelElevada}>
            Elevada?
            <input
              type="checkbox"
              id="potenciaElevada"
              name="potenciaElevada"
              value="potenciaElevada"
              onChange={toggleElevacaoCheckBox}
              className={styles.checkboxElevada}
            />
          </label>
        </InputGroup>

        <InputGroup
          label="Escala"
          id="escala"
          value={escala}
          setValue={setEscala}
        >
          <label htmlFor="potenciaElevada" className={styles.labelElevada}>
            Elevada?
            <input
              type="checkbox"
              id="potenciaElevada"
              name="potenciaElevada"
              value="potenciaElevada"
              onChange={toggleElevacaoCheckBox}
              className={styles.checkboxElevada}
            />
          </label>
        </InputGroup>
        <InputGroup
          label="Tempo de Conjuração"
          id="tempoConjuracao"
          value={tempoConjuracao}
          setValue={setTempoConjuracao}
        >
          <label htmlFor="potenciaElevada" className={styles.labelElevada}>
            Elevada?
            <input
              type="checkbox"
              id="potenciaElevada"
              name="potenciaElevada"
              value="potenciaElevada"
              onChange={toggleElevacaoCheckBox}
              className={styles.checkboxElevada}
            />
          </label>
        </InputGroup>

        <fieldset className={`${styles.inputGroupSpellType} ${styles.options}`}>
          <legend>Alcance</legend>
          <div>
            <input
              type="radio"
              id="toque"
              name="alcance"
              value="toque"
              defaultChecked
              onChange={toggleRadioBtn}
            />
            <label htmlFor="toque">Toque</label>
          </div>

          <div>
            <input
              type="radio"
              id="sensorial"
              name="alcance"
              value="sensorial"
              onChange={toggleRadioBtn}
            />
            <label htmlFor="sensorial">Sensorial</label>
          </div>

          <div>
            <input
              type="radio"
              id="simpatico"
              name="alcance"
              value="simpatico"
              onChange={toggleRadioBtn}
            />
            <label htmlFor="simpatico">Simpático</label>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
