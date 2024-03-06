import React from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import BackgroundImage from "../helpers/BackgroundImage";
import mtaLoginBg from "../../assets/mtaLoginBg.png";

import styles from "../../styles/authScreen.module.css";

export default function LoginScreen({ auth }) {
  const [email, setEmail] = React.useState(null);
  const [password, setpassword] = React.useState(null);

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
        <div className={styles.inputGroupContainer}>
          <input className={styles.inputField} placeholder="Nome Umbrático" />
          <input className={styles.inputField} placeholder="Mystério" />
        </div>
      </BackgroundImage>
    </div>
  );
}
