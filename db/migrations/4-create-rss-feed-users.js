'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('rssFeedUsers', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      userID: {
        type: DataTypes.STRING,
        references: { model: 'users', key: 'username'}
      },
      rssFeedID: {
        type: DataTypes.STRING,
        references: { model: 'rssFeeds', key: 'id'}
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('rssFeedUsers');
  }
};
