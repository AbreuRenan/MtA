import DiceRollerComponent from './components/diceRoller'
import { HashRouter, Route, Routes } from 'react-router-dom'

import './App.css'
import Home from './components/Home'
import SpellBook from './components/SpellBook'
import Header from './components/Header'


function App() {
  return (
    <>
      <HashRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spellbook" element={<SpellBook />} />
          <Route path="/dice" element={<DiceRollerComponent />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
