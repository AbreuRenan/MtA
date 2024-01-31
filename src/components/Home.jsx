import React from "react";

import styles from "../styles/home.module.css";
import InputComponent from "./InputComponent";

function Home() {
  return (
    <div className="container">
      <main>
        <div className={`${styles.sheetInfo}`}>
          <InputComponent label="Nome:" inputName="nomeInput" />
          <InputComponent label="Jogador:" inputName="jogadorInput" />
          <InputComponent label="Crônica:" inputName="cronicaInput" />
          <InputComponent label="Conceito:" inputName="conceitoInput" />
          <InputComponent label="Virtude:" inputName="virtudeInput" />
          <InputComponent label="Vício:" inputName="vicioInput" />
          <InputComponent label="Senda:" inputName="sendaInput" />
          <InputComponent label="Ordem:" inputName="ordemInput" />
          <InputComponent label="Cabala:" inputName="cabalaInput" />
        </div>
        <div className={`${styles.sheetAtrib}`}>
          <div>
            <InputComponent label="Inteligência:" inputName="inteligenciaInput" isDoted={true}/>
            <InputComponent label="Raciocínio:" inputName="racicinioInput" isDoted={true}/>
            <InputComponent label="Perseverança:" inputName="perserverancaInput" isDoted={true}/>
          </div>
          <div>
            <InputComponent label="Força:" inputName="forcaInput" isDoted={true}/>
            <InputComponent label="Destreza:" inputName="destrezaInput" isDoted={true}/>
            <InputComponent label="Vigor:" inputName="vigorInput" isDoted={true}/>
          </div>
          <div>
            <InputComponent label="Presença:" inputName="presencaInput" isDoted={true}/>
            <InputComponent label="Manipulação:" inputName="manipulacaoInput" isDoted={true}/>
            <InputComponent label="Autocontrole:" inputName="autocontroleInput" isDoted={true}/>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
