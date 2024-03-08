import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import LoginScreen from "./components/auth/LoginScreen";
import Home from "./components/Home";
import SpellBook from "./components/SpellBook";
import DiceRollerComponent from "./components/diceRoller";
import ReportScreen from "./components/reportScreen/reportScreen";
import { AppContextComponent } from "./AppContext";
import RouterGuard from "./components/helpers/RouterGuard";

function App() {
  return (
    <HashRouter >
      <AppContextComponent>
        <Header />
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/home" element={<RouterGuard><Home /></RouterGuard>} />
          <Route path="/spellbook" element={<RouterGuard><SpellBook /></RouterGuard>} />
          <Route path="/dice" element={<RouterGuard><DiceRollerComponent /></RouterGuard>} />
          <Route path="/reports" element={<RouterGuard><ReportScreen /></RouterGuard>} />
        </Routes>
      </AppContextComponent>
    </HashRouter>
  );
}

export default App;
