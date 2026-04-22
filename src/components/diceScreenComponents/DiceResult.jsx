import React from 'react';
import styles from '../../styles/diceRoller.module.css';

const DiceResult = ({ value, index, explosionTarget, successThreshold }) => {
  const diceImgRef = React.useRef(null);

  React.useEffect(() => {
    if (diceImgRef.current) {
      const delay = (index + 1) * 100 + 50;
      const keyframe = [
        { transform: "rotate(-360deg)" },
        { transform: "rotate(0deg)" },
      ];
      const timer = {
        duration: delay,
        fill: "forwards",
      };
      diceImgRef.current.animate(keyframe, timer);
    }
  }, [index]);

  const isExplosion = typeof value === 'number' && value >= explosionTarget;
  const isSuccess = typeof value === 'number' && value >= successThreshold;
  const isCriticalFail = value === 1;

  let diceImgClass = '';
  let textClass = '';

  if (isExplosion) {
    diceImgClass = 'gd-dice';
    textClass = 'gd';
  } else if (value >= 8 && isSuccess) {
    diceImgClass = 'bd-dice';
    textClass = 'bd';
  } else if (value > 1 && value < successThreshold) {
    diceImgClass = 'yd-dice';
    textClass = 'yd';
  } else if (isCriticalFail) {
    diceImgClass = 'rd-dice';
    textClass = 'rd';
  }

  return (
    <div className={isExplosion ? 'aura' : ''}>
      <span className={textClass}>{value}</span>
      <div 
        ref={diceImgRef} 
        className={`dice ${diceImgClass}`}
      ></div>
    </div>
  );
};

export default DiceResult;
