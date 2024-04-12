import React from "react";
import { AppContext } from "../../AppContext";
import { onValue, ref } from "firebase/database";

import styles from "../../styles/rollHistory.module.css";

export default function RollHistory({single = false}) {
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
    if(single) {
      const single = dataArray.reverse();
      setRollsHistoryData([single[0]])
    } else {
      setRollsHistoryData(dataArray.reverse());
    }
  }

  React.useEffect(() => {
    getRollsHistory();
  }, []);

  return (
    <div className={styles.rollHistoryContainer}>
      {rollsHistoryData.map((item, index) => {
        const numOfOnes = item.roll.filter((roll) => roll === 1).length;
        let falhaMizeravi = false;
        if (item.sucessos === 0 && numOfOnes === 0) {
          falhaMizeravi = "Nenhum Sucesso";
        }
        if (item.sucessos === 0 && numOfOnes > 0) {
          falhaMizeravi = "Falhou Mizeravi";
        }

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
            <span style={{ paddingRight: "10px" }}>
              <p style={{ padding: "2px 0" }}>{` [ ${rollString} ] `}</p>
              <hr />
              {item.sucessos && !falhaMizeravi ? (
                <p
                  style={{ padding: "2px 0" }}
                >{`  ${item?.sucessos} sucessos `}</p>
              ) : (
                <p
                  style={{ padding: "2px 0", color: 'red' }}
                >{`  ${falhaMizeravi} `}</p>
              )}
            </span>
            <span>{item.user}</span>
          </div>
        );
      })}
    </div>
  );
}
