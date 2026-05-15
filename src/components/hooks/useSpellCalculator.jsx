import React from "react";
import * as spellLogic from "../../js/spellLogic";
import * as spellReducer from "../../js/spellReducer";

export default function useSpellCalculator(userData) {
  const [state, dispatch] = React.useReducer(spellReducer.spellReducer, spellReducer.initialState);

  // === WRAPPER SETTERS PARA MANTER A API IGUAL ===
  const setPage = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'page', value: typeof value === 'function' ? value(state.page) : value } }), [state.page]);
  const setGnose = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'gnose', value: typeof value === 'function' ? value(state.gnose) : value } }), [state.gnose]);
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
  const setFerramentaDedicada = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'ferramentaDedicada', value: typeof value === 'function' ? value(state.ferramentaDedicada) : value } }), [state.ferramentaDedicada]);
  const setMitigarDadosParadoxoMana = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'mitigarDadosParadoxoMana', value: typeof value === 'function' ? value(state.mitigarDadosParadoxoMana) : value } }), [state.mitigarDadosParadoxoMana]);
  const setMitigarTodoParadoxoMana = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'mitigarTodoParadoxoMana', value: typeof value === 'function' ? value(state.mitigarTodoParadoxoMana) : value } }), [state.mitigarTodoParadoxoMana]);
  const setManaOpcional = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'manaOpcional', value: typeof value === 'function' ? value(state.manaOpcional) : value } }), [state.manaOpcional]);
  const setDadosExtras = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'dadosExtras', value: typeof value === 'function' ? value(state.dadosExtras) : value } }), [state.dadosExtras]);
  const setDadosParadoxoExtra = React.useCallback((value) => dispatch({ type: 'SET_VALUE', payload: { key: 'dadosParadoxoExtra', value: typeof value === 'function' ? value(state.dadosParadoxoExtra) : value } }), [state.dadosParadoxoExtra]);

  // Facilita o uso do state para os cálculos derivados abaixo
  const {
    gnose, nivelArcana, nivelRequerido, magiasAtivas, spellType, regente,
    potencia, duracao, escala, alcance, tempoConjuracao, currentFP,
    potenciaElevada, duracaoElevada, escalaElevada, alcanceElevado, tempoConjuracaoElevada,
    extraElevacoes, isCombinado, yantras, usouFV, ferramentaDedicada, mitigarDadosParadoxoMana,
    mitigarTodoParadoxoMana, manaOpcional, dadosExtras, page, dadosParadoxoExtra
  } = state;

  // === CÁLCULOS DERIVADOS (MEMO) ===
  const MagoData = React.useMemo(() => ({ gnose, nivelArcana, nivelRequerido }), [gnose, nivelArcana, nivelRequerido]);
  const Fatores = React.useMemo(() => ({ potencia, duracao, escala, alcance, tempoConjuracao }), [potencia, duracao, escala, alcance, tempoConjuracao]);

  const custoElevacoes = React.useMemo(() => {
    const custoPorExcessomMagiasAtivas = magiasAtivas >= gnose ? ((1 + magiasAtivas) - gnose) : 0;
    let totalElevacoesCalculadas = 0;
    if (potenciaElevada) totalElevacoesCalculadas++;
    if (duracaoElevada) totalElevacoesCalculadas++;
    if (escalaElevada) totalElevacoesCalculadas++;
    if (tempoConjuracaoElevada) totalElevacoesCalculadas++;
    if (alcanceElevado) totalElevacoesCalculadas += 1;
    totalElevacoesCalculadas += extraElevacoes;
    totalElevacoesCalculadas += custoPorExcessomMagiasAtivas;
    return totalElevacoesCalculadas;
  }, [potenciaElevada, duracaoElevada, escalaElevada, tempoConjuracaoElevada, extraElevacoes, alcanceElevado, magiasAtivas, gnose]);

  const custoVontade = usouFV ? 1 : 0;

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
    return spellLogic.calculateFreeReach(nivelArcana, nivelRequerido, spellType);
  }, [spellType, nivelArcana, nivelRequerido]);

  const calcularElevacoesExcedentes = React.useCallback(() => {
    const elevacoesGratis = calcularElevacoesGratis();
    return Math.max(0, custoElevacoes - elevacoesGratis);
  }, [custoElevacoes, calcularElevacoesGratis]);

  const calcularElevacoesTotais = React.useCallback(() => {
    return calcularElevacoesGratis() - custoElevacoes;
  }, [calcularElevacoesGratis, custoElevacoes]);

  const calcularDadosParadoxo = React.useCallback(() => {
    let raw = spellLogic.calculateParadoxDice(gnose, calcularElevacoesGratis(), custoElevacoes);
    if (ferramentaDedicada) {
      raw = Math.max(0, raw - 2);
    }
    return raw;
  }, [gnose, calcularElevacoesGratis, custoElevacoes, ferramentaDedicada]);

  const calcularTotalDadosParadoxo = React.useCallback(() => {
    let dadosParadoxo = calcularDadosParadoxo();
    let mitigacaoEfetiva = Math.min(dadosParadoxo, mitigarDadosParadoxoMana);
    return Math.max(0, (dadosParadoxo - mitigacaoEfetiva) + dadosParadoxoExtra);
  }, [mitigarDadosParadoxoMana, calcularDadosParadoxo, dadosParadoxoExtra]);

  const calcularDadosPorFator = React.useCallback(() => {
    return spellLogic.calculateFactorPenalty({ potencia, duracao, escala, currentFP, nivelArcana });
  }, [potencia, duracao, escala, currentFP, nivelArcana]);

  const calcularParadaDeDados = React.useCallback(() => {
    const factorPenalty = calcularDadosPorFator();
    return spellLogic.calculateDicePool({
      gnose, nivelArcana, yantras, dadosExtras, isCombinado, usouFV,
      tempoConjuracao, tempoConjuracaoElevada, currentFP, factorPenalty
    });
  }, [
    gnose, nivelArcana, yantras, dadosExtras, isCombinado, usouFV,
    tempoConjuracao, tempoConjuracaoElevada, currentFP, calcularDadosPorFator
  ]);

  const calcularGastoMana = React.useCallback(() => {
    const paradoxDice = calcularDadosParadoxo();
    let mitigacaoEfetiva = Math.min(paradoxDice, mitigarDadosParadoxoMana);
    return spellLogic.calculateManaCost({
      alcance, regente, duracao, duracaoElevada, manaOpcional,
      paradoxDice, mitigarTodoParadoxo: mitigarTodoParadoxoMana,
      mitigarDadosParadoxo: mitigacaoEfetiva,
      spellType
    });
  }, [
    alcance, regente, duracao, duracaoElevada, manaOpcional,
    calcularDadosParadoxo, mitigarTodoParadoxoMana, mitigarDadosParadoxoMana,
    spellType
  ]);

  const initialMana = (userData?.mana?.max || 0) - (userData?.mana?.usado || 0);

  const calcularBaseManaCost = React.useCallback(() => {
    return spellLogic.calculateManaCost({
      alcance, regente, duracao, duracaoElevada, manaOpcional: 0,
      paradoxDice: 0, mitigarTodoParadoxo: false,
      mitigarDadosParadoxo: 0,
      spellType
    });
  }, [alcance, regente, duracao, duracaoElevada, spellType]);

  const totalDisponivelParaOpcionais = React.useMemo(() => {
    return Math.max(0, initialMana - calcularBaseManaCost());
  }, [initialMana, calcularBaseManaCost]);

  const maxManaMitigacao = React.useMemo(() => {
    const paradoxoDados = calcularDadosParadoxo();
    return Math.min(paradoxoDados, totalDisponivelParaOpcionais);
  }, [calcularDadosParadoxo, totalDisponivelParaOpcionais]);

  const maxManaOpcional = totalDisponivelParaOpcionais;

  // === VALORES FINAIS (MEMO) ===
  const ModificamElevacao = React.useMemo(() => ({
    magiasAtivas, potenciaElevada, duracaoElevada, escalaElevada,
    tempoConjuracaoElevada, extraElevacoes, calcularElevacoesGratis, custoElevacoes
  }), [magiasAtivas, potenciaElevada, duracaoElevada, escalaElevada, tempoConjuracaoElevada, extraElevacoes, calcularElevacoesGratis, custoElevacoes]);

  const custoMana = React.useMemo(() => {
    return Math.max(0, calcularGastoMana());
  }, [calcularGastoMana]);

  const totalDadosParadoxo = React.useMemo(() => {
    return Math.max(0, calcularTotalDadosParadoxo());
  }, [calcularTotalDadosParadoxo]);

  const paradaDeDados = React.useMemo(() => {
    return calcularParadaDeDados();
  }, [calcularParadaDeDados]);


  const saveSpellData = React.useCallback((spellName) => {
    try {
      const KEY = `spellCalculator_${spellName}`;
      localStorage.setItem(KEY, JSON.stringify(state));
      console.log(`Dados da magia "${spellName}" salvos com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar dados da magia no localStorage:', error);
    }
  }, [state]);

  const loadSpellData = React.useCallback(() => {
    try {
      const savedData = localStorage.getItem('spellCalculatorData');
      if (savedData) {
        const spellDataObj = JSON.parse(savedData);
        dispatch({ type: 'LOAD_STATE', payload: spellDataObj });
        console.log('Dados da magia carregados com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao carregar dados da magia do localStorage:', error);
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
    const paradoxoMaximo = calcularDadosParadoxo();
    const tetoMitigacao = Math.min(paradoxoMaximo, totalDisponivel);
    if (mitigarDadosParadoxoMana > tetoMitigacao) setMitigarDadosParadoxoMana(tetoMitigacao);

  }, [manaOpcional, mitigarDadosParadoxoMana, totalDisponivelParaOpcionais, calcularDadosParadoxo]);

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
    // Estados e seus setters
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
    saveSpellData,
    loadSpellData
  };
}
