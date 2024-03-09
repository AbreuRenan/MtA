import React from "react";
import { AppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";
import { get, ref, remove, set } from "firebase/database";

export default function AdminConsole() {
  const navigate = useNavigate();
  const { userData, database } = React.useContext(AppContext);
  const [playersData, setPlayersData] = React.useState([]);

  React.useEffect(() => {
    if (userData.role !== "narrador") {
      navigate("/home");
    }

    async function fetchPlayersData() {
      const playersRef = ref(database, "users");
      const playerSnapshot = await get(playersRef);
      const playersList = playerSnapshot.val();
      if (playerSnapshot.exists()) {
        setPlayersData(() => {
          const data = playersList.filter((user) => user.role !== "narrador");
          return data;
        });
      }
    }

    fetchPlayersData();
  }, [userData]);

  function handleDeleteHistory() {
    const rollsRef = ref(database, "rollsHistory");
    remove(rollsRef)
      .then(() => set(rollsRef, ''))
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="container adminConsoleContainer">
      {/* <select name="players" id="">
          {playersData?.map( (player) => {
            return (
              <option key={player.id} value={player.id}>
                {player.nome}
              </option>
            )
          })}
        </select> */}

      <button className="btn DELETAR" onClick={handleDeleteHistory}>
        Apagar RollsHistory
      </button>
    </div>
  );
}
