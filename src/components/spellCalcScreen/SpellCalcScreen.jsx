// SpellCalcScreen.js (O componente principal agora)
import React from "react";
import styles from "../../styles/spellcalc.module.css";
import MageDataComponent from "./MageDataComponent";
import SpellDataComponent from "./SpellDataComponent";
import YantraDataComponent from "./YantraDataComponent";
import ExtraOptionsComponent from "./ExtraOptionsComponent";
import ResumoMagia from "./ResumoMagia";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import useSpellCalculator from "../hooks/useSpellCalculator";
import useResumoMagiaCalcs from "../hooks/useResumoMagiaCalcs";

export default function SpellCalcScreen() {
  const { userData } = React.useContext(AppContext);

  const navigate = useNavigate();

  const {
    // Estados
    page,
    setPage,
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
    currentFP,
    setCurrentFP,
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
    isCombinado,
    setIsCombinado,
    yantras,
    setYantras,
    usouFV,
    setUsouFdV,
    ferramentaDedicada,
    setFerramentaDedicada,
    mitigarDadosParadoxoMana,
    setMitigarDadosParadoxoMana,
    mitigarTodoParadoxoMana,
    setMitigarTodoParadoxoMana,
    manaOpcional,
    setManaOpcional,

    custoMana,
    setCustoMana,
    custoVontade,
    setCustoVontade,
    custoElevacoes,
    setCustoElevacoes,

    paradaDeDados,
    setParadaDeDados,
    dadosExtras,
    setDadosExtras,
    totalDadosParadoxo,
    setTotalDadosParadoxo,
    maxManaMitigacao,
    maxManaOpcional,

    // Funções
    toggleRegente,
    toggleUsouFV,
    resetCalculadora,
    calcularElevacoesGratis,
    calcularElevacoesExcedentes,
    calcularElevacoesTotais,
    calcularDadosParadoxo,
    calcularDadosPorFator,
  } = useSpellCalculator(userData);

  const {
    exibirPotencia,
    exibirDuracao,
    exibirEscala,
    exibirElevacoes,
    exibirTempoConjuracao,
    exibirTextoPorTamanho,
    manaDisponivel,
    FVDisponivel,
  } = useResumoMagiaCalcs(
    gnose,
    potencia,
    custoMana,
    custoVontade,
    currentFP,
    calcularElevacoesTotais,
    escala,
    duracao,
    escalaElevada,
    duracaoElevada,
    tempoConjuracao,
    tempoConjuracaoElevada,
    
  );

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
    currentFP,
    setCurrentFP,
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
    yantras,
    setYantras,
    ferramentaDedicada,
  };
  const extraOptionDataProps = {
    isCombinado,
    setIsCombinado,
    extraElevacoes,
    setExtraElevacoes,
    usouFV,
    setUsouFdV,
    ferramentaDedicada,
    setFerramentaDedicada,
    toggleUsouFV,
    mitigarDadosParadoxoMana,
    setMitigarDadosParadoxoMana,
    manaOpcional,
    setManaOpcional,
    mitigarTodoParadoxoMana,
    setMitigarTodoParadoxoMana,
    dadosExtras,
    setDadosExtras,
    calcularDadosParadoxo,
    maxManaMitigacao,
    maxManaOpcional,
  };
  const getWhatsAppText = React.useCallback(() => {
    const pExtra = Math.max(0, potencia - 1);
    const pPenalty = currentFP === "potencia" ? Math.max(0, potencia - nivelArcana) * 2 : pExtra * 2;
    const pFP = currentFP === "potencia" ? " (Fator Primário)" : "";
    const pElevada = potenciaElevada ? " (E)" : "";

    const dExtra = Math.max(0, duracao - 1);
    const dPenalty = currentFP === "duracao" ? Math.max(0, duracao - nivelArcana) * 2 : dExtra * 2;
    const dFP = currentFP === "duracao" ? " (Fator Primário)" : "";
    const dElevada = duracaoElevada ? " (E)" : "";

    let tBonus = 0;
    if (!tempoConjuracaoElevada && currentFP !== "tempoConjuracao") {
      tBonus = Math.min(5, Math.max(0, tempoConjuracao - 1));
    } else if (!tempoConjuracaoElevada && currentFP === "tempoConjuracao") {
      tBonus = Math.max(0, tempoConjuracao - 1);
    }
    const tExtra = Math.max(0, tempoConjuracao - 1);
    const tFP = currentFP === "tempoConjuracao" ? " (Fator Primário)" : "";
    const tElevada = tempoConjuracaoElevada ? " (E)" : "";

    const eExtra = Math.max(0, escala - 1);
    const ePenalty = currentFP === "escala" ? Math.max(0, escala - nivelArcana) * 2 : eExtra * 2;
    const eFP = currentFP === "escala" ? " (Fator Primário)" : "";
    const eElevada = escalaElevada ? " (E)" : "";

    let textoSoma = `Arcano ${nivelArcana} + Gnose ${gnose}`;
    if (yantras > 0) textoSoma += ` + Yantras ${yantras}`;
    if (tBonus > 0) textoSoma += ` + Ritual ${tBonus}`;
    if (usouFV) textoSoma += ` + FDV 3`;
    if (dadosExtras > 0) textoSoma += ` + Dados Extras ${dadosExtras}`;

    const xSoma = nivelArcana + gnose + yantras + tBonus + (usouFV ? 3 : 0) + dadosExtras;
    const yPenalties = pPenalty + dPenalty + ePenalty + (isCombinado ? 2 : 0);

    let elevacoesList = [];
    if (potenciaElevada) elevacoesList.push("Potência");
    if (duracaoElevada) elevacoesList.push("Duração");
    if (tempoConjuracaoElevada) elevacoesList.push("Tempo de Conjuração");
    if (escalaElevada) elevacoesList.push("Escala");
    if (alcance !== 'toque') elevacoesList.push("Alcance");
    if (extraElevacoes > 0) elevacoesList.push(`Elevação Opcionais ${extraElevacoes}`);
    const textoElevacoesUsadas = elevacoesList.length > 0 ? ` (${elevacoesList.join(', ')})` : '';

    return `
Nível da Prática: ${nivelRequerido}
Potência${pFP}${pElevada}: 1 + ${pExtra} (-${pPenalty}d)
Duração${dFP}${dElevada}: 1 + ${dExtra} (-${dPenalty}d) | ${exibirDuracao}
Tempo de conjuração${tFP}${tElevada}: Ritual 1 + ${tExtra} (+${tBonus}d)
Escala${eFP}${eElevada}: ${escala} | afeta Área (${exibirEscala.area}), Alvos e Tamanho (${exibirEscala.tamanhos})
Alcance: ${alcance.charAt(0).toUpperCase() + alcance.slice(1)}
Alvos: 1 + ${eExtra} (-${ePenalty}d)

${textoSoma}

Calculando: ${xSoma} - ${yPenalties} = ${paradaDeDados}

Parada de dados: ${paradaDeDados} dados

Elevações grátis: ${calcularElevacoesGratis()}
Elevações usadas: ${custoElevacoes}${textoElevacoesUsadas}
Dados paradoxo: ${totalDadosParadoxo}
Gasto de mana: ${custoMana}`;
  }, [potencia, currentFP, nivelArcana, potenciaElevada, duracao, duracaoElevada, tempoConjuracaoElevada, tempoConjuracao, escala, escalaElevada, exibirEscala, alcance, yantras, gnose, usouFV, dadosExtras, isCombinado, extraElevacoes, calcularElevacoesGratis, custoElevacoes, paradaDeDados, totalDadosParadoxo, custoMana, exibirDuracao, nivelRequerido]);

  const resumoMagiaProps = {
    exibirPotencia,
    exibirDuracao,
    exibirEscala,
    exibirElevacoes,
    exibirTempoConjuracao,
    exibirTextoPorTamanho,
    manaDisponivel,
    FVDisponivel,
    alcance,

    potenciaElevada,
    escalaElevada,
    duracaoElevada,
    tempoConjuracaoElevada,

    paradaDeDados,
    custoMana,
    custoVontade,
    calcularElevacoesExcedentes,
    custoElevacoes,
    totalDadosParadoxo,
    getWhatsAppText,
  };

  async function goToDice() {
    try {
      await navigator.clipboard.writeText(getWhatsAppText());
    } catch(err) {
      console.error('Falha ao copiar:', err);
    }
    navigate(`/dice?paradaDeDados=${paradaDeDados}`);
  }

  return (
    <>
      <div className={`container`}>
        <div className={styles.scrollableData}>
          <MageDataComponent {...mageDataProps} />
          <YantraDataComponent {...yantraDataProps} />
          <SpellDataComponent {...spellDataProps} />
          <ExtraOptionsComponent {...extraOptionDataProps} />
        </div>
        <div className={styles.notScrollableData}>
          <ResumoMagia {...resumoMagiaProps} />
          <div className={styles.spellCalcFooter}>
            <button className={styles.button} onClick={resetCalculadora}>
              Limpar
            </button>
            <button className={styles.button} onClick={goToDice}>
              Ir para Rolagem
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
