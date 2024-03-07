import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/Home";
import SpellBook from "./components/SpellBook";
import Header from "./components/Header";
import DiceRollerComponent from "./components/diceRoller";
import ReportScreen from "./components/reportScreen/reportScreen";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, remove } from "firebase/database";
import LoginScreen from "./components/auth/LoginScreen";
import { getAuth } from "firebase/auth";

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

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true)
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth()

  function deleteNodesFromRollsHistory() {
    const rollsHistoryRef = ref(database, "rollsHistory");
    get(rollsHistoryRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            remove(ref(database, `rollsHistory/${childKey}`));
          });
        } else {
          console.log("Nenhum nó encontrado para exclusão.");
        }
      })
      .catch((error) => {
        console.error("Erro ao recuperar nós para exclusão:", error);
      });
  }
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      deleteNodesFromRollsHistory();
    }, 48 * 60 * 60 * 1000); // 48 horas em milissegundos
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <HashRouter>
        {isLoggedIn && <Header />}
        <Routes>
          <Route path="/" element={<LoginScreen auth={auth} firestore={database} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/home" element={<Home firestore={database} />} />
          <Route
            path="/spellbook"
            element={<SpellBook firestore={database} />}
          />
          <Route
            path="/dice"
            element={<DiceRollerComponent firestore={database} />}
          />
          <Route
            path="/reports"
            element={<ReportScreen firestore={database} />}
          />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
