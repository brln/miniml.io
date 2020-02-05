import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import logger from 'morgan'
import path from 'path'

import {
  AccountRouter,
  EmailRouter,
  RandomShitRouter,
  RssRouter,
} from './routes'
import { configGet, ENV, LOGGING_TYPE } from './config'
import { SqsService } from "./services"


const server = express()

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

server.use(express.static('views'))
server.use('/app/static', express.static('app/build/static'))

server.use(logger(configGet(LOGGING_TYPE)))
server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use(cookieParser())

// configure the app to use bodyParser()
server.use(bodyParser.urlencoded({
    extended: true
}))
server.use(bodyParser.json())

const sqsService = SqsService.factory()
sqsService.receiveMessages()

server.use('/api/account', AccountRouter)
server.use('/api/email', EmailRouter)
server.use('/api/rss', RssRouter)
server.use('/api/randomShit', RandomShitRouter)

server.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, '/app/build/index.html'))
})

server.use('*.php', (req, res) => {
  setTimeout(() => {
    res.json({error: 'error'})
  }, Math.random() * 30000)
})

// catch 404 and forward to error handler
server.use(function(req, res, next) {
  res.status(404).send("<h1>Not Found</h1>")
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
