'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('services');

    // Only add columns that are missing
    if (!tableInfo.base_price) {
      await queryInterface.addColumn('services', 'base_price', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      });
    }

    if (!tableInfo.duration) {
      await queryInterface.addColumn('services', 'duration', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60,
      });
    }

    if (!tableInfo.vehicle_types) {
      await queryInterface.addColumn('services', 'vehicle_types', {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      });
    }

    if (!tableInfo.category) {
      await queryInterface.addColumn('services', 'category', {
        type: Sequelize.ENUM('basic', 'deluxe', 'premium'),
        allowNull: false,
        defaultValue: 'basic',
      });
    }

    if (!tableInfo.features) {
      await queryInterface.addColumn('services', 'features', {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      });
    }

    if (!tableInfo.image_url) {
      await queryInterface.addColumn('services', 'image_url', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableInfo.active) {
      await queryInterface.addColumn('services', 'active', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }

    console.log('Services table columns checked and added if missing.');
  },

  async down(queryInterface) {
    // Rollback (optional - removes columns if you revert)
    await queryInterface.removeColumn('services', 'base_price');
    await queryInterface.removeColumn('services', 'duration');
    await queryInterface.removeColumn('services', 'vehicle_types');
    await queryInterface.removeColumn('services', 'category');
    await queryInterface.removeColumn('services', 'features');
    await queryInterface.removeColumn('services', 'image_url');
    await queryInterface.removeColumn('services', 'active');
  }
};