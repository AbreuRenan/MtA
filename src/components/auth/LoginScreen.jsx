import React from "react";
import { useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";

import styles from "../../styles/authScreen.module.css";
import BackgroundImage from "../helpers/BackgroundImage";
import mtaLoginBg from "../../assets/mtaLoginBg.png";
import { AppContext } from "../../AppContext";

export default function LoginScreen() {
  const {firestore, auth, setUserData, setIsLoggedIn} = React.useContext(AppContext);
  const navigate = useNavigate();
  const [emailState, setEmail] = React.useState("");
  const [passwordState, setPassword] = React.useState("");
  const [userState, setUserState] = React.useState(null);
  const [erroMsgState, setErroMsg] = React.useState(null);

  function performLogin() {
    signInWithEmailAndPassword(auth, emailState, passwordState)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserState(user);
        console.log(user);
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
      const idRefs = ref(firestore, `usersToId/${userState?.uid}`);
      const IDSnapshot = await get(idRefs);

      if (IDSnapshot.exists()) {
        const userID = IDSnapshot.val();
        const userRef = ref(firestore, `users/${userID}`);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          setUserData(userSnapshot.val());
          setIsLoggedIn(true);
          navigate("/home");
        }
      }
    }

    fetchFirebase();
  }, [userState]);

  function handleInputChange({ target }, inputName) {
    if (inputName === "email") setEmail(target.value);
    if (inputName === "password") setPassword(target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (emailState && passwordState) {
      performLogin();
    } else {
      setErroMsg("Dados Incorretos");
    }
  }
  return (
    <div className="container" style={{ border: "red 1px solid" }}>
      <BackgroundImage src={mtaLoginBg}>
        <form className={styles.inputGroupContainer} onSubmit={handleSubmit}>
          <input
            type="email"
            className={styles.inputField}
            placeholder="Nome Umbrático"
            name="email"
            onChange={(e) => handleInputChange(e, "email")}
            value={emailState}
          />
          <input
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
        </form>
        <button
          className={`btn ${styles.loginBtn} `}
          style={{ position: "absolute", top: 40, left: 60 }}
          onClick={() => console.log(userState)}
        >
          Show User Data
        </button>
        {erroMsgState && <div>{erroMsgState}</div>}
      </BackgroundImage>
    </div>
  );
}
