import React from "react";
import { AppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";
import { get, ref, remove, set, update, onValue } from "firebase/database";
import PlayerDisplayAdmin from "./playerDisplayAdmin";
import { pushLog } from "../../js/logUtils";

import styles from "./adminStyles.module.css";
import RollHistory from "../diceScreenComponents/RollHistory";
import LogHistory from "./LogHistory";

export default function AdminScreen() {
  const navigate = useNavigate();
  const { userData, database, gameOpen, setGameOpen } = React.useContext(AppContext);
  const [playersData, setPlayersData] = React.useState([]);

  React.useEffect(() => {
    if (userData.role !== "narrador") {
      navigate("/home");
    }
    const usersRef = ref(database, "users");

    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const playersList = snapshot.val();
        const data = Object.keys(playersList)
          .map((key) => ({ ...playersList[key], id: key }))
          .filter((user) => user?.role !== "narrador" && user?.nome)
          .sort((a, b) => {
            let fa = a.nome.toLowerCase();
            let fb = b.nome.toLowerCase();
            return fa < fb ? -1 : fa > fb ? 1 : 0;
          });
        setPlayersData(data);
      } else {
        setPlayersData([]); // Limpa se não houver dados
      }
    });

    return () => unsubscribe();
  }, [userData, database, navigate]);

  async function handlePlayerUpdate(userId, path, newValue) {
    try {
      const playerPathRef = ref(database, `users/${userId}/${path}`);

      let valueToSave = newValue;
      if (typeof newValue === "string" && !isNaN(Number(newValue))) {
        valueToSave = Number(newValue);
      }
      await set(playerPathRef, valueToSave);

      const targetPlayer = playersData.find(p => p.id === userId);
      if (targetPlayer) {
          let type = "";
          let antes = 0;
          let depois = 0;
          
          if (path === "fv/usado") {
              type = "Vontade";
              antes = targetPlayer.fv.max - (targetPlayer.fv.usado || 0);
              depois = targetPlayer.fv.max - valueToSave;
          } else if (path === "mana/usado") {
              type = "Mana";
              antes = targetPlayer.mana.max - (targetPlayer.mana.usado || 0);
              depois = targetPlayer.mana.max - valueToSave;
          } else if (path === "fv/max") {
              type = "Vontade Max";
              antes = targetPlayer.fv.max || 0;
              depois = valueToSave;
          } else if (path === "mana/max") {
              type = "Mana Max";
              antes = targetPlayer.mana.max || 0;
              depois = valueToSave;
          } else if (path === "vitalidade/max") {
              type = "Vitalidade Max";
              antes = targetPlayer.vitalidade.max || 0;
              depois = valueToSave;
          }

          if (type) {
              pushLog(database, userData, type, {
                 antes,
                 depois,
                 targetUser: targetPlayer.nome,
                 isAdminAction: true
              });
          }
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do jogador:", error);
    }
  }

  React.useEffect(() => {
    const gameRef = ref(database, "gameStatus");
    const newGameStatus = { gameStatus: gameOpen };
    update(gameRef, newGameStatus);
  }, [gameOpen]);

  const handleDeleteHistory = () => {
    const rollsRef = ref(database, "rollsHistory");
    remove(rollsRef).catch((err) => {
      console.log(err);
    });
  };

  const handleDeleteLogs = () => {
    const logsRef = ref(database, "actionLogs");
    remove(logsRef).catch((err) => {
      console.log(err);
    });
  };

  function handleOpenGame() {
    setGameOpen(!gameOpen);
  }
  return (
    <div className={`${styles.adminConsoleContainer}`}>
      <div className={styles.topFixedArea}>
        <div className={styles.btnContainer}>
          <button className={`btn ${styles.deletar}`}onClick={handleDeleteHistory}>
            Apagar Rolls
          </button>
          <button className={`btn ${styles.deletar}`}onClick={handleDeleteLogs}>
            Apagar Logs
          </button>
          <button className={`btn ${!gameOpen ? `${styles.openGame}` : `${styles.closeGame}`}`}
            onClick={handleOpenGame}>
            {!gameOpen ? "Abrir Jogo" : "Fechar Jogo"}
          </button>
        </div>
        <div className={styles.historiesContainer}>
          <div className={styles.historySection}>
            <span className={styles.sectionTitle}>Histórico de Rolagens</span>
            <RollHistory single={true} />
          </div>
          <div className={styles.historySection}>
            <span className={styles.sectionTitle}>Log de Recursos</span>
            <div className={styles.logContainer}>
              <LogHistory />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.playersListContainer}>
        {playersData.map((selectedPlayer, index) => {
          return (
            <PlayerDisplayAdmin
              player={selectedPlayer}
              key={selectedPlayer.id}
              onUpdatePlayer={handlePlayerUpdate}
            />
          );
        })}
      </div>
    </div>

  );
}
