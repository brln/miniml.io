import { basicDataTypes, modelDefs } from "shared-dependencies"


const FRONTEND_BASE_MODEL = 'FrontendBase'

const db = {}
for (let modelName of Object.keys(modelDefs)) {
  if (modelName !== FRONTEND_BASE_MODEL) {
    const model = modelDefs[modelName](modelDefs.FrontendBase, basicDataTypes)
    db[model.name] = model
  }
}

export default db

