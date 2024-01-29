import React from "react";
import { NavLink } from "react-router-dom";
import MobileMenu from "./mobileMenu";

function Header() {
  return (
    <header>
      <nav>
        <MobileMenu/>
      </nav>
    </header>
  );
}

export default Header;
