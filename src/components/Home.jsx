import React from "react";

import RollHistory from "./diceScreenComponents/RollHistory";
import PlayerCompanion from "./homeScreen/PlayerCompanion";
import { AppContext } from "../AppContext";

function Home() {
  const { gameOpen, loading } = React.useContext(AppContext);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className={`loadingScreen ${loading && 'isLoading'}`}>Carregando...</div>
      <div className="container" style={{ padding: "20px" }}>
        {!loading && gameOpen ? (
          <div className="openGame">Jogo Aberto</div>
        ) : (
          <div className="closeGame">Jogo Fechado</div>
        )}
        <PlayerCompanion />
        <span>Ultimas Rolagens</span>
        <RollHistory />
      </div>
    </>
  );
}

export default Home;
