import { UserDoesNotExistError } from "../errors"
import db from '../models'


export default class EmailSaver {
  static saveEmail(data) {
    return new Promise((res, rej) => {
      const username = data.toAddress.split('@')[0]
      db.User.findByPk(username).then(found => {
        if (!found) {
          rej(new UserDoesNotExistError())
        } else {
          data.userID = username
          db.Email.create(data).then(resp => {
            res(resp)
          }).catch(e => {
            rej(e)
          })
        }
      })
    })
  }
}
