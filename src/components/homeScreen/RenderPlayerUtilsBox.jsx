import React from "react";
import styles from "../../styles/playerCompanion.module.css";
import { AppContext } from "../../AppContext";

function RenderPlayerUtilsBox({ boxToRender, type, clickHandler }) {
  const { database } = React.useContext(AppContext);
  const [state, setState] = React.useState([0]);

  React.useEffect( () => {setState(boxToRender)}, [boxToRender]);
  

  return (
    <div>
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
