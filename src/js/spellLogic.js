/**
 * Lógica pura para o sistema de magia de Mage: The Awakening 2e.
 * Este arquivo não depende do React e pode ser testado isoladamente.
 */

export const SPELL_CONSTANTS = {
  TEXTO_DURACAO_ELEVADA: [
    "1 Cena/Hora",
    "1 Dia",
    "1 Semana",
    "1 Mês",
    "1 Ano",
    "Indeterminada",
  ],
  FATORES_TEMPO_POR_GNOSE: [180, 60, 30, 10, 1],
  TEXTO_TAMANHOS: {
    1: "Objeto ou ferramenta de mão, Roedor",
    2: "Bebê, Gato, Espada, Espingarda, Skate",
    3: "Cachorro médio, Criança, Janela, Ferramenta de duas mãos, Banqueta",
    4: "Lança, Adolescente, Cadeira",
    5: "Adulto, Porta, Patinete elétrico",
    6: "Adulto muito grande, Veado, Bicicleta",
    7: "Jacaré, Urso, Moto, Caixão",
    8: "Porta de cofre, Carro compacto",
    10: "Carro esportivo, Alce",
    12: "Tubarão, Carro de luxo",
    15: "SUV, Elefante",
    20: "Avião leve, Iate, Caminhão semirreboque",
    25: "Caminhão basculante, Ônibus de turismo",
    30: "Baleia, Caminhão com carreta",
    35: "Baleia Azul pequena, Trem de carga curto",
    40: "Baleia Azul adulta, Locomotiva",
    45: "Trem de carga longo, Avião de carga pequeno",
    50: "Avião comercial médio (Boeing 737)",
    55: "Avião comercial grande (Boeing 777)",
    60: "Jato intercontinental, Submarino pequeno",
    65: "Navio de carga médio",
    70: "Navio de guerra (fragata)",
    75: "Destróier naval, Avião cargueiro militar",
    80: "Navio de cruzeiro pequeno",
    85: "Porta-aviões pequeno",
    90: "Porta-aviões médio, Navio tanque",
    95: "Porta-aviões nuclear, Navio de cruzeiro gigante",
    100: "Superpetroleiro, Ilha artificial flutuante",
  }
};

/**
 * Calcula elevações grátis baseadas no nível da Arcana e o nível requerido pela prática.
 */
export function calculateFreeReach(nivelArcana, nivelRequerido, spellType = "improvisado") {
  const nivelArcanaEfetivo = spellType === "rote" ? 5 : nivelArcana;
  return Math.max(0, nivelArcanaEfetivo - nivelRequerido + 1);
}

/**
 * Calcula a penalidade de dados baseada nos fatores de feitiço (Potência, Duração, Escala).
 */
export function calculateFactorPenalty({ potencia, duracao, escala, currentFP, nivelArcana }) {
  let penalidadePotencia = potencia === 1 ? 0 : (potencia - 1) * 2;
  let penalidadeDuracao = duracao === 1 ? 0 : (duracao - 1) * 2;
  let penalidadeEscala = escala === 1 ? 0 : (escala - 1) * 2;

  if (currentFP === "potencia") penalidadePotencia = potencia <= nivelArcana ? 0 : (potencia - nivelArcana) * 2;
  if (currentFP === "duracao") penalidadeDuracao = duracao <= nivelArcana ? 0 : (duracao - nivelArcana) * 2;
  if (currentFP === "escala") penalidadeEscala = escala <= nivelArcana ? 0 : (escala - nivelArcana) * 2;

  return Math.max(0, penalidadePotencia) + Math.max(0, penalidadeDuracao) + Math.max(0, penalidadeEscala);
}

/**
 * Calcula a parada de dados final.
 */

export function calculateDicePool(params) {
  const {
    gnose, nivelArcana, yantras, dadosExtras, isCombinado, usouFV,
    tempoConjuracao, tempoConjuracaoElevada, currentFP, factorPenalty, fatorFdv = 0
  } = params;

  let dadosIniciais = gnose + nivelArcana + yantras + dadosExtras;
  const combinadoPenalty = isCombinado * 2;
  let totalDados = dadosIniciais - factorPenalty - combinadoPenalty;
  
  if (usouFV) totalDados += (3 + fatorFdv);

  // Lógica do Tempo de Conjuração
  // Se não houver tempo elevado, o bônus de dados por tempo é (tempoConjuracao - 1).
  // Não imporemos um limite arbitrário aqui — chamadores podem passar um valor já limitado
  // (por exemplo, `e_tempoConjuracao` calculado por hooks que consideram `tempoExceder`).
  if (!tempoConjuracaoElevada) {
    totalDados += Math.max(0, tempoConjuracao - 1);
  }

  return totalDados;
}

/**
 * Calcula dados de paradoxo gerados por elevações excedentes.
 */
export function calculateParadoxDice(gnose, freeReach, totalReach) {
  const dadosPorGnose = Math.ceil(gnose / 2);
  const excessReach = Math.max(0, totalReach - freeReach);
  return excessReach * dadosPorGnose;
}

/**
 * Calcula o gasto de mana.
 */
export function calculateManaCost(params) {
  const {
    alcance, regente, duracao, duracaoElevada, manaOpcional, 
    paradoxDice, mitigarTodoParadoxo, mitigarDadosParadoxo,
    spellType = "improvisado"
  } = params;

  let totalMana = 0;
  if (alcance === "simpatico") totalMana += 1;
  if (spellType === "improvisado" && !regente) totalMana += 1;
  if (duracaoElevada && duracao >= 6) totalMana += 1;
  
  totalMana += manaOpcional;

  let manaParaParadoxo = mitigarTodoParadoxo ? paradoxDice : Math.max(0, mitigarDadosParadoxo);
  totalMana += manaParaParadoxo;

  return Math.max(0, totalMana);
}

/**
 * Formata os fatores para exibição textual.
 */
export function formatSpellFactors(params) {
  const {
    potencia, duracao, duracaoElevada, escala, escalaElevada, gnose, currentFP, tempoConjuracao, tempoConjuracaoElevada,
    efeitosYantra = {}
  } = params;
  const e_potencia = potencia + (efeitosYantra.fatorPotencia || 0);
  const e_duracao = duracao + (efeitosYantra.fatorDuracao || 0);
  const e_escala = escala + (efeitosYantra.fatorEscala || 0);

  // Duração
  const calculateDuracaoPadrao = (d) => {
    if (d === 1) return 1;
    if (d === 2) return 2;
    if (d === 3) return 3;
    if (d === 4) return 5;
    if (d === 5) return 10;
    return (d - 4) * 10;
  };

  let textoDuracao = "";
  if (duracaoElevada || efeitosYantra.duracaoElevada) {
    const index = Math.min(Math.max(0, e_duracao - 1), SPELL_CONSTANTS.TEXTO_DURACAO_ELEVADA.length - 1);
    textoDuracao = SPELL_CONSTANTS.TEXTO_DURACAO_ELEVADA[index];
  } else {
    const dPadrao = calculateDuracaoPadrao(e_duracao);
    textoDuracao = `${dPadrao} ${e_duracao === 1 ? "Turno" : "Turnos"}`;
  }

  // Escala
  const getEscalaData = (e, elevated) => {
    if (elevated) {
      return {
        alvos: 5 * Math.max(1, 2 ** Math.max(0, e - 1)),
        tamanhos: e * 5,
        area: ["Edifício Pequeno", "Depósito Pequeno", "Depósito Grande", "Fábrica Pequena", "Fábrica Grande", "Vizinhança"][Math.min(Math.max(0, e - 1), 5)] || "Área Gigantesca",
      };
    }
    return {
      alvos: ["1 Alvo", "2 Alvos", "4 Alvos", "8 Alvos", "16 Alvos"][Math.min(Math.max(0, e - 1), 4)] || "Fora de Escala",
      tamanhos: e + 4,
      area: ["Raio de 1 metro", "Sala pequena", "Sala grande", "Andar de uma casa", "Salão ou Casa pequena"][Math.min(Math.max(0, e - 1), 4)] || "Fora de Escala",
    };
  };

  const escalaData = getEscalaData(e_escala, escalaElevada || efeitosYantra.escalaElevada);
  const textoTamanho = SPELL_CONSTANTS.TEXTO_TAMANHOS[escalaData.tamanhos] || "Fora de Escala";

  // Tempo de Conjuração
  let textoTempo = "AGORA!";
  if (!(tempoConjuracaoElevada || efeitosYantra.tempoConjuracaoElevada)) {
    const gnoseIndex = Math.max(0, Math.ceil(gnose / 2) - 1);
    const fatorMago = SPELL_CONSTANTS.FATORES_TEMPO_POR_GNOSE[gnoseIndex] || 1;
    
    // Yantra: Exceder adiciona níveis ao limite máximo do Tempo de Conjuração
    const maxNivel = currentFP === "tempoConjuracao" ? 100 : (6 + (efeitosYantra.tempoExceder || 0));
    
    const maxTempoSugerido = Math.min(maxNivel, tempoConjuracao);
    
    // Yantra: Acelerar altera a quantidade final de tempo real gasto (horas/minutos)
    let tempoTotal = fatorMago * maxTempoSugerido;
    if (efeitosYantra.tempoAcelerar) {
        // Acelerar soma ou subtrai níveis da "escada de tempo".
        // Uma abordagem simples: ajusta o fatorMago ou diretamente os turnos.
        // Se a instrução do usuário é que aumenta/reduz tempo, podemos mudar a quantidade de minutos calculados:
        // Como Mago a cada passo do gráfico de tempo multiplica o tempo, a melhor abstração para "acelerar N níveis" é pular os passos do FATORES_TEMPO.
        const novoGnoseIndex = Math.max(0, gnoseIndex + efeitosYantra.tempoAcelerar);
        const novoFatorMago = SPELL_CONSTANTS.FATORES_TEMPO_POR_GNOSE[Math.min(novoGnoseIndex, 4)] || 1;
        tempoTotal = novoFatorMago * maxTempoSugerido;
    }
    
    const horas = Math.floor(tempoTotal / 60);
    const minutos = tempoTotal % 60;
    textoTempo = `${horas > 0 ? horas + 'h' : ''}${minutos > 0 ? minutos + 'min' : ''}`.trim() || "0min";
  }

  return {
    potencia: Math.max(0, e_potencia),
    duracao: textoDuracao,
    escala: escalaData,
    tamanho: textoTamanho,
    tempo: textoTempo
  };
}
