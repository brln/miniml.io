import express from 'express'
import endpointAuth from '../auth'
import moment from 'moment'
import Parser from 'rss-parser'
import MurmurHash3 from 'imurmurhash'

import db from '../models'
import { helpers } from 'shared-dependencies'
import {Op} from "sequelize"

const router = express.Router()

router.post('/feeds', endpointAuth, (req, res, next) => {
  const parser = new Parser()
  const username = res.locals.username
  let feedData

  parser.parseURL(req.body.url).then(_feedData => {
    feedData = _feedData
    return db.User.findByPk(username)
  }).then(user => {
    return db.RssFeed.findOne({where: {link: req.body.url}}).then(foundFeed => {
      if (foundFeed) {
        return db.RssFeedUser.findOne({where: {RssFeedID: foundFeed.id, UserUsername: user.username}}).then(foundUserFeed => {
          if (foundUserFeed) {
            return Promise.resolve()
          } else {
            return user.addRssFeed(foundFeed, {through: {id: helpers.getID() }})
          }
        }).then(() => {
          res.json(foundFeed)
        })
      } else {
        let created
        return db.RssFeed.create({
          id: helpers.getID(),
          link: req.body.url,
          title: feedData.title,
          description: feedData.description,
          language: feedData.language,
          copyright: feedData.copyright,
          managingEditor: feedData.managingEditor,
          webMaster: feedData.webMaster,
          pubDate: feedData.pubDate,
          lastBuildDate: feedData.lastBuildDate,
          category: feedData.category,
          generator: feedData.generator,
          docs: feedData.docs,
          cloud: feedData.cloud,
          ttl: feedData.ttl,
          imageLink: feedData.image ? feedData.image.link : null,
          imageURL: feedData.image ? feedData.image.url : null,
          imageTitle: feedData.image ? feedData.image.title : null,
          textInput: feedData.textInput,
          skipHours: feedData.skipHours,
          skipDays: feedData.skipDays,
        }).then(_created => {
          created = _created
          return user.addRssFeed(created, {through: {id: helpers.getID()}})
        }).then(() => {
          res.json(created)
        })
      }
    })
  }).catch(e => {
    console.log(e)
    if (e.errno === 'ECONNREFUSED') {
      res.json({error: 'Could not connect to that feed'}, 400)
    } else {
      res.json({error: 'Could not add that feed'}, 400)
    }
  })
})

router.get('/feeds', endpointAuth, (req, res, next) => {
  const username = res.locals.username
  return db.User.findByPk(username).then(user => {
    return user.getRssFeeds()
  }).then(feeds => {
    res.json(feeds)
  }).catch(e => {
    console.log(e)
    next(e)
  })
})

router.get('/articles', endpointAuth, (req, res, next) => {
  const username = res.locals.username
  const parser = new Parser()
  let feeds
  const articles = {}
  const betweenDate = helpers.between('12:23', parseInt(req.query.offset) || 0)
  return db.User.findByPk(username).then(user => {
    return user.getRssFeeds()
  }).then(_feeds => {
    feeds = _feeds
    const feedFetches = []
    for (let feed of feeds) {
      feedFetches.push(parser.parseURL(feed.link))
    }
    return Promise.all(feedFetches)
  }).then(feedFetches => {
    for (let [i, feedFetch] of feedFetches.entries()) {
      for (let item of feedFetch.items) {
        const guid = item.guid || MurmurHash3(feeds[i].id).hash(item.title).hash(item.link).result().toString()
        articles[guid] = {
          id: helpers.getID(),
          feedID: feeds[i].id,
          guid,
          title:  item.title,
          link:  item.link,
          author:  item.author,
          description:  item.description,
          pubDate:  moment(item.pubDate).format(),
          content: item.content,
          contentSnippet:  item.contentSnippet,
          comments: item.comments,
          category: item.category,
          enclosure: item.enclosure,
        }
      }
    }
    const guids = Object.keys(articles)
    return db.RssArticle.findAll({where: {guid: guids}})
  }).then(findResult => {
    const existingGUIDs = findResult.map(i => i.guid)

    const toSave = []
    for (let [guid, article] of Object.entries(articles)) {
      if (existingGUIDs.indexOf(guid) < 0) {
        toSave.push(article)
      }
    }
    return db.RssArticle.bulkCreate(toSave)
  }).then(() => {
    const feedIDs = feeds.map(f => f.id)
    return db.RssArticle.findAll({
      where: {
        feedID: feedIDs,
        pubDate: {
          [Op.between]: [betweenDate.yesterday, betweenDate.today]
        }
      },
      order: [['pubDate', 'DESC']]
    })
  }).then(articles => {
    res.json(articles)
  }).catch(e => {
    console.log(e)
    next(e)
  })
})


module.exports = router
