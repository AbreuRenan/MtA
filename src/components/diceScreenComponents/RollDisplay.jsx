import React from 'react';
import styles from '../../styles/diceRoller.module.css';

export default function RollDisplay({ rolls }) {
  return (
    <div className={styles?.rollDisplayArea}>
      {rolls?.map((roll, index) => (
        <span key={index} className={getDiceStyle(roll)}>
          {roll}
        </span>
      ))}
    </div>
  );
}

// Estiliza os dados baseado no valor
function getDiceStyle(value) {
  if (value >= 10) return styles.diceExploded;
  if (value >= 8) return styles.diceSuccess;
  if (value === 1) return styles.diceCriticalFail;
  return styles.diceNormal;
}