'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Subscriptions table
    await queryInterface.createTable('subscriptions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      tierId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'subscription_tiers',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'active',
      },
      currentPeriodStart: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      currentPeriodEnd: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      cancelledAt: {
        type: Sequelize.DATE,
        allowNull: true,
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

    // Add indexes
    await queryInterface.addIndex('subscriptions', ['userId']);
    await queryInterface.addIndex('subscriptions', ['tierId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscriptions');
  }
};
