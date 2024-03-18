import React from "react";

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
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
    const localData = localStorage.getItem("userdata");
    const userLocalData = JSON.parse(localData);
    if (userLocalData !== null) {
      performLoginApp(userLocalData, true);
    } else {
      localStorage.clear();
      navigate("/");
    }
  }, []);

React.useEffect( ()=>{
  console.log('userdata mudou')
  console.log(userData)
} ,[userData])

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
