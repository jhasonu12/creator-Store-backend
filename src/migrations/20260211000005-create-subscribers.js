'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Subscribers table
    await queryInterface.createTable('subscribers', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      creatorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'creators',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      subscriberId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'active',
      },
      subscribedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      cancelledAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes
    await queryInterface.addIndex('subscribers', ['creatorId']);
    await queryInterface.addIndex('subscribers', ['subscriberId']);
    await queryInterface.addIndex('subscribers', ['creatorId', 'subscriberId'], { unique: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscribers');
  }
};
