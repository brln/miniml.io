import querystring from 'querystring'
import express from 'express'
import endpointAuth from '../auth'
import bodyParser from "body-parser"
import {
  configGet,
  HOST,
} from "../config"
import { TwitterService } from '../services'
import db from '../models'
import moment from "moment-timezone"
import {Op} from "sequelize"
import {helpers} from "shared-dependencies"

const router = express.Router()

router.use(bodyParser.urlencoded({
  extended: true
}))
router.use(bodyParser.json())

const fetchTweets = async (req, res, next) => {
  const username = res.locals.username
  try {
    const user = await db.User.findOne({where: {username}})
    const deliveryTimeUTC = moment().tz(user.deliveryTimezone).hour(user.deliveryTime).utc().hour()
    const date = helpers.between(`${deliveryTimeUTC}:00`, parseInt(req.query.offset) || 0)
    const tweets = await user.getTweets({
      include: [db.TwitterUser],
      where: {
        createdAt: {
          [Op.between]: [date.yesterday, date.today]
        }
      }
    })
    res.json(tweets)
  } catch (e) {
    next(e)
  }
}

router.get('/', endpointAuth, fetchTweets)

router.post('/', endpointAuth, async (req, res, next) => {
  try {
    const username = res.locals.username
    const where = {where: {userID: username, tweetID: req.body.ids}}
    await db.UserTweet.update({read: req.body.updates.read}, where)
    await fetchTweets(req, res, next)
  } catch (e) {
    next(e)
  }
})

router.get('/:id', endpointAuth, async (req, res, next) => {
  const username = res.locals.username
  try {
    const user = await db.User.findOne({where: {username}})
    const tweets = await user.getTweets({
      include: [db.TwitterUser],
      where: {
        id: req.params.id
      }
    })
    res.json(tweets[0])
  } catch (e) {
    next(e)
  }
})

router.post('/:id', endpointAuth, async (req, res, next) => {
  try {
    const username = res.locals.username
    const where = {where: {userID: username, tweetID: req.params.id}}
    const user = await db.User.findOne({where: { username }})
    await db.UserTweet.update({read: req.body.read}, where)
    const tweets = await user.getTweets({
      where: {id: req.params.id},
      include: [db.TwitterUser]
    })
    res.json(tweets[0])
  } catch (e) {
    next(e)
  }
})


router.get('/startOauth', endpointAuth, (req, res, next) => {
  const username = res.locals.username

  let oauthToken
  TwitterService.makeRequest(
    'https://api.twitter.com/oauth/request_token',
    'POST',
    { oauth_callback: `${configGet(HOST)}/api/twitter/oauthCallback` }
  ).then(resp => resp.text()).then(text => {
    const parsed = querystring.parse(text)
    if (!parsed.oauth_token) {
      throw new Error(text)
    }
    oauthToken = parsed.oauth_token
    return db.User.findByPk(username)
  }).then(user => {
    user.twitterTempToken = oauthToken
    return user.save()
  }).then(() => {
    res.json({
      token: oauthToken
    })
  }).catch(e => {
    next(e)
  })
})

router.get('/oauthCallback', (req, res, next) => {
  const oauthToken = req.query.oauth_token
  const oauthVerifier = req.query.oauth_verifier
  let oauthData
  TwitterService.makeRequest(
    `https://api.twitter.com/oauth/access_token?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`,
    'POST',
  ).then(resp => resp.text()).then(text => {
    const parsed = querystring.parse(text)
    if (!parsed.oauth_token) {
      throw new Error(text)
    }
    oauthData = parsed
    return db.User.findOne({where: {twitterTempToken: oauthToken}})
  }).then(user => {
    user.twitterOauthToken = oauthData.oauth_token
    user.twitterOauthTokenSecret = oauthData.oauth_token_secret
    user.twitterUserID = oauthData.user_id
    user.twitterScreenName = oauthData.screen_name
    return user.save()
  }).then(() => {
    res.redirect('/settings')
  }).catch(e => {
    next(e)
  })
})

module.exports = router
