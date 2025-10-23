const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes');
const moistureLogRoutes = require('./routes/moistureLogRoutes');

app.use(cors());

app.use(express.json());

app.use('/api/moisture/auth', authRoutes);
app.use('/api/moisture/logs', moistureLogRoutes);

module.exports = app;
