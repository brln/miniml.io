import {
  ADD_RSS_FEED,
  CLEAR_SELECTED_EMAILS,
  CLEAR_SELECTED_RSS_ARTICLES,
  DESELECT_EMAIL,
  DESELECT_RSS_ARTICLE,
  LOG_FUNCTIONAL_ACTION,
  LOGOUT,
  SELECT_EMAIL,
  SELECT_RSS_ARTICLE,
  SET_AUTH_TOKEN,
  SET_ARTICLES,
  SET_EMAILS,
  SET_EMAIL_PAGE,
  SET_INBOX_ITEMS,
  SET_LOGIN_ERROR,
  SET_LOGIN_PASSWORD,
  SET_RSS_FEEDS,
  SET_RSS_FEED_ADD_ERROR,
  SET_SIGNUP_LOGIN_VIEW,
  SET_SIGNUP_PASSWORD,
  SET_USERNAME,
  SET_USER_DATA,
  SET_VIEWING_ARTICLE,
  SET_VIEWING_EMAIL,
  TOGGLE_SHOW_READ,
  TOKEN_CHECK_COMPLETE, SET_INBOX_LOADING,
} from '../constants/actions'

export function logFunctionalAction (name, otherData) {
  return {
    type: LOG_FUNCTIONAL_ACTION,
    name,
    otherData,
    actionType: 'functional',
    logData: ['name', 'otherData']
  }
}

export function addRssFeed (data) {
  return {
    type: ADD_RSS_FEED,
    data
  }
}

export function clearSelectedEmails () {
  return {
    type: CLEAR_SELECTED_EMAILS
  }
}

export function clearSelectedRssArticles () {
  return {
    type: CLEAR_SELECTED_RSS_ARTICLES
  }
}

export function deselectEmails (ids) {
  return {
    type: DESELECT_EMAIL,
    ids,
  }
}

export function selectEmails (ids) {
  return {
    type: SELECT_EMAIL,
    ids
  }
}

export function selectRssArticle (ids) {
  return {
    type: SELECT_RSS_ARTICLE,
    ids
  }
}

export function deselectRssArticle (ids) {
  return {
    type: DESELECT_RSS_ARTICLE,
    ids
  }
}

export function setArticles (articles) {
  return {
    type: SET_ARTICLES,
    articles,
  }
}

export function setEmails (emails) {
  return {
    type: SET_EMAILS,
    emails
  }
}

export function setRssFeeds (rssFeeds) {
  return {
    type: SET_RSS_FEEDS,
    rssFeeds
  }
}

export function setUsername (username) {
  return {
    type: SET_USERNAME,
    username,
  }
}

export function setAuthToken (authToken) {
  return {
    type: SET_AUTH_TOKEN,
    authToken,
  }
}

export function logOut () {
  return {
    type: LOGOUT,
  }
}

export function setEmailPage (page) {
  return {
    type: SET_EMAIL_PAGE,
    page
  }
}

export function setInboxItems (items) {
  return {
    type: SET_INBOX_ITEMS,
    items
  }
}

export function setInboxLoading (loading) {
  return {
    type: SET_INBOX_LOADING,
    loading,
    logData: ['loading']
  }
}

export function setLoginError (error) {
  return {
    type: SET_LOGIN_ERROR,
    error,
  }
}

export function setLoginPassword (loginPassword) {
  return {
    type: SET_LOGIN_PASSWORD,
    loginPassword,
  }
}

export function setRssFeedAddError (error) {
  return {
    type: SET_RSS_FEED_ADD_ERROR,
    error
  }
}

export function setSignupLoginView (newView) {
  return {
    type: SET_SIGNUP_LOGIN_VIEW,
    newView,
  }
}

export function setSignupPassword (value, whichOne) {
  return {
    type : SET_SIGNUP_PASSWORD,
    value,
    whichOne,
  }
}

export function setUserData (userData) {
  return {
    type: SET_USER_DATA,
    userData
  }
}

export function tokenCheckComplete () {
  return {
    type: TOKEN_CHECK_COMPLETE
  }
}

export function toggleShowRead () {
  return {
    type: TOGGLE_SHOW_READ,
  }
}

export function setViewingArticle (article) {
  return {
    type: SET_VIEWING_ARTICLE,
    article
  }
}

export function setViewingEmail (email) {
  return {
    type: SET_VIEWING_EMAIL,
    email
  }
}
