import express from 'express'
import endpointAuth from '../auth'
import db from '../models'

const router = express.Router()

router.get('/', endpointAuth, (req, res, next) => {
  const username = res.locals.username
  console.log(req.query.offset)
  const offset = parseInt(req.query.offset) || 0
  db.Email.findAll({where: {userID: username}, offset, limit: 50, order: [['date', 'DESC']]}).then(emails => {
    res.json(emails)
  }).catch(next)
})

router.get('/:id', endpointAuth, (req, res, next) => {
  const username = res.locals.username
  db.Email.findAll({where: {userID: username, id: req.params.id}}).then(email => {
    res.json(email[0])
  }).catch(next)
})

router.post('/:id', endpointAuth, (req, res, next) => {
  const username = res.locals.username
  const where = {where: {userID: username, id: req.params.id}}
  db.Email.update(req.body, where).then(resp => {
    return db.Email.findAll(where)
  }).then(email => {
    res.json(email[0])
  }).catch(next)
})

module.exports = router
