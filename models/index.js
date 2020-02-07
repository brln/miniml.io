'use strict'

import { modelDefs } from 'shared-dependencies'
import {
  configGet,
  DB_DATABASE,
  DB_PASSWORD,
  DB_USERNAME,
  DB_HOST,
  DB_DIALECT,
} from "../config"

import Sequelize from 'sequelize'

const config = {
  "username": configGet(DB_USERNAME),
  "password": configGet(DB_PASSWORD),
  "database": configGet(DB_DATABASE),
  "host": configGet(DB_HOST),
  "dialect": configGet(DB_DIALECT),
}

const db = {}

const FRONTEND_BASE_MODEL = 'FrontendBase' // So we can ignore this here on the backend.

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

for (let modelName of Object.keys(modelDefs)) {
  if (modelName !== FRONTEND_BASE_MODEL) {
    const model = modelDefs[modelName](Sequelize.Model, Sequelize.DataTypes)
    model.init(sequelize)
    db[model.name] = model
  }
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
