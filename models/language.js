'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class language extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  };
  language.init({
    language: DataTypes.STRING,
    shourtcut: DataTypes.STRING,
    direction: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    country_img: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'language',
    scopes : {
      allLanguageActive : {
        where : {
          active : true
        }
      }
    }
  });
  return language;
};