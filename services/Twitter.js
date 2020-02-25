import { Op } from 'sequelize'
import OAuth from "oauth-1.0a"
import crypto from "crypto"
import fetch from "node-fetch"

import {configGet, TWITTER_API_KEY, TWITTER_API_SECRET_KEY} from "../config"
import db from '../models'


export default class TwitterService {
  static makeRequest (url, method, data={}, userToken, userSecret) {
    const oauth = OAuth({
      consumer: {
        key: configGet(TWITTER_API_KEY),
        secret: configGet(TWITTER_API_SECRET_KEY),
      },
      signature_method: 'HMAC-SHA1',
      hash_function: (base_string, key) => {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64')
      },
    })

    const request_data = { url, method, data }

    let token = {}
    if (userToken && userSecret) {
      token = {
        key: userToken,
        secret: userSecret,
      }
    }

    const authorization = oauth.toHeader(oauth.authorize(request_data, token))
    return fetch(request_data.url,
      {
        method: request_data.method,
        headers: authorization,
      },
    )
  }

  static getHomeTimeline (userToken, userSecret, sinceID) {
    let url = `https://api.twitter.com/1.1/statuses/home_timeline.json?exclude_replies=true`
    if (sinceID) {
      url += `&since_id=${sinceID}`
    }
    console.log(url)
    return this.makeRequest(url, 'GET', {}, userToken, userSecret).then(resp => {
      return resp.text()
    })
  }

  static twitterFullUpdate () {
    db.User.findAll({where: {twitterOauthToken: {[Op.not]: null}}}).then(users => {
      let nextUserPromise = Promise.resolve()
      for (let user of users) {
        nextUserPromise = nextUserPromise.then(() => {
          return db.sequelize.query(`
            select tweetID 
            from userTweets 
            where createdAt = (
              select max(createdAt) from userTweets where userID = '${user.username}'
            )
            and userID = '${user.username}';
          `)
        }).then(userTweetMax => {
          const tweetID = userTweetMax && userTweetMax.length > 0 ? userTweetMax[0][0].tweetID : null
          const twitterUsers = {}
          const minimlTweets = {}
          const userTweets = []
          return TwitterService.getHomeTimeline(user.twitterOauthToken, user.twitterOauthTokenSecret, tweetID).then(text => {
            const parsed = JSON.parse(text)
            if (parsed.errors) {
              console.log(parsed.errors)
            }  else {
              for (let tweet of parsed) {
                const media = tweet.entities.media
                let imageURL
                if (media && media.length > 0) {
                  imageURL = media[0].media_url_https
                }
                twitterUsers[tweet.user.id] = {
                  id: tweet.user.id,
                  screenName: tweet.user.screen_name,
                  name: tweet.user.name,
                  profileImageUrlHttps: tweet.user.profile_image_url_https,
                  verified: tweet.user.verified,
                }
                minimlTweets[tweet.id_str] = {
                  id: tweet.id_str,
                  twitterUserID: tweet.user.id,
                  text: tweet.text,
                  image: "",
                  createdAt: tweet.created_at,
                  source: tweet.source,
                  retweetCount: tweet.retweet_count,
                  favoriteCount: tweet.favorite_count,
                  imageURL,
                }
                const id = `${user.username}_${tweet.id_str}`
                userTweets.push({
                  id,
                  tweetID: tweet.id_str,
                  userID: user.username,
                  read: false,
                })
              }
            }
            console.log(twitterUsers)
            return db.TwitterUser.bulkCreate(Object.values(twitterUsers), { updateOnDuplicate: [
              'verified', 'profileImageUrlHttps', 'name', 'screenName'
            ]})
          }).then(() => {
            return db.Tweet.bulkCreate(Object.values(minimlTweets), { updateOnDuplicate: [
              'retweetCount', 'favoriteCount'
            ] })
          }).then(() => {
            return db.UserTweet.bulkCreate(userTweets, { updateOnDuplicate: ['id'] })
          }).catch(e => {
            console.log(e)
          })
        })
      }
    })
  }
}

