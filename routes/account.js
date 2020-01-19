import bcrypt from 'bcryptjs'
import express from 'express'

import { makeToken } from '../helpers'
import db from "../models"

const router = express.Router()

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
        password: hashed
      }).then(() => {
        const authToken = makeToken(username)
        res.send({ authToken })
      })
    }
  }).catch(e => {
    console.log(e)
  })
})

router.post('/login', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  db.User.findByPk(username).then(userData => {
    console.log(userData)
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
    next(e)
  })
})

module.exports = router
