'use strict';
const {
  Model
} = require('sequelize');
const { defaultLanguage } = require('../Helper/helper');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  product.init({
    productName: DataTypes.STRING,
    catigory: DataTypes.INTEGER,
    pieces: DataTypes.INTEGER,
    productState: DataTypes.BOOLEAN,
    dayesOfUsed: DataTypes.INTEGER,
    version: DataTypes.INTEGER,
    productImage: DataTypes.STRING,
    descriptionImage: DataTypes.STRING,
    ProductOverview: DataTypes.STRING,
    fullDescription: DataTypes.STRING,
    productVideo: DataTypes.STRING,
    keyWord: DataTypes.STRING,
    price: DataTypes.INTEGER,
    descount: DataTypes.STRING,
    shourtcut: DataTypes.STRING,
    transitionOf: DataTypes.INTEGER,
    active : DataTypes.BOOLEAN,
    comments : DataTypes.BOOLEAN,
    likes : DataTypes.BOOLEAN,
    interAction:DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'product',
    scopes : {
      defaultLanguage : {
        where : {
          shourtcut : defaultLanguage()
        }
      }
    }
  });
  return product;
};