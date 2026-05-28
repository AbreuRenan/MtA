import React from "react";
import styles from "../../styles/spellcalc.module.css";

export default function InputSelectArcana({
  label,
  value: estateValue,
  setValue,
  min = 1,
  max = 5,
  options = [
    "Espaço",
    "Morte",
    "Destino",
    "Forças",
    "Matéria",
    "Mente",
    "Primórdio",
    "Espírito",
    "Tempo",
    "Vida"
  ],
  arcana,
  setArcana,
  regente,
  setRegente,
  ...props
}) {
  const handleBtnAddOrRemove = (e) => {
    const btnValue = parseInt(e.currentTarget.value, 10);
    let newValue = estateValue + btnValue;
    if (newValue > max) return setValue(max);
    if (newValue < min) return setValue(min);
    setValue(newValue);
  };

  function handleInputChange(e) {
    let inputValue = parseInt(e.target.value, 10);
    if (e.target.value === "") return setValue("");

    if (isNaN(inputValue)) return setValue(min);
    if (inputValue > max) return setValue(max);
    if (inputValue < min) return setValue(min);
    setValue(inputValue);
  }

  function handleBlur(e) {
    let inputValue = e.target.value;
    if (inputValue === "") {
      return setValue(min);
    }
  }


  return (
    <>
      {/* <label htmlFor={props.id}>{label}</label> */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <select
          id={props.id}
          value={arcana || "Espaço"}
          onChange={(e) => setArcana && setArcana(e.target.value)}
          className={styles.selectArcana}
        >
          {options.map((option, index) => (
            <option key={index} value={option} style={{ color: 'black' }}>
              {option}
            </option>
          ))}
        </select>
        {typeof regente !== 'undefined' && (
          <input
            type="checkbox"
            checked={regente}
            onChange={(e) => setRegente && setRegente(e.target.checked)}
            className={styles.checkboxElevada}
            style={{ cursor: 'pointer' }}
            title="Arcana Regente?"
          />
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
        <div className={styles.inputGroupControl}>
          <button
            type="button"
            data-inputname={props.id}
            value={-1}
            onClick={handleBtnAddOrRemove}
            disabled={estateValue <= min}
          >
            -1
          </button>
          <input
            type="number"
            id={props.id}
            data-inputname={props.id}
            className={styles.inputNumber}
            value={estateValue}
            onChange={handleInputChange}
            onBlur={handleBlur}

          />
          <button
            type="button"
            data-inputname={props.id}
            value={1}
            onClick={handleBtnAddOrRemove}
            disabled={estateValue >= max}
          >
            +1
          </button>
        </div>
      </div>
    </>
  );
}
