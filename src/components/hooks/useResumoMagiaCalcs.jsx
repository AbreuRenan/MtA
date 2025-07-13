import React from "react";
import { AppContext } from "../../AppContext";

export default function useResumoMagiaCalcs(
  gnose,
  potencia,
  custoMana,
  custoVontade,
  currentFP,
  calcularElevacoesTotais, // Esta função virá do useSpellCalculator
  escala,
  duracao,
  escalaElevada,
  duracaoElevada,
  tempoConjuracao,
  tempoConjuracaoElevada
) {
  const { userData } = React.useContext(AppContext);

  const calcularDuracaoPadrao = React.useCallback(() => {
    if (duracao === 1) return 1;
    if (duracao === 2) return 2;
    if (duracao === 3) return 3;
    if (duracao === 4) return 5;
    if (duracao === 5) return 10;
    if (duracao >= 6) return (duracao - 4) * 10;
    return 0;
  }, [duracao]);

  const calcManaDisponivel = React.useCallback(() => {
    const initialMana = userData.mana.max - userData.mana.usado;
    return initialMana - custoMana;
  }, [userData.mana.max, userData.mana.usado, custoMana]);

  const calcFVDisponivel = React.useCallback(() => {
    const initialFV = userData.fv.max - userData.fv.usado;
    return initialFV - custoVontade;
  }, [userData.fv.max, userData.fv.usado, custoVontade]);

  const fatoresDeTempoConjuracaoPorGnose = React.useMemo(
    () => [180, 60, 30, 10, 1],
    []
  );
  const textoDuracaoPadrao = React.useMemo(
    () => calcularDuracaoPadrao(),
    [calcularDuracaoPadrao]
  );
  const textoDuracaoElevada = React.useMemo(
    () => [
      "1 Cena/Hora",
      "1 Dia",
      "1 Semana",
      "1 Mês",
      "1 Ano",
      "Indeterminada",
    ],
    []
  );
  const textoEscalaPadrao = React.useMemo(
    () => ({
      alvos: ["1 Alvo", "2 Alvos", "4 Alvos", "8 Alvos", "16 Alvos"],
      tamanhos: escala + 4,
      area: [
        "Raio de 1 metro",
        "Sala pequena",
        "Sala grande",
        "Andar de uma casa",
        "Salão ou Casa pequena",
      ],
    }),
    [escala]
  );
  const textoEscalaElevada = React.useMemo(
    () => ({
      alvos: 5 * Math.max(1,(2 ** Math.max(0, escala - 1))),
      tamanhos: escala * 5,
      area: [
        "Edifício Pequeno",
        "Depósito Pequeno",
        "Depósito Grande",
        "Fábrica Pequena",
        "Fábrica Grande",
        "Vizinhança",
      ],
    }),
    [escala]
  );
  const textoParaTamanhos = React.useMemo(
    () => ({
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
      25: "Caminhão basculante, Casa flutuante, Ônibus de turismo, Caminhão com carreta",
      30: "Baleia",
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
    }),
    []
  );

  const exibirTextoPorTamanho = React.useMemo(() => {
    const { tamanhos } = escalaElevada ? textoEscalaElevada : textoEscalaPadrao;
    let tamanhosEncontrados = {}

    function lookupTamanho(tamanhos, tamanhoProcurado) {
      if (tamanhos[tamanhoProcurado]) {
        tamanhosEncontrados = {
          valor: tamanhos[tamanhoProcurado],
          anterior: null,
          posterior: null,
        };
        return tamanhosEncontrados.valor
      }
      const chaves = Object.keys(tamanhos).map(Number).sort((a, b) => a - b);

      let anterior = null;
      let posterior = null;
      for (let i = 0; i < chaves.length; i++) {
        const chave = chaves[i];
        if (chave < tamanhoProcurado) {
          anterior = chave;
        } else if (chave > tamanhoProcurado) {
          posterior = chave;
          break;
        }
      }

      tamanhosEncontrados = {
        valor: null,
        anterior:
          anterior !== null
            ? { chave: anterior, valor: tamanhos[anterior] }
            : null,
        posterior:
          posterior !== null
            ? { chave: posterior, valor: tamanhos[posterior] }
            : null,
      };

      return `Maior que:${tamanhosEncontrados.anterior.valor}  \nMenor que: ${tamanhosEncontrados.posterior.valor}`
    }
  }, [
    escalaElevada,
    textoEscalaElevada,
    textoEscalaPadrao,
    textoParaTamanhos,
    escala,
  ]);

  const exibirPotencia = React.useMemo(() => {
    return Math.max(0, potencia);
  }, [potencia]);

  const exibirDuracao = React.useMemo(() => {
    let index = Math.max(0, duracao - 1);
    if (duracaoElevada) {
      index = Math.min(index, textoDuracaoElevada.length - 1);
      return textoDuracaoElevada[index];
    }
    return `${textoDuracaoPadrao} ${duracao === 1 ? "Turno" : "Turnos"}`;
  }, [duracao, duracaoElevada, textoDuracaoPadrao, textoDuracaoElevada]);

  const exibirEscala = React.useMemo(() => {
    let index = Math.max(0, escala - 1);
    let texto = {};
    if (escalaElevada) {
      index = Math.min(index, textoEscalaElevada.area.length - 1);
      texto = {
        alvos: `${textoEscalaElevada.alvos} Alvos`,
        tamanhos: textoEscalaElevada.tamanhos,
        area: textoEscalaElevada.area[index], // area continua a igual mesmo em niveis muito altos, para aumentar a área é necessário magia Imperial, não coberta por este app
      };
      return texto;
    }
    if (index >= textoEscalaPadrao.alvos.length) {
      texto = {
        alvos: "Fora de Escala",
        tamanhos: "Fora de Escala",
        area: "Fora de Escala",
      };
      return texto;
    }

    texto = {
      alvos: textoEscalaPadrao.alvos[index],
      tamanhos: textoEscalaPadrao.tamanhos,
      area: textoEscalaPadrao.area[index],
    };
    return texto;
  }, [escala, escalaElevada, textoEscalaPadrao, textoEscalaElevada]);

  const exibirElevacoes = React.useMemo(() => {
    return calcularElevacoesTotais();
  }, [calcularElevacoesTotais]);

  const exibirTempoConjuracao = React.useMemo(() => {
    const indexDeTempoConjuracaoBaseadoNaGnose = Math.max(
      0,
      Math.ceil(gnose / 2) - 1
    ); // Ajustado para índice
    const maxNivelTempoConjuracao = currentFP === "tempoConjuracao" ? 100 : 6;
    if (tempoConjuracaoElevada) return "AGORA!";

    const fatorDeTempoDoMago =
      fatoresDeTempoConjuracaoPorGnose[indexDeTempoConjuracaoBaseadoNaGnose];
    const tempoTotal =
      (fatorDeTempoDoMago || 1) *
      Math.min(maxNivelTempoConjuracao, tempoConjuracao);

    const horas = Math.floor(tempoTotal / 60);
    const minutosRestantes = tempoTotal % 60;
    const textoHoras = horas > 0 ? `${horas}h` : "";
    const textoMin = minutosRestantes > 0 ? `${minutosRestantes}min` : "";

    if (tempoTotal === 0) return "0min";
    return `${textoHoras}${textoMin}`.trim();
  }, [
    gnose,
    currentFP,
    tempoConjuracaoElevada,
    tempoConjuracao,
    fatoresDeTempoConjuracaoPorGnose,
  ]);

  const manaDisponivelCalculado = React.useMemo(() => {
    return calcManaDisponivel();
  }, [calcManaDisponivel]);

  const FVDisponivelCalculado = React.useMemo(() => {
    return calcFVDisponivel();
  }, [calcFVDisponivel]);

  return {
    exibirPotencia,
    exibirDuracao,
    exibirEscala,
    exibirElevacoes,
    exibirTempoConjuracao,
    exibirTextoPorTamanho,
    manaDisponivel: manaDisponivelCalculado,
    FVDisponivel: FVDisponivelCalculado,
  };
}
