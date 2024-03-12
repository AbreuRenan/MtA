import React from "react";

function PlayerDisplayAdmin({ player }) {
  const { exp, expA, nome, vitalidade, mana, fv } = player;
  const { max, dano } = vitalidade 

  const divContainerStyle = {
    backgroundColor: "#777",
    padding: "20px",
    borderRadius: "8px",
    width: "50%",
    display: "grid",
  };

  console.log(Object.keys(dano))

  return (
    <div style={divContainerStyle}>
      <h1>{nome}</h1>
      <div>
        <span>{exp}</span>
        <span> | </span>
        <span>{expA}</span>
      </div>
      <div>{max} |  {Object.keys(dano).map( key => <span>{dano[key]}</span>)}</div>
    </div>
  );
}

export default PlayerDisplayAdmin;
