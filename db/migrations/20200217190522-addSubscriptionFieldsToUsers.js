'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'trialExpires', {
      type: Sequelize.DATE,
    }).then(() => {
      return queryInterface.addColumn('users', 'paid', {
        type: Sequelize.BOOLEAN,
      })
    }).then(() => {
      return queryInterface.addColumn('users', 'subscriptionExpires', {
        type: Sequelize.DATE,
      })
    }).then(() => {
      return queryInterface.addColumn('users', 'subscriptionStripeSessionID', {
        type: Sequelize.STRING
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'trialExpires').then(() => {
      return queryInterface.removeColumn('users', 'paid')
    }).then(() => {
      return queryInterface.removeColumn('users', 'subscriptionExpires')
    }).then(() => {
      return queryInterface.removeColumn('users', 'subscriptionStripeSessionID')
    })
  }
}
