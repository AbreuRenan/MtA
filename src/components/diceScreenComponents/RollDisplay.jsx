import React from 'react';
import styles from '../../styles/diceRoller.module.css';


export default function RollDisplay({ rolls }) {
  return (
    <div className={styles?.rollDisplayArea}>
      {rolls?.map((roll, index) => (    
        <div key={index} >
          <span  className={`${getDiceSpanStyle(roll, styles)}`}>{roll}</span>
          <div  className={`${getDiceStyle(roll, styles)} `}></div>
        </div>

      ))}
    </div>
  );
}

// Estiliza os dados baseado no valor
function getDiceStyle(value) {
  if (value >= 10) return 'gd-dice dice animateRoll';
  if (value >= 8) return 'bd-dice dice animateRoll';
  if (value === 1) return 'rd-dice dice animateRoll';
  return 'yd-dice dice animateRoll';
}
function getDiceSpanStyle(value) {
  if (value >= 10) return 'gd';
  if (value >= 8) return 'bd';
  if (value === 1) return 'rd';
  return 'yd';
}
