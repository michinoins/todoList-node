'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Todo.init(
    {
      userId: DataTypes.INTEGER,
      todoId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'User_Todo',
    }
  );
  return User_Todo;
};
