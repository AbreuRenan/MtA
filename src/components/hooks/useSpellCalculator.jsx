import React from "react";
import * as spellLogic from "../../js/spellLogic";
import * as spellReducer from "../../js/spellReducer";
import { ref, set, remove, update } from "firebase/database";
import { AppContext } from "../../AppContext";
import { extractYantraCosts, validateYantra } from "../../js/yantraLogic";

export default function useSpellCalculator(userData) {
  const [state, dispatch] = React.useReducer(spellReducer.spellReducer, spellReducer.initialState);
  const { database } = React.useContext(AppContext) || {};

  // === WRAPPER SETTERS PARA MANTER A API IGUAL ===
  const setGnose = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'gnose', value: typeof value === 'function' ? value(state.gnose) : value } }), [state.gnose]);
  const setArcana = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'arcana', value: typeof value === 'function' ? value(state.arcana) : value } }), [state.arcana]);
  const setArcanasExtras = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'arcanasExtras', value: typeof value === 'function' ? value(state.arcanasExtras) : value } }), [state.arcanasExtras]);
  const setNivelArcana = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'nivelArcana', value: typeof value === 'function' ? value(state.nivelArcana) : value } }), [state.nivelArcana]);
  const setNivelRequerido = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'nivelRequerido', value: typeof value === 'function' ? value(state.nivelRequerido) : value } }), [state.nivelRequerido]);
  const setMagiasAtivas = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'magiasAtivas', value: typeof value === 'function' ? value(state.magiasAtivas) : value } }), [state.magiasAtivas]);
  const setSpellType = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'spellType', value: typeof value === 'function' ? value(state.spellType) : value } }), [state.spellType]);
  const setRegente = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'regente', value: typeof value === 'function' ? value(state.regente) : value } }), [state.regente]);
  
  const setPotencia = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'potencia', value: typeof value === 'function' ? value(state.potencia) : value } }), [state.potencia]);
  const setDuracao = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'duracao', value: typeof value === 'function' ? value(state.duracao) : value } }), [state.duracao]);
  const setEscala = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'escala', value: typeof value === 'function' ? value(state.escala) : value } }), [state.escala]);
  const setAlcance = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'alcance', value: typeof value === 'function' ? value(state.alcance) : value } }), [state.alcance]);
  const setTempoConjuracao = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'tempoConjuracao', value: typeof value === 'function' ? value(state.tempoConjuracao) : value } }), [state.tempoConjuracao]);
  const setCurrentFP = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'currentFP', value: typeof value === 'function' ? value(state.currentFP) : value } }), [state.currentFP]);
  
  const setPotenciaElevada = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'potenciaElevada', value: typeof value === 'function' ? value(state.potenciaElevada) : value } }), [state.potenciaElevada]);
  const setDuracaoElevada = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'duracaoElevada', value: typeof value === 'function' ? value(state.duracaoElevada) : value } }), [state.duracaoElevada]);
  const setEscalaElevada = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'escalaElevada', value: typeof value === 'function' ? value(state.escalaElevada) : value } }), [state.escalaElevada]);
  const setAlcanceElevado = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'alcanceElevado', value: typeof value === 'function' ? value(state.alcanceElevado) : value } }), [state.alcanceElevado]);
  const setTempoConjuracaoElevada = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'tempoConjuracaoElevada', value: typeof value === 'function' ? value(state.tempoConjuracaoElevada) : value } }), [state.tempoConjuracaoElevada]);
  
  const setExtraElevacoes = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'extraElevacoes', value: typeof value === 'function' ? value(state.extraElevacoes) : value } }), [state.extraElevacoes]);
  const setIsCombinado = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'isCombinado', value: typeof value === 'function' ? value(state.isCombinado) : value } }), [state.isCombinado]);
  const setYantras = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'yantras', value: typeof value === 'function' ? value(state.yantras) : value } }), [state.yantras]);
  const setUsouFdV = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'usouFV', value: typeof value === 'function' ? value(state.usouFV) : value } }), [state.usouFV]);
  
  const setMitigarDadosParadoxoMana = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'mitigarDadosParadoxoMana', value: typeof value === 'function' ? value(state.mitigarDadosParadoxoMana) : value } }), [state.mitigarDadosParadoxoMana]);
  const setMitigarTodoParadoxoMana = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'mitigarTodoParadoxoMana', value: typeof value === 'function' ? value(state.mitigarTodoParadoxoMana) : value } }), [state.mitigarTodoParadoxoMana]);
  const setManaOpcional = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'manaOpcional', value: typeof value === 'function' ? value(state.manaOpcional) : value } }), [state.manaOpcional]);
  const setDadosExtras = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'dadosExtras', value: typeof value === 'function' ? value(state.dadosExtras) : value } }), [state.dadosExtras]);
  const setDadosParadoxoExtra = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'dadosParadoxoExtra', value: typeof value === 'function' ? value(state.dadosParadoxoExtra) : value } }), [state.dadosParadoxoExtra]);

  const {
    gnose, arcana, nivelArcana, arcanasExtras, nivelRequerido, magiasAtivas, spellType, regente,
    potencia, duracao, escala, alcance, tempoConjuracao, currentFP,
    potenciaElevada, duracaoElevada, escalaElevada, alcanceElevado, tempoConjuracaoElevada,
    extraElevacoes, isCombinado, yantras, usouFV, mitigarDadosParadoxoMana,
    mitigarTodoParadoxoMana, manaOpcional, dadosExtras, dadosParadoxoExtra
  } = state;

  const efeitosYantra = React.useMemo(() => {
    let efeitos = {
      modDados: 0,
      modMana: 0,
      gnose: 0,
      nivelArcana: 0,
      modElevacao: 0,
      modParadoxo: 0,
      potenciaElevada: false,
      duracaoElevada: false,
      escalaElevada: false,
      alcanceElevado: false,
      tempoConjuracaoElevada: false,
      fatorPotencia: 0,
      fatorDuracao: 0,
      fatorEscala: 0,
      fatorFdv: 0,
      alcanceToque: false,
      alcanceSensorial: false,
      alcanceSimpatico: false,
      tempoAcelerar: 0,
      tempoExceder: 0
    };

    if (Array.isArray(yantras)) {
      yantras.forEach(yantra => {
        // Validação em tempo real dos requisitos
        const contextForValidation = {
          fatoresMagia: {
            Gnosis: gnose,
            Arkanum: nivelArcana,
            arcana: arcana,
            [arcana]: nivelArcana,
            ...arcanasExtras.reduce((acc, curr) => {
              acc[curr.arcana] = curr.nivelArcana;
              return acc;
            }, {})
          },
          poolYantras: yantras
        };

        const validation = validateYantra(yantra, contextForValidation);
        if (!validation.isValid) return; // Ignora Yantras inválidos nos cálculos de bônus!

        if (yantra.efeitos && Array.isArray(yantra.efeitos)) {
          const selectedIndex = typeof yantra.selectedOptionIndex === 'number' ? yantra.selectedOptionIndex : 0;
          const selectedEffect = yantra.efeitos[selectedIndex];

          if (selectedEffect?.valores && typeof selectedEffect.valores === 'object') {
            Object.entries(selectedEffect.valores).forEach(([key, value]) => {
              const val = Number(value) || 0;

              // As chaves já são modDados, modMana, modElevacao, modParadoxo
              if (['potenciaElevada', 'duracaoElevada', 'escalaElevada', 'alcanceElevado', 'tempoConjuracaoElevada', 'alcanceToque', 'alcanceSensorial', 'alcanceSimpatico'].includes(key)) {
                if (val > 0) efeitos[key] = true;
              } else if (efeitos[key] !== undefined) {
                if (key === 'modMana') {
                  // modMana negativo significa custo, e no calculador subtraímos para acumular como um custo que será somado
                  efeitos[key] -= val;
                } else {
                  efeitos[key] += val;
                }
              }
            });
          }
        }
      });
    } else {
      efeitos.modDados = Number(yantras || 0);
    }
    return efeitos;
  }, [yantras, gnose, nivelArcana, arcana, arcanasExtras]);

  // === VALORES EFETIVOS (COM YANTRAS APLICADOS) ===
  const e_potenciaElevada = potenciaElevada || efeitosYantra.potenciaElevada;
  const e_duracaoElevada = duracaoElevada || efeitosYantra.duracaoElevada;
  const e_escalaElevada = escalaElevada || efeitosYantra.escalaElevada;
  const e_alcanceElevado = alcanceElevado || efeitosYantra.alcanceElevado;
  const e_tempoConjuracaoElevada = tempoConjuracaoElevada || efeitosYantra.tempoConjuracaoElevada;

  const e_gnose = Math.max(1, gnose + efeitosYantra.gnose);
  const e_potencia = Math.max(1, potencia + (efeitosYantra.fatorPotencia || 0));
  const e_duracao = Math.max(1, duracao + (efeitosYantra.fatorDuracao || 0));
  const e_escala = Math.max(1, escala + (efeitosYantra.fatorEscala || 0));

  // === AJUSTE DE TEMPO DE CONJURAÇÃO CONSIDERANDO EFEITOS YANTRA ===
  // Cap base: 6 (máximo tempo de conjuração ritual)
  // Se yantra tem tempoExceder: cap = 6 + tempoExceder
  // Nota: tempoAcelerar NÃO afeta bônus de dados, apenas o tempo exibido em spellLogic.formatSpellFactors
  const e_tempoConjuracao = (() => {
    const capMaximo = 6 + (Number(efeitosYantra.tempoExceder) || 0);
    return Math.min(tempoConjuracao || 1, capMaximo);
  })();

  const e_nivelArcana = Math.max(1, nivelArcana + efeitosYantra.nivelArcana);
  const e_extraElevacoes = extraElevacoes + efeitosYantra.modElevacao;
  const e_dadosParadoxoExtra = dadosParadoxoExtra + efeitosYantra.modParadoxo;

  let e_alcance = alcance;
  if (efeitosYantra.alcanceSimpatico) e_alcance = 'simpatico';
  else if (efeitosYantra.alcanceSensorial) e_alcance = 'sensorial';
  else if (efeitosYantra.alcanceToque) e_alcance = 'toque';

  // === CÁLCULOS DERIVADOS (MEMO) ===
  const MagoData = React.useMemo(() => ({ gnose: e_gnose, nivelArcana: e_nivelArcana, nivelRequerido }), [e_gnose, e_nivelArcana, nivelRequerido]);
  const Fatores = React.useMemo(() => ({ potencia, duracao, escala, alcance, tempoConjuracao }), [potencia, duracao, escala, alcance, tempoConjuracao]);

  const custoElevacoes = React.useMemo(() => {
    const custoPorExcessomMagiasAtivas = magiasAtivas >= e_gnose ? ((1 + magiasAtivas) - e_gnose) : 0;
    let totalElevacoesCalculadas = 0;
    if (e_potenciaElevada) totalElevacoesCalculadas++;
    if (e_duracaoElevada) totalElevacoesCalculadas++;
    if (e_escalaElevada) totalElevacoesCalculadas++;
    if (e_tempoConjuracaoElevada) totalElevacoesCalculadas++;
    if (e_alcanceElevado) totalElevacoesCalculadas += 1;
    totalElevacoesCalculadas += e_extraElevacoes;
    totalElevacoesCalculadas += custoPorExcessomMagiasAtivas;
    return totalElevacoesCalculadas;
  }, [e_potenciaElevada, e_duracaoElevada, e_escalaElevada, e_tempoConjuracaoElevada, e_extraElevacoes, e_alcanceElevado, magiasAtivas, e_gnose]);

  const custoVontade = usouFV ? 1 : 0;
  const yantraBonus = efeitosYantra.modDados || 0;

  // === FUNÇÕES DE CÁLCULO (CALLBACKS) ===
  const toggleRegente = React.useCallback((e) => {
    setRegente(e.target.checked);
  }, []);

  const toggleUsouFV = React.useCallback((val) => {
    const isChecked = typeof val === 'object' && val?.target ? val.target.checked : val;
    
    if (isChecked) {
      const initialFV = (userData?.fv?.max || 0) - (userData?.fv?.usado || 0);
      if (initialFV <= 0) {
        alert("Você não possui Força de Vontade disponível!");
        return;
      }
    }
    setUsouFdV(isChecked);
  }, [userData, setUsouFdV]);

  const calcularElevacoesGratis = React.useCallback(() => {
    return spellLogic.calculateFreeReach(e_nivelArcana, nivelRequerido, spellType);
  }, [spellType, e_nivelArcana, nivelRequerido]);

  const calcularElevacoesExcedentes = React.useCallback(() => {
    const elevacoesGratis = calcularElevacoesGratis();
    return Math.max(0, custoElevacoes - elevacoesGratis);
  }, [custoElevacoes, calcularElevacoesGratis]);

  const calcularElevacoesTotais = React.useCallback(() => {
    return calcularElevacoesGratis() - custoElevacoes;
  }, [calcularElevacoesGratis, custoElevacoes]);

  const calcularDadosParadoxo = React.useCallback(() => {
    let raw = spellLogic.calculateParadoxDice(e_gnose, calcularElevacoesGratis(), custoElevacoes);
    return raw;
  }, [e_gnose, calcularElevacoesGratis, custoElevacoes]);

  const calcularTotalDadosParadoxo = React.useCallback(() => {
    let dadosParadoxo = calcularDadosParadoxo();
    let effectiveParadoxo = Math.max(0, dadosParadoxo + e_dadosParadoxoExtra);
    let mitigacaoEfetiva = Math.min(effectiveParadoxo, mitigarDadosParadoxoMana);
    return Math.max(0, effectiveParadoxo - mitigacaoEfetiva);
  }, [mitigarDadosParadoxoMana, calcularDadosParadoxo, e_dadosParadoxoExtra]);

  const calcularDadosPorFator = React.useCallback(() => {
    return spellLogic.calculateFactorPenalty({ potencia: e_potencia, duracao: e_duracao, escala: e_escala, currentFP, nivelArcana: e_nivelArcana });
  }, [e_potencia, e_duracao, e_escala, currentFP, e_nivelArcana]);

  const calcularParadaDeDados = React.useCallback(() => {
    const factorPenalty = calcularDadosPorFator();
    const yantrasBonus = efeitosYantra.modDados;

    return spellLogic.calculateDicePool({
      gnose: e_gnose, 
      nivelArcana: e_nivelArcana, 
      yantras: yantrasBonus, dadosExtras, isCombinado, usouFV,
      tempoConjuracao: e_tempoConjuracao, 
      tempoConjuracaoElevada: e_tempoConjuracaoElevada, currentFP, factorPenalty,
      fatorFdv: efeitosYantra.fatorFdv
    });
  }, [
    e_gnose, e_nivelArcana, efeitosYantra.modDados, dadosExtras, isCombinado, usouFV,
    e_tempoConjuracao, e_tempoConjuracaoElevada, currentFP, calcularDadosPorFator
  ]);

  const yantraCosts = React.useMemo(() => extractYantraCosts(yantras), [yantras]);
  const yantraManaCost = efeitosYantra.modMana || 0;
  const yantraDanoResistente = yantraCosts.DANO_RESISTENTE || 0;

  const calcularGastoMana = React.useCallback(() => {
    const paradoxDice = calcularDadosParadoxo();
    const effectiveParadox = Math.max(0, paradoxDice + e_dadosParadoxoExtra);
    let mitigacaoEfetiva = Math.min(effectiveParadox, mitigarDadosParadoxoMana);
    return spellLogic.calculateManaCost({
      alcance: e_alcance, regente, duracao, duracaoElevada: e_duracaoElevada, manaOpcional: manaOpcional + yantraManaCost,
      paradoxDice: effectiveParadox, mitigarTodoParadoxo: mitigarTodoParadoxoMana,
      mitigarDadosParadoxo: mitigacaoEfetiva,
      spellType,
      arcanasExtras
    });
  }, [
    e_alcance, regente, duracao, e_duracaoElevada, manaOpcional, yantraManaCost,
    calcularDadosParadoxo, mitigarTodoParadoxoMana, mitigarDadosParadoxoMana, e_dadosParadoxoExtra,
    spellType, arcanasExtras
  ]);

  const initialMana = (userData?.mana?.max || 0) - (userData?.mana?.usado || 0);

  const calcularBaseManaCost = React.useCallback(() => {
    return spellLogic.calculateManaCost({
      alcance: e_alcance, regente, duracao, duracaoElevada: e_duracaoElevada, manaOpcional: yantraManaCost,
      paradoxDice: 0, mitigarTodoParadoxo: false,
      mitigarDadosParadoxo: 0,
      spellType,
      arcanasExtras
    });
  }, [e_alcance, regente, duracao, e_duracaoElevada, spellType, yantraManaCost, arcanasExtras]);

  const totalDisponivelParaOpcionais = React.useMemo(() => {
    return Math.max(0, initialMana - calcularBaseManaCost());
  }, [initialMana, calcularBaseManaCost]);

  const maxManaMitigacao = React.useMemo(() => {
    const baseParadoxo = calcularDadosParadoxo();
    const effectiveParadoxo = Math.max(0, baseParadoxo + e_dadosParadoxoExtra);
    return Math.min(effectiveParadoxo, totalDisponivelParaOpcionais);
  }, [calcularDadosParadoxo, totalDisponivelParaOpcionais, e_dadosParadoxoExtra]);

  const maxManaOpcional = totalDisponivelParaOpcionais;

  // === VALORES FINAIS (MEMO) ===
  const ModificamElevacao = React.useMemo(() => ({
    magiasAtivas, potenciaElevada: e_potenciaElevada, duracaoElevada: e_duracaoElevada, escalaElevada: e_escalaElevada,
    tempoConjuracaoElevada: e_tempoConjuracaoElevada, extraElevacoes: e_extraElevacoes, calcularElevacoesGratis, custoElevacoes
  }), [magiasAtivas, e_potenciaElevada, e_duracaoElevada, e_escalaElevada, e_tempoConjuracaoElevada, e_extraElevacoes, calcularElevacoesGratis, custoElevacoes]);

  const custoMana = React.useMemo(() => {
    return Math.max(0, calcularGastoMana());
  }, [calcularGastoMana]);

  const totalDadosParadoxo = React.useMemo(() => {
    return Math.max(0, calcularTotalDadosParadoxo());
  }, [calcularTotalDadosParadoxo]);

  const paradaDeDados = React.useMemo(() => {
    return calcularParadaDeDados();
  }, [calcularParadaDeDados]);


  const checkSpellExists = React.useCallback((spellName) => {
    return !!(userData?.savedSpells && userData.savedSpells[spellName]);
  }, [userData]);

  const saveSpellData = React.useCallback(async (spellName) => {
    if (!userData || !database) {
      alert("Usuário não autenticado ou banco de dados indisponível.");
      return false;
    }
    try {
      const spellPathRef = ref(database, `users/${userData.id}/savedSpells/${spellName}`);
      // Build a complete calculator snapshot to persist: raw state + derived values + yantra details
      const calculatorStateSnapshot = {
        // core reducer state (gnose, potencia, duracao, yantras, etc.)
        ...state,
        // detailed yantra effects and derived effective values
        efeitosYantra,
        e_gnose,
        e_potencia,
        e_duracao,
        e_escala,
        e_tempoConjuracao,
        e_nivelArcana,
        custoElevacoes,
        custoVontade,
        // ensure full yantras array (with objects) is saved
        yantras: Array.isArray(yantras) ? yantras : (typeof yantras === 'number' ? yantras : []),
        // final calculated outputs
        paradaDeDados: calcularParadaDeDados(),
        calculatorParadaDeDados: calcularParadaDeDados(),
        custoMana: calcularGastoMana(),
        totalDadosParadoxo: calcularTotalDadosParadoxo(),
        savedAt: Date.now()
      };

      const arcanasList = [`${arcana} ${nivelArcana}`];
      if (Array.isArray(arcanasExtras)) {
        arcanasExtras.forEach(extra => {
          arcanasList.push(`${extra.arcana} ${extra.nivelArcana}`);
        });
      }
      const arcanasText = arcanasList.join(", ");

      const spellToSave = {
        name: spellName,
        arcanas: arcanasText,
        description: "",
        calculatorState: calculatorStateSnapshot
      };

      await set(spellPathRef, spellToSave);
      console.log(`Magia "${spellName}" salva com sucesso no Firebase!`);
      return true;
    } catch (error) {
      console.error("Erro ao salvar magia no Firebase:", error);
      alert("Erro ao salvar a magia. Tente novamente.");
      return false;
    }
  }, [userData, database, state, nivelArcana, calcularParadaDeDados, calcularGastoMana, calcularTotalDadosParadoxo, efeitosYantra, e_gnose, e_potencia, e_duracao, e_escala, e_tempoConjuracao, e_nivelArcana, custoElevacoes, custoVontade, yantras]);

  const deleteSpellData = React.useCallback(async (spellName, userId) => {
    const targetUid = userId || userData?.id;
    if (!targetUid || !database) return false;
    try {
      const spellPathRef = ref(database, `users/${targetUid}/savedSpells/${spellName}`);
      await remove(spellPathRef);
      console.log(`Magia "${spellName}" excluída do Firebase.`);
      return true;
    } catch (error) {
      console.error("Erro ao excluir magia do Firebase:", error);
      return false;
    }
  }, [userData, database]);

  const updateSavedSpell = React.useCallback(async (spellName, fields, userId) => {
    const targetUid = userId || userData?.id;
    if (!targetUid || !database) return false;
    try {
      const spellPathRef = ref(database, `users/${targetUid}/savedSpells/${spellName}`);
      await update(spellPathRef, fields);
      console.log(`Magia "${spellName}" atualizada com sucesso no Firebase.`);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar magia no Firebase:", error);
      return false;
    }
  }, [userData, database]);

  const loadSpellData = React.useCallback((spellCalculatorState) => {
    if (spellCalculatorState) {
      dispatch({ type: 'LOAD_STATE', payload: spellCalculatorState });
      console.log('Dados da magia carregados no estado do calculador!');
    }
  }, []);


  const resetCalculadora = React.useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // === EFFECTS PARA RECALCULAR ESTADOS DERIVADOS ===

  React.useEffect(() => {
    // Efeito para verificar se nivel requerido é maior que o nivel possuido na arcana
    if (nivelRequerido > nivelArcana) {
      alert("Nível da Prática não pode ser maior que o seu Nível na Arcana");
      setNivelRequerido(nivelArcana);
    }
  }, [nivelRequerido, nivelArcana]);

  React.useEffect(() => {
    // Efeito para mitigar todo o paradoxo com mana respeitando o limite do usuario
    if (mitigarTodoParadoxoMana) {
      setMitigarDadosParadoxoMana(maxManaMitigacao);
    } else {
      setMitigarDadosParadoxoMana(0);
    }
  }, [mitigarTodoParadoxoMana, maxManaMitigacao]);

  const prevOptional = React.useRef(manaOpcional);
  const prevMitigation = React.useRef(mitigarDadosParadoxoMana);

  // Lógica de "Push and Pull": se a soma dos opcionais estourar o disponível, 
  // o que acabou de ser alterado "empurra" o outro para baixo.
  React.useEffect(() => {
    const totalDisponivel = totalDisponivelParaOpcionais;
    
    if (manaOpcional !== prevOptional.current) {
      // Usuário mexeu na Mana Opcional
      if (manaOpcional + mitigarDadosParadoxoMana > totalDisponivel) {
        setMitigarDadosParadoxoMana(Math.max(0, totalDisponivel - manaOpcional));
      }
      prevOptional.current = manaOpcional;
    } else if (mitigarDadosParadoxoMana !== prevMitigation.current) {
      // Usuário mexeu na Mitigação
      if (manaOpcional + mitigarDadosParadoxoMana > totalDisponivel) {
        setManaOpcional(Math.max(0, totalDisponivel - mitigarDadosParadoxoMana));
      }
      prevMitigation.current = mitigarDadosParadoxoMana;
    }

    // Trava de segurança absoluta para cada campo
    if (manaOpcional > totalDisponivel) setManaOpcional(totalDisponivel);
    const rawParadoxo = calcularDadosParadoxo();
    const effectiveParadoxo = Math.max(0, rawParadoxo + e_dadosParadoxoExtra);
    const tetoMitigacao = Math.min(effectiveParadoxo, totalDisponivel);
    if (mitigarDadosParadoxoMana > tetoMitigacao) setMitigarDadosParadoxoMana(tetoMitigacao);

  }, [manaOpcional, mitigarDadosParadoxoMana, totalDisponivelParaOpcionais, calcularDadosParadoxo, e_dadosParadoxoExtra]);

  // Trava de segurança para Força de Vontade (FdV)
  React.useEffect(() => {
    const initialFV = (userData?.fv?.max || 0) - (userData?.fv?.usado || 0);
    if (usouFV && initialFV <= 0) {
      setUsouFdV(false);
    }
  }, [usouFV, userData, setUsouFdV]);
  // === RETORNO DO HOOK ===
  return {
    // Objetos condensados para facilitar passar as props para outros componentes
    MagoData,
    Fatores,
    ModificamElevacao,
    efeitosYantra,
    yantraDanoResistente,
    // Estados e seus setters
    gnose,
    setGnose,
    arcana,
    setArcana,
    nivelArcana,
    setNivelArcana,
    arcanasExtras,
    setArcanasExtras,
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
    custoVontade,
    custoElevacoes,

    paradaDeDados,
    dadosExtras,
    setDadosExtras,
    totalDadosParadoxo,
    dadosParadoxoExtra,
    setDadosParadoxoExtra,
    maxManaMitigacao,
    maxManaOpcional,

    // Funções de toggle e reset
    toggleRegente,
    toggleUsouFV,
    resetCalculadora,

    // Funções de cálculo expostas para o ResumoMagia (se precisar)
    calcularElevacoesGratis,
    calcularElevacoesExcedentes,
    calcularElevacoesTotais,
    calcularDadosParadoxo,
    calcularDadosPorFator,
    calcularGastoMana, 
    calcularTotalDadosParadoxo, 
    calcularParadaDeDados: calcularParadaDeDados,
    checkSpellExists,
    saveSpellData,
    deleteSpellData,
    updateSavedSpell,
    loadSpellData
  };
}
