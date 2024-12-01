// Basic setup for the game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 20;
let snake = [{ x: 100, y: 100 }, { x: 80, y: 100 }, { x: 60, y: 100 }];
let direction = 'right';
let food = { x: 200, y: 200 };
let score = 0;
let gameInterval;
let isPaused = false;

// Start button and event listener
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('pauseButton').addEventListener('click', togglePause);
document.getElementById('continueButton').addEventListener('click', togglePause);
document.getElementById('restartButton').addEventListener('click', startGame);

// Draw the snake and the food on the canvas
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, cellSize, cellSize);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, cellSize, cellSize);
}

// Update the snake's position based on the current direction
function updateGame() {
    if (isPaused) return;

    let newHead = { ...snake[0] };

    switch (direction) {
        case 'right': newHead.x += cellSize; break;
        case 'left': newHead.x -= cellSize; break;
        case 'up': newHead.y -= cellSize; break;
        case 'down': newHead.y += cellSize; break;
    }

    // Wrap the snake around if it hits the canvas border
    if (newHead.x < 0) newHead.x = canvas.width - cellSize;
    if (newHead.y < 0) newHead.y = canvas.height - cellSize;
    if (newHead.x >= canvas.width) newHead.x = 0;
    if (newHead.y >= canvas.height) newHead.y = 0;

    // Check for collisions with itself
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        clearInterval(gameInterval);
        document.getElementById('gameOverMessage').style.display = 'block';
        return;
    }

    snake.unshift(newHead);
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = 'Score: ' + score;
        placeFood();
    } else {
        snake.pop();
    }

    drawGame();
}

// Start the game
function startGame() {
    snake = [{ x: 100, y: 100 }, { x: 80, y: 100 }, { x: 60, y: 100 }];
    direction = 'right';
    score = 0;
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('gameOverMessage').style.display = 'none';

    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 200);

    document.getElementById('startButton').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'inline';
}

// Toggle pause and resume
function togglePause() {
    if (isPaused) {
        gameInterval = setInterval(updateGame, 200);
        document.getElementById('pauseButton').style.display = 'inline';
        document.getElementById('continueButton').style.display = 'none';
    } else {
        clearInterval(gameInterval);
        document.getElementById('pauseButton').style.display = 'none';
        document.getElementById('continueButton').style.display = 'inline';
    }
    isPaused = !isPaused;
}

// Place food at a random location
function placeFood() {
    const x = Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize;
    const y = Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize;
    food = { x, y };
}

// Event listener for keyboard input
document.addEventListener('keydown', (e) => {
    if (isPaused) return;

    switch (e.key) {
        case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
    }
});

// Initial game setup
startGame();
