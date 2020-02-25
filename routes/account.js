import bcrypt from 'bcryptjs'
import express from 'express'
import moment from 'moment'

import endpointAuth from '../auth'
import { makeToken } from '../helpers'
import db from "../models"
import bodyParser from "body-parser"

const router = express.Router()

router.use(bodyParser.urlencoded({
  extended: true
}))
router.use(bodyParser.json())

router.post('/signup', function(req, res, next) {
  const username = req.body.username
  const password = req.body.password

  db.User.findByPk(username).then(found => {
    if (found) {
      res.status(409).json({'error': 'User already exists'})
      return Promise.resolve()
    } else {
      const hashed = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      return db.User.create({
        username,
        password: hashed,
        deliveryTime: 13,
        deliveryTimezone: 'America/Los_Angeles',
        paid: false,
        trialExpires: moment().add(7, 'days')
      }).then(() => {
        const authToken = makeToken(username)
        res.send({ authToken })
      })
    }
  }).catch(e => {
    console.log(e)
    next(e)
  })
})

router.post('/login', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  db.User.findByPk(username).then(userData => {
    if (!userData) {
      return res.status(401).json({'error': 'Wrong username/password'})
    }
    if (!password || !userData || !bcrypt.compareSync(password, userData.password)) {
      return res.status(401).json({'error': 'Wrong username/password'})
    } else {
      const authToken = makeToken(userData.username)
      res.send({
        authToken,
      })
    }
  }).catch(e => {
    console.log(e)
    next(e)
  })
})

router.get('/user', endpointAuth, (req, res, next) => {
  const username = res.locals.username
  db.User.findByPk(username).then(userData => {
    res.json({
      username: userData.username,
      deliveryTime: userData.deliveryTime,
      deliveryTimezone: userData.deliveryTimezone,
      trialExpires: userData.trialExpires,
      paid: userData.paid,
      twitterScreenName: userData.twitterScreenName,
    })
  })
})

router.post('/user', endpointAuth, (req, res, next) => {
  const username = res.locals.username
  const allowedUpdates = {
    deliveryTime: req.body.deliveryTime,
    deliveryTimezone: req.body.deliveryTimezone
  }
  db.User.update(allowedUpdates, { where: { username }}).then(_ => {
    return db.User.findByPk(username)
  }).then(user => {
    res.json(user)
  }).catch(e => {
    console.log(e)
    next(e)
  })
})

module.exports = router
