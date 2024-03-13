import React from "react";

import RollHistory from "./diceScreenComponents/RollHistory";
import PlayerCompanion from "./homeScreen/PlayerCompanion";

function Home() {

  React.useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);
  
  return (
    <div className="container" style={{padding: "20px"}} >
      <PlayerCompanion/>
      <RollHistory />
    </div>
  );
}

export default Home;
