import React from "react";
import styles from "../../styles/spellcalc.module.css";

export default function ResumoMagia(props) {
  const {
    potencia,
    custoMana,
    calcularElevacoesExcedentes,
    calcularDadosParadoxo,
    calcularElevacoesTotais,
    escala,
    duracao,
    escalaElevada,
    duracaoElevada,
    paradaDeDados,
    totalDadosParadoxo,
  } = props;
  function calcularDuracaoPadrao(duracao) {
    if (duracao === 1) return 1;
    if (duracao === 2) return 2;
    if (duracao === 3) return 3;
    if (duracao === 4) return 5;
    if (duracao === 5) return 10;
    if (duracao >= 6) return (duracao - 4) * 10;
  }

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
    alvos: [
      5 * (2**(escala - 1))
    ],
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
  const alvos = exibirEscala().alvos;
  const tamanhos = exibirEscala().tamanhos;
  const area = exibirEscala().area;

  return (
    <>
      <div>
        <center>
          <h2>Resumo da Magia</h2>
        </center>
        <div className={styles.resumoMagia}>
          <div className={styles.fatoresCol}>
            <p className={styles.potencia}>Potência: {potencia}</p>
            <p className={styles.duracao}>Duração: {exibirDuracao()}</p>
            <p className={styles.alvos}>Alvos: {alvos}</p>
            <p className={styles.area}>Área: {area}</p>
            <p className={styles.tamanho}>Tamanho: {tamanhos}</p>
          </div>
          <div className={styles.dadosCol}>
            <p className={styles.paradaDados}>Parada de Dados: {paradaDeDados}</p>
            <p className={styles.custoMana}>Custo de Mana: {custoMana}</p>
            {exibirElevacoes() >= 0 && (<p className={`${styles.elevacao} ${styles.verde}`}>
                Elevações Pra Gastar: {exibirElevacoes()}
              </p>
            )}
            {exibirElevacoes() < 0 && (<p className={`${styles.elevacao} ${styles.vermelho}`}>Elevações Passando: {calcularElevacoesExcedentes()}</p>
            )}
            <p className={styles.dadosParadoxo}>Dados de Paradoxo: {totalDadosParadoxo}</p>
          </div>
        </div>
      </div>
    </>
  );
}
