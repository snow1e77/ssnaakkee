const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
let snake = [{ x: 5, y: 5 }];
let direction = { x: 1, y: 0 };
let food = { x: 10, y: 10 };
let powerUp = null;
let currentScore = 0;
let gameInterval;
let isPaused = false;
let powerUpTimer = 0;

function startGame() {
    document.getElementById('instructions').style.display = 'none';
    snake = [{ x: 5, y: 5 }];
    direction = { x: 1, y: 0 };
    currentScore = 0;
    document.getElementById('pauseButton').style.display = 'inline';
    gameInterval = setInterval(gameLoop, 150);
    generateFood();
    generatePowerUp();
}

function showInstructions() {
    document.getElementById('instructions').style.display = 'block';
    document.getElementById('pauseButton').style.display = 'none';
    document.getElementById('resumeButton').style.display = 'none';
    document.getElementById('newGameButton').style.display = 'none';
    clearInterval(gameInterval);
}

function togglePause() {
    if (isPaused) {
        resumeGame();
    } else {
        isPaused = true;
        clearInterval(gameInterval);
        document.getElementById('pauseButton').style.display = 'none';
        document.getElementById('resumeButton').style.display = 'inline';
        document.getElementById('newGameButton').style.display = 'inline';
    }
}

function resumeGame() {
    isPaused = false;
    document.getElementById('pauseButton').style.display = 'inline';
    document.getElementById('resumeButton').style.display = 'none';
    document.getElementById('newGameButton').style.display = 'none';
    gameInterval = setInterval(gameLoop, 150);
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function generatePowerUp() {
    powerUp = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
    powerUpTimer = Date.now();
}

function drawBackground() {
    ctx.fillStyle = '#d3d3d3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    for (const part of snake) {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function drawPowerUp() {
    if (powerUp) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(powerUp.x * gridSize, powerUp.y * gridSize, gridSize - 2, gridSize - 2);
    }
}

function updateSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0) head.x = canvas.width / gridSize - 1;
    if (head.x >= canvas.width / gridSize) head.x = 0;
    if (head.y < 0) head.y = canvas.height / gridSize - 1;
    if (head.y >= canvas.height / gridSize) head.y = 0;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        currentScore++;
        generateFood();
    } else if (head.x === powerUp.x && head.y === powerUp.y) {
        currentScore += 5; // Collect power-up
        generatePowerUp();
    } else {
        snake.pop();
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            clearInterval(gameInterval);
            alert(`Game Over! Your score: ${currentScore}`);
            showInstructions();
            return;
        }
    }
}

function gameLoop() {
    if (!isPaused) {
        drawBackground();
        drawSnake();
        drawFood();
        drawPowerUp();
        updateSnake();
    }
}

document.addEventListener('keydown', (e) => {
    if (!isPaused) {
        switch (e.key) {
            case 'ArrowUp':
                if (direction.y === 0) direction = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
                if (direction.y === 0) direction = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
                if (direction.x === 0) direction = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
                if (direction.x === 0) direction = { x: 1, y: 0 };
                break;
        }
    }
});
