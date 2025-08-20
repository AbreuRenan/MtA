// hooks/useDiceRoll.js
import { useState } from "react";

export default function useDiceRoll() {
  const [result, setResult] = useState(null);

  const rollDice = (sides = 10) => Math.floor(Math.random() * sides) + 1;

  const makeRoll = (numberOfDices, explosionTarget = 10) => {
    const rolls = [];
    let explosions = 0;

    for (let i = 0; i < numberOfDices; i++) {
      const currentRoll = rollDice();
      rolls.push(currentRoll);
      if (currentRoll >= explosionTarget) explosions++;
    }

    while (explosions > 0) {
      const newRoll = rollDice();
      rolls.push(newRoll);
      explosions = newRoll >= explosionTarget ? 1 : 0; // Só continua se explodir novamente
    }

    return rolls;
  };

  const roll = (numberOfDices, explosionTarget) => {
    const rolagem = makeRoll(numberOfDices, explosionTarget);
    const successThreshold = numberOfDices > 0 ? 8 : 10
    const resultado = {
      hash: "#" + Math.random().toString(16).slice(8),
      date: new Date().toLocaleTimeString(),
      rolagem,
      sucessos: rolagem.filter((r) => r >= successThreshold).length,
    };
    setResult(resultado);
    return resultado;
  };

  return { roll, result };
}
