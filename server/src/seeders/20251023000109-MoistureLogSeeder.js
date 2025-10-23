'use strict';

const { subDays, addMinutes } = require('date-fns');

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [];
    const startDate = subDays(new Date(), 7);
    const intervalMinutes = 15;
    const totalIntervals = (7 * 24 * 60) / intervalMinutes;

    for (let i = 0; i <= totalIntervals; i++) {
      const timestamp = addMinutes(startDate, i * intervalMinutes);
      data.push({
        moisture_level: Math.floor(Math.random() * 21) + 80,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    await queryInterface.bulkInsert('MoistureLogs', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('MoistureLogs', null, {});
  }
};
