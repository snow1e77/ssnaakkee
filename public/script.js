// Canvas and context setup
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let snake = [{ x: 5, y: 5 }];
let snakeDirection = 'right';
let food = { x: 10, y: 10 };
let score = 0;
let highScore = 0;
let gameInterval;
let isPaused = false;
let gameSpeed = 200; // Speed of the game in milliseconds

// Event listeners for controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && snakeDirection !== 'down') {
        snakeDirection = 'up';
    } else if (event.key === 'ArrowDown' && snakeDirection !== 'up') {
        snakeDirection = 'down';
    } else if (event.key === 'ArrowLeft' && snakeDirection !== 'right') {
        snakeDirection = 'left';
    } else if (event.key === 'ArrowRight' && snakeDirection !== 'left') {
        snakeDirection = 'right';
    }
});

document.getElementById('startGameButton').addEventListener('click', newGame);
document.getElementById('pauseButton').addEventListener('click', pauseGame);
document.getElementById('resumeButton').addEventListener('click', resumeGame);
document.getElementById('newGameButton').addEventListener('click', newGame);

// Initialize the game state
function newGame() {
    snake = [{ x: 5, y: 5 }];
    snakeDirection = 'right';
    score = 0;
    isPaused = false;
    document.getElementById('pauseButton').style.display = 'inline-block';
    document.getElementById('resumeButton').style.display = 'none';
    document.getElementById('startGameButton').style.display = 'none';
    document.getElementById('newGameButton').style.display = 'none';
    document.getElementById('scoreDisplay').innerText = `Score: ${score}`;
    placeFood();
    gameLoop();
}

// Main game loop
function gameLoop() {
    if (isPaused) return;
    moveSnake();
    checkCollision();
    checkFood();
    drawGame();
    gameInterval = setTimeout(gameLoop, gameSpeed);
}

// Move the snake
function moveSnake() {
    let head = { ...snake[0] };
    switch (snakeDirection) {
        case 'up': head.y -= 1; break;
        case 'down': head.y += 1; break;
        case 'left': head.x -= 1; break;
        case 'right': head.x += 1; break;
    }

    // Boundary wrapping
    if (head.x < 0) head.x = canvas.width / 10 - 1;
    if (head.x >= canvas.width / 10) head.x = 0;
    if (head.y < 0) head.y = canvas.height / 10 - 1;
    if (head.y >= canvas.height / 10) head.y = 0;

    snake.unshift(head);
    snake.pop();
}

// Check for collisions with the snake itself
function checkCollision() {
    let head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

// Check if the snake eats the food
function checkFood() {
    let head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        if (score > highScore) highScore = score;
        document.getElementById('scoreDisplay').innerText = `Score: ${score}`;
        document.getElementById('highScoreDisplay').innerText = `High Score: ${highScore}`;
        placeFood();
        snake.push({});
    }
}

// Draw the game state
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    for (let segment of snake) {
        ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 10, food.y * 10, 10, 10);
}

// Place food on the canvas
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / 10));
    food.y = Math.floor(Math.random() * (canvas.height / 10));
}

// Pause the game
function pauseGame() {
    isPaused = true;
    clearTimeout(gameInterval);
    document.getElementById('pauseButton').style.display = 'none';
    document.getElementById('resumeButton').style.display = 'inline-block';
}

// Resume the game
function resumeGame() {
    if (isPaused) {
        isPaused = false;
        document.getElementById('pauseButton').style.display = 'inline-block';
        document.getElementById('resumeButton').style.display = 'none';
        gameLoop();
    }
}

// End the game and display "Game Over"
function endGame() {
    clearTimeout(gameInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Game Over! Final Score: ${score}`, canvas.width / 2 - 70, canvas.height / 2);
    document.getElementById('pauseButton').style.display = 'none';
    document.getElementById('resumeButton').style.display = 'none';
    document.getElementById('newGameButton').style.display = 'inline-block';
}
