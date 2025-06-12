import React from 'react';
import styles from '../../styles/diceRoller.module.css';


export default function RollDisplay({ rolls }) {
  return (
    <div className={styles?.rollDisplayArea}>
      {rolls?.map((roll, index) => (    

        <span key={index} className={`${getDiceStyle(roll, styles)}`}>
          {roll}
          {console.log(getDiceStyle(roll))}
        </span>
      ))}
    </div>
  );
}

// Estiliza os dados baseado no valor
function getDiceStyle(value) {
  if (value >= 10) return 'gd-dice dice';
  if (value >= 8) return 'bd-dice dice';
  if (value === 1) return 'rd-dice dice';
  return 'yd-dice dice';
}
