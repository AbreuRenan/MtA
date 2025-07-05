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
    totalDadosParadoxo
  } = props;
  const textoDuracaoPadrao = [
    "1 Turno",
    "2 Turnos",
    "3 Turnos",
    "5 Turnos",
    "10 Turnos",
    "20 Turnos",
    "30 Turnos",
    "40 Turnos",
    "50 Turnos",
    "60 Turnos",
    "70 Turnos",
    "80 Turnos",
    "90 Turnos",
    "100 Turnos",
  ];
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
      "5 Alvos",
      "10 Alvos",
      "20 Alvos",
      "40 Alvos",
      "80 Alvos",
      "160 Alvos",
    ],
    tamanhos: escala * 5,
    area: [
      "Casa ou edifício grande ",
      "Depósito pequeno",
      "Depósito pequeno",
      "Fábrica pequena ou shopping",
      "Fábrica grande ou um quarteirão",
      "Campus alvo ou vizinhança",
    ],
  };

  function exibirDuracao() {
    let index = Math.max(-1, duracao - 1);
    if (duracaoElevada) {
      index = index >= 6 ? 5 : index;
      return textoDuracaoElevada[index];
    }
    return textoDuracaoPadrao[index];
  }

  function exibirEscala() {
    let index = Math.max(-1, escala - 1);
    let texto = {};
    if (escalaElevada) {
      index = index >= 6 ? 5 : index;
      texto = {
        alvos: textoEscalaElevada.alvos[index],
        tamanhos: textoEscalaElevada.tamanhos,
        area: textoEscalaElevada.area[index],
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
          <p className={styles.paradaDados}>Parada de Dados: {paradaDeDados}</p>
          <p className={styles.potencia}>Potência: {potencia}</p>
          <div className={styles.escadaGrid}>
            <p>Escala</p>
            <p className={styles.duracao}>Duração: {exibirDuracao()}</p>
            <p className={styles.alvos}>Alvos: {alvos}</p>
            <p className={styles.tamanho}>Tamanho Máx: {tamanhos}</p>
            <p className={styles.area}>Área: {area}</p>
          </div>

          <p className={styles.custoMana}>Custo de Mana: {custoMana}</p>

          {exibirElevacoes() >= 0 && (
            <p className={`${styles.elevacao} ${styles.verde}`}>
              Elevações Pra Gastar: {exibirElevacoes()}
            </p>
          )}
          {exibirElevacoes() < 0 && (
            <p className={`${styles.elevacao} ${styles.vermelho}`}>
              Elevações Passando: {calcularElevacoesExcedentes()}
            </p>
          )}

          <p className={styles.dadosParadoxo}>
            Dados de Paradoxo: {totalDadosParadoxo}
          </p>
        </div>
      </div>
    </>
  );
}
