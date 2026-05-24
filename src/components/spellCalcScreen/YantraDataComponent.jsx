import React, { useContext, useEffect, useMemo, useState } from "react";
import styles from "../../styles/spellcalc.module.css";
import { AppContext } from "../../AppContext";
import { useAppSpellContext } from "../../AppSpellContext";

export default function YantraDataComponent(props) {
  const { gnose, page, setYantras, yantras = [] } = props;
  const { userData } = useContext(AppContext);
  const { yantrasList, isLoading } = useAppSpellContext();
  
  const qtdDeYantras = returnMaxYantrasPerGnose(gnose);
  
  const [yantraValues, setYantraValues] = useState(() => {
    const initialValues = Array.isArray(yantras) ? yantras.slice(0, qtdDeYantras) : [];
    while (initialValues.length < qtdDeYantras) {
      initialValues.push(null);
    }
    return initialValues;
  });

  useEffect(() => {
    const normalized = Array.isArray(yantras) ? yantras.slice(0, qtdDeYantras) : [];
    while (normalized.length < qtdDeYantras) {
      normalized.push(null);
    }

    const isSame = normalized.length === yantraValues.length && normalized.every((item, index) => item?.id === yantraValues[index]?.id);
    if (!isSame) {
      setYantraValues(normalized);
    }
  }, [yantras, qtdDeYantras, yantraValues]);

  function returnMaxYantrasPerGnose(gnose) {
    const gnoseCelling = Math.ceil(gnose / 2) + 1;
    return Math.max(0, gnoseCelling);
  }

  const availableYantras = useMemo(() => {
    if (!yantrasList || !userData) return [];
    if (userData.role === "narrador") return yantrasList;
    return yantrasList.filter(y => y.conhecidoPor && y.conhecidoPor.includes(userData.nome));
  }, [yantrasList, userData]);

  useEffect(() => {
    setYantraValues((prev) => {
      if (prev.length === qtdDeYantras) return prev;
      if (prev.length > qtdDeYantras) {
        return prev.slice(0, qtdDeYantras);
      }
      return [...prev, ...Array(qtdDeYantras - prev.length).fill(null)];
    });
  }, [qtdDeYantras]);

  useEffect(() => {
    const validYantras = yantraValues.filter(y => y !== null);
    const currentYantras = Array.isArray(yantras) ? yantras : [];
    const isSame = currentYantras.length === validYantras.length && currentYantras.every((y, i) => y?.id === validYantras[i]?.id);
    if (!isSame) {
      setYantras(validYantras);
    }
  }, [yantraValues, setYantras]);

  // Se o contexto ainda está carregando, mostra um placeholder
  if (isLoading) {
    return (
      <div className="page" data-page={page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
        <p>Carregando Yantras...</p>
      </div>
    );
  }

  const handleSelectYantra = (index, yantraId) => {
    const newYantraValues = [...yantraValues];
    if (!yantraId) {
      newYantraValues[index] = null;
    } else {
      const selectedObj = availableYantras.find(y => y.id === yantraId);
      newYantraValues[index] = selectedObj || null;
    }
    setYantraValues(newYantraValues);
  };

  return (
    <div className="page" data-page={page}>
      <div className={styles.spellCalcHeader}>
        <h1>Seleção de Yantras</h1>
      </div>
      <div className={styles.yantraData} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {yantraValues.map((selectedValue, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
            <label style={{ color: 'var(--amarelo)', fontSize: '0.9rem' }}>Yantra {index + 1}</label>
            <select
              value={selectedValue?.id || ""}
              onChange={(e) => handleSelectYantra(index, e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--separador)',
                color: 'white',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <option value="">Nenhum Yantra Selecionado</option>
              {availableYantras.map(yantra => {
                const isSelectedElsewhere = yantraValues.some((v, i) => i !== index && v?.id === yantra.id);
                return (
                  <option key={yantra.id} value={yantra.id} disabled={isSelectedElsewhere} style={{ color: 'black' }}>
                    {yantra.nome} 
                  </option>
                );
              })}
            </select>
            {selectedValue && selectedValue.efeitoExtra && (
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                Efeito: {selectedValue.efeitoExtra}
              </span>
            )}
          </div>
        ))}
        {yantraValues.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Nenhum slot de Yantra disponível (Gnose baixa).</p>
        )}
      </div>
    </div>
  );
}
