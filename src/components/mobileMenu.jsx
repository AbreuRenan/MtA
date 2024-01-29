import React from 'react';
import DiceRollerComponent from './diceRoller';
import { Link, NavLink, useLocation } from "react-router-dom";

import styles from '../styles/mobileMenu.module.css'

function MobileMenu() {
    return (
        <div className={``}>
            <nav className={`${styles.mobileNavigation}`} aria-label='mobile menu '>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/spellbook" end>Grimório</NavLink>
            <NavLink to="/dice" end>Dado</NavLink>
            </nav>
        </div>
    )
}

export default MobileMenu;