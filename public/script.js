// Инициализация переменных игры
const gameContainer = document.getElementById('gameContainer');
const gameSize = 400; // Размер игрового поля
const blockSize = 20; // Размер одного блока
const gridCount = gameSize / blockSize;
let snake = [
    { x: 160, y: 160 }, // Начальная позиция змейки (в пикселях)
];
let direction = 'right'; // Начальное направление
let food = { x: 100, y: 100 }; // Начальная позиция еды
let score = 0; // Счет игрока

// Функция для создания игрового поля и отрисовки объектов
function createGameBoard() {
    gameContainer.style.width = `${gameSize}px`;
    gameContainer.style.height = `${gameSize}px`;
    gameContainer.style.position = 'relative';
    gameContainer.style.backgroundColor = 'lightgray';
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
    // Вычислить новое положение головы змейки
    const head = { ...snake[0] };

    switch (direction) {
        case 'up':
            head.y -= blockSize;
            break;
        case 'down':
            head.y += blockSize;
            break;
        case 'left':
            head.x -= blockSize;
            break;
        case 'right':
            head.x += blockSize;
            break;
    }

    // Проверка на столкновение с краем поля
    if (head.x < 0 || head.x >= gameSize || head.y < 0 || head.y >= gameSize) {
        alert('Game Over! Your score: ' + score);
        resetGame();
        return;
    }

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
        score += 10; // Увеличение счета
        generateFood();
    } else {
        snake.pop(); // Удаление последнего сегмента змейки
    }

    // Добавление нового сегмента змейки
    snake.unshift(head);

    drawSnake();
    drawFood();
}

// Функция для сброса игры
function resetGame() {
    snake = [
        { x: 160, y: 160 },
    ];
    direction = 'right';
    score = 0;
    generateFood();
}

// Инициализация игры
createGameBoard();
generateFood();
setInterval(gameLoop, 200); // Запуск игрового цикла с интервалом 200 мс
