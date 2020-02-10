'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'deliveryTimezone', {
      type: Sequelize.STRING,
      defaultValue: 'America/Los_Angeles'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'deliveryTimezone')
  }
};
