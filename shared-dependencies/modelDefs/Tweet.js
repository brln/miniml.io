export default (baseModel, DataTypes) => {
  class Tweet extends baseModel {
    static init(sequelize) {
      return super.init(this.modelDef(), {
        sequelize,
        tableName: 'tweets'
      })
    }

    static modelDef () {
      return {
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
          type: DataTypes.STRING,
        },
        imageURL: {
          type: DataTypes.TEXT,
        }
      }
    }

    static associate(models) {
      this.twitterUser = this.belongsTo(models.TwitterUser, { foreignKey: 'twitterUserID' })
      this.user = this.belongsToMany(models.User, {through: models.UserTweet, foreignKey: 'tweetID', otherKey: 'userID'})
    }
  }
  return Tweet
}

