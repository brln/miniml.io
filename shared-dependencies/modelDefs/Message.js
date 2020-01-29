export default (baseModel, DataTypes) => {
  class Message extends baseModel {
    static init(sequelize) {
      return super.init(this.modelDef(), {
        sequelize,
        tableName: 'messages'
      })
    }

    static modelDef () {
      return {
        id: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        userID: {
          type: DataTypes.STRING,
          nullable: false,
        }
      }
    }

    static associate(models) {
      this.user = this.belongsTo(models.User, { foreignKey: 'id' })
    }
  }
  return Message
}
