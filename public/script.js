const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;
const gridSize = 20;
let snake = [{ x: 160, y: 160 }];
let direction = 'right';
let newDirection = 'right';
let food = {};
let score = 0;
let gameInterval;
let isPaused = false;

// Load images for the snake and food
const snakeImage = new Image();
const foodImage = new Image();
snakeImage.src = 'snake.png'; // Path to the snake image
foodImage.src = 'food.png';   // Path to the food image

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('pauseButton').addEventListener('click', pauseGame);
document.getElementById('resumeButton').addEventListener('click', resumeGame);
document.getElementById('newGameButton').addEventListener('click', newGame);

function startGame() {
    snake = [{ x: 160, y: 160 }];
    direction = newDirection = 'right';
    score = 0;
    document.getElementById('score').textContent = score;
    placeFood();
    document.getElementById('controls').style.display = 'flex';
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'inline';
    document.getElementById('gameOverMessage').style.display = 'none';
    cancelAnimationFrame(gameInterval);
    gameInterval = requestAnimationFrame(gameLoop);
}

function newGame() {
    cancelAnimationFrame(gameInterval);
    document.getElementById('gameOverMessage').style.display = 'none';
    document.getElementById('controls').style.display = 'flex';
    document.getElementById('pauseButton').style.display = 'inline';
    startGame();
}

function pauseGame() {
    isPaused = true;
    document.getElementById('pauseButton').style.display = 'none';
    document.getElementById('resumeButton').style.display = 'inline';
}

function resumeGame() {
    isPaused = false;
    document.getElementById('pauseButton').style.display = 'inline';
    document.getElementById('resumeButton').style.display = 'none';
    gameInterval = requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (!isPaused) {
        moveSnake();
        checkCollisions();
        updateCanvas();
        gameInterval = requestAnimationFrame(gameLoop);
    }
}

function moveSnake() {
    const head = { ...snake[0] };
    switch (newDirection) {
        case 'up': head.y -= gridSize; break;
        case 'down': head.y += gridSize; break;
        case 'left': head.x -= gridSize; break;
        case 'right': head.x += gridSize; break;
    }

    // Wrap the snake around the canvas edges
    if (head.x < 0) head.x = canvas.width - gridSize;
    if (head.y < 0) head.y = canvas.height - gridSize;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y >= canvas.height) head.y = 0;

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        placeFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

function checkCollisions() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach(segment => ctx.drawImage(snakeImage, segment.x, segment.y, gridSize, gridSize));
    ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize);
}

function placeFood() {
    const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    food = { x, y };
}

function gameOver() {
    cancelAnimationFrame(gameInterval);
    document.getElementById('gameOverMessage').style.display = 'block';
    document.getElementById('score').textContent = score;
    document.getElementById('controls').style.display = 'none';
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': if (direction !== 'down') newDirection = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') newDirection = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') newDirection = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') newDirection = 'right'; break;
    }
    direction = newDirection;
});
