const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const moistureLogRoutes = require('./routes/moistureLogRoutes');

app.use(express.json());

app.use('/api/moisture/auth', authRoutes);
app.use('/api/moisture/logs', moistureLogRoutes);

module.exports = app;
