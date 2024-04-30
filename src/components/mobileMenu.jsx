import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import styles from "../styles/mobileMenu.module.css";
import { AppContext } from "../AppContext";

function MobileMenu({ isOpen, setMenuMobileIsOpen }) {
  const { hasEvent } = React.useContext(AppContext)
  return (
    <>
      <div className={`${isOpen ? styles.isOpen : ""} ${styles.mobileMenu}`}>
        <nav className={`${styles.mobileNavigation}`} aria-label="mobile menu ">
          <NavLink to="/home" end onClick={() => setMenuMobileIsOpen(false)}>
            Home
          </NavLink>
{hasEvent && <NavLink
            to="/event"
            end
            onClick={() => setMenuMobileIsOpen(false)}
          >
            Evento
          </NavLink>}
          <NavLink to="/dice" end onClick={() => setMenuMobileIsOpen(false)}>
            Dado
          </NavLink>
          {/* <NavLink to="/reports" end onClick={() => setMenuMobileIsOpen(false)}>
            Relatórios
          </NavLink> */}
          <NavLink to="/admin" end onClick={() => setMenuMobileIsOpen(false)}>
            Admin
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
