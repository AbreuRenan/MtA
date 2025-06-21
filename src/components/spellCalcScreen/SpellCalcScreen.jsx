import React from "react";
import styles from "../../styles/spellcalc.module.css";
import MageDataComponent from "./MageDataComponent";
import SpellDataComponent from "./SpellDataComponent";

export default function SpellCalcScreen() {
  const [gnose, setGnose] = React.useState(1);
  const [nivelArcana, setNivelArcana] = React.useState(1);
  const [nivelRequerido, setNivelRequerido] = React.useState(1);
  const [magiasAtivas, setMagiasAtivas] = React.useState(0);
  const [spellType, setSpellType] = React.useState("improvisado");
  const [regente, setRegente] = React.useState(true);
  const [page, setPage] = React.useState(1);

  const [potencia, setPotencia] = React.useState(1);
  const [duracao, setDuracao] = React.useState(1);
  const [escala, setEscala] = React.useState(1);
  const [alcance, setAlcance] = React.useState(1);
  const [tempoConjuracao, setTempoConjuracao] = React.useState(1);

  const [custoMana, setCustoMana] = React.useState(0);
  const [custoVontade, setCustoVontade] = React.useState(0);
  const [custoElevacoes, setCustoElevacoes] = React.useState(0);

 
  function onChangeToggle(e) {
    const inputValue = e.target.checked
    if (!inputValue) {
      setCustoMana((prev) => prev + 1);
    } else {
      setCustoMana((prev) => (prev > 0 ? prev - 1 : 0));
    }

    setRegente((prev) => !prev);
  }
  
  React.useEffect(() => {
    if (nivelRequerido > nivelArcana) {
      alert("Nível Requerido não pode ser maior que o Nível Arcana");
      setNivelRequerido(nivelArcana);
    }

  },[nivelRequerido]);



  React.useEffect(() => {
    console.log("Regente:", regente);
    console.log("Custo Mana:", custoMana);
  }, [regente, custoMana]);

  return (
    <div className={`container `}>
      {page === 1 && (
        <MageDataComponent
          gnose={gnose}
          setGnose={setGnose}
          nivelArcana={nivelArcana}
          setNivelArcana={setNivelArcana}
          nivelRequerido={nivelRequerido}
          setNivelRequerido={setNivelRequerido}
          magiasAtivas={magiasAtivas}
          setMagiasAtivas={setMagiasAtivas}
          spellType={spellType}
          setSpellType={setSpellType}
          regente={regente}
          setRegente={setRegente}
          page={page}
          setPage={setPage}
          custoMana={custoMana}
          setCustoMana={setCustoMana}
          custoVontade={custoVontade}
          setCustoVontade={setCustoVontade}
          custoElevacoes={custoElevacoes}
          setCustoElevacoes={setCustoElevacoes}
          onChangeToggle={onChangeToggle}
        />
      )}

      {page === 2 && (
        <SpellDataComponent
          nivelArcana={nivelArcana}
          potencia={potencia}
          setPotencia={setPotencia}
          duracao={duracao}
          setDuracao={setDuracao}
          escala={escala}
          setEscala={setEscala}
          alcance={alcance}
          setAlcance={setAlcance}
          tempoConjuracao={tempoConjuracao}
          setTempoConjuracao={setTempoConjuracao}
          page={page}
          setPage={setPage}
          custoMana={custoMana}
          setCustoMana={setCustoMana}
          custoVontade={custoVontade}
          setCustoVontade={setCustoVontade}
          custoElevacoes={custoElevacoes}
          setCustoElevacoes={setCustoElevacoes}
        />
      )}

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
            setGnose(1);
            setNivelArcana(1);
            setNivelRequerido(1);
            setMagiasAtivas(0);
            setSpellType("improvisado");
            setRegente(true);
            setPage(1);
            setPotencia(1);
            setDuracao(1);
            setEscala(1);
            setAlcance(1);
            setTempoConjuracao(1);
            setCustoMana(0);
            setCustoVontade(0);
            setCustoElevacoes(0);
          }}
        >
          Limpar
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
