import { Sprite } from "./sprite.js";
import { setScore, setLives, setSpeed, setLevel, setAcceleration, showModalGameOver, reloadHighScores, closeModal } from "./web.js";

var player = new Sprite("player", 150, 40);
var wart = new Sprite("wart", 50, 50);
var coin = new Sprite("coin", 50, 50);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvasParent = document.getElementById("divGame");

var buttonPlay = document.getElementById("buttonPlay");
var buttonReset = document.getElementById("buttonReset");
var inputName = document.getElementById("inputName");
var buttonSaveScore = document.getElementById("buttonSaveScore");

var checkboxAudio = document.getElementById("checkboxAudio");
var audioNextLevel = new Audio("audio/nextLevel.mp3");
var audioGameOver = new Audio("audio/gameOver.mp3");
var audioFail = new Audio("audio/fail.mp3");

var gameRunning = false;
var interval = null;

var level = 1;
var score = 0;
var lives = 3;
var acceleration = 0.1;
var maxSpeed = 0;

export function reset() {
    pauseGame();

    level = 1;
    setLevel(level);

    score = 0;
    setScore(score);

    lives = 3;
    setLives(lives);

    acceleration = 0.1;
    setAcceleration(acceleration);

    resetSprites();
    draw();
}

function resetSprites() {
    player.xSpeed = 0;
    setSpeed(player.xSpeed);

    player.x = 0;
    player.y = canvas.height / 2;

    player.xSpeed = 0;
    player.ySpeed = 0;

    wart.x = canvas.width - wart.width;
    wart.y = Math.random() * (canvas.height - wart.height);

    coin.x = canvas.width / 2 - (100 - (Math.random() * canvas.width) / 4);
    coin.y = Math.random() * (canvas.height - coin.height);
    coin.collected = false;
}

function checkCoinColision() {
    let x = player.x - coin.x + player.width;
    if (x < player.width && x > 0 && Math.abs(player.y - coin.y) < player.height) {
        score += 3;
        setScore(score);
        coin.hidden = true;
        coin.collected = true;
    }
}

function update() {
    player.xSpeed += acceleration;
    setSpeed(player.xSpeed);

    maxSpeed = Math.max(maxSpeed, player.xSpeed);
    maxSpeed = Math.round(maxSpeed * 100) / 100;

    player.x += player.xSpeed;
    player.y += player.ySpeed;

    if (player.y < 0) {
        // Upper screen limit
        player.y = 0;
        player.ySpeed = 0;
    } else if (player.y + player.height > canvas.height) {
        // Lower screen limit
        player.y = canvas.height - player.height;
        player.ySpeed = 0;
    }

    if (player.x + player.width >= canvas.width) {
        if (Math.abs(player.y - wart.y) < wart.height / 2 + 5 + Math.floor(level / 2) * 4 ) {
            nextLevel();
        } else {
            if (checkboxAudio.checked) {
                audioFail.play();
            }

            lives--;
            if (lives == 0) {
                gameOver();
            }
            setLives(lives);
            pauseGame();
            resetSprites();
        }
    }

    if (!coin.collected) {
        checkCoinColision();
    }
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

    if (!coin.hidden) {
        ctx.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height);
    }

    if (!wart.hidden) {
        ctx.drawImage(wart.image, wart.x, wart.y, wart.width, wart.height);
    }
}

function pauseGame() {
    if (interval != null) {
        clearInterval(interval);
    }

    buttonPlay.style.display = "block";
    gameRunning = false;
}

function resumeGame() {
    buttonPlay.style.display = "none";
    interval = setInterval(function () {
        update();
    }, 1000 / 60);
    gameRunning = true;
    wart.hidden = false;

    if (!coin.collected) {
        coin.hidden = false;
    }
}

function gameOver() {
    if (checkboxAudio.checked) {
        audioGameOver.play();
    }

    showModalGameOver();
    document.getElementById("labelLevelReached").innerHTML = `Nivel alcanzado: ${level}`;
    document.getElementById("labelScoreReached").innerHTML = `Puntuación: ${score} puntos`;
    document.getElementById("labelMaxSpeedReached").innerHTML = `Velocidad máxima alcanzada: ${maxSpeed} m/s`;
    document.getElementById(
        "labelMaxAccelerationReached"
    ).innerHTML = `Aceleración máxima alcanzada: ${acceleration} m/s²`;
}

function nextLevel() {
    resetSprites();

    coin.hidden = false;
    coin.collected = false;

    score++;
    setScore(score);

    acceleration += 0.05;
    acceleration = Math.round(acceleration * 100) / 100;
    setAcceleration(acceleration);

    level++;
    setLevel(level);

    if (checkboxAudio.checked) {
        audioNextLevel.play();
    }
}

buttonReset.addEventListener("click", reset);
buttonReset.addEventListener("click", reset);

buttonPlay.addEventListener("click", resumeGame);

document.addEventListener("keydown", function (event) {
    if (event.key == "Escape") {
        pauseGame();
    } else if (event.key == " ") {
        if (gameRunning) {
            pauseGame();
        } else {
            resumeGame();
        }
        event.preventDefault();
    }

    if (!gameRunning) {
        return;
    }

    if (event.key == "ArrowUp") {
        player.ySpeed -= 1;
        // Avoid scrolling down the page
        event.preventDefault();
    } else if (event.key == "ArrowDown") {
        player.ySpeed += 1;
        // Avoid scrolling down the page
        event.preventDefault();
    } else if (event.key == "ArrowLeft" || event.key == "ArrowRight") {
        player.ySpeed = 0;
    }
});

function fitCanvas() {
    canvas.width = canvasParent.clientWidth;
    canvas.height = canvasParent.clientHeight;

    wart.hidden = true;
    coin.hidden = true;

    pauseGame();
    resetSprites();
    draw();
}

function storeScore(name, score, level, maxSpeed, acceleration) {
    let scores = JSON.parse(localStorage.getItem("highScores"));
    if (scores == null) {
        scores = [];
    }

    scores.push({
        name: name,
        score: score,
        level: level,
        maxSpeed: maxSpeed,
        acceleration: acceleration,
    });

    scores.sort(function (a, b) {
        return b.score - a.score;
    });

    if (scores.length > 10) {
        scores = scores.slice(0, 10);
    }

    localStorage.setItem("highScores", JSON.stringify(scores));

    reloadHighScores();
}

inputName.addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        buttonSaveScore.click();
    }
});

buttonSaveScore.addEventListener("click", function () {
    let name = inputName.value;
    if (name == "") {
        console.log("No name");
        return;
    }
    storeScore(name, score, level, maxSpeed, acceleration);
    closeModal();
});

window.onload = function () {
    reset();
};

window.addEventListener("resize", fitCanvas);
fitCanvas();
