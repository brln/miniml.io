export default (baseModel, DataTypes) => {
  class User extends baseModel {
    static init(sequelize) {
      return super.init(this.modelDef(), {
        sequelize,
        tableName: 'users'
      })
    }

    static modelDef () {
      return {
        username: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        password: {
          type: DataTypes.STRING,
          nullable: false,
        },
        deliveryTime: {
          type: DataTypes.STRING,
        },
        deliveryTimezone: {
          type: DataTypes.STRING,
        }
      }
    }

    static associate(models) {
      this.emails = this.hasMany(models.Email, { foreignKey: 'userID' })
      this.rssFeeds = this.belongsToMany(models.RssFeed, {through: models.RssFeedUser, foreignKey: 'userID', otherKey: 'rssFeedID'})
      this.rssArticleUsers = this.hasMany(models.RssArticleUser, { foreignKey: 'userID'})
    }
  }
  return User
}
