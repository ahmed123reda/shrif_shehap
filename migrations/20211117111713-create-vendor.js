'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vendors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fName: {
        type: Sequelize.STRING
      },
      lName: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      CommercialRegister: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING
      },
      addres: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vendors');
  }
};