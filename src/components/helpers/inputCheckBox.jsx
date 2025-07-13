import React from "react";
import styles from "../../styles/spellcalc.module.css";

export default function InputCheckBox({ label, id, checked, setValue, ...restProps }) {
    const handleClick = React.useCallback((e) => {
        setValue(e.target.checked); 
    }, [setValue]); 

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
                    {...restProps} 
                />
                <label htmlFor={id} className={styles.inputCheckbox}>
                    <div className={styles.inputCheckboxFalse}>Não</div>
                    <div className={styles.inputCheckboxTrue}>Sim</div>
                </label>
            </div>
        </>
    );
}