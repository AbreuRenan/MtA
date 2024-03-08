import React from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";

import styles from "../../styles/authScreen.module.css";
import BackgroundImage from "../helpers/BackgroundImage";
import mtaLoginBg from "../../assets/mtaLoginBg.png";
import { AppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {
  const {
    firestore,
    auth,
    performLoginApp,
    userData,
    setUserData,
    isLoggedIn,
  } = React.useContext(AppContext);
  const [emailState, setEmail] = React.useState("");
  const [passwordState, setPassword] = React.useState("");
  const [erroMsgState, setErroMsg] = React.useState(null);
  const navigate = useNavigate();

  function performLoginFirebase() {
    signInWithEmailAndPassword(auth, emailState, passwordState)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setUserData(user);
      })
      .catch((error) => {
        const code = error.code;
        const message = error.message;
        setErroMsg(() => {
          return { code, message };
        });
      });
  }

  React.useEffect(() => {
    async function fetchFirebase() {
      const idRefs = ref(firestore, `usersToId/${userData?.uid}`);
      const IDSnapshot = await get(idRefs);

      if (IDSnapshot.exists()) {
        const userID = IDSnapshot.val();
        const userRef = ref(firestore, `users/${userID}`);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          performLoginApp(userSnapshot.val());
        }
      }
    }

    fetchFirebase();
  }, [userData]);

  function handleInputChange({ target }, inputName) {
    if (inputName === "email") setEmail(target.value);
    if (inputName === "password") setPassword(target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (emailState && passwordState) {
      performLoginFirebase();
    } else {
      setErroMsg("Dados Incorretos");
    }
  }
  return (
    <div className="container">
      <BackgroundImage src={mtaLoginBg}>
        <form className={styles.inputGroupContainer} onSubmit={handleSubmit}>
          <input
            style={{ display: `${isLoggedIn ? "none" : "initial"}` }}
            type="email"
            className={styles.inputField}
            placeholder="Nome Umbrático"
            name="email"
            onChange={(e) => handleInputChange(e, "email")}
            value={emailState}
          />
          <input
            style={{ display: `${isLoggedIn ? "none" : "initial"}` }}
            type="password"
            className={styles.inputField}
            placeholder="Mystério"
            name="password"
            onChange={(e) => handleInputChange(e, "password")}
            value={passwordState}
          />

          <button className={`btn ${styles.loginBtn} `} type="submit">
            Despertar
          </button>

          <button
            className={`btn ${styles.loginBtn} }`}
            onClick={(e) => {
              e.preventDefault();
              navigate("/logout");
            }}
          >
            Purgar o Nimbus
          </button>
        </form>

        {erroMsgState && <div>{erroMsgState}</div>}
      </BackgroundImage>
    </div>
  );
}
