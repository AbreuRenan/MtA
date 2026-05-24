import React, { useEffect, useState } from 'react';
import useSpellCalculator from './components/hooks/useSpellCalculator';
import { AppContext } from './AppContext';
import { ref, onValue } from 'firebase/database';

const SpellContext = React.createContext(null);

// Valor padrão/seguro para quando o contexto ainda não foi carregado
const defaultSpellContextValue = {
  isReady: false,
  yantrasList: [],
  // adiciona stub methods para evitar undefined reference errors
  setPage: () => {},
  setGnose: () => {},
  setNivelArcana: () => {},
  setNivelRequerido: () => {},
  setMagiasAtivas: () => {},
  setSpellType: () => {},
  setRegente: () => {},
  setPotencia: () => {},
  setDuracao: () => {},
  setEscala: () => {},
  setAlcance: () => {},
  setTempoConjuracao: () => {},
  setCurrentFP: () => {},
  setPotenciaElevada: () => {},
  setDuracaoElevada: () => {},
  setEscalaElevada: () => {},
  setAlcanceElevado: () => {},
  setTempoConjuracaoElevada: () => {},
  setExtraElevacoes: () => {},
  setIsCombinado: () => {},
  setYantras: () => {},
  setUsouFdV: () => {},
  setMitigarDadosParadoxoMana: () => {},
  setMitigarTodoParadoxoMana: () => {},
  setManaOpcional: () => {},
  setDadosExtras: () => {},
  setDadosParadoxoExtra: () => {},
  toggleRegente: () => {},
  toggleUsouFV: () => {},
  resetCalculadora: () => {},
  calcularElevacoesGratis: () => 0,
  calcularElevacoesExcedentes: () => 0,
  calcularElevacoesTotais: () => 0,
  calcularDadosParadoxo: () => 0,
  calcularDadosPorFator: () => 0,
  calcularGastoMana: () => 0,
  calcularTotalDadosParadoxo: () => 0,
  calcularParadaDeDados: () => 0,
  checkSpellExists: () => false,
  saveSpellData: async () => false,
  deleteSpellData: async () => false,
  updateSavedSpell: async () => false,
  loadSpellData: () => {},
};

export default function SpellProvider({ children }) {
  const { userData, database } = React.useContext(AppContext);
  const spellCalculator = useSpellCalculator(userData);
  const [yantrasList, setYantrasList] = useState([]);
  const [isReady, setIsReady] = useState(false);
 
  useEffect(() => {
    if (!database) {
      setYantrasList([]);
      setIsReady(false);
      return;
    }

    setIsReady(false);
    const yantrasRef = ref(database, 'yantras');
    const unsubscribe = onValue(yantrasRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setYantrasList(list);
      } else {
        setYantrasList([]);
      }
      setIsReady(true);
    }, (error) => {
      console.error('Erro ao carregar yantras:', error);
      setYantrasList([]);
      setIsReady(true);
    });
    return () => unsubscribe();
  }, [database, userData]);

  const value = {
    ...spellCalculator,
    yantrasList, 
    isReady
  };

  return (
    <SpellContext.Provider value={value}>
      {children}
    </SpellContext.Provider>
  );
}

export const AppSpellContext = () => {
  const context = React.useContext(SpellContext);
  // Retorna o contexto real ou o padrão seguro se ainda não foi carregado
  return context || defaultSpellContextValue;
};

// Hook customizado que também expõe se o contexto está ready
export const useAppSpellContext = () => {
  const context = React.useContext(SpellContext);
  if (!context) {
    return { ...defaultSpellContextValue, isReady: false, isLoading: true };
  }
  return { ...context, isLoading: !context.isReady };
};