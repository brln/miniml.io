import Parser from "rss-parser"
import {helpers} from "shared-dependencies"
import db from "../models"
import MurmurHash3 from "imurmurhash"
import moment from "moment"
import { parse } from 'node-html-parser';

class DefaultParser {
  static parse(feed, feedFetch) {
    const articles = {}
    for (let item of feedFetch.items) {
      const guid = item.guid || MurmurHash3(feed.id).hash(item.title).hash(item.link).result().toString()

      articles[guid] = {
        id: helpers.getID(),
        rssFeedID: feed.id,
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
      }
    }
    return articles
  }
}

class RedditParser {
  static parse(feed, feedFetch) {
    const articles = {}
    for (let item of feedFetch.items) {
      const guid = item.guid || MurmurHash3(feed.id).hash(item.title).hash(item.link).result().toString()
      const root = parse(item.content)
      const actualLink = root.querySelectorAll('a').filter(a => a.innerHTML === '[link]')[0].getAttribute('href')
      articles[guid] = {
        id: helpers.getID(),
        rssFeedID: feed.id,
        guid,
        title:  item.title,
        link:  actualLink,
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
    return articles
  }
}

class ParserPicker {
  static pick (type) {
    if (!type) {
      return DefaultParser
    } else if (type === 'reddit') {
      return RedditParser
    }
  }
}

export default class RssUpdater {
  static checkIfExistsAndSaveNewArticles (articles) {
    const guids = Object.keys(articles)
    return db.RssArticle.findAll({where: {guid: guids}}).then(findResult => {
      const existingGUIDs = findResult.map(i => i.guid)

      const toSave = []
      for (let [guid, article] of Object.entries(articles)) {
        if (existingGUIDs.indexOf(guid) < 0) {
          toSave.push(article)
        }
      }
      return db.RssArticle.bulkCreate(toSave)
    })
  }

  static rssFetchBatchArticles (feeds) {
    const parser = new Parser()
    let articleFetch = Promise.resolve()

    for (let feed of feeds) {
      articleFetch = articleFetch.then(() => {
        return parser.parseURL(feed.link).then(feedFetch => {
          const parser = ParserPicker.pick(feed.get('specialType'))
          const articles = parser.parse(feed, feedFetch)
          RssUpdater.checkIfExistsAndSaveNewArticles(articles)
        })
      })
    }
    return articleFetch
  }

  static rssFullUpdate () {
    const FEEDS_AT_A_TIME = 2

    db.RssFeed.count().then(count => {
      let feedFetch = Promise.resolve()
      for (let i = 0; i < count; i += FEEDS_AT_A_TIME) {
        feedFetch = feedFetch.then(() => {
          return db.RssFeed.findAll({order: [['id']], limit: 2, offset: i}).then(feeds => {
            return RssUpdater.rssFetchBatchArticles(feeds)
          })
        })
      }
    })
  }
}

