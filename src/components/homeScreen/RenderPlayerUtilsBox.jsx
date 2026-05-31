import React from "react";
import styles from "../../styles/playerCompanion.module.css";
import { AppContext } from "../../AppContext";

function RenderPlayerUtilsBox({ boxToRender, type, clickHandler, disabled }) {
  const { database } = React.useContext(AppContext);
  const [state, setState] = React.useState([0]);

  React.useEffect( () => {setState(boxToRender)}, [boxToRender]);
  

  return (
    <div style={{ opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? "none" : "auto", transition: "opacity 0.2s ease" }}>
      <span>{type}</span>
      <div className={styles.boxContainer}>{state?.map((box, index) => {
    const classNames = ["", "contusivo", "letal", "agravado"];
    return (
      <div
        key={index}
        index={index}
        className={`${styles.BoxStyle} ${classNames[box]}`}
        value={box}
        onClick={clickHandler}
      ></div>
    );
  })}</div>
    </div>
  );
}

export default RenderPlayerUtilsBox;
