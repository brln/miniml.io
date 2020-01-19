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
      // this.account = this.belongsTo(models.Account, { foreignKey: 'id' })
    }
  }
  return User
}
