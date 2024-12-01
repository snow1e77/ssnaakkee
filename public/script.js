const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
const restartButton = document.getElementById('restartButton');
const currentScoreDisplay = document.getElementById('currentScore');
const highScoreDisplay = document.getElementById('highScore');

const gridSize = 20;
let snake = [];
let food = {};
let direction = 'right';
let newDirection = 'right';
let score = 0;
let highScore = 0;
let gameInterval;
let isPaused = false;

function initGame() {
    canvas.width = 400;
    canvas.height = 400;
    snake = [{ x: 100, y: 100 }];
    direction = newDirection = 'right';
    score = 0;
    currentScoreDisplay.textContent = score;
    placeFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
    showGameControls();
}

function gameLoop() {
    if (!isPaused) {
        moveSnake();
        checkCollisions();
        updateCanvas();
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

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        currentScoreDisplay.textContent = score;
        placeFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

function checkCollisions() {
    const head = snake[0];
    if (
        head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver();
    }
}

function placeFood() {
    const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    food = { x, y };
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function gameOver() {
    clearInterval(gameInterval);
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
    }
    alert('Game Over! Your score: ' + score);
}

function showGameControls() {
    startButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    restartButton.style.display = 'inline-block';
}

startButton.addEventListener('click', initGame);
pauseButton.addEventListener('click', () => {
    isPaused = true;
    pauseButton.style.display = 'none';
    resumeButton.style.display = 'inline-block';
});

resumeButton.addEventListener('click', () => {
    isPaused = false;
    resumeButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
});

restartButton.addEventListener('click', initGame);
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': if (direction !== 'down') newDirection = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') newDirection = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') newDirection = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') newDirection = 'right'; break;
    }
});
