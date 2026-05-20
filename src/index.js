const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userController = require('./controllers/userController');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/users';

const app = express();
app.use(bodyParser.json());

app.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const connected = dbState === 1;
    res.status(connected ? 200 : 503).json({
        status: connected ? 'ok' : 'degraded',
        database: connected ? 'connected' : 'disconnected'
    });
});

app.post('/users', userController.createUser);
app.get('/users', userController.getUsers);

async function start() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`User service running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        console.error('Start MongoDB with: docker compose up -d');
        process.exit(1);
    }
}

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

start();
