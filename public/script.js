// Инициализация переменных игры
const gameContainer = document.getElementById('gameContainer');
const currentScoreDisplay = document.getElementById('currentScore');
const highScoreDisplay = document.getElementById('highScore');
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
let gameInterval = setInterval(gameLoop, 100);

// Обновляем отображение счёта и лучшего результата
function updateScoreDisplay() {
    currentScoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;
}

// Функция для создания игрового поля
function createGameBoard() {
    gameContainer.style.width = `${gameSize}px`;
    gameContainer.style.height = `${gameSize}px`;
    gameContainer.style.position = 'relative';
}

// Функция для отрисовки змейки
function drawSnake() {
    gameContainer.innerHTML = ''; // Очистить контейнер перед отрисовкой
    snake.forEach(segment => {
        const snakePart = document.createElement('div');
        snakePart.style.width = `${blockSize}px`;
        snakePart.style.height = `${blockSize}px`;
        snakePart.style.backgroundColor = 'green';
        snakePart.style.position = 'absolute';
        snakePart.style.top = `${segment.y}px`;
        snakePart.style.left = `${segment.x}px`;
        gameContainer.appendChild(snakePart);
    });
}

// Функция для отрисовки еды
function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.width = `${blockSize}px`;
    foodElement.style.height = `${blockSize}px`;
    foodElement.style.backgroundColor = 'red';
    foodElement.style.position = 'absolute';
    foodElement.style.top = `${food.y}px`;
    foodElement.style.left = `${food.x}px`;
    gameContainer.appendChild(foodElement);
}

// Генерация новой еды в случайной позиции
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
            alert('Game Over! Your score: ' + score);
            resetGame();
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

// Функция для сброса игры
function resetGame() {
    snake = [
        { x: 160, y: 160 },
    ];
    direction = 'right';
    score = 0;
    generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

// Инициализация игры
createGameBoard();
generateFood();
updateScoreDisplay();
