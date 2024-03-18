import React from "react";

import RollHistory from "./diceScreenComponents/RollHistory";
import PlayerCompanion from "./homeScreen/PlayerCompanion";
import { AppContext } from "../AppContext";

function Home() {
  const { gameOpen } = React.useContext(AppContext);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  console.log(gameOpen);
  return (
    <div className="container" style={{ padding: "20px" }}>
      {gameOpen ? (
        <div className="openGame">Jogo Aberto</div>
      ) : (
        <div className="closeGame">Jogo Fechado</div>
      )}
      <PlayerCompanion />
      <span>Ultimas Rolagens</span>
      <RollHistory />
    </div>
  );
}

export default Home;
