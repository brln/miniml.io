'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('users', 'twitterTempToken', {
        type: Sequelize.STRING,
      })
      await queryInterface.addColumn('users', 'twitterOauthToken', {
        type: Sequelize.STRING,
      })
      await queryInterface.addColumn('users', 'twitterOauthTokenSecret', {
        type: Sequelize.STRING,
      })
      await queryInterface.addColumn('users', 'twitterUserID', {
        type: Sequelize.STRING
      })
      await queryInterface.addColumn('users', 'twitterScreenName', {
        type: Sequelize.STRING
      })
      await queryInterface.addIndex('users', ['twitterTempToken'])
    } catch (e) {
      console.log(e)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeIndex('users', ['twitterTempToken'])
      await queryInterface.removeColumn('users', 'twitterTempToken')
      await queryInterface.removeColumn('users', 'twitterOauthToken')
      await queryInterface.removeColumn('users', 'twitterOauthTokenSecret')
      await queryInterface.removeColumn('users', 'twitterUserID')
      await queryInterface.removeColumn('users', 'twitterScreenName')
    } catch (e) {
      console.log(e)
    }
  }
};
