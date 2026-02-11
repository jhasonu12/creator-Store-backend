'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Creators table
    await queryInterface.createTable('creators', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      displayName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      profileImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bannerImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      verificationDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      totalEarnings: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      totalReviews: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.addIndex('creators', ['slug']);
    await queryInterface.addIndex('creators', ['userId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('creators');
  }
};
