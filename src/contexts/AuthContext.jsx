import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from './FirebaseContext';
import { useUI } from './UIContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { auth, database } = useFirebase();
  const { setLoading, setDataLoadFinished } = useUI();
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const saveLocalData = useCallback((data) => {
    const json = JSON.stringify(data);
    localStorage.setItem("userData", json);
  }, []);

  const performLoginApp = useCallback((data, fromLocal = false) => {
    setUserData(data);
    if (!fromLocal) saveLocalData(data);
    navigate("/home");
  }, [saveLocalData, navigate]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const userRef = ref(database, `users/${uid}`);
        
        const unsubscribeUser = onValue(userRef, (userSnapshot) => {
          if (userSnapshot.exists()) {
            const fetchedUserData = userSnapshot.val();
            const finalUserData = { ...fetchedUserData, id: uid, uid: uid };
            setUserData(finalUserData);
            saveLocalData(finalUserData);
            setLoggedIn(true);
          } else {
            setUserData(null);
            localStorage.clear();
            setLoggedIn(false);
            navigate("/");
          }
          setDataLoadFinished(true);
        }, (error) => {
          console.error("User data fetch error:", error);
          setUserData(null);
          localStorage.clear();
          setLoggedIn(false);
          setDataLoadFinished(true);
          navigate("/");
        });

        return () => unsubscribeUser();
      } else {
        localStorage.clear();
        setUserData(null);
        setLoggedIn(false);
        setDataLoadFinished(true);
        navigate("/");
      }
    });

    return () => unsubscribeAuth();
  }, [auth, database, navigate, saveLocalData, setDataLoadFinished]);

  return (
    <AuthContext.Provider value={{ 
      userData, setUserData, 
      isLoggedIn, setLoggedIn, 
      performLoginApp, saveLocalData 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
