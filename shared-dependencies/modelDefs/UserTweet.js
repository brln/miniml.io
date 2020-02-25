export default (baseModel, DataTypes) => {
  class UserTweet extends baseModel {
    static init(sequelize) {
      return super.init(this.modelDef(), {
        sequelize,
        tableName: 'userTweets'
      })
    }

    static modelDef () {
      return {
        id: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        deletedAt: {
          type: DataTypes.DATE,
        },
        read: {
          type: DataTypes.BOOLEAN
        }
      }
    }

    static associate(models) {
      this.user = this.belongsTo(models.User, { foreignKey: 'id' })
      this.tweet = this.belongsTo(models.Tweet, { foreignKey: 'id'})
    }
  }
  return UserTweet
}
