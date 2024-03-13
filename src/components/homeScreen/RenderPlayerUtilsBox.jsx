import React from 'react'
import styles from "../../styles/playerCompanion.module.css"
function RenderPlayerUtilsBox({boxToRender}) {
    const [state, setState] = React.useState(boxToRender);


    function handleClick() {

    }

    state.map((box, index) => {
        const classNames = ["", "contusivo", "letal", "agravado"];
        return (
          <div
            key={index}
            index={index}
            className={`${styles.BoxStyle} ${classNames[box]}`}
            value={box}
            onClick={handleClick}
          ></div>
        );
      })
  return (
    <div>RenderPlayerUtilsBox</div>
  )
}

export default RenderPlayerUtilsBox