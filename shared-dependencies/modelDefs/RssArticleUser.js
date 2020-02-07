export default (baseModel, DataTypes) => {
  class RssArticleUser extends baseModel {
    static init(sequelize) {
      return super.init(this.modelDef(), {
        sequelize,
        tableName: 'rssArticleUsers'
      })
    }

    static modelDef () {
      return {
        id: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        read: {
          type: DataTypes.BOOLEAN
        }
      }
    }

    static associate(models) {
      this.user = this.belongsTo(models.User, { foreignKey: 'id' })
      this.rssArticle = this.belongsTo(models.RssArticle, { foreignKey: 'id'})
    }
  }
  return RssArticleUser
}
