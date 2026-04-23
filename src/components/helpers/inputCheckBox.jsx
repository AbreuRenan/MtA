import React from "react";
import styles from "../../styles/spellcalc.module.css";

export default function InputCheckBox({ label, id, checked, setValue, disabled, ...restProps }) {
    const handleClick = React.useCallback((e) => {
        if (disabled) return;
        setValue(e.target.checked); 
    }, [setValue, disabled]); 

    return (
        <>
            <label htmlFor={id}>{label}</label> 
            <div className={styles.inputGroupControl}>
                <input
                    id={id}
                    type="checkbox"
                    className={styles.inputCheckbox}
                    checked={checked}
                    onChange={handleClick} 
                    disabled={disabled}
                    {...restProps} 
                />
                <label 
                    htmlFor={id} 
                    className={styles.inputCheckbox}
                    data-disabled={disabled}
                    onClick={disabled ? (e) => e.preventDefault() : undefined}
                >
                    <div className={styles.inputCheckboxFalse}>Não</div>
                    <div className={styles.inputCheckboxTrue}>Sim</div>
                </label>
            </div>
        </>
    );
}