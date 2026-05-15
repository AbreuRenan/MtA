import React from "react";
import { AppContext } from "../../AppContext";
import { onValue, ref, query, limitToLast } from "firebase/database";

import styles from "../../styles/rollHistory.module.css";

export default function LogHistory() {
  const { database } = React.useContext(AppContext);
  const [logsData, setLogsData] = React.useState([]);

  React.useEffect(() => {
    const logsRef = query(ref(database, "actionLogs"), limitToLast(20));
    const unsubscribe = onValue(logsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const dataArray = Object.keys(data).map((key) => data[key]);
        setLogsData(dataArray.reverse());
      } else {
        setLogsData([]);
      }
    });

    return () => unsubscribe();
  }, [database]);

  function formatVitality(vitalityStr) {
    try {
      const v = JSON.parse(vitalityStr);
      return `C:${v.contusivo} L:${v.letal} A:${v.agravado}`;
    } catch (e) {
      return vitalityStr;
    }
  }

  return (
    <div className={styles.rollHistoryContainer}>
      {logsData.length === 0 ? (
        <p style={{ textAlign: "center", padding: "10px", color: "#666" }}>Sem logs recentes.</p>
      ) : (
        logsData.map((log, index) => (
          <div
            key={index}
            className={`${styles.historyRow} ${
              index % 2 ? styles.evenRow : styles.oddRow
            }`}
            style={{ color: log.isAdminAction ? "#00ffff" : "inherit" }}
          >
            <span>{log.timestamp}</span>
            <span style={{ flex: 2 }}>
              <p>
                <strong>{log.type}:</strong>{" "}
                {log.type === "Vitalidade" ? (
                  <>
                    {formatVitality(log.antes)} ➔ {formatVitality(log.depois)}
                  </>
                ) : (
                  <>
                    {log.antes} ➔ {log.depois} {log.custo ? `(Custo: ${log.custo})` : ""}
                  </>
                )}
              </p>
            </span>
            <span>
              {log.isAdminAction && log.targetUser
                ? `${log.userName} ➔ ${log.targetUser}`
                : log.userName}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
