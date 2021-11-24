'use strict';
const {
  Model, STRING, Op
} = require('sequelize');
const { defaultLanguage } = require('../Helper/helper');
module.exports = (sequelize, DataTypes) => {
  class productComments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  productComments.init({
    comment: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    likes: DataTypes.INTEGER,
    desLikes: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    shourtcut : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'productComments',
    scopes : {
      defaultLanguage : {
        where : {
          shourtcut : {
            [Op.eq] : defaultLanguage()
          }
        }
      }
    }
  });
  return productComments;
};