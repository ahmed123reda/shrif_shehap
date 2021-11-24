'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productName: {
        type: Sequelize.STRING
      },
      catigory: {
        type: Sequelize.INTEGER
      },
      pieces: {
        type: Sequelize.INTEGER
      },
      productState: {
        type: Sequelize.BOOLEAN
      },
      dayesOfUsed: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      descount: {
        allowNull: true,
        type: Sequelize.STRING
      },
      version: {
        type: Sequelize.INTEGER
      },
      ProductOverview: {
        type: Sequelize.STRING
      },
      fullDescription: {
        type: Sequelize.STRING
      },
      keyWord: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      active : {
        type : Sequelize.BOOLEAN
      },
      comments : {
        type : Sequelize.BOOLEAN
      },
      likes : {
        type : Sequelize.BOOLEAN
      },
      interAction : {
        type : Sequelize.BOOLEAN
      },
      productImage: {
        type: Sequelize.STRING
      },
      descriptionImage: {
        type: Sequelize.STRING
      },
      productVideo: {
        type: Sequelize.STRING
      },
      shourtcut: {
        type: Sequelize.STRING
      },
      transitionOf: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('products');
  }
};