const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authenticateAdmin = require('./middleware/auth');

const app = express();

app.use(cors({
    origin: 'https://featurebox-admin.netlify.app', 
    credentials: true
}));
app.use(express.json());

// 🟢 РОУТ ДЛЯ ПИНГА (чтобы UptimeRobot не давал серверу уснуть)
app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

// Открытый маршрут: проверка пароля
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        return res.json({ token: password });
    }
    res.status(401).json({ error: 'Неверный пароль' });
});

// Защищённые маршруты
app.use('/api/circles', authenticateAdmin, require('./routes/circles'));
app.use('/api/calibers', authenticateAdmin, require('./routes/calibers'));
app.use('/api/skills', authenticateAdmin, require('./routes/skills'));
app.use('/api/spells', authenticateAdmin, require('./routes/spells'));
app.use('/api/items', authenticateAdmin, require('./routes/items'));
app.use('/api/characters', authenticateAdmin, require('./routes/characters'));
app.use('/api/economy', authenticateAdmin, require('./routes/economy'));
app.use('/api/runes', authenticateAdmin, require('./routes/runes'));

// 🟢 Слушаем порт (добавлен '0.0.0.0' для работы на хостинге)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Бэкенд запущен на порту ${PORT}`);
});
