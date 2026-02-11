'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Subscription Tiers table
    await queryInterface.createTable('subscription_tiers', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      billingCycle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      features: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      maxSupport: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscription_tiers');
  }
};
