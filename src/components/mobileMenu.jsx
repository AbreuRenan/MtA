import React from "react";
import { NavLink } from "react-router-dom";

import styles from "../styles/mobileMenu.module.css";
import { AppContext } from "../AppContext";

function MobileMenu({ isOpen, setMenuMobileIsOpen }) {
  const { hasEvent, userData, loading } = React.useContext(AppContext);

  if (loading) { return null }

  return (
    <>
      <div className={`${isOpen ? styles.isOpen : ""} ${styles.mobileMenu}`}>
        <nav className={`${styles.mobileNavigation}`} aria-label="mobile menu ">
          <NavLink to="/home" end onClick={() =>      setMenuMobileIsOpen(false)}>Home</NavLink>
          {hasEvent && (
            <NavLink to="/event" end onClick={() =>   setMenuMobileIsOpen(false)}>Evento</NavLink>
          )}
          <NavLink to="/dice" end onClick={() =>      setMenuMobileIsOpen(false)}>Dado</NavLink>
          {userData && userData.role === "narrador" && (
            <NavLink to="/admin" end onClick={() =>   setMenuMobileIsOpen(false)}>Admin</NavLink>
          )}
          {/* <NavLink to="/spellBook" end onClick={() => setMenuMobileIsOpen(false)}>Grimório</NavLink> */}
          <NavLink to="/spellCalc" end onClick={() => setMenuMobileIsOpen(false)}>Taumaturgia Creativa</NavLink>
          <NavLink to="/logout" end onClick={() =>    setMenuMobileIsOpen(false)}>Logout</NavLink>
        </nav>
      </div>
    </>
  );
}

export default MobileMenu;
