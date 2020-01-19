import express from 'express'

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

module.exports = router
