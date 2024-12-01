// Global variables
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let snake = [{ x: 5, y: 5 }]; // Initial position of the snake
let snakeDirection = 'right'; // Initial movement direction
let food = { x: 10, y: 10 }; // Initial position of the food
let score = 0; // Player's score
let gameInterval;
let isPaused = false; // Game state
let gameSpeed = 200; // Default game speed (in milliseconds)

// Set up event listener for arrow key controls
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

// Main game loop
function gameLoop() {
    if (isPaused) return; // Exit loop if the game is paused

    moveSnake();
    checkCollision();
    checkFood();
    drawGame();
    gameInterval = setTimeout(gameLoop, gameSpeed);
}

// Move the snake based on current direction
function moveSnake() {
    let head = { ...snake[0] };
    switch (snakeDirection) {
        case 'up': head.y -= 1; break;
        case 'down': head.y += 1; break;
        case 'left': head.x -= 1; break;
        case 'right': head.x += 1; break;
    }

    // Boundary wrapping: if the snake goes out of bounds, appear on the opposite side
    if (head.x < 0) head.x = canvas.width / 10 - 1;
    if (head.x >= canvas.width / 10) head.x = 0;
    if (head.y < 0) head.y = canvas.height / 10 - 1;
    if (head.y >= canvas.height / 10) head.y = 0;

    // Add new head to the snake
    snake.unshift(head);

    // Remove the tail to maintain the same length
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
        score += 10; // Increase score
        placeFood(); // Place new food
        snake.push({}); // Grow the snake
    }
}

// Draw everything on the canvas
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the snake
    ctx.fillStyle = 'green';
    for (let segment of snake) {
        ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10);
    }

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 10, food.y * 10, 10, 10);

    // Draw the score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

// Place food in a random position
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / 10));
    food.y = Math.floor(Math.random() * (canvas.height / 10));

    // Ensure the food does not appear on the snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            placeFood();
            return;
        }
    }
}

// Pause the game
function pauseGame() {
    isPaused = true;
    clearTimeout(gameInterval);
}

// Resume the game
function resumeGame() {
    if (isPaused) {
        isPaused = false;
        gameLoop();
    }
}

// End the game and display a game-over message
function endGame() {
    clearTimeout(gameInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText(`Game Over! Final Score: ${score}`, canvas.width / 2 - 100, canvas.height / 2);
}

// Start a new game
function newGame() {
    snake = [{ x: 5, y: 5 }];
    snakeDirection = 'right';
    score = 0;
    isPaused = false;
    placeFood();
    gameLoop();
}

// Initialize the game
document.getElementById('startGameButton').addEventListener('click', () => {
    if (!isPaused) {
        newGame();
    }
});

// Start the game loop when the page loads
window.onload = newGame;
