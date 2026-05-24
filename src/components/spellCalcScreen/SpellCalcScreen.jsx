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
import { useAppSpellContext } from "../../AppSpellContext";
import useResumoMagiaCalcs from "../hooks/useResumoMagiaCalcs";
import { ref, update } from "firebase/database";
import { pushLog } from "../../js/logUtils";
import SalvarMagiaModal from "./SalvarMagiaModal";

export default function SpellCalcScreen() {
  const { userData, database } = React.useContext(AppContext);
  const navigate = useNavigate();

  const [modalSalvarAberto, setModalSalvarAberto] = React.useState(false);

  // Obter contexto da magia com proteção de loading
  const spellContextData = useAppSpellContext();
  const { isLoading } = spellContextData;

  const handleSalvarMagia = async (spellName) => {
    if (spellContextData.checkSpellExists(spellName)) {
      const confirmOverwrite = window.confirm(
        `Já existe uma magia salva com o nome "${spellName}". Deseja substituí-la?`
      );
      if (!confirmOverwrite) return;
    }
    
    const success = await spellContextData.saveSpellData(spellName);
    if (success) {
      setModalSalvarAberto(false);
    }
  };

  const {
    // Estados
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
    dadosParadoxoExtra,
    setDadosParadoxoExtra,
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
    checkSpellExists,
    saveSpellData,
    efeitosYantra,
  } = spellContextData;

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
    efeitosYantra
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
    currentFP,
    yantras,
    setYantras,
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
    yantras,
    setYantras,
  };
  const extraOptionDataProps = {
    isCombinado,
    setIsCombinado,
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
    dadosParadoxoExtra,
    setDadosParadoxoExtra,
    maxManaMitigacao,
    maxManaOpcional,
    userData,
  };
  const getWhatsAppText = React.useCallback(() => {
    const e_potenciaElevada = potenciaElevada || efeitosYantra.potenciaElevada;
    const e_duracaoElevada = duracaoElevada || efeitosYantra.duracaoElevada;
    const e_tempoConjuracaoElevada = tempoConjuracaoElevada || efeitosYantra.tempoConjuracaoElevada;
    // Effective tempoConjuracao considers yantra.tempoExceder (increases cap beyond 6)
    const tMaxNivel = currentFP === "tempoConjuracao" ? 100 : (6 + (efeitosYantra.tempoExceder || 0));
    const e_tempoConjuracao = Math.min(tempoConjuracao, tMaxNivel);
    const e_escalaElevada = escalaElevada || efeitosYantra.escalaElevada;
    
    let e_alcance = alcance;
    if (efeitosYantra.alcanceSimpatico) e_alcance = 'simpatico';
    else if (efeitosYantra.alcanceSensorial) e_alcance = 'sensorial';
    else if (efeitosYantra.alcanceToque) e_alcance = 'toque';

    const e_potencia = potencia + (efeitosYantra.fatorPotencia || 0);
    const e_duracao = duracao + (efeitosYantra.fatorDuracao || 0);
    const e_escala = escala + (efeitosYantra.fatorEscala || 0);
    const e_gnose = Math.max(1, gnose + (efeitosYantra.gnose || 0));
    const e_nivelArcana = Math.max(1, nivelArcana + (efeitosYantra.nivelArcana || 0));
    const yantraBonus = efeitosYantra.dadosBonus || 0;

    const getYantraBonusValue = (yantra) => {
      if (!yantra) return 0;
      if (typeof yantra.dadosBonus !== 'undefined') {
        return Number(yantra.dadosBonus) || 0;
      }
      if (Array.isArray(yantra.efeitosDinamicos)) {
        const dadosBonusEffect = yantra.efeitosDinamicos.find(ef => ef.campo === 'dadosBonus');
        return Number(dadosBonusEffect?.valor) || 0;
      }
      return 0;
    };

    const textoYantras = Array.isArray(yantras) && yantras.length > 0
      ? yantras.filter(Boolean).map(y => (typeof y === 'string' ? y : (y.nome || y.name || 'Yantra'))).join(', ')
      : '';

    const textoYantraBonus = Array.isArray(yantras)
      ? yantras
          .filter(y => y && typeof y === 'object' && getYantraBonusValue(y) > 0)
          .map(y => `${y.nome || y.name || 'Yantra'} +${getYantraBonusValue(y)}`)
          .join(' + ')
      : '';

    const pExtra = Math.max(0, e_potencia - 1);
    const pPenalty = currentFP === "potencia" ? Math.max(0, e_potencia - e_nivelArcana) * 2 : pExtra * 2;
    const pFP = currentFP === "potencia" ? " (Fator Primário)" : "";
    const pElevada = e_potenciaElevada ? " (E)" : "";

    const dExtra = Math.max(0, e_duracao - 1);
    const dPenalty = currentFP === "duracao" ? Math.max(0, e_duracao - e_nivelArcana) * 2 : dExtra * 2;
    const dFP = currentFP === "duracao" ? " (Fator Primário)" : "";
    const dElevada = e_duracaoElevada ? " (E)" : "";

    let tBonus = 0;
    if (!e_tempoConjuracaoElevada) {
      tBonus = Math.max(0, e_tempoConjuracao - 1);
    }
    const tExtra = Math.max(0, e_tempoConjuracao - 1);
    const tFP = currentFP === "tempoConjuracao" ? " (Fator Primário)" : "";
    const tElevada = e_tempoConjuracaoElevada ? " (E)" : "";

    const eExtra = Math.max(0, e_escala - 1);
    const ePenalty = currentFP === "escala" ? Math.max(0, e_escala - e_nivelArcana) * 2 : eExtra * 2;
    const eFP = currentFP === "escala" ? " (Fator Primário)" : "";
    const eElevada = e_escalaElevada ? " (E)" : "";

    let textoSoma = `Arcano ${e_nivelArcana} + Gnose ${e_gnose}`;
    if (textoYantraBonus) textoSoma += ` + ${textoYantraBonus}`;
    else if (yantraBonus > 0) textoSoma += ` + Yantras ${yantraBonus}`;
    if (tBonus > 0) textoSoma += ` + Ritual ${tBonus}`;
    if (usouFV) textoSoma += ` + FDV 3`;
    if (dadosExtras > 0) textoSoma += ` + Dados Extras ${dadosExtras}`;

    const xSoma = e_nivelArcana + e_gnose + yantraBonus + tBonus + (usouFV ? 3 : 0) + dadosExtras;
    const yPenalties = pPenalty + dPenalty + ePenalty + (isCombinado ? 2 : 0);

    let elevacoesList = [];
    if (e_potenciaElevada) elevacoesList.push("Potência");
    if (e_duracaoElevada) elevacoesList.push("Duração");
    if (e_tempoConjuracaoElevada) elevacoesList.push("Tempo de Conjuração");
    if (e_escalaElevada) elevacoesList.push("Escala");
    if (e_alcance !== 'toque') elevacoesList.push("Alcance");
    if (extraElevacoes > 0) elevacoesList.push(`Elevação Opcionais ${extraElevacoes}`);
    const textoElevacoesUsadas = elevacoesList.length > 0 ? ` (${elevacoesList.join(', ')})` : '';

    return `
Nível da Prática: ${nivelRequerido}
Potência${pFP}${pElevada}: 1 + ${pExtra} (-${pPenalty}d)
Duração${dFP}${dElevada}: 1 + ${dExtra} (-${dPenalty}d) | ${exibirDuracao}
Tempo de conjuração${tFP}${tElevada}: Ritual 1 + ${tExtra} (+${tBonus}d) | ${exibirTempoConjuracao}
Escala${eFP}${eElevada}: ${e_escala} | Área: ${exibirEscala.area} | Alvos: ${exibirEscala.alvos} | Tamanho: ${exibirEscala.tamanhos} (${exibirTextoPorTamanho})
Alcance: ${e_alcance.charAt(0).toUpperCase() + e_alcance.slice(1)}

Parada Inicial: ${textoSoma}
Calculando: ${xSoma} - ${yPenalties} = ${paradaDeDados}
Parada de dados: ${paradaDeDados} dados

${textoYantras ? `Yantras Selecionados: ${textoYantras}\n` : ''}
Elevações grátis: ${calcularElevacoesGratis()}
Elevações usadas: ${custoElevacoes}${textoElevacoesUsadas}
Dados paradoxo: ${totalDadosParadoxo}
Gasto de mana: ${custoMana}`;
  }, [potencia, currentFP, nivelArcana, potenciaElevada, duracao, duracaoElevada, tempoConjuracaoElevada, tempoConjuracao, escala, escalaElevada, exibirEscala, alcance, yantras, gnose, usouFV, dadosExtras, isCombinado, extraElevacoes, calcularElevacoesGratis, custoElevacoes, paradaDeDados, totalDadosParadoxo, custoMana, exibirDuracao, nivelRequerido, exibirTempoConjuracao, exibirTextoPorTamanho, efeitosYantra]);

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

    if (userData && database) {
      const userRefInDB = ref(database, `users/${userData.id}`);
      const updates = {};
      
      if (custoMana > 0) {
        const manaAtual = userData.mana.max - (userData.mana.usado || 0);
        updates["mana/usado"] = (userData.mana.usado || 0) + custoMana;
        pushLog(database, userData, "Mana", {
          antes: manaAtual,
          depois: manaAtual - custoMana,
          custo: custoMana
        });
      }
      
      if (custoVontade > 0) {
        const fvAtual = userData.fv.max - (userData.fv.usado || 0);
        updates["fv/usado"] = (userData.fv.usado || 0) + custoVontade;
        pushLog(database, userData, "Vontade", {
          antes: fvAtual,
          depois: fvAtual - custoVontade,
          custo: custoVontade
        });
      }

      if (Object.keys(updates).length > 0) {
        try {
          await update(userRefInDB, updates);
        } catch (e) {
          console.error("Erro ao atualizar recursos no DB:", e);
        }
      }
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
            <div className={styles.footerRow}>
              <button className={styles.button} onClick={resetCalculadora}>
                Limpar
              </button>
             <button className={styles.button} onClick={() => setModalSalvarAberto(true)}>
                Salvar
              </button>
            </div>
            <button className={styles.button} onClick={goToDice}>
              Ir para Rolagem
            </button>
          </div>
        </div>
      </div>
      <SalvarMagiaModal
        isOpen={modalSalvarAberto}
        onClose={() => setModalSalvarAberto(false)}
        onSave={handleSalvarMagia}
      />
    </>
  );
}
