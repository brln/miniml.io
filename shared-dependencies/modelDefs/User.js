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
        }
      }
    }

    static associate(models) {
      this.messages = this.hasMany(models.Message, { foreignKey: 'userID' })
      this.emails = this.hasMany(models.Email, { foreignKey: 'userID' })
      this.rssFeeds = this.belongsToMany(models.RssFeed, {through: models.RssFeedUser})
    }
  }
  return User
}
