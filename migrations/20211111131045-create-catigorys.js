'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('catigorys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      shourtcut: {
        type: Sequelize.STRING
      },
      transitionOf: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      slug: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      image: {
        type: Sequelize.STRING
      },
      catigoryId: {
        type: Sequelize.INTEGER
      },
      comments: {
        type: Sequelize.BOOLEAN
      },
      interAction: {
        type: Sequelize.BOOLEAN
      },
      forShow: {
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
    await queryInterface.dropTable('catigorys');
  }
};