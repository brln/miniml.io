export default (baseModel, DataTypes) => {
  class TwitterUser extends baseModel {
    static init(sequelize) {
      return super.init(this.modelDef(), {
        sequelize,
        tableName: 'twitterUsers'
      })
    }

    static modelDef () {
      return {
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
      }
    }

    static associate(models) {
      this.tweets = this.hasMany(models.Tweet, { foreignKey: 'id' })
    }
  }

  return TwitterUser


}
