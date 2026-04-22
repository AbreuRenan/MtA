export default function roll(numberOfDices, explosionTarget = 10) {
  const resultadoRolagem = makeRoll(numberOfDices, explosionTarget);
  const dataRolagem = new Date();
  const successThreshold = numberOfDices > 0 ? 8 : 10;
  
  const resultado = {
    hash: "#" + Math.random().toString(16).slice(8),
    date: `${
      dataRolagem.getHours() < 10
        ? "0" + dataRolagem.getHours()
        : dataRolagem.getHours()
    }:${
      dataRolagem.getMinutes() < 10
        ? "0" + dataRolagem.getMinutes()
        : dataRolagem.getMinutes()
    }:${
      dataRolagem.getSeconds() < 10
        ? "0" + dataRolagem.getSeconds()
        : dataRolagem.getSeconds()
    }`,
    rolagem: [...resultadoRolagem],
    sucessos: [...resultadoRolagem].filter(val => typeof val === 'number' && val >= successThreshold).length,
    falhas: [...resultadoRolagem].filter(val => typeof val === 'number' && val < 8).length,
    critFailDices: [...resultadoRolagem].filter(val => val === 1).length,
    successThreshold,
    explosionTarget
  };

  return resultado;
}

function rollDice(qtdOfSides = 10, bonus = 1) {
  const min = 1;
  const max = qtdOfSides + bonus;
  const rollValue = Math.floor(Math.random() * (max - min) + min);
  return rollValue > 10 ? 10 : rollValue;
}

function makeRoll(numberOfDices, explosionTarget) {
  const rolls = [];
  const numToExplod = explosionTarget;
  
  if (numberOfDices > 0) {
    let dicesLeft = numberOfDices;
    while (dicesLeft > 0) {
      const currentRoll = rollDice();
      rolls.push(currentRoll);
      dicesLeft--;
    }
    
    let numOfExplodedDices = rolls.filter((dice) => dice >= numToExplod).length;
    while (numOfExplodedDices !== 0) {
      numOfExplodedDices--;
      const currentRoll = rollDice();
      rolls.push(currentRoll);
      if (currentRoll >= numToExplod) numOfExplodedDices++;
    }
    return rolls;
  } else if (numberOfDices >= -5) {
    // Chance Die logic
    const currentRoll = rollDice();
    rolls.push(currentRoll);
    return rolls;
  } else {
    rolls.push("-");
    return rolls;
  }
}
