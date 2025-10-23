const { MoistureLog } = require('../models');
const { Op } = require('sequelize');
const { sendResponse, sendError } = require('../helpers/responseHelper');

exports.createMoistureLog = async (req, res) => {
    try {
        const { moisture_level } = req.body;

        if (moisture_level === undefined) {
            return sendError(res, 'Moisture level is required', 400);
        }

        const newLog = await MoistureLog.create({ moisture_level });
        return sendResponse(res, newLog, 'Moisture log created successfully');
    } catch (error) {
        return sendError(res, error.message);
    }
};

exports.getTodayLogs = async (req, res) => {
    try {
        const startOfToday = new Date();
        startOfToday.setUTCHours(0, 0, 0, 0);

        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);

        const logs = await MoistureLog.findAll({
            where: {
                createdAt: {
                    [Op.gte]: startOfToday,
                    [Op.lt]: startOfTomorrow,
                },
            },
            attributes: ['id', 'moisture_level', 'createdAt'],
            order: [['createdAt', 'ASC']],
        });

        const stats = logs.length
            ? {
                latest: logs[logs.length - 1].moisture_level,
                average: parseFloat(
                    (logs.reduce((sum, log) => sum + log.moisture_level, 0) / logs.length).toFixed(2)
                ),
                min: Math.min(...logs.map(log => log.moisture_level)),
                max: Math.max(...logs.map(log => log.moisture_level)),
                count: logs.length,
            }
            : {
                latest: null,
                average: null,
                min: null,
                max: null,
                count: 0,
            };

        return sendResponse(
            res,
            { logs, stats },
            logs.length ? 'Moisture logs retrieved successfully' : 'No moisture logs found'
        );
    } catch (error) {
        return sendError(res, error.message);
    }
};

exports.getThreeDayLogs = async (req, res) => {
    try {
        const now = new Date();
        const threeDaysAgo = new Date(now);
        threeDaysAgo.setUTCDate(threeDaysAgo.getUTCDate() - 3);

        const logs = await MoistureLog.findAll({
            where: {
                createdAt: {
                    [Op.gte]: threeDaysAgo,
                    [Op.lt]: now,
                },
            },
            attributes: ['id', 'moisture_level', 'createdAt'],
            order: [['createdAt', 'ASC']],
        });

        const stats = logs.length
            ? {
                latest: logs[logs.length - 1].moisture_level,
                average: parseFloat(
                    (logs.reduce((sum, log) => sum + log.moisture_level, 0) / logs.length).toFixed(2)
                ),
                min: Math.min(...logs.map(log => log.moisture_level)),
                max: Math.max(...logs.map(log => log.moisture_level)),
                count: logs.length,
            }
            : {
                latest: null,
                average: null,
                min: null,
                max: null,
                count: 0,
            };

        return sendResponse(
            res,
            { logs, stats },
            logs.length ? 'Moisture logs retrieved successfully' : 'No moisture logs found'
        );
    } catch (error) {
        return sendError(res, error.message);
    }
};

exports.getSevenDayLogs = async (req, res) => {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);

        const logs = await MoistureLog.findAll({
            where: {
                createdAt: {
                    [Op.gte]: sevenDaysAgo,
                    [Op.lt]: now,
                },
            },
            attributes: ['id', 'moisture_level', 'createdAt'],
            order: [['createdAt', 'ASC']],
        });

        const stats = logs.length
            ? {
                latest: logs[logs.length - 1].moisture_level,
                average: parseFloat(
                    (logs.reduce((sum, log) => sum + log.moisture_level, 0) / logs.length).toFixed(2)
                ),
                min: Math.min(...logs.map(log => log.moisture_level)),
                max: Math.max(...logs.map(log => log.moisture_level)),
                count: logs.length,
            }
            : {
                latest: null,
                average: null,
                min: null,
                max: null,
                count: 0,
            };

        return sendResponse(
            res,
            { logs, stats },
            logs.length ? 'Moisture logs retrieved successfully' : 'No moisture logs found'
        );
    } catch (error) {
        return sendError(res, error.message);
    }
};

exports.getAllDaysLogs = async (req, res) => {
    try {
        const logs = await MoistureLog.findAll({
            attributes: ['id', 'moisture_level', 'createdAt'],
            order: [['createdAt', 'ASC']],
        });

        const stats = logs.length
            ? {
                latest: logs[logs.length - 1].moisture_level,
                average: parseFloat(
                    (logs.reduce((sum, log) => sum + log.moisture_level, 0) / logs.length).toFixed(2)
                ),
                min: Math.min(...logs.map(log => log.moisture_level)),
                max: Math.max(...logs.map(log => log.moisture_level)),
                count: logs.length,
            }
            : {
                latest: null,
                average: null,
                min: null,
                max: null,
                count: 0,
            };

        return sendResponse(
            res,
            { logs, stats },
            logs.length ? 'Moisture logs retrieved successfully' : 'No moisture logs found'
        );
    } catch (error) {
        return sendError(res, error.message);
    }
};