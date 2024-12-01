// Include anime.js by adding this script tag in your HTML if you haven't already:
// <script src="https://cdn.jsdelivr.net/npm/anime@3.2.1/lib/anime.min.js"></script>

// Select necessary elements
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
let currentSpeed = 150; // Speed for medium difficulty

// Canvas size
gameCanvas.width = 400;
gameCanvas.height = 400;

// Function to start the game
function startGame() {
    gameRunning = true;
    gameOverMessage.style.display = 'none';
    score = 0;
    snake = [{ x: 150, y: 150 }];
    snakeDirection = 'right';
    generateFood();
    startButton.style.display = 'none';
    pauseButton.style.display = 'block';
    restartButton.style.display = 'none';
    continueButton.style.display = 'none';

    gameInterval = setInterval(() => {
        moveSnake();
        checkCollision();
        drawGame();
    }, currentSpeed);

    // Add animations when the game starts
    anime({
        targets: '#gameCanvas',
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeInOutQuad'
    });
}

// Function to move the snake
function moveSnake() {
    const head = { ...snake[0] };

    if (snakeDirection === 'up') head.y -= 10;
    if (snakeDirection === 'down') head.y += 10;
    if (snakeDirection === 'left') head.x -= 10;
    if (snakeDirection === 'right') head.x += 10;

    if (head.x < 0) head.x = gameCanvas.width - 10;
    if (head.x >= gameCanvas.width) head.x = 0;
    if (head.y < 0) head.y = gameCanvas.height - 10;
    if (head.y >= gameCanvas.height) head.y = 0;

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
        // Animate food appearance
        anime({
            targets: '#food',
            scale: [1, 1.5],
            direction: 'alternate',
            duration: 500,
            easing: 'easeInOutQuad',
            loop: true
        });
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

    anime({
        targets: '#gameOverMessage',
        opacity: [0, 1],
        scale: [0.5, 1],
        duration: 1000,
        easing: 'easeOutElastic(1, 0.3)'
    });
}

// Function to generate food
function generateFood() {
    const x = Math.floor(Math.random() * (gameCanvas.width / 10)) * 10;
    const y = Math.floor(Math.random() * (gameCanvas.height / 10)) * 10;
    food = { x, y };

    // Draw the food on the canvas
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, 10, 10);
}

// Function to draw the game elements
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

continueButton.addEventListener('click', () => {
    if (!gameRunning) {
        gameRunning = true;
        pauseButton.style.display = 'block';
        continueButton.style.display = 'none';
        restartButton.style.display = 'none';

        gameInterval = setInterval(() => {
            moveSnake();
            checkCollision();
            drawGame();
        }, currentSpeed);
    }
});

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
