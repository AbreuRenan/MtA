import React, { useContext, useMemo } from "react";
import styles from "../../styles/spellcalc.module.css";
import { AppContext } from "../../AppContext";
import { useAppSpellContext } from "../../AppSpellContext";
import { validateYantra, calculateUsedSlots, extractYantraCosts } from "../../js/yantraLogic";

export default function YantraDataComponent(props) {
  const { gnose, nivelArcana, arcana, arcanasExtras = [], page, setYantras, yantras = [] } = props;
  const { userData } = useContext(AppContext);
  const { yantrasList, isLoading } = useAppSpellContext();

  // Garantir que yantras seja um array de objetos válidos
  const selectedYantras = Array.isArray(yantras) ? yantras.filter(Boolean) : [];

  function returnMaxYantrasPerGnose(gnoseValue) {
    const gnoseCelling = Math.ceil(gnoseValue / 2) + 1;
    return Math.max(0, gnoseCelling);
  }

  const maxSlots = returnMaxYantrasPerGnose(gnose);
  const usedSlots = calculateUsedSlots(selectedYantras);
  const availableSlots = Math.max(0, maxSlots - usedSlots);

  const availableYantras = useMemo(() => {
    if (!yantrasList || !userData) return [];
    if (userData.role === "narrador") return yantrasList;
    return yantrasList.filter(y => y.conhecidoPor && y.conhecidoPor.includes(userData.nome));
  }, [yantrasList, userData]);

  const contextAtual = useMemo(() => ({
    fatoresMagia: {
      Gnosis: gnose,
      Arkanum: nivelArcana,
      arcana: arcana,
      [arcana]: nivelArcana,
      ...arcanasExtras.reduce((acc, curr) => {
        acc[curr.arcana] = curr.nivelArcana;
        return acc;
      }, {})
    },
    poolYantras: selectedYantras
  }), [gnose, nivelArcana, arcana, arcanasExtras, selectedYantras]);

  const handleAddYantra = (e) => {
    const yantraId = e.target.value;
    if (!yantraId) return;
    const selectedObj = availableYantras.find(y => y.id === yantraId);
    if (selectedObj) {
      const yantraWithSelection = { ...selectedObj, selectedOptions: {} };
      if (selectedObj.efeitosDinamicos) {
        selectedObj.efeitosDinamicos.forEach((ef, index) => {
          if (ef.tipoVariacao === 'SELECAO_VARIAVEL') {
            yantraWithSelection.selectedOptions[index] = 0;
          }
        });
      }
      setYantras([...selectedYantras, yantraWithSelection]);
    }
    // Reseta o select
    e.target.value = "";
  };

  const handleRemoveYantra = (index) => {
    const newYantras = [...selectedYantras];
    newYantras.splice(index, 1);
    setYantras(newYantras);
  };

  const handleOptionChange = (yantraIndex, effectIndex, newOptionIndex) => {
    const newYantras = [...selectedYantras];
    const yantra = { ...newYantras[yantraIndex] };
    yantra.selectedOptions = { ...yantra.selectedOptions, [effectIndex]: Number(newOptionIndex) };
    newYantras[yantraIndex] = yantra;
    setYantras(newYantras);
  };

  const getSpecificYantraCost = (yantra) => {
    const costs = extractYantraCosts([yantra]);
    return costs.SLOT_YANTRA || 0;
  };

  if (isLoading) {
    return (
      <div className="page" data-page={page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
        <p>Carregando Yantras...</p>
      </div>
    );
  }

  return (
    <div className="page" data-page={page}>
      <div className={styles.spellCalcHeader}>
        <h1>Seleção de Yantras</h1>
        <p style={{ color: 'var(--amarelo)', fontSize: '0.9rem', marginTop: '5px' }}>
          Slots: {usedSlots} / {maxSlots} utilizados
        </p>
      </div>

      <div className={styles.yantraData} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {/* Lista de Yantras Selecionados */}
        {selectedYantras.map((yantra, index) => (
          <div key={`${yantra.id}-${index}`} className={styles.yantraAdded}>
            <div style={{ flex: 1 }}>
              <strong style={{ color: 'white', display: 'block' }}>{yantra.nome}</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--amarelo)' }}>
                {yantra.tipo || 'Ferramenta Dedicada'} | Custo: {getSpecificYantraCost(yantra)} Slot(s)
              </span>
              {(yantra.descricaoEfeito || yantra.efeitoExtra) && (
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginTop: '2px' }}>
                  Efeito: {yantra.descricaoEfeito || yantra.efeitoExtra}
                </span>
              )}

              {(yantra.efeitosDinamicos && yantra.efeitosDinamicos.some(ef => ef.tipoVariacao === 'SELECAO_VARIAVEL')) && (
                <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
                  {yantra.efeitosDinamicos.map((ef, efIndex) => {
                    if (ef.tipoVariacao === 'SELECAO_VARIAVEL' && ef.opcoes) {
                      return (
                        <div key={efIndex} style={{ marginBottom: '5px' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--amarelo)', display: 'block', marginBottom: '2px' }}>Variação de Efeito</label>
                          <select
                            value={yantra.selectedOptions ? (yantra.selectedOptions[efIndex] || 0) : 0}
                            onChange={(e) => handleOptionChange(index, efIndex, e.target.value)}
                            style={{ width: '100%', padding: '6px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--separador)', borderRadius: '4px', fontSize: '0.85rem' }}
                          >
                            {ef.opcoes.map((op, opIndex) => (
                              <option key={opIndex} value={opIndex} style={{ color: 'black' }}>
                                {op.rotulo || `Opção ${opIndex + 1}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
            <button
              onClick={() => handleRemoveYantra(index)}
              style={{ background: 'rgba(255,0,0,0.2)', color: 'var(--vermelho)', border: '1px solid rgba(255,0,0,0.5)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Remover
            </button>
          </div>
        ))}

        {selectedYantras.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', margin: '10px 0' }}>Nenhum Yantra selecionado.</p>
        )}

        {/* Dropdown para Adicionar Novo Yantra */}
        {availableSlots > 0 ? (
          <div style={{ marginTop: '10px' }}>
            <label style={{ color: 'var(--amarelo)', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Adicionar Yantra (Disponível: {availableSlots} slots)</label>
            <select
              onChange={handleAddYantra}
              defaultValue=""
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px dashed var(--amarelo)',
                color: 'white',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <option value="" disabled>Selecione para adicionar...</option>
              {availableYantras.map(yantra => {
                const yantraAsAdded = { ...yantra, selectedOptions: {} };
                if (yantraAsAdded.efeitosDinamicos) {
                  yantraAsAdded.efeitosDinamicos.forEach((ef, i) => {
                    if (ef.tipoVariacao === 'SELECAO_VARIAVEL') yantraAsAdded.selectedOptions[i] = 0;
                  });
                }

                const custo = getSpecificYantraCost(yantraAsAdded);
                const doesntFit = custo > availableSlots;

                const validation = validateYantra(yantraAsAdded, contextAtual);
                const isInvalid = !validation.isValid;
                const reason = validation.reason;

                const disabled = doesntFit || isInvalid;
                let label = `${yantra.nome} (${custo} Slot${custo > 1 ? 's' : ''})`;

                if (doesntFit) label += ' - Faltam Slots';
                else if (isInvalid) label += ` - ${reason}`;

                return (
                  <option key={yantra.id} value={yantra.id} disabled={disabled} style={{ color: disabled ? 'gray' : 'black' }}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '10px', color: 'var(--vermelho)', padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '4px', border: '1px solid rgba(255,0,0,0.3)' }}>
            Limite de Slots de Yantra atingido para a sua Gnose atual.
          </div>
        )}
      </div>
    </div>
  );
}
