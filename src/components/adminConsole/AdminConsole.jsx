import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";
import { get, ref, remove, set, update } from "firebase/database";
import PlayerDisplayAdmin from "./playerDisplayAdmin";

export default function AdminConsole() {
  const navigate = useNavigate();
  const { userData, database, gameOpen, setGameOpen} = useContext(AppContext);
  const [playersData, setPlayersData] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    if (userData.role !== "narrador") {
      navigate("/home");
    }
    async function fetchPlayersData() {
      const playersRef = ref(database, "users");
      const playerSnapshot = await get(playersRef);
      const playersList = playerSnapshot.val();
      if (playerSnapshot.exists()) {
        const data = Object.values(playersList).filter((user) => user.role !== "narrador");
        setPlayersData(data);
      }
    }
    fetchPlayersData();
  }, [userData, database, navigate]);

  useEffect( ()=> {
    const gameRef = ref(database, "gameStatus");
    const newGameStatus = {gameStatus: gameOpen}
    update(gameRef, newGameStatus)
  }, [gameOpen])



  const handleDeleteHistory = () => {
    const rollsRef = ref(database, "rollsHistory");
    remove(rollsRef)
      .then(() => set(rollsRef, ''))
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOptionSelect = (event) => {
    const selectedIndex = event.target.value;
    const selectPlayerData = playersData[selectedIndex];
    setSelectedPlayer(selectPlayerData);

  }

  function handleOpenGame() {
    setGameOpen(!gameOpen);
  }
  return (
    <div className="container adminConsoleContainer">
      <select name="players" onChange={handleOptionSelect} defaultValue={'default'}>
        <option value="default" disabled hidden>Escolha um jogador</option>
        {playersData.map((player, index) => (
          <option key={index} value={index}>
            {player.nome}
          </option>
        ))}
      </select>
      {selectedPlayer && <PlayerDisplayAdmin player={selectedPlayer} />}
      <button className="btn DELETAR" onClick={handleDeleteHistory}>
        Apagar RollsHistory
      </button>
      <button className={`btn ${!gameOpen ? 'openGame' : 'closeGame'}`} onClick={handleOpenGame}>
        {!gameOpen ? 'Abrir Jogo' : 'Fechar Jogo'}
      </button>
    </div>
  );
}
