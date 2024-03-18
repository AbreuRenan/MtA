import React from "react";
import { AppContext } from "../../AppContext";
import { onValue, ref } from "firebase/database";

import styles from "../../styles/rollHistory.module.css";

export default function RollHistory() {
  const { database, errorContextState, setErrorContextState } =
    React.useContext(AppContext);
  const [rollsHistoryData, setRollsHistoryData] = React.useState([]);

  function getRollsHistory() {
    const rollsHistoryRef = ref(database, "rollsHistory");
    onValue(rollsHistoryRef, (snapshotRollsHistory) => {
      setSnapshotDataToState(snapshotRollsHistory.val());
    });
  }

  function setSnapshotDataToState(snapshotVal) {
    const dataArray = [];
    for (const key in snapshotVal) {
      dataArray.push(snapshotVal[key]);
    }
    setRollsHistoryData(dataArray.reverse());
  }

  React.useEffect(() => {
    getRollsHistory();
  }, []);

  const numSucessos = rollsHistoryData[0]?.roll?.filter(
    (roll) => roll >= 8
  ).length;
  return (
    <div className={styles.rollHistoryContainer}>
      {rollsHistoryData.map((item, index) => {
        const rollString = item.roll.map((i, index) => {
          if (index !== item.roll.length - 1) return ` ${i}`;
          return ` ${i}`;
        });
        return (
          <div
            key={index}
            className={`${styles.historyRow} ${
              index % 2 ? styles.evenRow : styles.oddRow
            }`}
          >
            <span>{item.date}</span>
            <span style={{paddingRight: '10px'}}>
              <p style={{padding: '2px 0'}}>{` [ ${rollString} ] `}</p>
              <hr/>
              <p style={{padding: '2px 0'}}>{`  ${numSucessos} sucessos `}</p>
            </span>
            <span>{item.user}</span>
          </div>
        );
      })}
    </div>
  );
}
