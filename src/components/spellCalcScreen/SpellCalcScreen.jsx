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
  const [tempoConjuracaoElevada, setTempoConjuracaoElevada] = React.useState(false);
  const [extraElevacoes, setExtraElevacoes] = React.useState(0);

  const [custoMana, setCustoMana] = React.useState(0);
  const [custoVontade, setCustoVontade] = React.useState(0);
  const [custoElevacoes, setCustoElevacoes] = React.useState(0);

  const mageDataProps = {
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
    onChangeToggle,
  };
  const spellDataProps = {
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
    setPage,
    custoMana,
    setCustoMana,
    custoVontade,
    setCustoVontade,
    custoElevacoes,
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
  };
  const yantraDataProps = {
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
    custoMana,
    setCustoMana,
    custoVontade,
    setCustoVontade,
    custoElevacoes,
    setCustoElevacoes,
    yantras,
    setYantras,
  };
  const resumoMagiaProps = {
    duracao,
    escala,
    escalaElevada,
    duracaoElevada,
    gnose,
    nivelArcana,
    yantras,
    custoMana,
    custoVontade,
    custoElevacoes,
    calcularElevacoesGratis,
    calcularElevacoesExcedentes,
    calcularDadosParadoxo,
    exibirElevacoes,
    calcularDadosPorFator
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
    return calcularElevacoesGratis() - custoElevacoes;
  }

  function calcularDadosParadoxo() {
    const dadosPorGnose = Math.ceil(gnose / 2);
    const elevacoesExcedentes = calcularElevacoesExcedentes();
    const dadosDeParadoxo = elevacoesExcedentes * dadosPorGnose;
    return dadosDeParadoxo;
  }

  function calcularDadosPorFator() {
    let penalidadePotencia = potencia === 1 ? 0 : (potencia - 1) * 2;
    let penalidadeDuracao = duracao === 1 ? 0 : (duracao - 1) * 2;
    let penalidadeEscala = escala === 1 ? 0 : (escala - 1) * 2;

    switch (currentFP) {
      case "potencia":
        penalidadePotencia = (potencia - nivelArcana) * 2;
        break;
      case "duracao":
        penalidadeDuracao = (duracao - nivelArcana) * 2;
        break;
      case "escala":
        penalidadeEscala = (escala - nivelArcana) * 2;
        break;
    }
    const dadoPenalidadeTotal =
      Math.max(0, penalidadePotencia) +
      Math.max(0, penalidadeDuracao) +
      Math.max(0, penalidadeEscala);
    return dadoPenalidadeTotal;
  }

  React.useEffect(() => {
    if (nivelRequerido > nivelArcana) {
      alert("Nível da Prática não pode ser maior que o seu Nível na Arcana");
      setNivelRequerido(nivelArcana);
    }
  }, [nivelRequerido]);

  return (
    <div className={`container `}>
      <MageDataComponent {...mageDataProps} />
      <YantraDataComponent {...yantraDataProps} />
      <SpellDataComponent {...spellDataProps} />
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
