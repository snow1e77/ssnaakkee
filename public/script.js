// Получаем элементы для кнопок
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
const restartButton = document.getElementById('restartButton');
const gameOverMessage = document.getElementById('gameOverMessage');

let gameInterval;
let isPaused = false;
let isGameOver = false;
let snake = [];
let snakeDirection = 'right';
let food = {};
let score = 0;
let highScore = 0;

// Инициализация кнопок при загрузке страницы
pauseButton.style.display = 'none';
resumeButton.style.display = 'none';
restartButton.style.display = 'none';
gameOverMessage.style.display = 'none';

// Функция для начала игры
function startGame() {
    if (isGameOver) {
        // Если игра была окончена, обнуляем все состояния
        resetGame();
    }
    gameInterval = setInterval(moveSnake, 200);
    startButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
}

// Функция для паузы игры
pauseButton.addEventListener('click', () => {
    if (!isPaused) {
        isPaused = true;
        clearInterval(gameInterval);
        pauseButton.style.display = 'none';
        resumeButton.style.display = 'inline-block';
    }
});

// Функция для возобновления игры
resumeButton.addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        gameInterval = setInterval(moveSnake, 200);
        resumeButton.style.display = 'none';
        pauseButton.style.display = 'inline-block';
    }
});

// Функция для перезапуска игры
restartButton.addEventListener('click', resetGame);

// Функция для сброса игры
function resetGame() {
    clearInterval(gameInterval);
    snake = [{ x: 5, y: 5 }];
    snakeDirection = 'right';
    score = 0;
    isPaused = false;
    isGameOver = false;
    gameOverMessage.style.display = 'none';
    startButton.style.display = 'inline-block';
    restartButton.style.display = 'none';
    pauseButton.style.display = 'none';
    resumeButton.style.display = 'none';
    gameInterval = setInterval(moveSnake, 200);
}

// Функция для движения змейки
function moveSnake() {
    if (isGameOver || isPaused) return;

    const head = { ...snake[0] };

    switch (snakeDirection) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Проверка на столкновение с границей (выход с противоположной стороны)
    if (head.x < 0) head.x = canvas.width / gridSize - 1;
    if (head.x >= canvas.width / gridSize) head.x = 0;
    if (head.y < 0) head.y = canvas.height / gridSize - 1;
    if (head.y >= canvas.height / gridSize) head.y = 0;

    // Проверка на столкновение с телом змейки
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Проверка на еду
    if (head.x === food.x && head.y === food.y) {
        score++;
        if (score > highScore) {
            highScore = score;
        }
        placeFood();
    } else {
        snake.pop();
    }

    draw();
}

// Функция для отрисовки змейки и еды
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Отображение змейки
    for (let part of snake) {
        context.fillStyle = 'green';
        context.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    }

    // Отображение еды
    context.fillStyle = 'red';
    context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Обновление счёта на экране
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('highScore').innerText = `High Score: ${highScore}`;
}

// Функция для установки еды на случайное место
function placeFood() {
    const x = Math.floor(Math.random() * (canvas.width / gridSize));
    const y = Math.floor(Math.random() * (canvas.height / gridSize));
    food = { x, y };

    // Убедимся, что еда не появляется на теле змейки
    for (let part of snake) {
        if (food.x === part.x && food.y === part.y) {
            placeFood();
            return;
        }
    }
}

// Функция для завершения игры
function gameOver() {
    clearInterval(gameInterval);
    isGameOver = true;
    gameOverMessage.style.display = 'block';
    restartButton.style.display = 'inline-block';
}

// Обработчик клавиш для управления змейкой
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && snakeDirection !== 'down') snakeDirection = 'up';
    if (e.key === 'ArrowDown' && snakeDirection !== 'up') snakeDirection = 'down';
    if (e.key === 'ArrowLeft' && snakeDirection !== 'right') snakeDirection = 'left';
    if (e.key === 'ArrowRight' && snakeDirection !== 'left') snakeDirection = 'right';
});

// Инициализация игры
placeFood();
draw();
