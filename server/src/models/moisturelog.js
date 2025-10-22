'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoistureLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MoistureLog.init({
    moisture_level: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'MoistureLog',
  });
  return MoistureLog;
};