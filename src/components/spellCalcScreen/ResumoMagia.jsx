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
    alcance,

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
    getWhatsAppText,
  } = props;

  const [copiado, setCopiado] = React.useState(false);

  const handleCopyWhatsApp = async () => {
    try {
      await navigator.clipboard.writeText(getWhatsAppText());
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <h2 style={{ margin: 0 }}>Resumo da Magia</h2>
          <button
            onClick={handleCopyWhatsApp}
            title="Copiar p/ WhatsApp"
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: copiado ? '#4CAF50' : '#d4d4d4',
              transition: 'color 0.2s'
            }}
          >
            {copiado ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            )}
          </button>
        </div>
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
            <p className={styles.tooltipParent}>
              - Tamanho:<b> {exibirEscala.tamanhos}</b>
              <span className={styles.tooltip}> {exibirTextoPorTamanho}</span>
            </p>
            {/* <p className={alcance !== "toque" ? styles.elevada : styles.notelevada}>Alcance: <b> {alcance}</b></p> */}
          </div>
          <div className={styles.dadosCol}>
            <p className={styles.paradaDados}>
              Parada de Dados:<b> {paradaDeDados}d</b>
            </p>

            <p className={styles.custoMana}>
              Custo de Mana:<b> {custoMana}</b>
            </p>
            <p className={styles.custoVontade}>
              Custo de Vontade:<b> {custoVontade}</b>
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
