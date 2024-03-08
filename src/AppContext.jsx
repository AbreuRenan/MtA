import React from 'react';

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

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

export function AppContextComponent({children}) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState();
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth()
  const navigate = useNavigate();

  function performLoginApp(userData) {

    setUserData(userData);
    setIsLoggedIn(true);
    const json = JSON.stringify(userData)
    localStorage.setItem("userdata", json);

    navigate("/home");
  }


  React.useEffect( ()=>{
    const localData = localStorage.getItem('userdata');
    const userLocalData = JSON.parse(localData)
    if (userLocalData) {
        performLoginApp(userLocalData);
    } else {
      navigate('/login')
    }
  }, []) 

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn,
      userData,
      setUserData,
      firestore: database,
      auth,
      performLoginApp
    }}>{children}</AppContext.Provider>
  )
}
