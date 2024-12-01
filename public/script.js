// Инициализация переменных игры
const gameContainer = document.getElementById('gameContainer');
const currentScoreDisplay = document.getElementById('currentScore');
const highScoreDisplay = document.getElementById('highScore');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreDisplay = document.getElementById('finalScore');
const gameSize = 400;
const blockSize = 20;
const gridCount = gameSize / blockSize;
let snake = [
    { x: 160, y: 160 },
];
let direction = 'right';
let food = { x: 100, y: 100 };
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let isPaused = false; // Флаг для паузы
let gameIntervalSpeed = 100; // Скорость игры
let gameInterval;

// Функция для отрисовки змейки
function drawSnake() {
    gameContainer.innerHTML = ''; // Очистить контейнер перед отрисовкой
    snake.forEach(segment => {
        const snakePart = document.createElement('div');
        snakePart.classList.add('snakePart');
        snakePart.style.top = `${segment.y}px`;
        snakePart.style.left = `${segment.x}px`;
        gameContainer.appendChild(snakePart);
    });
}

// Функция для отрисовки еды
function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.id = 'food';
    foodElement.style.top = `${food.y}px`;
    foodElement.style.left = `${food.x}px`;
    gameContainer.appendChild(foodElement);
}

// Функция для генерации новой еды
function generateFood() {
    food.x = Math.floor(Math.random() * gridCount) * blockSize;
    food.y = Math.floor(Math.random() * gridCount) * blockSize;

    // Проверка, чтобы еда не появилась на змейке
    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
        }
    });
}

// Обработка нажатия клавиш для управления змейкой
document.addEventListener('keydown', (event) => {
    if (isPaused) return; // Игнорируем ввод, если игра на паузе

    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Основной игровой цикл
function gameLoop() {
    if (isPaused) return; // Если игра на паузе, не выполняем цикл

    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y -= blockSize; break;
        case 'down': head.y += blockSize; break;
        case 'left': head.x -= blockSize; break;
        case 'right': head.x += blockSize; break;
    }

    // Проверка на столкновение с границей (телепортация)
    if (head.x < 0) head.x = gameSize - blockSize;
    if (head.x >= gameSize) head.x = 0;
    if (head.y < 0) head.y = gameSize - blockSize;
    if (head.y >= gameSize) head.y = 0;

    // Проверка на столкновение с телом змейки
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    // Проверка на съеденную еду
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        generateFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
    drawSnake();
    drawFood();
    updateScoreDisplay();
}

// Функция для обновления отображения счёта
function updateScoreDisplay() {
    currentScoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;
}

// Функция для обработки окончания игры
function gameOver() {
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = score;
    gameOverModal.style.display = 'block';
    startButton.style.display = 'block';
    pauseButton.style.display = 'none';
}

// Функция для сброса игры
function resetGame() {
    gameOverModal.style.display = 'none';
    snake = [
        { x: 160, y: 160 },
    ];
    direction = 'right';
    score = 0;
    generateFood();
    updateScoreDisplay();
    gameInterval = setInterval(gameLoop, gameIntervalSpeed);
    isPaused = false;
    pauseButton.style.display = 'block';
    startButton.style.display = 'none';
}

// Функция для начала игры
startButton.addEventListener('click', () => {
    resetGame(); // Ensure the game resets and starts immediately
    startButton.style.display = 'none';
    pauseButton.style.display = 'block';
    gameInterval = setInterval(gameLoop, gameIntervalSpeed); // Start the game loop
});


// Функция для паузы игры
pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Продолжить' : 'Пауза';
    if (!isPaused) {
        gameInterval = setInterval(gameLoop, gameIntervalSpeed);
    } else {
        clearInterval(gameInterval);
    }
});

// Слушатель события для перезапуска игры
restartButton.addEventListener('click', resetGame);
