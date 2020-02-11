import express from 'express'
import endpointAuth from '../auth'
import Parser from 'rss-parser'
import moment from 'moment-timezone'

import db from '../models'
import { helpers } from 'shared-dependencies'
import {Op} from "sequelize"
import { RssUpdater } from '../services'

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
        return db.RssFeedUser.findOne({where: {rssFeedID: foundFeed.id, userID: user.username}}).then(foundUserFeed => {
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
          RssUpdater.rssFetchBatchArticles([created])
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

router.get('/articles/:id', endpointAuth, (req, res, next) => {
  db.RssArticle.findByPk(req.params.id).then(article => {
    res.json(article)
  })
})

router.post('/articles', endpointAuth, (req, res, next) => {
  const username = res.locals.username
  const where = {where: {userID: username, rssArticleID: req.body.ids}}
  db.RssArticleUser.findAll(where).then(found => {
    const foundIDs = found.map(rau => rau.id)
    let findOrCreate = Promise.resolve()
    if (foundIDs.length > 0) {
      console.log(foundIDs)
      const newWhere = {where: {userID: username, id: foundIDs}}
      findOrCreate = db.RssArticleUser.update(req.body.updates, newWhere)
    }
    findOrCreate.then(() => {
      const needCreating = req.body.ids.reduce((accum, id) => {
        if (foundIDs.indexOf(id) < 0) {
          accum.push({
            userID: username,
            rssArticleID: id,
            id: helpers.getID(),
            read: req.body.updates.read
          })
        }
        return accum
      }, [])
      return db.RssArticleUser.bulkCreate(needCreating)
    })
    return findOrCreate
  }).then(() => {
    fetchArticles(req, res, next)
  }).catch(e => {
    console.log(e)
    next(e)
  })
})

// @TODO: factor endpoint auth out of each endpoint and apply to all routes
router.post('/articles/:id', endpointAuth, (req, res, next) => {
  const username = res.locals.username
  // This is not a general purpose updater because 'read' is stored on RssArticleUser
  // and users can't update RssArticles
  const newRead = req.body.read
  let article
  db.RssArticle.findByPk(req.params.id).then(_article => {
    article = _article
    return article.getRssArticleUsers({where: {userID: username}})
  }).then(rssArticleUsers => {
    let updateOrCreate
    if (rssArticleUsers.length) {
      updateOrCreate = rssArticleUsers[0].update({read: req.body.read})
    } else {
      const newArticleUser = {
        id: helpers.getID(),
        userID: username,
        rssArticleID: article.id,
        read: newRead,
      }
      updateOrCreate = db.RssArticleUser.create(newArticleUser)
    }
    return updateOrCreate
  }).then(() => {
    return db.RssArticle.findByPk(req.params.id, {include: [db.RssArticleUser]})
  }).then(rssArticle => {
    res.json(rssArticle)
  }).catch(e => {
    console.log(e)
    next(e)
  })
})

const fetchArticles = (req, res, next) => {
  const username = res.locals.username
  let feeds
  let user

  return db.User.findByPk(username).then(_user => {
    user = _user
    return user.getRssFeeds()
  }).then(_feeds => {
    const deliveryTimeUTC = moment().tz(user.deliveryTimezone).hour(user.deliveryTime).utc().hour()
    const betweenDate = helpers.between(`${deliveryTimeUTC}:00`, parseInt(req.query.offset) || 0)
    feeds = _feeds
    const feedIDs = feeds.map(f => f.id)
    return db.RssArticle.findAll({
      where: {
        rssFeedID: feedIDs,
        pubDate: {
          [Op.between]: [betweenDate.yesterday, betweenDate.today]
        }
      },
      order: [['pubDate', 'DESC']],
      include: [db.RssArticleUser]
    })
  }).then(articles => {
    res.json(articles)
  }).catch(e => {
    console.log(e)
    next(e)
  })
}

router.get('/articles', endpointAuth, fetchArticles)


module.exports = router
