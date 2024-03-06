export default function roll() {
  const inputNumberOfDices = document.getElementById("numberDados");
  const resultadoRolagem = makeRoll(inputNumberOfDices.value);
  const dataRolagem = new Date();

  const resultado = {
    hash: "#" + Math.random().toString(16).slice(8),
    date: `${dataRolagem.getHours()}:${dataRolagem.getMinutes()}:${dataRolagem.getSeconds() < 10 ? '0'+dataRolagem.getSeconds() : dataRolagem.getSeconds() }`,
    rolagem: [...resultadoRolagem],
  };
  clearDisplayArea();
  updateHistory(resultado, inputNumberOfDices.value);
  playDiceSound();
  return resultado;
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
  newDataElement.innerText = 'Hora: '+resultData.date;
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
    if (dice === 1) newDice.classList.add("D1");
    if (index !== rolledDices.length - 1) newDice.innerText += `,`;
    newRollElement.appendChild(newDice);
    fillDisplayRoll(dice, successesTargetNum);
  });



  if (successes === 0 && critFailDices > 0) {
    rollDisplayArea.appendChild(createCritFail(critFailDices))
  } else {
    rollDisplayArea.appendChild(createDisplayQtd(fails, false));
    rollDisplayArea.appendChild(createDisplayQtd(successes, true));
  }

  // divHistory.insertBefore(newDivContainer, divHistory.children[0]);
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
  const newDiceImg = document.createElement("div");
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
    newDiceImg.classList.add('gd-dice');
    newDiceImg.classList.add('dice');
    newDiceText.classList.add("gd");
    newDiceDiv.classList.add("aura");
  }
  if (
    diceRolled >= 8 &&
    diceRolled >= successesTargetNum &&
    !newDiceText.classList.contains("gd")
  ) {
    newDiceImg.classList.add('bd-dice');
    newDiceImg.classList.add('dice');
    newDiceText.classList.add("bd");
  }
  if (diceRolled > 1 && diceRolled < successesTargetNum) {
    newDiceImg.classList.add('yd-dice');
    newDiceImg.classList.add('dice');
    newDiceText.classList.add("yd");
  }
  if (diceRolled === 1) {
    newDiceImg.classList.add('rd-dice');
    newDiceImg.classList.add('dice');
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

  newSpanNumElement.innerText = 0;
  newSpanNumElement.setAttribute('data-count', qtd);
  newSpanTextElement.innerText = `Quantidade de ${
    type ? "Sucessos" : "Falhas"
  }`;
  
  animateCount(newSpanNumElement);
  return newDivElement;
}

function createCritFail(qtdDices) {
  const newDivElement = document.createElement("div");
  const newSpanNumElement = document.createElement("span");
  const newSpanTextElement = document.createElement("span");
  const classToAdd = "falhaCrit";

  newDivElement.classList.add(classToAdd);
  newSpanNumElement.innerText = qtdDices;
  newSpanTextElement.innerText = 'Falha Crítica!!!'
  // newDivElement.appendChild(newSpanNumElement);
  newDivElement.appendChild(newSpanTextElement);
  return newDivElement


}

function animateCount(element) {
  const interval  = 250;
  let startValue = 0;
  let endValue = parseInt(element.getAttribute('data-count'));
  const duration = Math.floor(interval / endValue);
  if (endValue != 0){
    let counter = setInterval( () => {
      startValue += 1;
      element.innerText = startValue
      if (startValue == endValue) {
        clearInterval(counter)
      }
    }, duration )
  }
}