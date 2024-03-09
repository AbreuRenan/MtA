import React from "react";
import { AppContext } from "../../AppContext";
import { onValue, ref } from "firebase/database";


import styles from '../../styles/rollHistory.module.css'

export default function RollHistory() {
  const {database} = React.useContext(AppContext);
  const [ rollsHistoryData, setRollsHistoryData] = React.useState([])

  function getRollsHistory(){
    const rollsHistoryRef = ref(database, 'rollsHistory');
    onValue(rollsHistoryRef, (snapshotRollsHistory) => {
      setSnapshotDataToState(snapshotRollsHistory.val())
    })
  }

  function setSnapshotDataToState(snapshotVal) {
    const dataArray = []
    for (const key in snapshotVal) {
      dataArray.push(snapshotVal[key])
    }
    setRollsHistoryData(dataArray.reverse())
  }


  React.useEffect( () => {
    getRollsHistory()
  }, [])



  return (
    <>
      {rollsHistoryData.map((item, index) => {
        const rollString = item.roll.map( (i, index)=> {
            if (index !== item.roll.length -1) return `${i} `
            return `${i}`
        })
        return (
          <div key={index} className={`${styles.historyRow} ${index%2 ? styles.evenRow : styles.oddRow}`} >
            <span>{item.date}</span>
            <span>{` [ ${rollString} ] `}</span>
            <span>{item.user}</span>
          </div>
        );
      })}
    </>
  );
}
