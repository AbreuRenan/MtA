import React from "react";

import RollHistory from "./diceScreenComponents/RollHistory";
import PlayerCompanion from "./homeScreen/PlayerCompanion";
import { AppContext } from "../AppContext";
import Loading from "./helpers/Loading";

function Home() {
  const { gameOpen, loading, userData } = React.useContext(AppContext);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Loading/>
      <div className="container">
        {!loading && gameOpen ? (
          <div className="openGame">Jogo Aberto</div>
        ) : (
          <div className="closeGame">Jogo Fechado</div>
        )}
       {userData && userData?.role !== "narrador" ? (<PlayerCompanion />) : null}
        <span>Ultimas Rolagens</span>
        <RollHistory />
      </div>
    </>
  );
}

export default Home;
