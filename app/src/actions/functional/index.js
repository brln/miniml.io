import { fromJS } from 'immutable'
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
  setRssFeeds,
  setRssFeedAddError,
  setUserData,
  setViewingArticle,
  setViewingEmail,
  tokenCheckComplete,
} from '../../actions/standard'

function getArticles (offset) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.get(`/api/rss/articles?offset=${offset}`).then(articles => {
      const byID = articles.reduce((accum, article) => {
        accum[article.id] = article
        return accum
      }, {})
      dispatch(setArticles(byID))
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
      const byID = emails.reduce((accum, email) => {
        accum[email.id] = email
        return accum
      }, {})
      dispatch(setEmails(byID))
    })
  }
}

function getEmail (id) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.get(`/api/email/${id}`).then(email => {
      dispatch(setViewingEmail(email))
    })
  }
}

function getRssFeeds () {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.get(`/api/rss/feeds`).then(rssFeeds => {
      const byID = rssFeeds.reduce((accum, feed) => {
        accum[feed.id] = feed
        return accum
      }, {})
      dispatch(setRssFeeds(byID))
    })
  }
}

function getRssArticle (id) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.get(`/api/rss/articles/${id}`).then(article => {
      dispatch(setViewingArticle(article))
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
      dispatch(setViewingArticle(article))
      dispatch(toggleRssArticleRead(id))
      dispatch(push(`/messages/articles/${id}`))
    } else if (type ==='email') {
      const email = getState().getIn(['localState', 'emails', id])
      dispatch(setViewingEmail(email))
      dispatch(toggleEmailRead(id))
      dispatch(push(`/messages/emails/${id}`))
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
    const emailIDs = getState().getIn(['localState', 'selectedEmails'])
    if (emailIDs.count() > 0) {
      const token = getState().getIn(['localState', 'authToken'])
      const apiClient = new ApiClient(token)
      return apiClient.post(`/api/email`, {ids: emailIDs, updates: newValues, offset}).then(emails => {
        const byID = emails.reduce((accum, email) => {
          accum[email.id] = email
          return accum
        }, {})
        dispatch(setEmails(byID))
      })
    } else {
      return Promise.resolve()
    }
  }
}

function bulkUpdateSelectedRssArticles (newValues, offset=0) {
  return (dispatch, getState) => {
    const articleIDs = getState().getIn(['localState', 'selectedRssArticles'])
    if (articleIDs.count() > 0) {
      const token = getState().getIn(['localState', 'authToken'])
      const apiClient = new ApiClient(token)
      return apiClient.post(`/api/rss/articles`, {ids: articleIDs, updates: newValues, offset}).then(articles => {
        const byID = articles.reduce((accum, article) => {
          accum[article.id] = article
          return accum
        }, {})
        dispatch(setArticles(byID))
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
      dispatch(functional.getArticles(emailPage))
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

      const listItems = [...articles, ...emails].sort((a, b) => {
        return new Date(b.date) - new Date(a.date)
      })
      dispatch(setInboxItems(listItems))
      dispatch(setInboxLoading(false))
    })
  }
}

function submitRssFeed (url) {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    return apiClient.post(`/api/rss/feeds`, {url}).then(feed => {
      dispatch(addRssFeed(feed))
    }).catch(e => {
      dispatch(setRssFeedAddError(e.message))
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
  doLogin,
  doLogout,
  doSignup,
  getArticles,
  getEmail,
  getEmails,
  getRssArticle,
  getRssFeeds,
  getUserData,
  loadInbox,
  onBoot,
  openInboxItem,
  submitRssFeed,
  toggleEmailRead,
  toggleRssArticleRead,
  tryToFetchAuthToken,
  updateUserData,
}
export default functional
