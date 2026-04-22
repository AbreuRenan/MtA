import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { useFirebase } from './FirebaseContext';

const GameContext = createContext();

export function GameProvider({ children }) {
  const { database } = useFirebase();
  const [gameOpen, setGameOpen] = useState(false);
  const [hasEvent, setEvent] = useState(null);

  useEffect(() => {
    const gameStatusRef = ref(database, "gameStatus");
    const unsubscribeGameStatus = onValue(gameStatusRef, (snapshot) => {
      if (snapshot.exists()) {
        const status = snapshot.val();
        setGameOpen(status.gameStatus);
      } else {
        setGameOpen(false);
      }
    });
    return () => unsubscribeGameStatus();
  }, [database]);

  useEffect(() => {
    const gameEventRef = ref(database, "event");
    const unsubscribeEvent = onValue(gameEventRef, (snapshot) => {
      if (snapshot.exists()) {
        const status = snapshot.val();
        setEvent(status.hasEvent);
      } else {
        setEvent(null);
      }
    });
    return () => unsubscribeEvent();
  }, [database]);

  return (
    <GameContext.Provider value={{ gameOpen, setGameOpen, hasEvent, setEvent }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
