import React from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";

import BackgroundImage from "../helpers/BackgroundImage";
import mtaLoginBg from "../../assets/mtaLoginBg.png";

import styles from "../../styles/authScreen.module.css";

export default function LoginScreen({ auth, firestore }) {
  const [emailState, setEmail] = React.useState('');
  const [passwordState, setPassword] = React.useState('');
  const [userState, setUserStat] = React.useState(null);
  const [erroMsgState, setErroMsg] = React.useState(null)

  
  function handleLogin() {
    signInWithEmailAndPassword(auth, emailState, passwordState)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserStat(user);
      })
      .catch((error) => {
        const code = error.code;
        const message = error.message;
        setErroMsg( ()=> {
            return {code, message}
        })
      });
  }

  React.useEffect( ()=> {
    async function fetchFirebase() {
        const idRefs = ref(firestore, `usersToId/${userState.uid}`);
        const IDsnapshot = await get(idRefs);

        if (IDsnapshot.exists()) {
            const userID = IDsnapshot.val()
            console.log(userID)
        }
    }

    fetchFirebase()
  }, [userState])

  function handleInputChange({target}, inputName) {
    if (inputName === 'email') setEmail(target.value)
    if (inputName === 'password') setPassword(target.value)
  }
  function handleSubmit(e) {
    e.preventDefault()
    if(emailState && passwordState) {
        handleLogin()
        console.log(userState)
    } else {
        setErroMsg('Dados Incorretos')
    }

  }
  return (
    <div className="container" style={{ border: "red 1px solid" }}>
      <BackgroundImage src={mtaLoginBg}>
        <form className={styles.inputGroupContainer} onSubmit={handleSubmit}>
          <input type="email" className={styles.inputField} placeholder="Nome Umbrático" name="email" onChange={(e)=>handleInputChange(e, 'email')} value={emailState}/>
          <input type="password" className={styles.inputField} placeholder="Mystério" name="password" onChange={(e)=>handleInputChange(e, 'password')} value={passwordState}/>
          <button className={`btn ${styles.loginBtn} `} type="submit"  >Despertar</button>
        </form>
        <button className={`btn ${styles.loginBtn} `} style={{position: 'absolute', top: 40, left: 60, }} onClick={() => console.log(userState)}  >Show User Data</button>
      </BackgroundImage>
    </div>
  );
}
