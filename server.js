import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import logger from 'morgan'
import path from 'path'

import {
  AccountRouter,
  EmailRouter,
  PaymentsRouter,
  RandomShitRouter,
  RssRouter,
  TwitterRouter,
} from './routes'
import { configGet, ENV, LOGGING_TYPE } from './config'
import {
  CronService,
  SqsService,
  RssUpdater ,
  TwitterService,
} from "./services"

CronService.startCron(RssUpdater.rssFullUpdate, 15)
CronService.startCron(TwitterService.twitterFullUpdate, 5)


const server = express()

server.use(express.static('views'))
server.use('/app/static', express.static('app/build/static'))

server.use(logger(configGet(LOGGING_TYPE)))
server.use(cookieParser())

const sqsService = SqsService.factory()
sqsService.receiveMessages()

server.use('/api/account', AccountRouter)
server.use('/api/email', EmailRouter)
server.use('/api/payments', PaymentsRouter)
server.use('/api/rss', RssRouter)
server.use('/api/randomShit', RandomShitRouter)
server.use('/api/twitter', TwitterRouter)
server.use('/api/*', (req, res, next) => {
  res.status(404).send({error: 'Not Found'})
})

server.use('*.php', (req, res) => {
  setTimeout(() => {
    res.json({error: 'error'})
  }, Math.random() * 30000)
})

// catch 404 and forward to error handler
server.use(function(req, res, next) {
  res.sendFile(path.join(__dirname, '/app/build/index.html'))
})

// error handler
server.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err)
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({'error': err})
})

module.exports = server
