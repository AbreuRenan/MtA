import React from "react";
import styles from "../../styles/spellcalc.module.css";

export default function ResumoMagia(props) {
  const {
    exibirPotencia,
    exibirDuracao,
    exibirEscala,
    exibirElevacoes,
    exibirTempoConjuracao,
    exibirTextoPorTamanho,
    manaDisponivel,
    FVDisponivel,

    potenciaElevada,
    duracaoElevada,
    escalaElevada,
    tempoConjuracaoElevada,

    paradaDeDados,
    custoMana,
    custoVontade,
    calcularElevacoesExcedentes,
    custoElevacoes,
    totalDadosParadoxo,
  } = props;

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
        <div className={styles.resumoDisponivel}></div>
        <center>
          <h2>Resumo da Magia</h2>
        </center>
        <div className={styles.resumoMagia}>
          <div className={styles.fatoresCol}>
            <p className={potenciaElevada ? styles.elevada : styles.notelevada}>
              Potência:<b> {exibirPotencia}</b>
            </p>
            <p className={duracaoElevada ? styles.elevada : styles.notelevada}>
              Duração:<b> {exibirDuracao}</b>
            </p>
            <p
              className={
                tempoConjuracaoElevada ? styles.elevada : styles.notelevada
              }
            >
              Tempo Conjuração:<b> {exibirTempoConjuracao}</b>
            </p>
            <p className={escalaElevada ? styles.elevada : styles.notelevada}>
              Escala ↴
            </p>
            <p>
              - Alvos:<b> {exibirEscala.alvos}</b>
            </p>
            <p>
              - Área:<b> {exibirEscala.area}</b>
            </p>
            <p>
              - Tamanho:<b> {exibirEscala.tamanhos}</b>
              <span className={styles.tooltip}> {exibirTextoPorTamanho}</span>
            </p>
          </div>
          <div className={styles.dadosCol}>
            <p className={styles.paradaDados}>
              Parada de Dados:<b> {paradaDeDados}d</b>
            </p>

            <p className={styles.custoMana}>
              Custo de Mana:<b> {custoMana}</b>
            </p>
            <p className={styles.manaDisponivel}>
              Mana Disponível:<b> {manaDisponivel}</b>
            </p>
            <p className={styles.fvDisponivel}>
              FV Disponível:<b> {FVDisponivel}</b>
            </p>
            <p>Elevações gastas:<b> {custoElevacoes}</b></p>
            {exibirElevacoes >= 0 && (
              <p className={`${styles.elevacao} ${styles.verde}`}>
                Elevações Pra Gastar:<b> {exibirElevacoes}</b>
              </p>
            )}
            {exibirElevacoes < 0 && (
              <p className={`${styles.elevacao} ${styles.vermelho}`}>Elevações Passando:<b> {calcularElevacoesExcedentes()}</b>
              </p>
            )}
            <p className={styles.dadosParadoxo}>
              Dados de Paradoxo:<b> {totalDadosParadoxo}d</b>
            </p>
            
          </div>
          
        </div>
      </div>
    </>
  );
}
