const express = require('express');
const router = express.Router();
const { createMoistureLog, getTodayLogs, getThreeDayLogs, getSevenDayLogs, getAllDaysLogs, getIoTStatus } = require('../controllers/moistureLogController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/log', authenticate, createMoistureLog);
router.get('/status', authenticate, getIoTStatus);
router.get('/today', authenticate, getTodayLogs);
router.get('/three-days', authenticate, getThreeDayLogs);
router.get('/seven-days', authenticate, getSevenDayLogs);
router.get('/all-days', authenticate, getAllDaysLogs);

module.exports = router;
