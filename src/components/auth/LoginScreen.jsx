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
          setLoggedIn(true);
          setErrorContextState(err);
        });
    } else {
      console.log("not signed in with Email");
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

  function pwaClickHandler() {
    console.log('oi')
  }


  React.useEffect( () => {
    let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  // Guardar o evento para ser usado posteriormente
  deferredPrompt = event;
  // Exibir o botão de instalação
  document.getElementById("installButton").style.display = "block";

  // Prevenir o comportamento padrão do evento
  event.preventDefault();
});

// Lidar com o clique no botão de instalação
document.getElementById("installButton").addEventListener("click", () => {
  // Verificar se existe um evento de instalação pendente
  console.log('ia')
  if (deferredPrompt) {
    // Mostrar a solicitação de instalação
    deferredPrompt.prompt();
    // Aguardar a resposta do usuário
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("Usuário aceitou a instalação");
      } else {
        console.log("Usuário recusou a instalação");
      }
      // Limpar o evento de instalação pendente
      deferredPrompt = null;
    });
  }
});

  }, [])
 
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

        <div id="installButton" className={`installStyle`} ></div>
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
