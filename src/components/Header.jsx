import React from "react";
import MobileMenu from "./mobileMenu";

import styles from '../styles/header.module.css';
import mtashare from '../assets/mtashare.png'
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";



function Header() {
  const navigate = useNavigate();
  const context = React.useContext(AppContext);
  const {isLoggedIn} = context;
  const [mobileMenuIsOpen, setMenuMobileIsOpen] = React.useState(false);

  function toggleMenu() {
    setMenuMobileIsOpen(!mobileMenuIsOpen);
  }
  if (!isLoggedIn) return null
  return (
    <header>
      <nav className={`${styles.headerNav} `} >
        <button className={`${styles.mobileMenuButton} ${mobileMenuIsOpen ? styles.isOpen : ''}`} onClick={toggleMenu}></button>
        <MobileMenu
          isOpen={mobileMenuIsOpen}
          setMenuMobileIsOpen={setMenuMobileIsOpen}
        />
        <img src={mtashare} className={`${styles.mtaLogo}`} onClick={()=>{ navigate('/login')}} alt="mage_logo_title"/>
      </nav>
    </header>
  );
}

export default Header;
