import React from "react";
import styles from "../../styles/spellcalc.module.css";

export default function InputCheckBox({ label, value, setValue, ...props }) {
    const handleClick = (e) => {
        const inputValue = e.target.checked;
        setValue(inputValue);
    };
  const inputContent = (
    <>
      <label>Arcana é Regente?</label>
      <div className={styles.inputGroupControl}>
        <input
          id={props.id}
          type="checkbox"
          className={styles.inputCheckbox}
          value={value}
          onChange={handleClick}
          {...props}
        />
        <label htmlFor={props.id} className={styles.inputCheckbox}>
          <div className={styles.inputCheckboxFalse}>Não</div>
          <div className={styles.inputCheckboxTrue}>Sim</div>
        </label>
      </div>
    </>
  );

  return inputContent;
}
