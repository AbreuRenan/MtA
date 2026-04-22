import React, { createContext, useContext, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  dataBaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const FirebaseContext = createContext();

export function FirebaseProvider({ children }) {
  const app = useMemo(() => initializeApp(firebaseConfig), []);
  const database = useMemo(() => getDatabase(app), [app]);
  const auth = useMemo(() => getAuth(app), [app]);

  return (
    <FirebaseContext.Provider value={{ app, database, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
