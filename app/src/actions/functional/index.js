import { fromJS, List } from 'immutable'
import { push } from 'connected-react-router'

import {
  AuthStorageService,
  ApiClient,
} from '../../services/'

import {
  addRssFeed,
  logOut,
  setAuthToken,
  setArticles,
  setEmails,
  setInboxItems,
  setInboxLoading,
  setLoginError,
  setRssFeed,
  setRssFeeds,
  setRssFeedAddError,
  setTweets,
  setUserData,
  setViewingItem,
  tokenCheckComplete,
} from '../../actions/standard'
import {EMAILS, RSS_ARTICLES, TWEETS} from "../../constants/magicStrings"

function byID (items) {
  return items.reduce((accum, item) => {
    accum[item.id] = item
    return accum
  }, {})
}

function connectToTwitter () {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    apiClient.get('/api/twitter/startOauth').then(resp => {
      window.location = `https://api.twitter.com/oauth/authorize?oauth_token=${resp.token}`
    })
  }
}

function createCheckoutSession () {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    apiClient.post(`/api/payments`).then(resp => {
      const sessionId = resp.sessionID
      console.log('key', process.env.REACT_APP_STRIPE_PUBLIC_KEY)
      const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
      return stripe.redirectToCheckout({ sessionId })
    }).then(result => {
      console.log(result)
      if (result.error) {
        alert(result.error.message)
      }
    })
  }
}

function deleteRssFeed (feedID) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.delete(`/api/rss/feeds/${feedID}`).then(deleted => {
      dispatch(setRssFeed(deleted))
    }).catch(e => {
      console.log(e)
    })
  }
}

function getArticles (offset) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.get(`/api/rss/articles?offset=${offset}`).then(articles => {
      dispatch(setArticles(byID(articles)))
    })
  }
}

function doSignup () {
  return (dispatch, getState) => {
    const apiClient = new ApiClient()
    apiClient.post('/api/account/signup', {
      username: getState().getIn(['signupLogin', 'username']),
      password: getState().getIn(['signupLogin', 'signupPassword', '1']),
    }).then(resp => {
      dispatch(onAuthTokenReceipt(resp.authToken))
    }).catch(e => {
      dispatch(setLoginError(e.toString()))
    })
  }
}

function doLogin () {
  return (dispatch, getState) => {
    const apiClient = new ApiClient()
    apiClient.post('/api/account/login', {
      username: getState().getIn(['signupLogin', 'username']),
      password: getState().getIn(['signupLogin', 'loginPassword'])
    }).then(resp => {
      dispatch(onAuthTokenReceipt(resp.authToken))
    }).catch(e => {
      dispatch(setLoginError(e.toString()))
    })
  }
}

function doLogout () {
  return (dispatch, getState) => {
    AuthStorageService.destroyToken()
    dispatch(logOut())
  }
}

function getEmails (offset) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.get(`/api/email?offset=${offset}`).then(emails => {
      dispatch(setEmails(byID(emails)))
    })
  }
}

function getTweets (offset) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.get(`/api/twitter?offset=${offset}`).then(tweets => {
      dispatch(setTweets(byID(tweets)))
    })
  }
}

function getTweet (id) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.get(`/api/tweet/${id}`).then(tweet => {
      dispatch(setViewingItem(tweet))
    })
  }
}

function getEmail (id) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.get(`/api/email/${id}`).then(email => {
      dispatch(setViewingItem(email))
    })
  }
}

function getRssFeeds () {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.get(`/api/rss/feeds`).then(rssFeeds => {
      dispatch(setRssFeeds(byID(rssFeeds)))
    })
  }
}

function getRssArticle (id) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.get(`/api/rss/articles/${id}`).then(article => {
      dispatch(setViewingItem(article))
    })
  }
}

function getUserData () {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.get(`/api/account/user`).then(userData => {
      dispatch(setUserData(userData))
    })
  }
}

function openInboxItem (type, id) {
  return (dispatch, getState) => {
    if (type === 'rssArticle') {
      const article = getState().getIn(['localState', 'articles', id])
      dispatch(setViewingItem(article))
      dispatch(toggleRssArticleRead(id))
      dispatch(push(`/messages/articles/${id}`))
    } else if (type ==='email') {
      const email = getState().getIn(['localState', 'emails', id])
      dispatch(setViewingItem(email))
      dispatch(toggleEmailRead(id))
      dispatch(push(`/messages/emails/${id}`))
    } else if (type === 'tweet') {
      const tweet = getState().getIn(['localState', 'tweets', id])
      dispatch(setViewingItem(tweet))
      dispatch(toggleTweetRead(id))
      dispatch(push(`/messages/tweets/${id}`))
    }
  }
}

function toggleEmailRead (id) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const newValue = !getState().getIn(['localState', 'emails', id, 'read'])
    const apiClient = new ApiClient(token)
    apiClient.post(`/api/email/${id}`, {read: newValue}).then(email => {
      const currentEmails = getState().getIn(['localState', 'emails'])
      const newEmails = currentEmails.set(email.id, fromJS(email))
      dispatch(setEmails(newEmails))
    })
  }
}

function toggleTweetRead (id) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const newValue = !getState().getIn(['localState', 'tweets', id, 'read'])
    const apiClient = new ApiClient(token)
    apiClient.post(`/api/twitter/${id}`, {read: newValue}).then(tweet => {
      const currentTweets = getState().getIn(['localState', 'tweets'])
      const newTweets = currentTweets.set(tweet.id, fromJS(tweet))
      dispatch(setTweets(newTweets))
    })
  }
}

function toggleRssArticleRead (id) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    const newValue = !getState().getIn(['localState', 'articles', id, 'read'])
    apiClient.post(`/api/rss/articles/${id}`, {read: newValue}).then(article => {
      const currentArticles = getState().getIn(['localState', 'articles'])
      const newArticles = currentArticles.set(article.id, fromJS(article))
      dispatch(setArticles(newArticles))
    })
  }
}

function bulkUpdateSelectedEmails (newValues, offset=0) {
  return (dispatch, getState) => {
    const emailIDs = getState().getIn(['localState', 'selectedItems', EMAILS]) || List()
    if (emailIDs.count() > 0) {
      const token = getState().getIn(['localState', 'authToken'])
      const apiClient = new ApiClient(token)
      return apiClient.post(`/api/email`, {ids: emailIDs, updates: newValues, offset}).then(emails => {
        dispatch(setEmails(byID(emails)))
      })
    } else {
      return Promise.resolve()
    }
  }
}

function bulkUpdateSelectedRssArticles (newValues, offset=0) {
  return (dispatch, getState) => {
    const articleIDs = getState().getIn(['localState', 'selectedItems', RSS_ARTICLES]) || List()
    if (articleIDs.count() > 0) {
      const token = getState().getIn(['localState', 'authToken'])
      const apiClient = new ApiClient(token)
      return apiClient.post(`/api/rss/articles`, {ids: articleIDs, updates: newValues, offset}).then(articles => {
        dispatch(setArticles(byID(articles)))
      })
    } else {
      return Promise.resolve()
    }
  }
}

function bulkUpdateSelectedTweets (newValues, offset=0) {
  return (dispatch, getState) => {
    const tweetIDs = getState().getIn(['localState', 'selectedItems', TWEETS]) || List()
    if (tweetIDs.count() > 0) {
      const token = getState().getIn(['localState', 'authToken'])
      const apiClient = new ApiClient(token)
      return apiClient.post(`/api/twitter`, {ids: tweetIDs, updates: newValues, offset}).then(tweets => {
        dispatch(setTweets(byID(tweets)))
      })
    } else {
      return Promise.resolve()
    }
  }
}

function onAuthTokenReceipt (authToken) {
  return (dispatch) => {
    dispatch(setAuthToken(authToken))
    AuthStorageService.setToken(authToken)
    dispatch(push('/'))
  }
}

function onBoot () {
  return (dispatch, getState) => {
    dispatch(functional.tryToFetchAuthToken())
    if (getState().getIn(['localState', 'authToken'])) {
      dispatch(functional.loadInbox())
    }
  }
}

function loadInbox () {
  return (dispatch, getState) => {
    const emailPage = getState().getIn(['localState', 'emailPage'])
    dispatch(setInboxLoading(true))
    const loadCalls = [
      dispatch(functional.getEmails(emailPage)),
      dispatch(functional.getRssFeeds()),
      dispatch(functional.getArticles(emailPage)),
      dispatch(functional.getTweets(emailPage)),
    ]
    return Promise.all(loadCalls).then(() => {
      const articles = getState().getIn(['localState', 'articles']).valueSeq().map(article => {
        return {
          type: 'rssArticle',
          date: article.get('pubDate'),
          id: article.get('id'),
        }
      })

      const emails = getState().getIn(['localState', 'emails']).valueSeq().map(email => {
        return {
          type: 'email',
          date: email.get('date'),
          id: email.get('id'),
        }
      })

      const tweets = getState().getIn(['localState', 'tweets']).valueSeq().map(tweet => {
        return {
          type: 'tweet',
          date: tweet.get('createdAt'),
          id: tweet.get('id'),
        }
      })

      const listItems = [...articles, ...emails, ...tweets].sort((a, b) => {
        return new Date(b.date) - new Date(a.date)
      })
      dispatch(setInboxItems(listItems))
      dispatch(setInboxLoading(false))
    })
  }
}

function submitRssFeed (url, specialType) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.post(`/api/rss/feeds`, {url, specialType}).then(feed => {
      dispatch(addRssFeed(feed))
    }).catch(e => {
      dispatch(setRssFeedAddError(e.message))
      setTimeout(() => {
        dispatch(setRssFeedAddError(''))
      }, 2000)
    })
  }
}

function updateUserData (newData) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.post(`/api/account/user`, newData).then(user => {
      dispatch(setUserData(user))
    })
  }
}

function tryToFetchAuthToken () {
  return (dispatch) => {
    const token = AuthStorageService.getToken()
    if (token) {
      dispatch(setAuthToken(token))
    }
    dispatch(tokenCheckComplete())
  }
}

// This method of exporting allows us to mock individual functional actions
// while testing some other functional action from this same module.
const functional = {
  bulkUpdateSelectedEmails,
  bulkUpdateSelectedRssArticles,
  bulkUpdateSelectedTweets,
  connectToTwitter,
  createCheckoutSession,
  deleteRssFeed,
  doLogin,
  doLogout,
  doSignup,
  getArticles,
  getEmail,
  getEmails,
  getTweet,
  getRssArticle,
  getRssFeeds,
  getTweets,
  getUserData,
  loadInbox,
  onBoot,
  openInboxItem,
  submitRssFeed,
  toggleEmailRead,
  toggleRssArticleRead,
  toggleTweetRead,
  tryToFetchAuthToken,
  updateUserData,
}
export default functional
