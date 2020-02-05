import express from 'express'
import faker from 'faker'

import { helpers } from 'shared-dependencies'
import db from '../models'
import { configGet, ENV } from '../config'

const router = express.Router()

router.use(mustBeLocal)

function mustBeLocal (req, res, next) {
  if (configGet(ENV) !== 'local') {
    res.send(404)
  } else {
    next()
  }
}

router.get('/', (req, res) => {
  res.send(`
    <h1>Random Shit</h1><br/>
    <a href="/api/randomShit/migrateDB">Migrate DB</a><br/>
    <a href="/api/randomShit/generateEmails">Generate Emails</a><br/>
  `)
})

// NOT PRODUCTION READY, CHANGES THE DB TO FIT THE LOCAL MODELS
// EVERY TIME YOU HIT IT! REMOVE WHEN MIGRATIONS ARE IMPLEMENTED
router.get('/migrateDB', (req, res) => {
  db.sequelize.sync({ alter: true }).then(() => {
    console.log('DB Synced')
  }).then(() => {
    res.json({'all': 'done'})
  })
})

router.get('/generateEmails', (req, resp, next) => {
  let now = Promise.resolve()
  for (let i=0; i<1000; i++) {
      now = now.then(() => {
        return db.Email.create({
        id: helpers.getID(), fromAddress: faker.internet.email(),
        fromName: faker.name.findName(),
        replyToAddress:  faker.internet.email(),
        toAddress: 'bob@miniml.io',
        subject: faker.lorem.words(),
        bodyHTML: faker.lorem.paragraph(),
        read: false,
        userID: 'bob',
        date: new Date(faker.date.recent(30)),
        archived: false
      }).catch(next)
    })
  }
  now.then(() => {
    resp.json
  })
})

module.exports = router
