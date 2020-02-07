export default (baseModel, DataTypes) => {
  class RssArticle extends baseModel {
    static init(sequelize) {
      return super.init(this.modelDef(), {
        sequelize,
        tableName: 'rssArticles'
      })
    }

    static modelDef () {
      return {
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
      }
    }
                                                                      
    static associate(models) {
      this.belongsTo(models.RssFeed, {foreignKey: 'id'})
      this.hasMany(models.RssArticleUser, {foreignKey: 'rssArticleID'})
    }
  }
  return RssArticle
}
