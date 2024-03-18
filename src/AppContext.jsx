import React from "react";

import { initializeApp } from "firebase/app";
import { get, getDatabase, onValue, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyBza5P8Nn30uu3WrT8HaEJfl3IiGeg1fbs",
  authDomain: "mtacompanion.firebaseapp.com",
  projectId: "mtacompanion",
  storageBucket: "mtacompanion.appspot.com",
  messagingSenderId: "1031241767832",
  appId: "1:1031241767832:web:dc92c4a878039663d7e9ed",
  measurementId: "G-F00XEFYJEJ",
  dataBaseURL: "https://mtacompanion-default-rtdb.firebaseio.com/",
};

export const AppContext = React.createContext();

export function AppContextComponent({ children }) {
  const [userData, setUserData] = React.useState(null);
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [errorContextState, setErrorContextState] = React.useState(false);
  const [gameOpen, setGameOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth();
  const navigate = useNavigate();

  function saveLocalData(userData) {
    const json = JSON.stringify(userData);
    localStorage.setItem("userdata", json);
    setUserData(userData);
  }

  function performLoginApp(userData, fromLocal = false) {
    setUserData(userData);
    setLoggedIn(true);
    if (!fromLocal) saveLocalData(userData);
    navigate("/home");
  }

  React.useEffect(() => {
    setLoading(true)
    const localData = JSON.parse(localStorage.getItem("userdata"));
    if (localData !== null) {
      performLoginApp(localData, true);
    } else {
      localStorage.clear();
      navigate("/");
    }
    const gameStatusRef = ref(database, 'gameStatus');
    onValue(gameStatusRef, (snapshot) => {
      if(snapshot.exists()){
        const status = snapshot.val()
        setGameOpen(status.gameStatus)
      }
      setLoading(false)
    })
  }, []);


  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn: setLoggedIn,
        setLoggedIn,
        userData,
        setUserData,
        saveLocalData,
        firestore: database,
        database,
        auth,
        performLoginApp,
        errorContextState,
        setErrorContextState,
        gameOpen, 
        setGameOpen,
        loading, setLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
