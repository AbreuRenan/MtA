import React from "react";
import { AppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";

import mushu from "../../assets/mushuDoEvento.jpeg";

function Event() {
  const [viewOnce, setViewOnce] = React.useState(false);
  const { hasEvent, userData } = React.useContext(AppContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("viewer"));
    if (!hasEvent) navigate("/home");
    if (!viewOnce && !localData) {
      setViewOnce(true);
      const viewerLog = { nome: userData.nome, viewOnce: true };
      localStorage.setItem("viewer", JSON.stringify(viewerLog));
    } else {
      console.log(localData);
    }
  }, []);

  return (
    <>
      <div className="gradContainer">
        <div className="gradOverImg"></div>
        <img src={mushu} alt="imagem do evento" className="imgDoEvento" />
      </div>
      <div className="eventContainer">
        <h1>Tesouros</h1>
        <div className="grid">
            <div className="gridItem titulo">Barganha </div>
            <div className="gridItem titulo">Preço</div>
            <div className="gridItem">2 Clássicos pelo preço de 1 <span>Habilidade chave é sorteada</span></div>
            <div className="gridItem">0/2</div>
            <div className="gridItem">Yantra Abissal <span>Yantra além do limite, adiciona 2d ao paradoxo</span></div>
            <div className="gridItem">4/0</div>
            <div className="gridItem">Poção de Mana <span>Pode causar vício</span></div>
            <div className="gridItem">2</div>
        </div>
      </div>
    </>
  );
}

export default Event;
