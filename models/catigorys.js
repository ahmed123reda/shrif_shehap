'use strict';
const {Model , Op} = require('sequelize');
const { defaultLanguage } = require('../Helper/helper');
module.exports = (sequelize, DataTypes) => {
  class catigorys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      catigorys.hasMany(models.catigorys , {as : "supCatigorys" , foreignKey : "catigoryId"})
    }
  };
  catigorys.init({
    name: DataTypes.STRING,
    shourtcut: DataTypes.STRING,
    transitionOf: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    slug: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
    catigoryId: DataTypes.INTEGER,
    comments: DataTypes.BOOLEAN,
    interAction: DataTypes.BOOLEAN,
    forShow: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'catigorys',
    scopes: {
      defaultLanguage : {
        where : {
          shourtcut : defaultLanguage()
        }
      },
      allCatigory : {
        where : {
          [Op.and] : [{catigoryId : {[Op.eq] : 0}}]
        }
      },
      allSupCatigory : {
        where : {
          [Op.and] : [{catigoryId : {[Op.gt] : 0}}]
        }
      },
    }
  });
  return catigorys;
};