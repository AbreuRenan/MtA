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
import SalvarMagiaModal from "./SalvarMagiaModal";

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

    // Funções
    toggleRegente,
    toggleUsouFV,
    resetCalculadora,
    calcularElevacoesGratis,
    calcularElevacoesExcedentes,
    calcularElevacoesTotais,
    calcularDadosParadoxo,
    calcularDadosPorFator,

    saveSpellData,
    loadSpellData,
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
    tempoConjuracaoElevada
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
    usouFV,
    setUsouFdV,
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
  };
  const resumoMagiaProps = {
    exibirPotencia,
    exibirDuracao,
    exibirEscala,
    exibirElevacoes,
    exibirTempoConjuracao,
    exibirTextoPorTamanho,
    manaDisponivel,
    FVDisponivel,

    paradaDeDados,
    custoMana,
    custoVontade,
    calcularElevacoesExcedentes,
    totalDadosParadoxo,
  };

  function goToDice() {
    navigate(`/dice?paradaDeDados=${paradaDeDados}`);
  }
    const handleOpenSaveModal = () => {
      return true
    };


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
          {/* <button className={styles.button} onClick={goToDice}>Ir para Rolagem</button> */}
          <button className={styles.button} onClick={handleOpenSaveModal}>
            Salvar!
          </button>
          <button className={styles.button} onClick={loadSpellData}>
            Carregar
          </button>
        </div>
      </div>

    </div>
        <SalvarMagiaModal
          isOpen={handleOpenSaveModal}
          // onClose={handleCloseSaveModal}
          // onSave={handleSaveSpellWithModal}
      />
      </>
  );
}
