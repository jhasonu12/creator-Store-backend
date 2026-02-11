'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Products table
    await queryInterface.createTable('products', {
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
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
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
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD',
      },
      images: {
        type: Sequelize.JSON,
        defaultValue: [],
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'draft',
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tags: {
        type: Sequelize.JSON,
        defaultValue: [],
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      totalReviews: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isDigital: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.addIndex('products', ['creatorId']);
    await queryInterface.addIndex('products', ['status']);
    await queryInterface.addIndex('products', ['category']);
    await queryInterface.addIndex('products', ['creatorId', 'slug'], { unique: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
