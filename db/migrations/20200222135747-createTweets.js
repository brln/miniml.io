'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('tweets', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      text: {
        type: DataTypes.TEXT,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      source: {
        type: DataTypes.TEXT,
      },
      retweetCount: {
        type: DataTypes.STRING,
      },
      favoriteCount: {
        type: DataTypes.STRING
      },
      twitterUserID: {
        type: DataTypes.STRING,
        references: { model: 'twitterUsers', key: 'id'}
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
      imageURL: {
        type: DataTypes.TEXT,
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tweets');
  }
};
