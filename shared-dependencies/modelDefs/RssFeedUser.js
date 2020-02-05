export default (baseModel, DataTypes) => {
  class RssFeedUser extends baseModel {
    static init(sequelize) {
      return super.init(this.modelDef(), {
        sequelize,
        tableName: 'rssFeedUsers'
      })
    }

    static modelDef () {
      return {
        id: {
          type: DataTypes.STRING,
          primaryKey: true
        },
      }
    }

    static associate(models) {
      this.user = this.belongsTo(models.User, { foreignKey: 'id' })
      this.rssFeed = this.belongsTo(models.RssFeed, { foreignKey: 'id'})
    }
  }
  return RssFeedUser
}
