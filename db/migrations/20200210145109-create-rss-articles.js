'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('rssArticles', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      guid: {
        type: DataTypes.STRING,
      },
      title: {
        type: DataTypes.TEXT,
      },
      link: {
        type: DataTypes.TEXT,
      },
      author: {
        type: DataTypes.TEXT,
      },
      description: {
        type: DataTypes.TEXT,
      },
      pubDate: {
        type: DataTypes.DATE,
      },
      content: {
        type: DataTypes.TEXT,
      },
      contentSnippet: {
        type: DataTypes.TEXT,
      },
      comments: {
        type: DataTypes.TEXT,
      },
      category: {
        type: DataTypes.TEXT,
      },
      enclosure: {
        type: DataTypes.TEXT,
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
    return queryInterface.dropTable('rssArticles');
  }
};
