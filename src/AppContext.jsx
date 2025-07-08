import React from "react";

import { initializeApp } from "firebase/app";
import { get, getDatabase, onValue, ref } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
  const [hasEvent, setEvent] = React.useState(null);
  const [userData, setUserData] = React.useState(null);
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [errorContextState, setErrorContextState] = React.useState(false);
  const [gameOpen, setGameOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const app = React.useMemo(() => initializeApp(firebaseConfig), []);
  const database = React.useMemo(() => getDatabase(app), [app]);
  const auth = React.useMemo(() => getAuth(app), [app]);

  const navigate = useNavigate();

  const saveLocalData = React.useCallback((data) => {
    const json = JSON.stringify(data);
    localStorage.setItem("userdata", json);
  }, []); 

  const performLoginApp = React.useCallback(
    (data, fromLocal = false) => {
      setUserData(data); 
      setLoggedIn(true);
      if (!fromLocal) saveLocalData(data); 
      navigate("/home"); 
    },
    [saveLocalData, navigate]
  );

  React.useEffect(() => {
    setLoading(true); 
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const userToIdRef = ref(database, `usersToId/${uid}`);
        get(userToIdRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userIdNum = snapshot.val(); 
              const userRef = ref(database, `users/${userIdNum}`);
              const unsubscribeUser = onValue(
                userRef,
                (userSnapshot) => {
                  if (userSnapshot.exists()) {
                    const fetchedUserData = userSnapshot.val();
                    const finalUserData = { ...fetchedUserData, id: userIdNum, uid: uid };
                    setUserData(finalUserData);
                    saveLocalData(finalUserData); 
                    setLoggedIn(true); 
                  } else {

                    setUserData(null);
                    localStorage.clear();
                    setLoggedIn(false);
                    console.warn(`Dados para o usuário numérico ${userIdNum} não encontrados em /users.`);
                  }
                  setLoading(false);
                },
                (error) => {
                  console.error("Erro ao ler dados do usuário em tempo real:", error);
                  setUserData(null);
                  localStorage.clear();
                  setLoggedIn(false);
                  setLoading(false);
                }
              );

              return () => unsubscribeUser();
            } else {
              console.warn(`Mapeamento UID para ID não encontrado para ${uid} em /usersToId.`);
              setUserData(null);
              localStorage.clear();
              setLoggedIn(false);
              setLoading(false);
              navigate("/");
            }
          })
          .catch((error) => {
            console.error("Erro ao buscar o ID numérico:", error);
            setUserData(null);
            localStorage.clear();
            setLoggedIn(false);
            setLoading(false);
            navigate("/");
          });
      } else {
        localStorage.clear();
        setUserData(null);
        setLoggedIn(false);
        setLoading(false);
        navigate("/"); 
      }
    });
    return () => unsubscribeAuth();
  }, [auth, database, navigate, saveLocalData]);


  React.useEffect(() => {
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

  React.useEffect(() => {
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
    <AppContext.Provider
      value={{
        hasEvent,
        setEvent,
        isLoggedIn,
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
        loading,
        setLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}