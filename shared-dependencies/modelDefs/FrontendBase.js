import { Map } from 'extendable-immutable'

export default class FrontendBase extends Map {
  static sortedFields () {
    const fields = this.modelDef()
    return Object.keys(fields).sort((a, b) => {
      const aDef = fields[a]
      const bDef = fields[b]
      const aSort = aDef instanceof Object
        && aDef.frontend
        && aDef.frontend.sortOrder ? aDef.frontend.sortOrder : Number.MAX_SAFE_INTEGER
      const bSort = bDef instanceof Object
        && bDef.frontend
        && bDef.frontend.sortOrder ? bDef.frontend.sortOrder : Number.MAX_SAFE_INTEGER
      return aSort - bSort
    })
  }

  static defaultInstance (constructorArgs={}) {
    const definition = this.modelDef()
    const data = Object.keys(definition).reduce((accum, field) => {
      if (!definition[field]) {
        throw new Error(`wut? ${field}`)
      }
      if (definition[field].frontend && definition[field].frontend.defaultValue !== undefined) {
        accum[field] = definition[field].frontend.defaultValue
      }
      accum[field] = definition[field].frontend ? definition[field].frontend.defaultValue : null
      return accum
    }, Object.assign(constructorArgs, {__typename: this.name }))
    return new this(data)
  }

  generateCreateVariables (children) {
    const createFields = this.constructor.createFields().reduce((accum, field) => {
      accum[field] = this.get(field)
      return accum
    }, {})
    if (children) {
      for (let childType of Object.keys(children)) {
        createFields[childType] = children[childType].map(child => {
          return child.generateCreateVariables()
        }).toJS()
      }
    }
    return createFields
  }

  save (children, authToken, savingService, callback) {
    const createVariables = this.generateCreateVariables(children)
    savingService.createRecord(this.constructor.name, createVariables, this.toJS(), authToken, callback)
  }
}
