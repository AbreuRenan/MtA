import React from 'react';


import styles from '../../styles/spellDropDown.module.css';

export default function InputSpellDropDown({ label, value, setValue, options }) {



    return(
        <div className={styles.inputSpellDropDown}>
            <label htmlFor={label}>{label}</label>
            <select
                id={label}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}