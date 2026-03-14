'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable('store_pages');

    if (!tableDefinition.form) {
      await queryInterface.addColumn('store_pages', 'form', {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {
          collectName: true,
          collectEmail: true,
        },
      });
    }

    if (!tableDefinition.digitalAssets) {
      await queryInterface.addColumn('store_pages', 'digitalAssets', {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      });
    }
  },

  async down(queryInterface) {
    const tableDefinition = await queryInterface.describeTable('store_pages');

    if (tableDefinition.digitalAssets) {
      await queryInterface.removeColumn('store_pages', 'digitalAssets');
    }

    if (tableDefinition.form) {
      await queryInterface.removeColumn('store_pages', 'form');
    }
  },
};
