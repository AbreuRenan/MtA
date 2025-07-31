// hooks/useSpellCalculator.js (Crie este arquivo)
import React from "react";

export default function useSpellCalculator() {
  // === ESTADOS ===
  // Estados relacionados a dados do Mago
  const [page, setPage] = React.useState(1);
  const [gnose, setGnose] = React.useState(1);
  const [nivelArcana, setNivelArcana] = React.useState(1);
  const [nivelRequerido, setNivelRequerido] = React.useState(1);
  const [magiasAtivas, setMagiasAtivas] = React.useState(0);
  const [spellType, setSpellType] = React.useState("improvisado");
  const [regente, setRegente] = React.useState(true);

  // Estados relacionados a dados do Feitiço
  const [potencia, setPotencia] = React.useState(1);
  const [duracao, setDuracao] = React.useState(1);
  const [escala, setEscala] = React.useState(1);
  const [alcance, setAlcance] = React.useState("toque");
  const [tempoConjuracao, setTempoConjuracao] = React.useState(1);
  const [currentFP, setCurrentFP] = React.useState("potencia"); // Foco Principal
  const [potenciaElevada, setPotenciaElevada] = React.useState(false);
  const [duracaoElevada, setDuracaoElevada] = React.useState(false);
  const [escalaElevada, setEscalaElevada] = React.useState(false);
  const [alcanceElevado, setAlcanceElevado] = React.useState(false);
  const [tempoConjuracaoElevada, setTempoConjuracaoElevada] =
    React.useState(false);
  const [extraElevacoes, setExtraElevacoes] = React.useState(0);
  const [isCombinado, setIsCombinado] = React.useState(0); // Assumo que 0 ou 1
  const [yantras, setYantras] = React.useState(0);
  const [usouFV, setUsouFdV] = React.useState(false);
  const [mitigarDadosParadoxoMana, setMitigarDadosParadoxoMana] =
    React.useState(0);
  const [mitigarTodoParadoxoMana, setMitigarTodoParadoxoMana] =
    React.useState(false);
  const [manaOpcional, setManaOpcional] = React.useState(0);

  // Estados de Custo e Resultados
  const [custoMana, setCustoMana] = React.useState(0);
  const [custoVontade, setCustoVontade] = React.useState(0);
  const [custoElevacoes, setCustoElevacoes] = React.useState(0); // Este custo precisa ser calculado

  const [paradaDeDados, setParadaDeDados] = React.useState(0);
  const [dadosExtras, setDadosExtras] = React.useState(0);
  const [totalDadosParadoxo, setTotalDadosParadoxo] = React.useState(0);

  // === FUNÇÕES DE CÁLCULO ===
  const toggleRegente = React.useCallback((e) => {
    setRegente(e.target.checked);
  }, []);

  const toggleUsouFV = React.useCallback((e) => {
    // 'e' aqui deve ser o valor booleano
    setUsouFdV(e);
  }, []);

  const calcularElevacoesGratis = React.useCallback(() => {
    const nivelArcanaEfetivo = spellType === "rote" ? 5 : nivelArcana;
    const elevacoesGratis = nivelArcanaEfetivo - nivelRequerido + 1;
    return elevacoesGratis;
  }, [spellType, nivelArcana, nivelRequerido]);

  const calcularElevacoesExcedentes = React.useCallback(() => {
    const elevacoesGratis = calcularElevacoesGratis();
    return Math.max(0, custoElevacoes - elevacoesGratis);
  }, [custoElevacoes, calcularElevacoesGratis]);

  const calcularElevacoesTotais = React.useCallback(() => {
    return calcularElevacoesGratis() - custoElevacoes
  }, [calcularElevacoesGratis, custoElevacoes]);

  const calcularDadosParadoxo = React.useCallback(() => {
    const dadosPorGnose = Math.ceil(gnose / 2);
    const elevacoesExcedentes = calcularElevacoesExcedentes();
    let dadosDeParadoxo = elevacoesExcedentes * dadosPorGnose;
    return Math.max(0, dadosDeParadoxo);
  }, [gnose, calcularElevacoesExcedentes]);

  const calcularTotalDadosParadoxo = React.useCallback(() => {
    let dadosParadoxo = calcularDadosParadoxo();
    let dadosMitigacao = mitigarDadosParadoxoMana;
    // Omiti mitigarTodoParadoxoMana aqui, pois o efeito para mitigarDadosParadoxoMana
    // já cuida disso antes de chegar a essa função.
    return dadosParadoxo - dadosMitigacao;
  }, [mitigarDadosParadoxoMana, calcularDadosParadoxo]);

  const calcularDadosPorFator = React.useCallback(() => {
    let penalidadePotencia = potencia === 1 ? 0 : (potencia - 1) * 2;
    let penalidadeDuracao = duracao === 1 ? 0 : (duracao - 1) * 2;
    let penalidadeEscala = escala === 1 ? 0 : (escala - 1) * 2;

    if (currentFP === "potencia" ) penalidadePotencia = potencia <= nivelArcana ? 0 : (potencia - nivelArcana) * 2;
    if (currentFP === "duracao" ) penalidadeDuracao = duracao <= nivelArcana ? 0 : (duracao - nivelArcana) * 2;
    if (currentFP === "escala") penalidadeEscala = escala <= nivelArcana ? 0 : (escala - nivelArcana) * 2;

    const dadoPenalidadeTotal =
      Math.max(0, penalidadePotencia) +
      Math.max(0, penalidadeDuracao) +
      Math.max(0, penalidadeEscala);
    return dadoPenalidadeTotal;
  }, [potencia,duracao,escala,currentFP,nivelArcana]);

  const calcularParadaDeDados = React.useCallback(() => {
    let dadosIniciais = gnose + nivelArcana + yantras + dadosExtras;
    const penalidadePorFator = calcularDadosPorFator();
    const combinado = isCombinado * 2;
    let totalDados = dadosIniciais - penalidadePorFator - combinado;
    if (usouFV) totalDados += 3;

    // Lógica do Tempo de Conjuracao
    if (!tempoConjuracaoElevada && currentFP !== "tempoConjuracao") {
      totalDados = totalDados + Math.min(5, tempoConjuracao - 1);
    } else if (!tempoConjuracaoElevada && currentFP === "tempoConjuracao") {
      totalDados = totalDados + Math.max(0, tempoConjuracao - 1);
    }

    // setParadaDeDados(totalDados); // Não setar estado aqui dentro de uma função de cálculo
    return totalDados;
  }, [
    gnose,
    nivelArcana,
    yantras,
    dadosExtras,
    calcularDadosPorFator,
    isCombinado,
    usouFV,
    tempoConjuracao,
    tempoConjuracaoElevada,
    currentFP,
  ]);

  const calcularGastoMana = React.useCallback(() => {
    let totalMana = 0;
    if (alcance === "simpatico") {
      totalMana += 1;
    }
    if (!regente) {
      totalMana += 1;
    }
    if(duracaoElevada && duracao >= 6) {
      totalMana += 1
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
  }, [
    alcance,
    regente,
    manaOpcional,
    calcularDadosParadoxo,
    mitigarTodoParadoxoMana,
    mitigarDadosParadoxoMana,
  ]);

  const MagoData = React.useMemo( () => ({gnose, nivelArcana, nivelRequerido}), [gnose, nivelArcana, nivelRequerido])
  const Fatores = React.useMemo( () => ({potencia, duracao, escala, alcance, tempoConjuracao}), [potencia, duracao, escala, alcance, tempoConjuracao]) 
  const ModificamElevacao = React.useMemo(() =>( {magiasAtivas, potenciaElevada, duracaoElevada, escalaElevada, tempoConjuracaoElevada, extraElevacoes, calcularElevacoesGratis,custoElevacoes}), [magiasAtivas, potenciaElevada, duracaoElevada, escalaElevada, tempoConjuracaoElevada, extraElevacoes, calcularElevacoesGratis,custoElevacoes]) 


const saveSpellData = React.useCallback(() => {
    const spellDataObj = {
      page, gnose, nivelArcana, nivelRequerido, magiasAtivas, spellType, regente,
      potencia, duracao, escala, alcance, tempoConjuracao, currentFP,
      potenciaElevada, duracaoElevada, escalaElevada, alcanceElevado, tempoConjuracaoElevada,
      extraElevacoes, isCombinado, yantras, usouFV,
      mitigarDadosParadoxoMana, mitigarTodoParadoxoMana, manaOpcional,
    };
   try {

      const KEY = `spellCalculator_${spellName}`; 
      localStorage.setItem(KEY, JSON.stringify(spellDataObj));
      console.log(`Dados da magia "${spellName}" salvos com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar dados da magia no localStorage:', error);
    }
  }, [
    page, gnose, nivelArcana, nivelRequerido, magiasAtivas, spellType, regente,
    potencia, duracao, escala, alcance, tempoConjuracao, currentFP,
    potenciaElevada, duracaoElevada, escalaElevada, alcanceElevado, tempoConjuracaoElevada,
    extraElevacoes, isCombinado, yantras, usouFV,
    mitigarDadosParadoxoMana, mitigarTodoParadoxoMana, manaOpcional
  ]);

  const loadSpellData = React.useCallback(() => {
    try {
      const savedData = localStorage.getItem('spellCalculatorData');
      if (savedData) {
        const spellDataObj = JSON.parse(savedData);
        setPage(spellDataObj.page || 1); 
        setGnose(spellDataObj.gnose || 1);
        setNivelArcana(spellDataObj.nivelArcana || 1);
        setNivelRequerido(spellDataObj.nivelRequerido || 1);
        setMagiasAtivas(spellDataObj.magiasAtivas || 0);
        setSpellType(spellDataObj.spellType || "improvisado");
        setRegente(spellDataObj.regente !== undefined ? spellDataObj.regente : true); 
        setPotencia(spellDataObj.potencia || 1);
        setDuracao(spellDataObj.duracao || 1);
        setEscala(spellDataObj.escala || 1);
        setAlcance(spellDataObj.alcance || "toque");
        setTempoConjuracao(spellDataObj.tempoConjuracao || 1);
        setCurrentFP(spellDataObj.currentFP || "potencia");
        setPotenciaElevada(spellDataObj.potenciaElevada !== undefined ? spellDataObj.potenciaElevada : false);
        setDuracaoElevada(spellDataObj.duracaoElevada !== undefined ? spellDataObj.duracaoElevada : false);
        setEscalaElevada(spellDataObj.escalaElevada !== undefined ? spellDataObj.escalaElevada : false);
        setAlcanceElevado(spellDataObj.alcanceElevado !== undefined ? spellDataObj.alcanceElevado : false);
        setTempoConjuracaoElevada(spellDataObj.tempoConjuracaoElevada !== undefined ? spellDataObj.tempoConjuracaoElevada : false);
        setExtraElevacoes(spellDataObj.extraElevacoes || 0);
        setIsCombinado(spellDataObj.isCombinado || 0);
        setYantras(spellDataObj.yantras || 0);
        setUsouFdV(spellDataObj.usouFV !== undefined ? spellDataObj.usouFV : false);
        setMitigarDadosParadoxoMana(spellDataObj.mitigarDadosParadoxoMana || 0);
        setMitigarTodoParadoxoMana(spellDataObj.mitigarTodoParadoxoMana !== undefined ? spellDataObj.mitigarTodoParadoxoMana : false);
        setManaOpcional(spellDataObj.manaOpcional || 0);

        console.log('Dados da magia carregados com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao carregar dados da magia do localStorage:', error);
      // Opcional: chamar resetCalculadora() aqui se o carregamento falhar
    }
  }, []);


  const resetCalculadora = React.useCallback(() => {
    setPage(1);
    setGnose(1);
    setNivelArcana(1);
    setNivelRequerido(1);
    setMagiasAtivas(0);
    setSpellType("improvisado");
    setRegente(true);
    setPotencia(1);
    setDuracao(1);
    setEscala(1);
    setAlcance("toque");
    setTempoConjuracao(1);
    setCurrentFP("potencia");
    setPotenciaElevada(false);
    setDuracaoElevada(false);
    setEscalaElevada(false);
    setAlcanceElevado(false);
    setTempoConjuracaoElevada(false);
    setExtraElevacoes(0);
    setIsCombinado(0);
    setYantras(0);
    setUsouFdV(false);
    setMitigarDadosParadoxoMana(0);
    setMitigarTodoParadoxoMana(false);
    setManaOpcional(0);
    setCustoMana(0);
    setCustoVontade(0);
    setCustoElevacoes(0);
    setParadaDeDados(0);
    setTotalDadosParadoxo(0);
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
    // Efeito para Calcular Parada de Dados
    setParadaDeDados(calcularParadaDeDados());
  }, [
    calcularParadaDeDados,
    // Todas as dependências que calcularParadaDeDados *realmente* precisa
    // já estão no seu useCallback, então basta a função em si.
  ]);

  React.useEffect(() => {
    // Efeito para controle do gasto de FV
    setCustoVontade(usouFV ? 1 : 0);
  }, [usouFV]); // regente não afeta custoVontade aqui

  React.useEffect(() => {
    // Efeito para Calcular custo de mana
    setCustoMana(Math.max(0, calcularGastoMana()));
  }, [calcularGastoMana]); // setCustoMana não é uma dependência necessária aqui

  React.useEffect(() => {
    // Efeito para mitigar todo o paradoxo com mana
    if (mitigarTodoParadoxoMana) {
      const paradoxoDados = calcularDadosParadoxo();
      setMitigarDadosParadoxoMana(paradoxoDados);
    } else {
      // Se desmarcado, resetar a mitigação, a menos que haja um valor que o usuário queira manter
      setMitigarDadosParadoxoMana(0); // Ou deixar o valor anterior se for o caso
    }
  }, [mitigarTodoParadoxoMana, calcularDadosParadoxo]);

  React.useEffect(() => {
    // Efeito para calcular total de dados de paradoxo
    setTotalDadosParadoxo(Math.max(0, calcularTotalDadosParadoxo()));
  }, [calcularTotalDadosParadoxo]); // Dependências da função já no useCallback


React.useEffect(() => {
    // Efeito para calcular total de Elevações
    const custoPorExcessomMagiasAtivas = magiasAtivas >= gnose ? ((1 + magiasAtivas) - gnose) : 0;
    let totalElevacoesCalculadas = 0;
    if (potenciaElevada) totalElevacoesCalculadas++;
    if (duracaoElevada) totalElevacoesCalculadas++;
    if (escalaElevada) totalElevacoesCalculadas++;
    if (tempoConjuracaoElevada) totalElevacoesCalculadas++;
    if (alcanceElevado) totalElevacoesCalculadas += 1;
    totalElevacoesCalculadas += extraElevacoes; 
    totalElevacoesCalculadas += custoPorExcessomMagiasAtivas; 
    setCustoElevacoes(totalElevacoesCalculadas);

}, [
    potenciaElevada, duracaoElevada, escalaElevada,
    tempoConjuracaoElevada, extraElevacoes,
    alcanceElevado, magiasAtivas, gnose 
]);
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
