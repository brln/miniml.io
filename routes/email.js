import express from 'express'
import endpointAuth from '../auth'
import db from '../models'
import { Op } from 'sequelize'
import { helpers } from 'shared-dependencies'

const router = express.Router()


router.get('/', endpointAuth, (req, res, next) => {
  const username = res.locals.username
  const date = helpers.between('1:00', parseInt(req.query.offset) || 0)

  db.Email.findAll({
    where: {
      userID: username,
      archived: false,
      date: {
        [Op.between]: [date.yesterday, date.today]
      }
    },
    order: [['date', 'DESC']]
  }).then(emails => {
    res.json(emails)
  }).catch(next)
})

router.post('/', endpointAuth, (req, res, next) => {
  const username = res.locals.username
  const where = {where: {userID: username, id: req.body.ids}}
  db.Email.update(req.body.updates, where).then(resp => {
    const offset = parseInt(req.body.offset) || 0
    return db.Email.findAll({where: {userID: username, archived: false}, offset, limit: 50, order: [['date', 'DESC']]})
  }).then(emails => {
    res.json(emails)
  }).catch(next)
})

router.get('/:id', endpointAuth, (req, res, next) => {
  const username = res.locals.username
  db.Email.findAll({where: {userID: username, id: req.params.id, archived: false}}).then(email => {
    res.json(email[0])
  }).catch(next)
})

router.post('/:id', endpointAuth, (req, res, next) => {
  const username = res.locals.username
  const where = {where: {userID: username, id: req.params.id}}
  db.Email.update(req.body, where).then(resp => {
    where.where.archived = false
    return db.Email.findAll(where)
  }).then(email => {
    res.json(email[0])
  }).catch(next)
})

module.exports = router
