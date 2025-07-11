import React from "react";

import RollHistory from "./diceScreenComponents/RollHistory";
import PlayerCompanion from "./homeScreen/PlayerCompanion";
import { AppContext } from "../AppContext";
import Loading from "./helpers/Loading";

function Home() {
  const { gameOpen, loading, userData } = React.useContext(AppContext);
  const [gameOpenBanner, setGameOpenBanner] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(()=> {
    if(!loading && gameOpen) return setGameOpenBanner(true)
    setGameOpenBanner(false)
  },[gameOpen, loading] )
  return (
    <>
      <Loading/>
      <div className="container">
        {gameOpenBanner ? (
          <div className="openGame">Jogo Aberto</div>
        ) : (
          <div className="closeGame">Jogo Fechado</div>
        )}
       {/* {userData && userData?.role !== "narrador" ? (<PlayerCompanion />) : null} */}
       {userData ? (<PlayerCompanion />) : null}
        <span>Ultimas Rolagens</span>
        <RollHistory />
      </div>
    </>
  );
}

export default Home;
