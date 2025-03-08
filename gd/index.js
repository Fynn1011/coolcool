const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const finalScoreDisplay = document.getElementById('final-score');

let isJumping = false;
let gameRunning = false;
let gameSpeed = 7;
let gravity = 0.9;
let jumpForce = -12;
let playerVelocity = 0;
let score = 0;
let obstacles = [];
let nextObstacleTime = 0;
let lastTime = 0;
let obstacleTypes = [
    { width: 30, height: 30 },
    { width: 30, height: 45 },
    { width: 50, height: 30 },
    { width: 20, height: 50 }
];

// Animation für Spieler-Rotation
let rotation = 0;

function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameRunning = true;
    score = 0;
    scoreDisplay.textContent = score;
    obstacles = [];
    nextObstacleTime = 0;
    gameSpeed = 5;
    playerVelocity = 0;
    player.style.bottom = '60px';
    player.style.transform = 'rotate(0deg)';
    rotation = 0;
    
    requestAnimationFrame(updateGame);
}

function endGame() {
    gameRunning = false;
    gameOverScreen.style.display = 'flex';
    finalScoreDisplay.textContent = `Punkte: ${score}`;
}

function jump() {
    if (!isJumping && gameRunning) {
        isJumping = true;
        playerVelocity = jumpForce;
    }
}

function createObstacle() {
    const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.width = `${obstacleType.width}px`;
    obstacle.style.height = `${obstacleType.height}px`;
    obstacle.style.left = `${gameContainer.offsetWidth}px`;
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
}

function updateObstacles(deltaTime) {
    nextObstacleTime -= deltaTime;
    
    if (nextObstacleTime <= 0) {
        createObstacle();
        nextObstacleTime = 1500 + Math.random() * 1000; // 1.5-2.5 Sekunden
        
        // Prüfe, ob das vorherige Hindernis bereits genug Abstand hat
        const lastObstacle = obstacles[obstacles.length - 2];
        if (lastObstacle && parseFloat(lastObstacle.style.left) > gameContainer.offsetWidth - 250) {
            nextObstacleTime += 1000; // Verzögere das nächste Hindernis
        }
    }
    
    const obstacleSpeed = gameSpeed * deltaTime / 16; // Für gleichmäßige Bewegung
    
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        const obstacleLeft = parseFloat(obstacle.style.left);
        obstacle.style.left = `${obstacleLeft - obstacleSpeed}px`;
        
        // Hindernis außerhalb des Bildschirms
        if (obstacleLeft < -50) {
            obstacle.remove();
            obstacles.splice(i, 1);
            score++;
            scoreDisplay.textContent = score;
            
            // Erhöhe Spielgeschwindigkeit alle 10 Punkte
            if (score % 10 === 0) {
                gameSpeed += 0.8;
            }
        }
        
        // Kollisionserkennung
        if (checkCollision(player, obstacle)) {
            endGame();
        }
    }
}

function checkCollision(player, obstacle) {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    
    // Schrumpfe die Hitboxen für eine großzügigere Kollisionserkennung
    const shrinkFactor = 5; // Pixel, die von allen Seiten abgezogen werden
    
    const playerHitbox = {
        left: playerRect.left + shrinkFactor,
        right: playerRect.right - shrinkFactor,
        top: playerRect.top + shrinkFactor,
        bottom: playerRect.bottom - shrinkFactor
    };
    
    const obstacleHitbox = {
        left: obstacleRect.left + shrinkFactor,
        right: obstacleRect.right - shrinkFactor,
        top: obstacleRect.top + shrinkFactor,
        bottom: obstacleRect.bottom - shrinkFactor
    };
    
    return !(
        playerHitbox.right < obstacleHitbox.left ||
        playerHitbox.left > obstacleHitbox.right ||
        playerHitbox.bottom < obstacleHitbox.top ||
        playerHitbox.top > obstacleHitbox.bottom
    );
}

function updatePlayerPosition(deltaTime) {
    // Anwenden der Schwerkraft
    playerVelocity += gravity * deltaTime / 16;
    
    // Aktualisieren der Spielerposition
    const currentBottom = parseFloat(window.getComputedStyle(player).bottom);
    let newBottom = currentBottom - playerVelocity;
    
    // Boden-Kollision
    if (newBottom <= 60) {
        newBottom = 60;
        playerVelocity = 0;
        isJumping = false;
        rotation = 0;
    } else {
        // Rotation während des Sprungs
        rotation += deltaTime * 0.2;
        if (rotation > 360) rotation = 0;
    }
    
    player.style.bottom = `${newBottom}px`;
    player.style.transform = `rotate(${rotation}deg)`;
}

function updateGame(timestamp) {
    if (!gameRunning) return;
    
    const deltaTime = lastTime ? timestamp - lastTime : 16;
    lastTime = timestamp;
    
    updatePlayerPosition(deltaTime);
    updateObstacles(deltaTime);
    
    requestAnimationFrame(updateGame);
}

// Event-Listener
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        if (gameOverScreen.style.display === 'flex') {
            startGame();
        } else if (!gameRunning && !startScreen.style.display) {
            startGame();
        } else if (gameRunning) {
            jump();
        }
        event.preventDefault();
    }
});

gameContainer.addEventListener('click', function() {
    if (!gameRunning && !startScreen.style.display) {
        startGame();
    } else {
        jump();
    }
});