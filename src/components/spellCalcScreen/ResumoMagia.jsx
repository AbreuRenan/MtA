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

    potencia,
    duracao,
    escala,
    tempoConjuracao,
    currentFP,
    gnose,
    nivelArcana,
    nivelRequerido,
    yantras,
    usouFV,
    dadosExtras,
    isCombinado,
    extraElevacoes,
    calcularElevacoesGratis,
  } = props;

  const [copiado, setCopiado] = React.useState(false);

  const handleCopyWhatsApp = async () => {
    const pExtra = Math.max(0, potencia - 1);
    const pPenalty = currentFP === "potencia" ? Math.max(0, potencia - nivelArcana) * 2 : pExtra * 2;
    const pFP = currentFP === "potencia" ? " (Fator Primário)" : "";
    const pElevada = potenciaElevada ? " (E)" : "";

    const dExtra = Math.max(0, duracao - 1);
    const dPenalty = currentFP === "duracao" ? Math.max(0, duracao - nivelArcana) * 2 : dExtra * 2;
    const dFP = currentFP === "duracao" ? " (Fator Primário)" : "";
    const dElevada = duracaoElevada ? " (E)" : "";

    let tBonus = 0;
    if (!tempoConjuracaoElevada && currentFP !== "tempoConjuracao") {
      tBonus = Math.min(5, Math.max(0, tempoConjuracao - 1));
    } else if (!tempoConjuracaoElevada && currentFP === "tempoConjuracao") {
      tBonus = Math.max(0, tempoConjuracao - 1);
    }
    const tExtra = Math.max(0, tempoConjuracao - 1);
    const tFP = currentFP === "tempoConjuracao" ? " (Fator Primário)" : "";
    const tElevada = tempoConjuracaoElevada ? " (E)" : "";

    const eExtra = Math.max(0, escala - 1);
    const ePenalty = currentFP === "escala" ? Math.max(0, escala - nivelArcana) * 2 : eExtra * 2;
    const eFP = currentFP === "escala" ? " (Fator Primário)" : "";
    const eElevada = escalaElevada ? " (E)" : "";

    let textoSoma = `Arcano ${nivelArcana} + Gnose ${gnose}`;
    if (yantras > 0) textoSoma += ` + Yantras ${yantras}`;
    if (tBonus > 0) textoSoma += ` + Ritual ${tBonus}`;
    if (usouFV) textoSoma += ` + FDV 3`;
    if (dadosExtras > 0) textoSoma += ` + Dados Extras ${dadosExtras}`;

    const xSoma = nivelArcana + gnose + yantras + tBonus + (usouFV ? 3 : 0) + dadosExtras;
    const yPenalties = pPenalty + dPenalty + ePenalty + (isCombinado ? 2 : 0);

    let elevacoesList = [];
    if (potenciaElevada) elevacoesList.push("Potência");
    if (duracaoElevada) elevacoesList.push("Duração");
    if (tempoConjuracaoElevada) elevacoesList.push("Tempo de Conjuração");
    if (escalaElevada) elevacoesList.push("Escala");
    if (alcance !== 'toque') elevacoesList.push("Alcance");
    if (extraElevacoes > 0) elevacoesList.push(`Elevação Opcionais ${extraElevacoes}`);
    const textoElevacoesUsadas = elevacoesList.length > 0 ? ` (${elevacoesList.join(', ')})` : '';

    const texto = `
Nível da Prática: ${nivelRequerido}
Potência${pFP}${pElevada}: 1 + ${pExtra} (-${pPenalty}d)
Duração${dFP}${dElevada}: 1 + ${dExtra} (-${dPenalty}d) | ${exibirDuracao}
Tempo de conjuração${tFP}${tElevada}: Ritual 1 + ${tExtra} (+${tBonus}d)
Escala${eFP}${eElevada}: ${escala} | afeta Área (${exibirEscala.area}), Alvos e Tamanho (${exibirEscala.tamanhos})
Alcance: ${alcance.charAt(0).toUpperCase() + alcance.slice(1)}
Alvos: 1 + ${eExtra} (-${ePenalty}d)

${textoSoma}

Calculando: ${xSoma} - ${yPenalties} = ${paradaDeDados}

Parada de dados: ${paradaDeDados} dados

Elevações grátis: ${calcularElevacoesGratis()}
Elevações usadas: ${custoElevacoes}${textoElevacoesUsadas}
Dados paradoxo: ${totalDadosParadoxo}
Gasto de mana: ${custoMana}`;

    try {
      await navigator.clipboard.writeText(texto);
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
