import { fromJS, List } from 'immutable'

import {
  ADD_RSS_FEED,
  CLEAR_SELECTED_EMAILS,
  DESELECT_EMAIL,
  LOG_FUNCTIONAL_ACTION,
  LOGOUT,
  SELECT_EMAIL,
  SET_ARTICLES,
  SET_AUTH_TOKEN,
  SET_EMAILS,
  SET_EMAIL_PAGE,
  SET_INBOX_ITEMS,
  SET_INBOX_LOADING,
  SET_RSS_FEEDS,
  SET_RSS_FEED_ADD_ERROR,
  SET_USER_DATA,
  SET_VIEWING_ARTICLE,
  SET_VIEWING_EMAIL,
  TOGGLE_SHOW_READ,
  TOKEN_CHECK_COMPLETE, SELECT_RSS_ARTICLE, DESELECT_RSS_ARTICLE, CLEAR_SELECTED_RSS_ARTICLES,
} from '../constants/actions'

export const initialState = fromJS({
  actionLog: List(),
  articles: {},
  authToken: null,
  emails: {},
  emailPage: 0,
  inboxItems: [],
  inboxLoading: false,
  rssFeeds: {},
  rssFeedAddError: null,
  selectedEmails: [],
  selectedRssArticles: [],
  showRead: false,
  tokenCheckComplete: false,
  userData: {},
  viewingArticle: null,
  viewingEmail: null,
})

function appendLog (state, action) {
  const log = state.get('actionLog') ? state.get('actionLog') : List()
  const shortened = log.count() > 1000 ? log.shift() : log

  const toLog = {
    'action': (action.type === LOG_FUNCTIONAL_ACTION ? action.name : action.type),
    actionType: action.actionType || 'standard',
    timestamp: (new Date()).toISOString(),
    logData: action.logData ? {} : null
  }
  console.log(toLog)
  if (action.logData) {
    for (const logItem of action.logData) {
      toLog.logData[logItem] = action[logItem]
    }
  }
  return state.set('actionLog', shortened.push(fromJS(toLog)))
}

export default function LocalStateReducer(state=initialState, action) {
  state = appendLog(state, action)
  switch (action.type) {
    case ADD_RSS_FEED:
      return state.setIn(['rssFeeds', action.data.id], fromJS(action.data))
    case CLEAR_SELECTED_EMAILS:
      return state.set('selectedEmails', List())
    case CLEAR_SELECTED_RSS_ARTICLES:
      return state.set('selectedRssArticles', List())
    case DESELECT_EMAIL:
      let newDeselected = state.get('selectedEmails')
      for (let id of action.ids) {
        const index = state.get('selectedEmails').indexOf(id)
        newDeselected = newDeselected.splice(index, 1)
      }
      return state.set('selectedEmails', newDeselected)
    case DESELECT_RSS_ARTICLE:
      let newDeselectedRss = state.get('selectedRssArticles')
      for (let id of action.ids) {
        const index = state.get('selectedRssArticles').indexOf(id)
        newDeselectedRss = newDeselectedRss.splice(index, 1)
      }
      return state.set('selectedRssArticles', newDeselectedRss)
    case LOGOUT:
      return initialState.set('tokenCheckComplete', true)
    case SELECT_EMAIL:
      let newSelected = state.get('selectedEmails')
      for (let id of action.ids) {
        newSelected = newSelected.push(id)
      }
      return state.set('selectedEmails', newSelected)
    case SELECT_RSS_ARTICLE:
      let newSelectedRss = state.get('selectedRssArticles')
      for (let id of action.ids) {
        newSelectedRss = newSelectedRss.push(id)
      }
      return state.set('selectedRssArticles', newSelectedRss)
    case SET_AUTH_TOKEN:
      return state.set('authToken', action.authToken)
    case SET_ARTICLES:
      return state.set('articles', fromJS(action.articles))
    case SET_EMAILS:
      return state.set('emails', fromJS(action.emails))
    case SET_EMAIL_PAGE:
      return state.set('emailPage', action.page)
    case SET_INBOX_ITEMS:
      return state.set('inboxItems', fromJS(action.items))
    case SET_INBOX_LOADING:
      return state.set('inboxLoading', action.loading)
    case SET_RSS_FEEDS:
      return state.set('rssFeeds', fromJS(action.rssFeeds))
    case SET_USER_DATA:
      return state.set('userData', fromJS(action.userData))
    case SET_VIEWING_ARTICLE:
      return state.set('viewingArticle', fromJS(action.article))
    case SET_VIEWING_EMAIL:
      return state.set('viewingEmail', fromJS(action.email))
    case SET_RSS_FEED_ADD_ERROR:
      return state.set('rssFeedAddError', action.error)
    case TOGGLE_SHOW_READ:
      return state.set('showRead', !state.get('showRead'))
    case TOKEN_CHECK_COMPLETE:
      return state.set('tokenCheckComplete', true)
    default:
      return state
  }
}
