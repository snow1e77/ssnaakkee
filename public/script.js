const canvas = document.getElementById('gameCanvas');
canvas.width = 400;
canvas.height = 400;
const ctx = canvas.getContext('2d');

let snake = [{ x: 20, y: 20 }];
let direction = 'RIGHT';
let food = { x: 100, y: 100 };
let score = 0;
let gameInterval;
let isPaused = false;

document.addEventListener('keydown', changeDirection);
document.getElementById('resumeBtn').addEventListener('click', resumeGame);
document.getElementById('restartBtn').addEventListener('click', startNewGame);

function changeDirection(event) {
  if (isPaused) return;

  switch (event.key) {
    case 'ArrowUp': if (direction !== 'DOWN') direction = 'UP'; break;
    case 'ArrowDown': if (direction !== 'UP') direction = 'DOWN'; break;
    case 'ArrowLeft': if (direction !== 'RIGHT') direction = 'LEFT'; break;
    case 'ArrowRight': if (direction !== 'LEFT') direction = 'RIGHT'; break;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = 'green';
  snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 20, 20));

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, 20, 20);

  // Check for collisions
  if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
    endGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      endGame();
    }
  }

  // Check if snake eats the food
  if (snake[0].x === food.x && snake[0].y === food.y) {
    score++;
    generateFood();
    // Grow the snake
    snake.push({});
  } else {
    snake.pop();
  }

  // Move the snake
  const head = { ...snake[0] };
  switch (direction) {
    case 'UP': head.y -= 20; break;
    case 'DOWN': head.y += 20; break;
    case 'LEFT': head.x -= 20; break;
    case 'RIGHT': head.x += 20; break;
  }

  // Wrap around logic
  if (head.x < 0) head.x = canvas.width - 20;
  if (head.x >= canvas.width) head.x = 0;
  if (head.y < 0) head.y = canvas.height - 20;
  if (head.y >= canvas.height) head.y = 0;

  snake.unshift(head);
  document.getElementById('score').innerText = `Score: ${score}`;
}

function generateFood() {
  const x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
  const y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
  food = { x, y };
}

function startNewGame() {
  if (gameInterval) clearInterval(gameInterval);
  snake = [{ x: 20, y: 20 }];
  direction = 'RIGHT';
  score = 0;
  isPaused = false;
  document.getElementById('pauseOverlay').style.display = 'none';
  gameInterval = setInterval(draw, 100);
}

function pauseGame() {
  if (isPaused) return;
  isPaused = true;
  clearInterval(gameInterval);
  document.getElementById('pauseOverlay').style.display = 'block';
}

function resumeGame() {
  if (!isPaused) return;
  isPaused = false;
  document.getElementById('pauseOverlay').style.display = 'none';
  gameInterval = setInterval(draw, 100);
}

function endGame() {
  clearInterval(gameInterval);
  alert(`Game Over! Your score was ${score}`);
  startNewGame();
}

// Start the game
startNewGame();
