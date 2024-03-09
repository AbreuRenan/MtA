import React from "react";

import RollHistory from "./diceScreenComponents/RollHistory";

function Home() {

  React.useEffect(() => {
    window.scrollTo(0, 0); // Isso faz com que a página role para o topo quando o componente for montado
  }, []);
  
  return (
    <div className="container" >

      
      <RollHistory />
    </div>
  );
}

export default Home;
