const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
let snake = [{ x: 160, y: 160 }];
let snakeDirection = 'right';
let gameInterval;
let isPaused = false;

function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function moveSnake() {
    if (isPaused) return;

    const head = { ...snake[0] };

    switch (snakeDirection) {
        case 'up': head.y -= gridSize; break;
        case 'down': head.y += gridSize; break;
        case 'left': head.x -= gridSize; break;
        case 'right': head.x += gridSize; break;
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || isCollidingWithBody(head)) {
        alert('Game Over');
        clearInterval(gameInterval);
        return;
    }

    snake.unshift(head);
    snake.pop();
    drawSnake();
}

function isCollidingWithBody(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function startGame() {
    gameInterval = setInterval(moveSnake, 200);
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'inline-block';
}

document.getElementById('pauseButton').addEventListener('click', () => {
    if (!isPaused) {
        isPaused = true;
        clearInterval(gameInterval);
        document.getElementById('pauseButton').style.display = 'none';
        document.getElementById('resumeButton').style.display = 'inline-block';
    }
});

document.getElementById('resumeButton').addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        gameInterval = setInterval(moveSnake, 200);
        document.getElementById('resumeButton').style.display = 'none';
        document.getElementById('pauseButton').style.display = 'inline-block';
    }
});

document.getElementById('startButton').addEventListener('click', startGame);

// Инициализация кнопок при загрузке страницы
document.getElementById('pauseButton').style.display = 'none';
document.getElementById('resumeButton').style.display = 'none';
