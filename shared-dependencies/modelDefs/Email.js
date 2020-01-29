export default (baseModel, DataTypes) => {
  class Email extends baseModel {
    static init(sequelize) {
      return super.init(this.modelDef(), {
        sequelize,
        tableName: 'emails'
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
        },
        fromAddress: {
          type: DataTypes.STRING,
        },
        fromName: {
          type: DataTypes.STRING,
        },
        replyToAddress: {
          type: DataTypes.STRING,
        },
        subject: {
          type: DataTypes.TEXT,
        },
        bodyHTML: {
          type: DataTypes.TEXT,
        },
      }
    }

    static associate(models) {
      this.user = this.belongsTo(models.User, { foreignKey: 'id' })
    }
  }
  return Email
}
