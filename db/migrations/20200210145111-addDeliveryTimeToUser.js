'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'deliveryTime', {
      type: Sequelize.STRING,
      defaultValue: 13,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'deliveryTime')
  }
};
