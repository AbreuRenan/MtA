import React from "react";
import styles from "../../styles/spellcalc.module.css";
import MageDataComponent from "./MageDataComponent";
import SpellDataComponent from "./SpellDataComponent";
import YantraDataComponent from "./YantraDataComponent";
import ExtraOptionsComponent from "./ExtraOptionsComponent";
import ResumoMagia from "./ResumoMagia";

export default function SpellCalcScreen() {
  const [page, setPage] = React.useState(1);
  const [gnose, setGnose] = React.useState(1);
  const [nivelArcana, setNivelArcana] = React.useState(1);
  const [nivelRequerido, setNivelRequerido] = React.useState(1);
  const [magiasAtivas, setMagiasAtivas] = React.useState(0);
  const [spellType, setSpellType] = React.useState("improvisado");
  const [regente, setRegente] = React.useState(true);

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
  const [isCombinado, setIsCombinado] = React.useState(0);
  const [yantras, setYantras] = React.useState(0);
  const [usouFdV, setUsouFdv] = React.useState(false);
  const [mitigarDadosParadoxoMana, setMitigarDadosParadoxoMana] =
    React.useState(0);
  const [mitigarTodoParadoxoMana, setMitigarTodoParadoxoMana] =
    React.useState(false);
  const [manaOpcional, setManaOpcional] = React.useState(0);

  const [custoMana, setCustoMana] = React.useState(0);
  const [custoVontade, setCustoVontade] = React.useState(0);
  const [custoElevacoes, setCustoElevacoes] = React.useState(0);

  const [paradaDeDados, setParadaDeDados] = React.useState(0);
  const [totalDadosParadoxo, setTotalDadosParadoxo] = React.useState(0);

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
    toggleRegente,
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
  const extraOptionDataProps = {
    isCombinado,
    setIsCombinado,
    custoMana,
    setCustoMana,
    custoVontade,
    setCustoVontade,
    extraElevacoes,
    setExtraElevacoes,
    usouFdV,
    setUsouFdv,
    toggleUsouFdV,
    mitigarDadosParadoxoMana,
    setMitigarDadosParadoxoMana,
    manaOpcional,
    setManaOpcional,
    mitigarTodoParadoxoMana,
    setMitigarTodoParadoxoMana,
  };
  const resumoMagiaProps = {
    potencia,
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
    calcularElevacoesTotais,
    calcularDadosPorFator,
    paradaDeDados,
    setParadaDeDados,
    totalDadosParadoxo,
  };
  function toggleRegente(e) {
    setRegente(e.target.checked);
  }
  function toggleUsouFdV(e) {
    setUsouFdv(e);
  }
  
  function calcularElevacoesGratis() {
    const elevacoesGratis = nivelArcana - nivelRequerido + 1;
    return elevacoesGratis;
  }
  function calcularElevacoesExcedentes() {
    const elevacoesGratis = calcularElevacoesGratis();
    return Math.max(0, custoElevacoes - elevacoesGratis);
  }
  function calcularElevacoesTotais() {
    return calcularElevacoesGratis() - custoElevacoes;
  }

  function calcularGastoMana() {
    let totalMana = 0;
    if (alcance === "simpatico") {
      totalMana += 1;
    }
    if (!regente) {
      totalMana += 1;
    }
    totalMana += manaOpcional;

    const dadosParadoxoGerados = calcularDadosParadoxo();
    let manaParaParadoxo = 0;
    if (mitigarTodoParadoxoMana) {
      manaParaParadoxo = dadosParadoxoGerados;
    } else {
      manaParaParadoxo = Math.max(0, mitigarDadosParadoxoMana);
    }

    totalMana += manaParaParadoxo;
    return totalMana;
  }

  function calcularDadosParadoxo() {
    const dadosPorGnose = Math.ceil(gnose / 2);
    const elevacoesExcedentes = calcularElevacoesExcedentes();
    let dadosDeParadoxo = elevacoesExcedentes * dadosPorGnose;
    return Math.max(0, dadosDeParadoxo);
  }
  function calcularTotalDadosParadoxo() {
    let dadosParadoxo = calcularDadosParadoxo();
    let dadosMitigacao = mitigarDadosParadoxoMana;
    return dadosParadoxo - dadosMitigacao;
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
  function calcularParadaDeDados() {
    const dadosIniciais = gnose + nivelArcana + yantras;
    const penalidadePorFator = calcularDadosPorFator();
    const combinado = isCombinado * 2;
    let totalDados = dadosIniciais - penalidadePorFator - combinado;
    if (usouFdV) totalDados += 3;
    setParadaDeDados(totalDados);
    return totalDados;
  }

  React.useEffect(() => {
    if (nivelRequerido > nivelArcana) {
      alert("Nível da Prática não pode ser maior que o seu Nível na Arcana");
      setNivelRequerido(nivelArcana);
    }
  }, [nivelRequerido]);

  // effect Calcular Parada de Dados
  React.useEffect(() => {
    calcularParadaDeDados();
  }, [
    gnose,
    nivelArcana,
    yantras,
    isCombinado,
    potencia,
    duracao,
    escala,
    tempoConjuracao,
    usouFdV,
    mitigarDadosParadoxoMana,
    paradaDeDados,
    totalDadosParadoxo,
  ]);

  // effect para controle do gasto de FdV
  React.useEffect(() => {
    setCustoVontade((prev) => (usouFdV ? 1 : 0));
  }, [usouFdV, setCustoVontade]);

  // effect Calcular custo de mana
  React.useEffect(() => {
    const manaValue = calcularGastoMana();
    setCustoMana(Math.max(0, manaValue));
  }, [setCustoMana, calcularGastoMana]);

    React.useEffect(() => { 
      if(mitigarTodoParadoxoMana) {
        const paradoxoDados = calcularDadosParadoxo()
        setMitigarDadosParadoxoMana(paradoxoDados)
      }

    }, [mitigarTodoParadoxoMana]);

  React.useEffect(() => {
    const totalDadosParadoxoValue = calcularTotalDadosParadoxo();
    setTotalDadosParadoxo(totalDadosParadoxoValue);
  }, [mitigarDadosParadoxoMana, calcularDadosParadoxo, mitigarTodoParadoxoMana ]);

  return (
    <div className={`container`}>
      <MageDataComponent {...mageDataProps} />
      <YantraDataComponent {...yantraDataProps} />
      <SpellDataComponent {...spellDataProps} />
      <ExtraOptionsComponent {...extraOptionDataProps} />
      <div className={styles.spellCalcFooter}>
        <ResumoMagia {...resumoMagiaProps} />

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
            setAlcance("toque");
            setCurrentFP("potencia");
            setTempoConjuracao(1);
            setCustoMana(0);
            setCustoVontade(0);
            setCustoElevacoes(0);
            setMitigarDadosParadoxoMana(0);
            setYantras(0);
            setIsCombinado(0);
            setExtraElevacoes(0);
            setParadaDeDados(0);
            setUsouFdv(false);
            setPotenciaElevada(false);
            setDuracaoElevada(false);
            setEscalaElevada(false);
            setAlcanceElevado(false);
            setTempoConjuracaoElevada(false);
          }}
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
