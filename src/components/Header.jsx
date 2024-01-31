import React from "react";
import MobileMenu from "./mobileMenu";

import styles from '../styles/header.module.css';

function Header() {
  const [mobileMenuIsOpen, setMenuMobileIsOpen] = React.useState(false);

  function toggleMenu() {
    setMenuMobileIsOpen(!mobileMenuIsOpen);
  }

  return (
    <header>
      <nav className={`${styles.headerNav} `} >
        <button className={`${styles.mobileMenuButton} ${mobileMenuIsOpen ? styles.isOpen : ''}`} onClick={toggleMenu}></button>
        <MobileMenu
          isOpen={mobileMenuIsOpen}
          setMenuMobileIsOpen={setMenuMobileIsOpen}
        />
        <img src="mtashare.png" className={`${styles.mtaLogo}`} />
      </nav>
    </header>
  );
}

export default Header;
