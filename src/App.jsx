import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AppContextComponent } from "./AppContext";

import "./App.css";
import Header from "./components/Header";
import LoginScreen from "./components/auth/LoginScreen";
import Home from "./components/Home";
import DiceRollerComponent from "./components/DiceRollerComponent";
import RouterGuard from "./components/helpers/RouterGuard";
import Logout from "./components/auth/Logout";
import AdminScreen from "./components/adminScreenComponent/AdminConsole";
import SpellCalcScreen from "./components/spellCalcScreen/SpellCalcScreen";
import GrimorioScreen from "./components/grimorioScreenComponent/GrimorioScreen";

function App() {
  return (
    <HashRouter initialEntries={['/']}>
      <AppContextComponent>
        <Header />
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/home" element={<RouterGuard><Home /></RouterGuard>} />
          <AppSpellContext>
            <Route path="/dice" element={<RouterGuard><DiceRollerComponent/></RouterGuard>} />
            <Route path="/spellCalc" element={<RouterGuard><SpellCalcScreen /></RouterGuard>} />
            {/* <Route path="/spellBook" element={<RouterGuard><GrimorioScreen/></RouterGuard>} /> */}
          </AppSpellContext>
          <Route path="/admin" element={<RouterGuard><AdminScreen /></RouterGuard>} />
        </Routes>
      </AppContextComponent>
    </HashRouter>
  );
}

export default App;
