'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = ['users', 'products', 'orders']; // add all your table names here

    for (const table of tables) {
      await queryInterface.addColumn(table, 'isDeleted', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tables = ['Users', 'Products', 'Orders'];

    for (const table of tables) {
      await queryInterface.removeColumn(table, 'isDeleted');
    }
  }
};
