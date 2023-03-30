import { reset } from "./game.js";

var buttonViewControls = document.getElementById("buttonViewControls");
var buttonViewHighScores = document.getElementById("buttonViewHighScores");
var listControls = document.getElementById("listControls");
var divHighScores = document.getElementById("divHighScores");
let tableHighScores = document.getElementById("tableHighScores");

var labelScore = document.getElementById("labelScore");
var labelLives = document.getElementById("labelLives");
var labelLevel = document.getElementById("labelLevel");
var labelSpeed = document.getElementById("labelSpeed");
var labelAcceleration = document.getElementById("labelAcceleration");
var flexHearts = document.getElementById("flexHearts");

buttonViewControls.addEventListener("click", function () {
  if (listControls.style.display == "block") {
    listControls.style.display = "none";
    buttonViewControls.innerHTML = "Ver controles";
  } else {
    listControls.style.display = "block";
    buttonViewControls.innerHTML = "Ocultar controles";
    // Scroll to bottom
    window.scrollTo(0, document.body.scrollHeight);
  }
});

buttonViewHighScores.addEventListener("click", function () {  
  if (divHighScores.style.display == "block") {
    divHighScores.style.display = "none";
    buttonViewHighScores.innerHTML = "Ver puntuaciones";
  } else {
    reloadHighScores();
    divHighScores.style.display = "block";
    buttonViewHighScores.innerHTML = "Ocultar puntuaciones";
    // Scroll to bottom
    window.scrollTo(0, document.body.scrollHeight);
  }
});

export function setLevel(level) {
  labelLevel.innerHTML = `Nivel: ${level}`;
}

export function setScore(score) {
  labelScore.innerHTML = `Puntos: ${score}`;
}

function showHearts(heartNumber) {
  for (let i = 1; i <= heartNumber; i++) {
    let heart = document.getElementById(`heart${i}`);
    heart.style.display = "block";
  }

  for (let i = 3; i > heartNumber; i--) {
    let heart = document.getElementById(`heart${i}`);
    heart.style.display = "none";
  }
}

export function setLives(lives) {
  if (lives == 1) {
    labelLives.style.color = "red";
    flexHearts.style.animation = "beat 0.4s infinite alternate";
    flexHearts.style.transformOrigin = "center";
  } else {
    labelLives.style.color = "white";
    flexHearts.style.animation = "none";
  }

  showHearts(lives);
}

export function setSpeed(speed) {
  speed = Math.round(speed * 10) / 10;

  let low = 15;
  let medium = 30;

  labelSpeed.innerHTML = `Velocidad: ${speed} m/s`;

  if (speed < low) {
    labelSpeed.style.color = "white";
  } else if (speed >= low && speed < medium) {
    labelSpeed.style.color = "orange";
  } else if (speed >= medium) {
    labelSpeed.style.color = "red";
  }
}

export function setAcceleration(acceleration) {
  acceleration = Math.round(acceleration * 100) / 100;
  labelAcceleration.innerHTML = `Aceleración: ${acceleration} m/s²`;
}

var modalGameOver = document.getElementById("modalGameOver");
var buttonCloseModal = document.getElementById("buttonCloseModal");

export function showModalGameOver() {
    modalGameOver.style.display = "block";
};

buttonCloseModal.onclick = closeModal;

export function closeModal() {
    modalGameOver.style.display = "none";
    reset();
}

export function reloadHighScores() {
    let highScores = JSON.parse(localStorage.getItem("highScores"));

    tableHighScores.innerHTML = `
    <label>Nombre</label>
    <label>Puntuación</label>
    <label>Nivel</label>
    <label>Velocidad</label>
    <label>Aceleración</label>`;

    if (!highScores) {
      return;
    }

    highScores.sort((a, b) => b.score - a.score);

    for (let i = 0; i < highScores.length; i++) {
        let cellName = tableHighScores.appendChild(document.createElement("label"));
        cellName.innerHTML = highScores[i].name;

        let cellScore = tableHighScores.appendChild(document.createElement("label"));
        cellScore.innerHTML = highScores[i].score;

        let cellLevel = tableHighScores.appendChild(document.createElement("label"));
        cellLevel.innerHTML = highScores[i].level;

        let cellMaxSpeed = tableHighScores.appendChild(document.createElement("label"));
        cellMaxSpeed.innerHTML = highScores[i].maxSpeed;

        let cellAcceleration = tableHighScores.appendChild(document.createElement("label"));
        cellAcceleration.innerHTML = highScores[i].acceleration;
    }
}
 
// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target == modalGameOver) {
    modalGameOver.style.display = "none";
  }
};
