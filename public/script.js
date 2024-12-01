document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 400;

    const gridSize = 20;
    let snake = [{ x: 100, y: 100 }];
    let food = { x: 200, y: 200 };
    let direction = 'right';
    let gameInterval;
    let isPaused = false;

    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resumeButton = document.getElementById('resumeButton');

    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', pauseGame);
    resumeButton.addEventListener('click', resumeGame);

    function startGame() {
        resetGame();
        gameInterval = setInterval(() => {
            if (!isPaused) {
                moveSnake();
                checkCollision();
                drawGame();
            }
        }, 100);
        startButton.style.display = 'none';
        pauseButton.style.display = 'inline-block';
    }

    function pauseGame() {
        isPaused = true;
        pauseButton.style.display = 'none';
        resumeButton.style.display = 'inline-block';
    }

    function resumeGame() {
        isPaused = false;
        resumeButton.style.display = 'none';
        pauseButton.style.display = 'inline-block';
    }

    function resetGame() {
        snake = [{ x: 100, y: 100 }];
        direction = 'right';
        food = { x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize, y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize };
        clearInterval(gameInterval);
    }

    function moveSnake() {
        const head = { ...snake[0] };
        if (direction === 'right') head.x += gridSize;
        if (direction === 'left') head.x -= gridSize;
        if (direction === 'up') head.y -= gridSize;
        if (direction === 'down') head.y += gridSize;

        if (head.x === food.x && head.y === food.y) {
            snake.unshift(head);
            placeNewFood();
        } else {
            snake.pop();
            snake.unshift(head);
        }
    }

    function placeNewFood() {
        food = { x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize, y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize };
    }

    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'green';
        snake.forEach(part => {
            ctx.fillRect(part.x, part.y, gridSize, gridSize);
        });

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, gridSize, gridSize);
    }

    function checkCollision() {
        const head = snake[0];

        // Collision with walls
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            endGame();
        }

        // Collision with itself
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                endGame();
            }
        }
    }

    function endGame() {
        clearInterval(gameInterval);
        alert('Игра окончена!');
        startButton.style.display = 'inline-block';
        pauseButton.style.display = 'none';
        resumeButton.style.display = 'none';
    }
});
