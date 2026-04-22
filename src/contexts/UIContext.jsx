import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [errorContextState, setErrorContextState] = useState(false);
  const [minimumLoadTimeReached, setMinimumLoadTimeReached] = useState(false);
  const [dataLoadFinished, setDataLoadFinished] = useState(false);

  return (
    <UIContext.Provider value={{ 
      loading, setLoading, 
      errorContextState, setErrorContextState,
      minimumLoadTimeReached, setMinimumLoadTimeReached,
      dataLoadFinished, setDataLoadFinished
    }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
