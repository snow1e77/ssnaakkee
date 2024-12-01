// Game elements
const gameCanvas = document.getElementById('gameCanvas');
const context = gameCanvas.getContext('2d');
const gameOverMessage = document.getElementById('gameOverMessage');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const continueButton = document.getElementById('continueButton');
const restartButton = document.getElementById('restartButton');
const difficultySelect = document.getElementById('difficultySelect');

let snake = [{ x: 150, y: 150 }];
let snakeDirection = 'right';
let food = {};
let gameInterval;
let gameRunning = false;
let score = 0;
let highScore = 0;
let currentSpeed = 150; // Default speed for medium difficulty

// Canvas size
gameCanvas.width = 400;
gameCanvas.height = 400;

// Function to start the game
function startGame() {
    if (gameRunning) return; // Prevent starting if the game is already running

    gameRunning = true;
    gameOverMessage.style.display = 'none';
    score = 0;
    snake = [{ x: 150, y: 150 }];
    snakeDirection = 'right';
    generateFood();

    // Show/hide buttons as needed
    startButton.style.display = 'none';
    pauseButton.style.display = 'block';
    restartButton.style.display = 'none';
    continueButton.style.display = 'none';

    gameInterval = setInterval(() => {
        if (gameRunning) {
            moveSnake();
            checkCollision();
            drawGame();
        }
    }, currentSpeed);
}

// Function to move the snake
function moveSnake() {
    const head = { ...snake[0] };

    if (snakeDirection === 'up') head.y -= 10;
    if (snakeDirection === 'down') head.y += 10;
    if (snakeDirection === 'left') head.x -= 10;
    if (snakeDirection === 'right') head.x += 10;

    // Wrap around logic for canvas edges
    if (head.x < 0) head.x = gameCanvas.width - 10;
    if (head.x >= gameCanvas.width) head.x = 0;
    if (head.y < 0) head.y = gameCanvas.height - 10;
    if (head.y >= gameCanvas.height) head.y = 0;

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

// Function to check for collisions
function checkCollision() {
    const head = snake[0];

    // Check if the snake collides with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval);
    gameRunning = false;
    gameOverMessage.style.display = 'block';
    gameOverMessage.textContent = `Game Over! Your score: ${score}`;

    if (score > highScore) {
        highScore = score;
        document.getElementById('highScore').textContent = `High Score: ${highScore}`;
    }

    // Hide buttons and show restart options
    pauseButton.style.display = 'none';
    continueButton.style.display = 'none';
    restartButton.style.display = 'block';
}

// Function to generate food
function generateFood() {
    const x = Math.floor(Math.random() * (gameCanvas.width / 10)) * 10;
    const y = Math.floor(Math.random() * (gameCanvas.height / 10)) * 10;
    food = { x, y };
}

// Function to draw the game
function drawGame() {
    context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw the snake
    context.fillStyle = 'green';
    for (let segment of snake) {
        context.fillRect(segment.x, segment.y, 10, 10);
    }

    // Draw the food
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, 10, 10);

    // Update score display
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Event listener for arrow keys
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (snakeDirection !== 'down') snakeDirection = 'up';
            break;
        case 'ArrowDown':
            if (snakeDirection !== 'up') snakeDirection = 'down';
            break;
        case 'ArrowLeft':
            if (snakeDirection !== 'right') snakeDirection = 'left';
            break;
        case 'ArrowRight':
            if (snakeDirection !== 'left') snakeDirection = 'right';
            break;
    }
});

// Event listeners for buttons
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', () => {
    clearInterval(gameInterval);
    gameRunning = false;
    pauseButton.style.display = 'none';
    continueButton.style.display = 'block';
    restartButton.style.display = 'block';
});

continueButton.addEventListener('click', startGame);

restartButton.addEventListener('click', startGame);

// Event listener for difficulty selection
difficultySelect.addEventListener('change', (event) => {
    switch (event.target.value) {
        case 'easy':
            currentSpeed = 200;
            break;
        case 'medium':
            currentSpeed = 150;
            break;
        case 'hard':
            currentSpeed = 100;
            break;
    }
});
