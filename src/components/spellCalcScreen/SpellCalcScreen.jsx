import React from "react";
import styles from "../../styles/spellcalc.module.css";
import MageDataComponent from "./MageDataComponent";
import SpellDataComponent from "./SpellDataComponent";
import YantraDataComponent from "./YantraDataComponent";
import ResumoMagia from "./ResumoMagia";

export default function SpellCalcScreen() {
  const [gnose, setGnose] = React.useState(1);
  const [nivelArcana, setNivelArcana] = React.useState(1);
  const [nivelRequerido, setNivelRequerido] = React.useState(1);
  const [magiasAtivas, setMagiasAtivas] = React.useState(0);
  const [spellType, setSpellType] = React.useState("improvisado");
  const [regente, setRegente] = React.useState(true);
  const [yantras, setYantras] = React.useState(0);
  const [page, setPage] = React.useState(1);

  const [potencia, setPotencia] = React.useState(1);
  const [duracao, setDuracao] = React.useState(1);
  const [escala, setEscala] = React.useState(1);
  const [alcance, setAlcance] = React.useState("toque");
  const [tempoConjuracao, setTempoConjuracao] = React.useState(1);
  const [currentFP, setCurrentFP] = React.useState("potencia");
  const [potenciaElevada, setPotenciaElevada] = React.useState(false);
  const [duracaoElevada, setDuracaoElevada] = React.useState(false);
  const [escalaElevada, setEscalaElevada] = React.useState(false);
  const [alcanceElevado, setAlcanceElevado] = React.useState(false);
  const [tempoConjuracaoElevada, setTempoConjuracaoElevada] =
    React.useState(false);
  const [extraElevacoes, setExtraElevacoes] = React.useState(0);

  const [custoMana, setCustoMana] = React.useState(0);
  const [custoVontade, setCustoVontade] = React.useState(0);
  const [custoElevacoes, setCustoElevacoes] = React.useState(0);

  const [paradaDados, setParadaDados] = React.useState(0);

  const resumoMagiaProps = {
    duracao,
    escala,
    escalaElevada,
    duracaoElevada,
    yantras,
    custoMana,
    custoVontade,
    custoElevacoes,
    calcularElevacoesGratis,
    calcularElevacoesExcedentes,
    calcularDadosParadoxo,
    exibirElevacoes
  };

  function onChangeToggle(e) {
    const inputValue = e.target.checked;
    if (!inputValue) {
      setCustoMana((prev) => prev + 1);
    } else {
      setCustoMana((prev) => (prev > 0 ? prev - 1 : 0));
    }
    setRegente((prev) => !prev);
  }

  function calcularElevacoesGratis() {
    const elevacoesGratis = nivelArcana - nivelRequerido + 1;
    return elevacoesGratis;
  }

  function calcularElevacoesExcedentes() {
    const elevacoesGratis = calcularElevacoesGratis();
    return Math.max(0, custoElevacoes - elevacoesGratis);
  }
  function exibirElevacoes() {
    return calcularElevacoesGratis() - custoElevacoes
  }

  function calcularDadosParadoxo() {
    const dadosPorGnose = Math.ceil(gnose / 2);
    const elevacoesExcedentes = calcularElevacoesExcedentes();
    const dadosDeParadoxo = elevacoesExcedentes * dadosPorGnose;
    return dadosDeParadoxo;
  }

function calcularDadosPorFator() {
  let penalidadePotencia = potencia === 1 ? 0 : (potencia - 1)* 2;
  let penalidadeDuracao = duracao === 1 ? 0 : (duracao - 1) * 2;
  let penalidadeEscala = escala === 1 ? 0 : (escala - 1) * 2;

  switch (currentFP) {
    case "potencia": penalidadePotencia = (potencia - nivelArcana) * 2; break;
    case "duracao": penalidadeDuracao = (duracao - nivelArcana) * 2; break;
    case "escala": penalidadeEscala = (escala - nivelArcana) * 2; break;
  }
  const dadoPenalidadeTotal = Math.max(0,penalidadePotencia) + Math.max(0,penalidadeDuracao) + Math.max(0,penalidadeEscala);
  return dadoPenalidadeTotal;
}

  React.useEffect(() => {
    if (nivelRequerido > nivelArcana) {
      alert("Nível da Prática não pode ser maior que o seu Nível na Arcana");
      setNivelRequerido(nivelArcana);
    }
  }, [nivelRequerido]);

  React.useEffect(() => {
    console.log(
      "parada de dados:",
      calcularDadosPorFator(potencia, nivelArcana)
    );
  }, [potencia, duracao, escala, nivelArcana]);

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
          currentFP={currentFP}
          setCurrentFP={setCurrentFP}
          custoElevacoes={custoElevacoes}
          setCustoElevacoes={setCustoElevacoes}
          potenciaElevada={potenciaElevada}
          setPotenciaElevada={setPotenciaElevada}
          duracaoElevada={duracaoElevada}
          setDuracaoElevada={setDuracaoElevada}
          escalaElevada={escalaElevada}
          setEscalaElevada={setEscalaElevada}
          alcanceElevado={alcanceElevado}
          setAlcanceElevado={setAlcanceElevado}
          tempoConjuracaoElevada={tempoConjuracaoElevada}
          setTempoConjuracaoElevada={setTempoConjuracaoElevada}
          extraElevacoes={extraElevacoes}
          setExtraElevacoes={setExtraElevacoes}
        />
      )}

      {page === 3 && (
        <YantraDataComponent
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
          yantras={yantras}
          setYantras={setYantras}
        />
      )}
      <div className={styles.spellCalcFooter}>
        <ResumoMagia {...resumoMagiaProps} />

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
            setYantras(0);
            setPotenciaElevada(false);
            setDuracaoElevada(false);
            setEscalaElevada(false);
            setAlcanceElevado(false);
            setTempoConjuracaoElevada(false);
            setCurrentFP("potencia");
            setExtraElevacoes(0);
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
