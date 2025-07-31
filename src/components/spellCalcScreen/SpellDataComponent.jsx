import React from "react";
import styles from "../../styles/spellcalc.module.css";
import InputGroup from "../helpers/inputGroup";

export default function SpellDataComponent(props) {
  const {
    nivelArcana,
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
    setCustoVontade,
    currentFP,
    setCurrentFP,
    setCustoElevacoes,
    potenciaElevada,
    setPotenciaElevada,
    duracaoElevada,
    setDuracaoElevada,
    escalaElevada,
    setEscalaElevada,
    alcanceElevado,
    setAlcanceElevado,
    tempoConjuracaoElevada,
    setTempoConjuracaoElevada,
    extraElevacoes,
    setExtraElevacoes,
  } = props;

  const setValue = React.useMemo(
    () => ({
      potencia: setPotencia,
      duracao: setDuracao,
      escala: setEscala,
      alcance: setAlcance,
      tempoConjuracao: setTempoConjuracao,
      custoVontade: setCustoVontade,
      custoElevacoes: setCustoElevacoes,
      potenciaElevada: setPotenciaElevada,
      duracaoElevada: setDuracaoElevada,
      escalaElevada: setEscalaElevada,
      alcanceElevado: setAlcanceElevado,
      tempoConjuracaoElevada: setTempoConjuracaoElevada,
      extraElevacoes: setExtraElevacoes,
    }),
    [
      setPotencia,
      setDuracao,
      setEscala,
      setTempoConjuracao,
      setAlcance,
      setCustoVontade,
      setCustoElevacoes,
      setPotenciaElevada,
      setDuracaoElevada,
      setEscalaElevada,
      setAlcanceElevado,
      setTempoConjuracaoElevada,
      setExtraElevacoes,
    ]
  );

  function calcularTotalElevacoes() {
    const elevacoes = [
      potenciaElevada,
      duracaoElevada,
      escalaElevada,
      alcanceElevado,
      tempoConjuracaoElevada,
      extraElevacoes,
    ];
    // valores true são considerados 1, false são 0
    const total = elevacoes.reduce((acc, curr) => acc + curr, 0);
    setCustoElevacoes(total);
  }

  function toggleRadioBtnAlcance(e) {
    const inputName = e.target.id;
    setAlcance(inputName);
    setAlcanceElevado(false);
    if (inputName !== "toque")     { setAlcanceElevado(true); }

  }

  function toggleFPradioBtn(e) {
    const newFP = e.target.value;
    const oldFP = currentFP;
    if (oldFP && setValue[oldFP]) { resetValueFromFP(oldFP); }
    if (setValue[newFP]) { setValue[newFP](nivelArcana); }
    if (oldFP !== "escala" && newFP === "escala") { setExtraElevacoes((prev) => prev + 1); }
    if (oldFP === "escala" && newFP !== "escala") { setExtraElevacoes((prev) => Math.max(0, prev - 1));}
    setCurrentFP(newFP);
  }

  function toggleElevacaoCheckBox(e) {
    if (e.target.checked) {
      setValue[e.target.id](e.target.checked);
    } else {
      setValue[e.target.id](e.target.checked);
    }
    if(e.target.id === "tempoConjuracaoElevada") setTempoConjuracao(1)
  }

  function resetValueFromFP(state) {
    setValue[state](1);
  }

  React.useEffect(() => {
    if (currentFP && setValue[currentFP]) {
      setValue[currentFP](nivelArcana);
    }
  }, [nivelArcana, currentFP, setValue]);

  React.useEffect(() => {
    calcularTotalElevacoes();
  }, [
    potenciaElevada,
    duracaoElevada,
    escalaElevada,
    alcanceElevado,
    tempoConjuracaoElevada,
    setCustoElevacoes,
    extraElevacoes,
  ]);

  return (
    <div className="page" data-page={page}>
      <div className={styles.spellCalcHeader}>
        <h1>Fatores do Fetiço</h1>
      </div>
      <div className={`${styles.spellData}`}>
        <span className={styles.columnName}>FP?</span>
        <span className={styles.columnName}>Fatores de Magia</span>
        <span
          className={styles.columnName}
          style={{ transform: "translateX(-30%)" }}
        >
          Elevada?
        </span>
        <span className={styles.columnName} style={{ justifySelf: "center" }}>
          Nível
        </span>
        <input
          id="potenciaFP"
          type="radio"
          name="fatorPrimario"
          value="potencia"
          checked={currentFP === "potencia"}
          className={styles.checkboxElevada}
          onChange={toggleFPradioBtn}
        />
        <InputGroup label="Potência"
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
            checked={potenciaElevada}
            onChange={toggleElevacaoCheckBox}
            className={styles.checkboxElevada}
          />
        </InputGroup>
        <input id="duracaoFP"
          type="radio"
          name="fatorPrimario"
          value="duracao"
          checked={currentFP === "duracao"}
          className={styles.checkboxElevada}
          onChange={toggleFPradioBtn}
        ></input>
        <InputGroup label="Duração"
          id="duracao"
          value={duracao}
          setValue={setDuracao}
          max={duracaoElevada ? 6 : 100}
        >
          <input
            type="checkbox"
            id="duracaoElevada"
            name="duracaoElevada"
            value="duracaoElevada"
            checked={duracaoElevada}
            className={styles.checkboxElevada}
            onChange={toggleElevacaoCheckBox}
          />
        </InputGroup>

        <input id="tempoConjuracaoFP"
          type="radio"
          name="fatorPrimario"
          value="tempoConjuracao"
          className={styles.checkboxElevada}
          onChange={toggleFPradioBtn}
        ></input>
        <InputGroup label="Tempo de Conjuração"
          id="tempoConjuracao"
          value={tempoConjuracao}
          setValue={setTempoConjuracao}
          max={tempoConjuracaoElevada ? 1 : 100}
        >
          <input
            type="checkbox"
            id="tempoConjuracaoElevada"
            name="tempoConjuracaoElevada"
            value="tempoConjuracaoElevada"
            checked={tempoConjuracaoElevada}
            onChange={toggleElevacaoCheckBox}
            className={styles.checkboxElevada}
          />
        </InputGroup>
        <input id="escalaFP"
          type="radio"
          name="fatorPrimario"
          value="escala"
          checked={currentFP === "escala"}
          className={styles.checkboxElevada}
          onChange={toggleFPradioBtn}
        ></input>
        <InputGroup label="Escala"
          id="escala"
          value={escala}
          setValue={setEscala}
          max={escalaElevada ? 100 : 5}
        >
          <input
            type="checkbox"
            id="escalaElevada"
            name="escalaElevada"
            value="escalaElevada"
            checked={escalaElevada}
            className={styles.checkboxElevada}
            onChange={toggleElevacaoCheckBox}
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
              checked={alcance === "toque"}
              onChange={toggleRadioBtnAlcance}
            />
            <label htmlFor="toque">Toque</label>
          </div>

          <div>
            <input
              type="radio"
              id="sensorial"
              name="alcance"
              value="sensorial"
              checked={alcance === "sensorial"}
              onChange={toggleRadioBtnAlcance}
            />
            <label htmlFor="sensorial">Sensorial</label>
          </div>

          <div>
            <input
              type="radio"
              id="simpatico"
              name="alcance"
              value="simpatico"
              checked={alcance === "simpatico"}
              onChange={toggleRadioBtnAlcance}
            />
            <label htmlFor="simpatico">Simpático</label>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
