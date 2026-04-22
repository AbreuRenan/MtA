import React, { useEffect, createContext } from "react";
import { FirebaseProvider, useFirebase } from "./contexts/FirebaseContext";
import { UIProvider, useUI } from "./contexts/UIContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { GameProvider, useGame } from "./contexts/GameContext";
import Loading from "./components/helpers/Loading";

export const AppContext = createContext();

// Helper component to aggregate all context values into the legacy AppContext
function AppContextAggregator({ children }) {
  const { database, auth } = useFirebase();
  const { 
    loading, setLoading, 
    errorContextState, setErrorContextState,
    minimumLoadTimeReached, setMinimumLoadTimeReached,
    dataLoadFinished 
  } = useUI();
  const { userData, setUserData, isLoggedIn, setLoggedIn, performLoginApp, saveLocalData } = useAuth();
  const { gameOpen, setGameOpen, hasEvent, setEvent } = useGame();

  const loadingTime = 0; // Keeping as 0 as in original

  useEffect(() => {
    setMinimumLoadTimeReached(false);
    const timer = setTimeout(() => {
      setMinimumLoadTimeReached(true);
    }, loadingTime);

    return () => clearTimeout(timer);
  }, [loading, setMinimumLoadTimeReached]);

  useEffect(() => {
    if (dataLoadFinished && minimumLoadTimeReached) {
      setLoading(false);
    }
  }, [dataLoadFinished, minimumLoadTimeReached, setLoading]);

  const legacyValue = {
    hasEvent,
    setEvent,
    isLoggedIn,
    setLoggedIn,
    userData,
    setUserData,
    saveLocalData,
    firestore: database, // Aliased as in original
    database,
    auth,
    performLoginApp,
    errorContextState,
    setErrorContextState,
    gameOpen,
    setGameOpen,
    loading,
    setLoading,
  };

  return (
    <AppContext.Provider value={legacyValue}>
      {loading && <Loading loading={loading} />}
      {!loading && children}
    </AppContext.Provider>
  );
}

export function AppContextComponent({ children }) {
  return (
    <UIProvider>
      <FirebaseProvider>
        <GameProvider>
          <AuthProvider>
            <AppContextAggregator>
              {children}
            </AppContextAggregator>
          </AuthProvider>
        </GameProvider>
      </FirebaseProvider>
    </UIProvider>
  );
}