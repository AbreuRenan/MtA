import React from "react";
import DiceRollerComponent from "./diceRoller";
import { Link, NavLink, useLocation } from "react-router-dom";

import styles from "../styles/mobileMenu.module.css";

function MobileMenu({ isOpen, setMenuMobileIsOpen }) {
  return (
    <>
      <div className={`${isOpen ? styles.isOpen : ""} ${styles.mobileMenu}`}>
        <nav className={`${styles.mobileNavigation}`} aria-label="mobile menu ">
          <NavLink to="/home" end onClick={() => setMenuMobileIsOpen(false)}>
            Home
          </NavLink>
          {/* <NavLink
            to="/spellbook"
            end
            onClick={() => setMenuMobileIsOpen(false)}
          >
            Grimório
          </NavLink> */}
          <NavLink to="/dice" end onClick={() => setMenuMobileIsOpen(false)}>
            Dado
          </NavLink>
          {/* <NavLink to="/reports" end onClick={() => setMenuMobileIsOpen(false)}>
            Relatórios
          </NavLink> */}
          <NavLink to="/logout" end onClick={() => setMenuMobileIsOpen(false)}>
            Logout
          </NavLink>
        </nav>
      </div>
    </>
  );
}

export default MobileMenu;
