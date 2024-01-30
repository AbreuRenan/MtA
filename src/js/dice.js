export default function roll() {
  const inputNumberOfDices = document.getElementById("numberDados");
  const resultadoRolagem = makeRoll(inputNumberOfDices.value);
  const dataRolagem = new Date();

  const resultado = {
    hash: "#" + Math.random().toString(16).slice(8),
    data: `${dataRolagem.getHours()}:${dataRolagem.getMinutes()}:${dataRolagem.getSeconds()}`,
    rolagem: [...resultadoRolagem],
  };
  clearDisplayArea();

  updateHistory(resultado, inputNumberOfDices.value);
  playDiceSound();
}
function rollDice(qtdOfSides = 10) {
  const min = 1;
  const max = qtdOfSides + 1;
  const roll = Math.floor(Math.random() * (max - min) + min);
  return roll > 10 ? 10 : roll;
}
function makeRoll(numberOfDices) {
  const rolls = [];
  let numToExplod = getExplosionTargetNum();
  if (numberOfDices > 0) {
    for (numberOfDices; numberOfDices > 0; numberOfDices--) {
      const currentRoll = rollDice();
      rolls.push(currentRoll);
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
    numToExplod = 12;
    const currentRoll = rollDice();
    rolls.push(currentRoll);
    return rolls;
  } else {
    rolls.push("-");
    return rolls;
  }
}

function updateHistory(resultData, numberOfDices) {
  const divHistory = document.getElementById("history");
  const newDivContainer = document.createElement("div");
  const newHashElement = document.createElement("span");
  const newDataElement = document.createElement("span");
  const newRollElement = document.createElement("p");

  const rolledDices = resultData.rolagem;
  const successesTargetNum = numberOfDices > 0 ? 8 : 10;

  newDivContainer.appendChild(newHashElement);
  newDivContainer.appendChild(newDataElement);
  newDivContainer.appendChild(newRollElement);

  newHashElement.innerText = resultData.hash;
  newDataElement.innerText = resultData.data;
  newRollElement.classList.add("rollLine");

  const successes = resultData.rolagem.filter(
    (dice) => dice >= successesTargetNum
  ).length;
  const fails = resultData.rolagem.filter((dice) => dice < 8).length;
  const critFailDices = resultData.rolagem.filter((dice) => dice === 1).length;

  rolledDices.forEach((dice, index) => {
    const newDice = document.createElement("span");
    newDice.innerText = `${dice}`;
    if (dice >= getExplosionTargetNum()) newDice.classList.add("D10");
    // if (dice >= 8 && dice >= successesTargetNum) newDice.classList.add("DSuccess");
    // if (dice > 1 && dice < successesTargetNum) newDice.classList.add("Droll");
    if (dice === 1) newDice.classList.add("D1");
    if (index !== rolledDices.length - 1) newDice.innerText += `,`;
    newRollElement.appendChild(newDice);

    fillDisplayRoll(dice, successesTargetNum);
  });
  rollDisplayArea.appendChild(createDisplayQtd(fails, false));
  rollDisplayArea.appendChild(createDisplayQtd(successes, true));

  divHistory.insertBefore(newDivContainer, divHistory.children[0]);
}

function getExplosionTargetNum() {
  const inputCheckExplosionNum = Array.from(
    document.querySelectorAll(".targetNumExplosion")
  )
    .filter((el) => el.checked)
    .map((el) => el.value);
  const explosionTargetNum = [10, ...inputCheckExplosionNum];
  return Math.min(...explosionTargetNum);
}

function playDiceSound() {
  const audioElement = document.getElementById("diceSound");
  audioElement.play();
}

function fillDisplayRoll(diceRolled, successesTargetNum) {
  const displayArea = document.getElementById("rollDisplayArea");
  const delay = (displayArea.childElementCount + 1) * 100 + 50;
  const newDiceDiv = document.createElement("div");
  const newDiceImg = document.createElement("img");
  const newDiceText = document.createElement("span");

  newDiceText.innerText = diceRolled;

  const keyframe = [
    { transform: "rotate(-360deg)" },
    { transform: "rotate(0deg)" },
  ];
  const timer = {
    duration: delay,
    fill: "forwards",
  };

  newDiceImg.animate(keyframe, timer);
  displayArea.appendChild(newDiceDiv);
  newDiceDiv.appendChild(newDiceText);
  newDiceDiv.appendChild(newDiceImg);

  if (diceRolled >= getExplosionTargetNum()) {
    newDiceImg.src = "/assets/gd.png";
    newDiceText.classList.add("gd");
    newDiceDiv.classList.add("aura");
  }
  if (
    diceRolled >= 8 &&
    diceRolled >= successesTargetNum &&
    !newDiceText.classList.contains("gd")
  ) {
    newDiceImg.src = "/assets/bd.png";
    newDiceText.classList.add("bd");
  }
  if (diceRolled > 1 && diceRolled < successesTargetNum) {
    newDiceImg.src = "/assets/yd.png";
    newDiceText.classList.add("yd");
  }
  if (diceRolled === 1) {
    newDiceImg.src = "/assets/rd.png";
    newDiceText.classList.add("rd");
  }
}

function clearDisplayArea() {
  const displayArea = document.getElementById("rollDisplayArea");
  if (displayArea.childElementCount > 0) displayArea.innerHTML = "";
}

function createDisplayQtd(qtd, type) {
  const newDivElement = document.createElement("div");
  const newSpanNumElement = document.createElement("span");
  const newSpanTextElement = document.createElement("span");
  const classToAdd = type ? "qtdSucesso" : "qtdFalha";

  newDivElement.classList.add(classToAdd);
  if (type) {
    newDivElement.appendChild(newSpanNumElement);
    newDivElement.appendChild(newSpanTextElement);
  }
  if (!type) {
    newDivElement.appendChild(newSpanNumElement);
    newDivElement.appendChild(newSpanTextElement);
  }

  newSpanNumElement.innerText = qtd;
  newSpanTextElement.innerText = `Quantidade de ${
    type ? "Sucessos" : "Falhas"
  }`;

  return newDivElement;
}
