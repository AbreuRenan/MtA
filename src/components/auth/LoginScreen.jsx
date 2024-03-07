import React from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import BackgroundImage from "../helpers/BackgroundImage";
import mtaLoginBg from "../../assets/mtaLoginBg.png";

// import "../../js/loginLightAnimation";
import styles from "../../styles/authScreen.module.css";

export default function LoginScreen({ auth }) {
  const [email, setEmail] = React.useState(null);
  const [password, setpassword] = React.useState(null);

  React.useEffect( ()=>{
    const cursorPosition = document.documentElement;

  
    const handleMouseMove = (e) => {
      cursorPosition.style.setProperty("--x", e.clientX + "px");
      cursorPosition.style.setProperty("--y", e.clientY + "px");
    }
    const handleTouchMove = (e) => {
        const touch = e.touches[0];
        if (touch) {
          cursorPosition.style.setProperty('--x', touch.clientX + 'px');
          cursorPosition.style.setProperty('--y', touch.clientY + 'px');
        }
      };

      cursorPosition.addEventListener("mousemove", handleMouseMove);
      cursorPosition.addEventListener("touchmove", handleTouchMove);
    return () => {
        cursorPosition.removeEventListener('mousemove', handleMouseMove);
        cursorPosition.removeEventListener('touchmove', handleTouchMove);
      };
    }, []);

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  return (
    <div className="container" style={{ border: "red 1px solid" }}>
      <BackgroundImage src={mtaLoginBg}>
        <div className="light"></div>
        <form className={styles.inputGroupContainer}>
          <input className={styles.inputField} placeholder="Nome Umbrático" />
          <input className={styles.inputField} placeholder="Mystério" />
          <button className={`btn ${styles.loginBtn} `}>Despertar</button>
        </form>
      </BackgroundImage>
    </div>
  );
}
