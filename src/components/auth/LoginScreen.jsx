import React from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";

import styles from "../../styles/authScreen.module.css";
import BackgroundImage from "../helpers/BackgroundImage";
import mtaLoginBg from "../../assets/mtaLoginBg.png";
import { AppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";
import ErrorComponent from "../helpers/ErrorComponent";

export default function LoginScreen() {
  const {
    firestore,
    auth,
    performLoginApp,
    userData,
    setUserData,
    isLoggedIn,
    setLoggedIn,
    errorContextState, setErrorContextState
  } = React.useContext(AppContext);
  const [emailState, setEmail] = React.useState("");
  const [passwordState, setPassword] = React.useState("");
  const navigate = useNavigate();

  function performLoginFirebase() {
    if (auth && emailState && passwordState) {
      signInWithEmailAndPassword(auth, emailState, passwordState)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserData(user);
      })
      .catch((err) => {
        console.log(err)
        setLoggedIn(true)
        setErrorContextState(err);
      });
    } else {
      console.log('not signed in with Email')
    }

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
      setErrorContextState("Dados Incorretos");

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

        {errorContextState && <ErrorComponent state={errorContextState} msg={'Sem conexão com Internet'} />}
      </BackgroundImage>
    </div>
  );
}
