export default (baseModel, DataTypes) => {
  class RssFeed extends baseModel {
    static init(sequelize) {
      return super.init(this.modelDef(), {
        sequelize,
        tableName: 'rssFeeds'
      })
    }

    static modelDef () {
      return {
        id: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        title: {
          type: DataTypes.TEXT
        },
        link: {
          type: DataTypes.TEXT
        },
        description: {
          type: DataTypes.TEXT
        },
        language: {
          type: DataTypes.STRING,
        },
        copyright: {
          type: DataTypes.TEXT
        },
        managingEditor: {
          type: DataTypes.STRING,
        },
        webMaster: {
          type: DataTypes.STRING,
        },
        pubDate: {
          type: DataTypes.DATE
        },
        lastBuildDate: {
          type: DataTypes.DATE
        },
        category: {
          type: DataTypes.STRING,
        },
        generator: {
          type: DataTypes.STRING,
        },
        docs: {
          type: DataTypes.TEXT
        },
        cloud: {
          type: DataTypes.STRING,
        },
        ttl: {
          type: DataTypes.INTEGER
        },
        imageLink: {
          type: DataTypes.STRING,
        },
        imageURL: {
          type: DataTypes.STRING,
        },
        imageTitle: {
          type: DataTypes.STRING,
        },
        textInput: {
          type: DataTypes.STRING,
        },
        skipHours: {
          type: DataTypes.STRING,
        },
        skipDays: {
          type: DataTypes.STRING,
        },
      }
    }

    static associate(models) {
      this.belongsToMany(models.User, {through: models.RssFeedUser, foreignKey: 'rssFeedID', otherKey: 'userID'})
      this.hasMany(models.RssArticle, {foreignKey: 'rssFeedID'})
    }
  }
  return RssFeed
}
