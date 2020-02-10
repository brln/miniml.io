'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('emails', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      fromAddress: {
        type: DataTypes.STRING,
      },
      fromName: {
        type: DataTypes.STRING,
      },
      replyToAddress: {
        type: DataTypes.STRING,
      },
      subject: {
        type: DataTypes.TEXT,
      },
      bodyHTML: {
        type: DataTypes.TEXT,
      },
      read: {
        type: DataTypes.BOOLEAN
      },
      date: {
        type: DataTypes.DATE
      },
      archived: {
        type: DataTypes.BOOLEAN
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
    return queryInterface.dropTable('emails');
  }
};
