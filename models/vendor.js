'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  vendor.init({
    fName: DataTypes.STRING,
    lName: DataTypes.STRING,
    age: DataTypes.INTEGER,
    CommercialRegister: DataTypes.STRING,
    image: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile: DataTypes.INTEGER,
    password: DataTypes.STRING,
    addres: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'vendor',
    scopes : {
      activeVendor : {
        where : {
          active : true
        }
      }
    }
  });
  return vendor;
};