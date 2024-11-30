// server.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/snakeGame', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Схема пользователя
const userSchema = new mongoose.Schema({
    username: String,
    highScore: Number,
});

const User = mongoose.model('User', userSchema);

// API для получения списка игроков и их лучших результатов
app.get('/api/highscores', async (req, res) => {
    try {
        const users = await User.find().sort({ highScore: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// API для добавления нового результата
app.post('/api/highscore', async (req, res) => {
    const { username, score } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            // Обновляем только в случае, если новый результат выше текущего
            if (score > user.highScore) {
                user.highScore = score;
                await user.save();
            }
        } else {
            user = new User({ username, highScore: score });
            await user.save();
        }

        res.status(201).send('Score updated successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
