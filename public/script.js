// Переменные для взаимодействия с сервером
const serverUrl = 'http://localhost:3000'; // Укажите URL сервера

// Функция для отправки результатов на сервер
async function submitScore(username, score) {
    try {
        const response = await fetch(`${serverUrl}/submitScore`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, score }),
        });
        if (!response.ok) {
            throw new Error('Failed to submit score');
        }
        console.log('Score submitted successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Функция для получения и отображения таблицы лидеров
async function fetchLeaderboard() {
    try {
        const response = await fetch(`${serverUrl}/leaderboard`);
        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard');
        }
        const leaderboard = await response.json();
        displayLeaderboard(leaderboard);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Функция для отображения таблицы лидеров на странице
function displayLeaderboard(leaderboard) {
    const leaderboardContainer = document.getElementById('leaderboard');
    leaderboardContainer.innerHTML = ''; // Очищаем контейнер перед отображением
    leaderboard.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.textContent = `${entry.username}: ${entry.score}`;
        leaderboardContainer.appendChild(entryElement);
    });
}

// Обработчик для кнопки отображения таблицы лидеров
document.getElementById('showLeaderboardButton').addEventListener('click', fetchLeaderboard);

// Код для отправки результата при завершении игры
// Предположим, что у нас есть переменные `username` и `score` после игры
// Например, при вызове функции завершения игры, можно сделать:
const username = 'User123'; // Получаем юзернейм пользователя из Telegram (заменить на реальное значение)
const score = 150; // Результат игры (здесь пример)

submitScore(username, score);
