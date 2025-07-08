import React from "react";
import { AppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";
import { get, ref, remove, set, update, onValue } from "firebase/database";
import PlayerDisplayAdmin from "./playerDisplayAdmin";

import styles from "./adminStyles.module.css";
import RollHistory from "../diceScreenComponents/RollHistory";

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
        const data = Object.values(playersList)
          .filter((user) => user.role !== "narrador")
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
    remove(rollsRef)
      .then(() => set(rollsRef, ""))
      .catch((err) => {
        console.log(err);
      });
  };

  function handleOpenGame() {
    setGameOpen(!gameOpen);
  }
  return (
    <div className={`${styles.adminConsoleContainer}`}>
      <RollHistory single={true} />
      <div className={styles.btnContainer}>
        <button className={`btn ${styles.deletar}`}onClick={handleDeleteHistory}>
          Apagar RollsHistory
        </button>
        <button className={`btn ${!gameOpen ? `${styles.openGame}` : `${styles.closeGame}`}`}
          onClick={handleOpenGame}>
          {!gameOpen ? "Abrir Jogo" : "Fechar Jogo"}
        </button>
      </div>
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
  );
}
