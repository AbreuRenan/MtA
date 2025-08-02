import React from "react";

import { initializeApp } from "firebase/app";
import { get, getDatabase, onValue, ref } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from "./components/helpers/Loading";



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

export const AppContext = React.createContext();
 
export function AppContextComponent({ children }) {
  const [hasEvent, setEvent] = React.useState(null);
  const [userData, setUserData] = React.useState(null);
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [errorContextState, setErrorContextState] = React.useState(false);
  const [gameOpen, setGameOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [minimumLoadTimeReached, setMinimumLoadTimeReached] = React.useState(false);
  const [dataLoadFinished, setDataLoadFinished] = React.useState(false);

  const app = React.useMemo(() => initializeApp(firebaseConfig), []);
  const database = React.useMemo(() => getDatabase(app), [app]);
  const auth = React.useMemo(() => getAuth(app), [app]);

  const navigate = useNavigate();
  const loadingTime = 0

  const saveLocalData = React.useCallback((data) => {
    const json = JSON.stringify(data);
    localStorage.setItem("userData", json);
  }, []); 

  const performLoginApp = React.useCallback(
    (data, fromLocal = false) => {
      setUserData(data); 
      if (!fromLocal) saveLocalData(data); 
      navigate("/home"); 
    },
    [saveLocalData, navigate]
  );


    React.useEffect(() => {
    setMinimumLoadTimeReached(false);
    const timer = setTimeout(() => {
      setMinimumLoadTimeReached(true);
    }, loadingTime);

    return () => clearTimeout(timer);
  }, [loading]);

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
                  }
                  setDataLoadFinished(true)
                },
                (error) => {
                  setUserData(null);
                  localStorage.clear();
                  setLoggedIn(false);
                  setDataLoadFinished(true)
                }
              );

              return () => unsubscribeUser();
            } else {
              setUserData(null);
              localStorage.clear();
              setLoggedIn(false);
              setDataLoadFinished(true)
              navigate("/");
            }
          })
          .catch((error) => {
            setUserData(null);
            localStorage.clear();
            setLoggedIn(false);
            setDataLoadFinished(true)
            navigate("/");
          });
      } else {
        localStorage.clear();
        setUserData(null);
        setLoggedIn(false);
        setDataLoadFinished(true)
        navigate("/"); 
      }
    });
    return () => unsubscribeAuth();
  }, [auth, database, navigate, saveLocalData]);

    React.useEffect(() => {
    if (dataLoadFinished && minimumLoadTimeReached) {
      setLoading(false);
    }
  }, [dataLoadFinished, minimumLoadTimeReached]);


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
    <>
    {loading && (<Loading loading={loading}/>)}
    {!loading && (
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
    ) }
    </>
  );
}