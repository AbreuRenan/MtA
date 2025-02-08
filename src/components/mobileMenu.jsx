import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import styles from "../styles/mobileMenu.module.css";
import { AppContext } from "../AppContext";

function MobileMenu({ isOpen, setMenuMobileIsOpen }) {
  const { hasEvent } = React.useContext(AppContext);
  const { userData } = React.useContext(AppContext);
  console.log(userData)
  return (
    <>
      <div className={`${isOpen ? styles.isOpen : ""} ${styles.mobileMenu}`}>
        <nav className={`${styles.mobileNavigation}`} aria-label="mobile menu ">
          <NavLink to="/home" end onClick={() => setMenuMobileIsOpen(false)}>
            Home
          </NavLink>
          {hasEvent && (
            <NavLink to="/event" end onClick={() => setMenuMobileIsOpen(false)}>
              Evento
            </NavLink>
          )}
          <NavLink to="/dice" end onClick={() => setMenuMobileIsOpen(false)}>
            Dado
          </NavLink>
          {userData.role == "narrador" && (
            <NavLink to="/admin" end onClick={() => setMenuMobileIsOpen(false)}>
              Admin
            </NavLink>
          )}

          <NavLink
            to="/spellCalc"
            end
            onClick={() => setMenuMobileIsOpen(false)}
          >
            Taumaturgia Creativa
          </NavLink>
          <NavLink to="/logout" end onClick={() => setMenuMobileIsOpen(false)}>
            Logout
          </NavLink>
        </nav>
      </div>
    </>
  );
}

export default MobileMenu;
