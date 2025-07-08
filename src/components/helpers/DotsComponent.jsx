import React from "react";

import styles from "../styles/dotsComponent.module.css"

function Dots({ numberOfDots = 1 }) {
  const [dots, setDots] = React.useState(numberOfDots);

  function handleClick({target}) {
    const value = target.getAttribute('data-value')
    setDots(value)
  }
  return (
    <div className={`${styles.dotsContainer}`}>
      <div className={`${styles.dots} ${dots>=1? styles.isMarked: ''}`} onClick={handleClick} data-value={1}></div>
      <div className={`${styles.dots} ${dots>=2? styles.isMarked: ''}`} onClick={handleClick} data-value={2}></div>
      <div className={`${styles.dots} ${dots>=3? styles.isMarked: ''}`} onClick={handleClick} data-value={3}></div>
      <div className={`${styles.dots} ${dots>=4? styles.isMarked: ''}`} onClick={handleClick} data-value={4}></div>
      <div className={`${styles.dots} ${dots>=5? styles.isMarked: ''}`} onClick={handleClick} data-value={5}></div>
    </div>
  );
}

export default Dots;
