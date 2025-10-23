const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    timezone: process.env.TIMEZONE || '+00:00',
    dialectOptions: {
      useUTC: true,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

module.exports = { connectDB, sequelize };
