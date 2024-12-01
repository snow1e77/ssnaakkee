const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const difficultySelector = document.getElementById('difficulty');
const gameOverModal = document.getElementById('gameOverModal');
const restartButton = document.getElementById('restartButton');
const currentScoreSpan = document.getElementById('currentScore');
const highScoreSpan = document.getElementById('highScore');
const finalScoreText = document.getElementById('finalScore');

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let currentScore = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;
let gameIntervalSpeed = 100; // Default speed
let isPaused = false;

const speeds = { easy: 150, medium: 100, hard: 50 };

// Update high score display
highScoreSpan.textContent = `Лучший результат: ${highScore}`;

function drawBackground() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = '#00ff00';
    snake.forEach(segment => ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18));
}

function drawFood() {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x * 20, food.y * 20, 18, 18);
}

function updateSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wrap around edges
    if (head.x < 0) head.x = canvas.width / 20 - 1;
    if (head.x >= canvas.width / 20) head.x = 0;
    if (head.y < 0) head.y = canvas.height / 20 - 1;
    if (head.y >= canvas.height / 20) head.y = 0;

    snake.unshift(head);

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
        currentScore++;
        currentScoreSpan.textContent = `Счёт: ${currentScore}`;
        generateFood();
    } else {
        snake.pop();
    }

    // Check for self-collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            endGame();
            return;
        }
    }
}

function generateFood() {
    do {
        food = { x: Math.floor(Math.random() * (canvas.width / 20)), y: Math.floor(Math.random() * (canvas.height / 20)) };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function endGame() {
    clearInterval(gameInterval);
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem('highScore', highScore);
        highScoreSpan.textContent = `Лучший результат: ${highScore}`;
    }
    finalScoreText.textContent = `Ваш счёт: ${currentScore}`;
    gameOverModal.style.display = 'block';
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    currentScore = 0;
    currentScoreSpan.textContent = `Счёт: ${currentScore}`;
    generateFood();
    gameOverModal.style.display = 'none';
}

function gameLoop() {
    if (!isPaused) {
        drawBackground();
        drawSnake();
        drawFood();
        updateSnake();
    }
}

// Event listeners
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
    if (e.key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
    if (e.key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
    if (e.key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
});

startButton.addEventListener('click', () => {
    resetGame();
    gameIntervalSpeed = speeds[difficultySelector.value];
    gameInterval = setInterval(gameLoop, gameIntervalSpeed);
    startButton.style.display = 'none';
    pauseButton.style.display = 'block';
});

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Продолжить' : 'Пауза';
});

restartButton.addEventListener('click', () => {
    resetGame();
    gameInterval = setInterval(gameLoop, gameIntervalSpeed);
    pauseButton.style.display = 'block';
});
