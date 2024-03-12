import React from "react";

import RollHistory from "./diceScreenComponents/RollHistory";
import PlayerCompanion from "./homeScreen/PlayerCompanion";

function Home() {

  React.useEffect(() => {
    window.scrollTo(0, 0); // Isso faz com que a página role para o topo quando o componente for montado
  }, []);
  
  return (
    <div className="container" style={{padding: "20px"}} >
      <PlayerCompanion/>
      <RollHistory />
    </div>
  );
}

export default Home;
