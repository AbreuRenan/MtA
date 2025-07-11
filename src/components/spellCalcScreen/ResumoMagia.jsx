import React from "react";
import styles from "../../styles/spellcalc.module.css";
import { AppContext } from "../../AppContext";

export default function ResumoMagia(props) {
  const [manaDisponivel, setManaDisponivel] = React.useState(0);
  const [FVDisponivel, setFVDisponivel] = React.useState(0);
  const { userData } = React.useContext(AppContext);
  const {
    gnose,
    potencia,
    custoMana,
    custoVontade: custoFV,
    calcularElevacoesExcedentes,
    currentFP,
    calcularElevacoesTotais,
    escala,
    duracao,
    escalaElevada,
    duracaoElevada,
    paradaDeDados,
    tempoConjuracao,
    tempoConjuracaoElevada,
    totalDadosParadoxo,
  } = props;

  function calcManaDisponivel() {
    const initialMana = userData.mana.max - userData.mana.usado;
    return initialMana - custoMana;
  }
  React.useEffect(() => {
    setManaDisponivel(calcManaDisponivel());
  }, [custoMana, manaDisponivel]);

  function calcFVDisponivel() {
    const initialFV = userData.fv.max - userData.fv.usado;
    return initialFV - custoFV;
  }
  React.useEffect(() => {
    setFVDisponivel(calcFVDisponivel());
  }, [custoFV, FVDisponivel]);

  function calcularDuracaoPadrao(duracao) {
    if (duracao === 1) return 1;
    if (duracao === 2) return 2;
    if (duracao === 3) return 3;
    if (duracao === 4) return 5;
    if (duracao === 5) return 10;
    if (duracao >= 6) return (duracao - 4) * 10;
  }
  const fatoresDeTempoConjuracaoPorGnose = [180, 60, 30, 10, 1];
  const textoDuracaoPadrao = calcularDuracaoPadrao(duracao);
  const textoDuracaoElevada = [
    "1 Cena/Hora",
    "1 Dia",
    "1 Semana",
    "1 Mês",
    "1 Ano",
    "Indeterminada",
  ];
  const textoEscalaPadrao = {
    alvos: ["1 Alvo", "2 Alvos", "4 Alvos", "8 Alvos", "16 Alvos"],
    tamanhos: [5, 6, 7, 8, 9],
    area: [
      "Raio de 1 metro",
      "Sala pequena",
      "Sala grande",
      "Andar de uma casa",
      "Salão ou Casa pequena",
    ],
  };
  const textoEscalaElevada = {
    alvos: [5 * 2 ** (escala - 1)],
    tamanhos: escala * 5,
    area: [
      "Edifício Pequeno",
      "Depósito Pequeno",
      "Depósito Grande",
      "Fábrica Pequena",
      "Fábrica Grande",
      "Vizinhança",
    ],
  };

  function exibirDuracao() {
    let index = Math.max(-1, duracao - 1);
    if (duracaoElevada) {
      index = index >= 6 ? 5 : index;
      return textoDuracaoElevada[index];
    }
    return `${textoDuracaoPadrao} ${duracao === 1 ? "Turno" : "Turnos"}`;
  }

  function exibirEscala() {
    let index = Math.max(-1, escala - 1);
    let texto = {};
    if (escalaElevada) {
      index = index >= 6 ? 5 : index;
      texto = {
        alvos: `${textoEscalaElevada.alvos} Alvos`,
        tamanhos: textoEscalaElevada.tamanhos,
        area: index >= 6 ? "Fora de Escala" : textoEscalaElevada.area[index],
      };
      return texto;
    } else {
      index = index >= 5 ? "fora de escala" : index;
      if (index === "fora de escala") {
        return {
          alvos: "Fora de Escala",
          tamanhos: "Fora de Escala",
          area: "Fora de Escala",
        };
      }
      texto = {
        alvos: textoEscalaPadrao.alvos[index],
        tamanhos: textoEscalaPadrao.tamanhos[index],
        area: textoEscalaPadrao.area[index],
      };
      return texto;
    }
  }
  function exibirElevacoes() {
    return calcularElevacoesTotais();
  }
  function exibirTempoConjuracao() {
    const tempoPorGnose = Math.ceil(gnose / 2) - 1;
    const maxNivelTempoConjuracao = currentFP === "tempoConjuracao" ? 100 : 6;
    if (tempoConjuracaoElevada) return "AGORA!";
    const fatorDeTempoDoMago = fatoresDeTempoConjuracaoPorGnose[tempoPorGnose];
    const tempoTotal =
      fatorDeTempoDoMago * Math.min(maxNivelTempoConjuracao, tempoConjuracao);
    const horas = Math.floor(tempoTotal / 60);
    const minutosRestantes = tempoTotal % 60;
    const textoHoras = horas > 0 ? `${horas}h` : "";
    const textoMin = minutosRestantes > 0 ? `${minutosRestantes}min` : "";
    return `${textoHoras}${textoMin}`;
  }
  function fazBarrinhas(valorTotal) {
    let string = "";
    if (valorTotal === 0) {
      return (string = "");
    }
    for (let i = 0; i < valorTotal; i++) {
      string += "|";
    }
    return string;
  }
  return (
    <>
      <div>
        <center>
          <h2>Resumo da Magia</h2>
        </center>
        <div className={styles.resumoMagia}>
          <div className={styles.fatoresCol}>
            <p className={styles.potencia}>
              Potência:<b> {potencia}</b>
            </p>
            <p className={styles.duracao}>
              Duração:<b> {exibirDuracao()}</b>
            </p>
            <p className={styles.alvos}>
              Alvos:<b> {exibirEscala().alvos}</b>
            </p>
            <p className={styles.area}>
              Área:<b> {exibirEscala().area}</b>
            </p>
            <p className={styles.tamanho}>
              Tamanho:<b> {exibirEscala().tamanhos}</b>
            </p>
          </div>
          <div className={styles.dadosCol}>
            <p className={styles.paradaDados}>
              Parada de Dados:<b> {paradaDeDados}</b>
            </p>
            <p className={styles.tempoConjuracao}>
              Tempo Conjuração:<b> {exibirTempoConjuracao()}</b>
            </p>
            <p className={styles.custoMana}>
              Custo de Mana:<b> {custoMana}</b>
            </p>
            {exibirElevacoes() >= 0 && (
              <p className={`${styles.elevacao} ${styles.verde}`}>
                Elevações Pra Gastar:<b> {exibirElevacoes()}</b>
              </p>
            )}
            {exibirElevacoes() < 0 && (
              <p className={`${styles.elevacao} ${styles.vermelho}`}>
                Elevações Passando:<b> {calcularElevacoesExcedentes()}</b>
              </p>
            )}
            <p className={styles.dadosParadoxo}>
              Dados de Paradoxo:<b> {totalDadosParadoxo}</b>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
