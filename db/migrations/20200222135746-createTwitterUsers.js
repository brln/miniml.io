'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('twitterUsers', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      screenName: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      profileImageUrlHttps: {
        type: DataTypes.STRING,
      },
      verified: {
        type: DataTypes.BOOLEAN,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('twitterUsers');
  }
};
