import React from "react";
import Dots from "./DotsComponent";

import styles from "../styles/InputComponent.module.css"


function InputComponent({ label, inputType = "text", inputName, isDoted, value }) {
  return (
    <div >
      <label htmlFor={label}>{label}</label>
      {isDoted ? (
        <Dots id={inputName} numberOfDots={value}/>
      ) : (
        <input id={inputName} type={inputType} name={inputName} />
      )}
    </div>
  );
}

export default InputComponent;
