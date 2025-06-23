import React from "react";
import styles from "../../styles/spellcalc.module.css";
import InputGroup from "./inputGroup";
import InputCheckBox from "./inputCheckBox";

export default function SpellDataComponent(props) {
  const [currentFP, setCurrentFP] = React.useState("potencia");

  const {nivelArcana,potencia,setPotencia,duracao,setDuracao,escala,setEscala,
    alcance,setAlcance,tempoConjuracao,setTempoConjuracao,page,setPage,custoMana,
    setCustoMana,custoVontade,setCustoVontade,custoElevacoes,setCustoElevacoes,} = props;

  const setValue = {
    potencia: setPotencia,
    duracao: setDuracao,
    escala: setEscala,
    alcance: setAlcance,
    tempoConjuracao: setTempoConjuracao,
    custoMana: setCustoMana,
    custoVontade: setCustoVontade,
    custoElevacoes: setCustoElevacoes,
  };

  function toggleRadioBtn(e) {
    const inputValue = e.target.value;
    setAlcance(inputValue);
  }
  function toggleFPradioBtn(e) {
    const newFP = e.target.value;
    const oldFP = currentFP;

    if (oldFP && setValue[oldFP]) {
      resetValue(oldFP);
    }

    if (setValue[newFP]) {
      setValue[newFP](nivelArcana);
    }

    setCurrentFP(newFP);
  }

  function toggleElevacaoCheckBox(e) {
    if (e.target.checked) {
      setCustoElevacoes((prev) => prev + 1);
    } else {
      setCustoElevacoes((prev) => (prev > 0 ? prev - 1 : 0));
    }
  }

  function resetValue(state) {
    setValue[state](1);
  }

  React.useEffect(() => {
    console.log("Elevations Cost:", custoElevacoes);
  }, [custoElevacoes]);

  React.useEffect(() => {
        if (currentFP && setValue[currentFP]) {
        setValue[currentFP](nivelArcana);
    }
  }, [nivelArcana, currentFP, setValue]);

  return (
    <div className="page" data-page={page}>
      <div className={styles.spellCalcHeader}>
        <h1>Fatores do Fetiço</h1>
      </div>
      <div className={`${styles.spellData}`}>
        <span className={styles.columnName}>FP?</span>
        <span className={styles.columnName}>Fatores de Magia</span>
        <span className={styles.columnName}>Elevada?</span>
        <span className={styles.columnName}>Nível</span>
        <input
          type="radio"
          name="fatorPrimario"
          value="potencia"
          id="potenciaFR"
          defaultChecked
          className={styles.checkboxElevada}
          onChange={toggleFPradioBtn}
        />
        <InputGroup
          label="Potência"
          id="potencia"
          value={potencia}
          setValue={setPotencia}
          max={100}
        >
          <input
            type="checkbox"
            id="potenciaElevada"
            name="potenciaElevada"
            value="potenciaElevada"
            onChange={toggleElevacaoCheckBox}
            className={styles.checkboxElevada}
          />
        </InputGroup>
        <input
          type="radio"
          name="fatorPrimario"
          value="duracao"
          id="duracaoFR"
          className={styles.checkboxElevada}
          onChange={toggleFPradioBtn}
        />
        <InputGroup
          label="Duração"
          id="duracao"
          value={duracao}
          setValue={setDuracao}
          max={100}
        >
          <input
            type="checkbox"
            id="potenciaElevada"
            name="potenciaElevada"
            value="potenciaElevada"
            className={styles.checkboxElevada}
            onChange={toggleElevacaoCheckBox}
          />
        </InputGroup>
        <input
          type="radio"
          name="fatorPrimario"
          value="escala"
          id="escalaFR"
          className={styles.checkboxElevada}
          onChange={toggleFPradioBtn}
        />
        <InputGroup
          label="Escala"
          id="escala"
          value={escala}
          setValue={setEscala}
          max={100}
        >
          <input
            type="checkbox"
            id="potenciaElevada"
            name="potenciaElevada"
            value="potenciaElevada"
            className={styles.checkboxElevada}
            onChange={toggleElevacaoCheckBox}
          />
        </InputGroup>
        <input
          type="radio"
          name="fatorPrimario"
          value="tempoConjuracao"
          id="tempoConjuracaoFR"
          disabled
          className={styles.checkboxElevada}
          onChange={toggleFPradioBtn}
        />
        <InputGroup
          label="Tempo de Conjuração"
          id="tempoConjuracao"
          value={tempoConjuracao}
          setValue={setTempoConjuracao}
          max={100}
        >
          <input
            type="checkbox"
            id="potenciaElevada"
            name="potenciaElevada"
            value="potenciaElevada"
            onChange={toggleElevacaoCheckBox}
            className={styles.checkboxElevada}
            max={100}
          />
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
