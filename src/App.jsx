import DiceRollerComponent from './components/diceRoller'
import { HashRouter, Route, Routes } from 'react-router-dom'

import './App.css'
import Home from './components/Home'
import SpellBook from './components/SpellBook'
import Header from './components/Header'
import ReportScreen from './components/reportScreen/reportScreen'


function App() {
  return (
    <>
      <HashRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spellbook" element={<SpellBook />} />
          <Route path="/dice" element={<DiceRollerComponent />} />
          <Route path="/reports" element={<ReportScreen />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
