import React from "react";
import styles from "../../styles/spellcalc.module.css";

export default function InputGroup({label,value: estateValue,setValue,min = 1,max = 10,childInputContainer = false, 
  childContainerClass,children, ...props})  {

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

  const inputContent = (
    <>
      <label htmlFor={props.id}>{label}</label>
      {childInputContainer && (
        <div className={childContainerClass}>
          {children}
          <div className={styles.inputGroupControl}>
            <button
              data-inputname={props.id}
              value={-1}
              onClick={handleBtnAddOrRemove}
              disabled={ estateValue <= min}
            >
              -1
            </button>
            <input
              type={props.type || "number"}
              id={props.id}
              data-inputname={props.id}
              className={styles.inputNumber}
              value={estateValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            <button
              data-inputname={props.id}
              value={1}
              onClick={handleBtnAddOrRemove}
              disabled={ estateValue >= max}
            >
              +1
            </button>
          </div>
        </div>
      )}
      {!childInputContainer && (
        <>
          {children}
          <div className={styles.inputGroupControl}>
            <button
              data-inputname={props.id}
              value={-1}
              onClick={handleBtnAddOrRemove}
              disabled={ estateValue <= min}

            >
              -1
            </button>
            <input
              type={props.type || "number"}
              id={props.id}
              data-inputname={props.id}
              className={styles.inputNumber}
              value={estateValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            <button
              data-inputname={props.id}
              value={1}
              onClick={handleBtnAddOrRemove}
              disabled={ estateValue >= max}

            >
              +1
            </button>
          </div>
        </>
      )}
    </>
  );


  React.useEffect(() =>{
    if (estateValue < min) { setValue(min) }
    if (estateValue > max) { setValue(max)} 
  }, [estateValue, min, max, setValue])

  return <>{inputContent}</>;
}
