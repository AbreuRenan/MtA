import React from 'react';
import useSpellCalculator from './components/hooks/useSpellCalculator';

const SpellContext = React.createContext();

export default function SpellProvider({ children }) {
  const spellCalculator = useSpellCalculator();
  return (
    <SpellContext.Provider value={spellCalculator}>
      {children}
    </SpellContext.Provider>
  );
}

export const useSpellContext = () => {
  return React.useContext(SpellContext);
};