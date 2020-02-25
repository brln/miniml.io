'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('userTweets', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      userID: {
        type: DataTypes.STRING,
        references: { model: 'users', key: 'username'}
      },
      tweetID: {
        type: DataTypes.STRING,
        references: { model: 'tweets', key: 'id'}
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
      read: {
        type: DataTypes.BOOLEAN,
      },
    });
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('userTweets');
  }
};
