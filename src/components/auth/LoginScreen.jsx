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
    errorContextState,
    setErrorContextState,
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
          console.log(err);
          setErrorContextState(err);
        });
    } else {
      console.log("not signed in with Email");
    }
  }

  async function fetchFirebase() {
    const idRefs = ref(firestore, `usersToId/${userData?.uid}`);
    const IDSnapshot = await get(idRefs);
    if (IDSnapshot.exists() && isLoggedIn) {
      console.log(isLoggedIn);
      const userID = IDSnapshot.val();
      const userRef = ref(firestore, `users/${userID}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        performLoginApp(userSnapshot.val());
      }
    }
  }
  React.useEffect(() => {
    fetchFirebase();
  }, [userData, isLoggedIn]);

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

  React.useEffect(() => {
    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", (event) => {
      // Guardar o evento para ser usado posteriormente
      deferredPrompt = event;
      // Exibir o botão de instalação
      document.getElementById("installButton").style.display = "block";

      // Prevenir o comportamento padrão do evento
      event.preventDefault();
    });

    document.getElementById("installButton").addEventListener("click", () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("Usuário aceitou a instalação");
          } else {
            console.log("Usuário recusou a instalação");
          }
          deferredPrompt = null;
        });
      }
    });
  }, []);

  return (
    <div className="container h-100">
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

        <div id="installButton" className={`installStyle`}></div>
        {errorContextState && (
          <ErrorComponent
            state={errorContextState}
            msg={"Sem conexão com Internet"}
          />
        )}
      </BackgroundImage>
    </div>
  );
}
