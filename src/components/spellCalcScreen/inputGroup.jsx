import React from "react";
import styles from "../../styles/spellcalc.module.css";

export default function InputGroup({label, value, setValue,  min = 0, max = 10, ...props}) {
  const handleBtnAddOrRemove = (e) => {
    const btnValue = parseInt(e.currentTarget.value, 10);
    let newValue = value + btnValue;
    if (newValue > max) return setValue(max);
    if (newValue < min) return setValue(min);
    setValue(newValue);
  };

    function handleInputChange(e) {
      let inputValue = parseInt(e.target.value, 10);
      if( e.target.value === "") return setValue("");

      if (isNaN(inputValue)) return setValue(min);
      if (inputValue > max)  return setValue(max);
      if (inputValue < min)  return setValue(min);
      setValue(inputValue);
    }



  const inputContent = (
    <>
      <label htmlFor={props.id}>{label}</label>
      <div className={styles.inputGroupControl}>
        <button data-inputname={props.id} value={-1} onClick={handleBtnAddOrRemove}>
          -1
        </button>
        <input
          type={props.type || "number"}
          id={props.id}
          data-inputname={props.id}
          className={styles.inputNumber}
          value={value}
          onChange={handleInputChange}
        />
        <button data-inputname={props.id} value={1} onClick={handleBtnAddOrRemove}>
          +1
        </button>
      </div>
    </>
  );



  return <>{inputContent}</>;
}
