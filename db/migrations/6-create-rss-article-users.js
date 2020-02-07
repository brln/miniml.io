'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('rssArticleUsers', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      read: {
        type: DataTypes.BOOLEAN
      },
      rssArticleID: {
        type: DataTypes.STRING,
        references: { model: 'rssArticles', key: 'id'}
      },
      userID: {
        type: DataTypes.STRING,
        references: { model: 'users', key: 'username'}
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
    return queryInterface.dropTable('rssArticleUsers');
  }
};
