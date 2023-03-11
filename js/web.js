var buttonViewControls = document.getElementById("buttonViewControls");
var listControls = document.getElementById("listControls");

var labelScore = document.getElementById("labelScore");
var labelLives = document.getElementById("labelLives");
var labelLevel = document.getElementById("labelLevel");

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

export function setLevel(level) {
  labelLevel.innerHTML = `Nivel: ${level}`;
}

export function setScore(score) {
  labelScore.innerHTML = `Puntos: ${score}`;
}

export function setLives(lives) {
  let heart = "♥️";
  let hearts = heart.repeat(lives);
  labelLives.innerHTML = `Vidas: ${hearts}`;

  if (lives == 1) {
    labelLives.style.color = "red";
    labelLives.style.animation = "beat 0.4s infinite alternate";
    labelLives.style.transformOrigin = "center";
  } else {
    labelLives.style.color = "white";
    labelLives.style.animation = "none";
  }
}

export function setSpeed(speed) {
  speed = Math.round(speed * 100) / 100;

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

buttonCloseModal.onclick = () => {
    modalGameOver.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target == modalGameOver) {
    modalGameOver.style.display = "none";
  }
};
