import express from 'express'
import endpointAuth from '../auth'
import db from '../models'

const router = express.Router()

router.get('/', endpointAuth, function(req, res, next) {
  const username = res.locals.username
  db.Email.findAll({where: {userID: username}}).then(emails => {
    res.json(emails)
  })
})

router.get('/:id', endpointAuth, function(req, res, next) {
  const username = res.locals.username
  db.Email.findAll({where: {userID: username, id: req.params.id}}).then(email => {
    res.json(email)
  })
})

module.exports = router
