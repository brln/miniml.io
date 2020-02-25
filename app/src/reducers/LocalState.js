import { fromJS, List, Map } from 'immutable'

import {
  ADD_RSS_FEED,
  CLEAR_SELECTED,
  LOG_FUNCTIONAL_ACTION,
  LOGOUT,
  SELECT_ITEM,
  SET_ARTICLES,
  SET_AUTH_TOKEN,
  SET_EMAILS,
  SET_EMAIL_PAGE,
  SET_INBOX_ITEMS,
  SET_INBOX_LOADING,
  SET_RSS_FEED,
  SET_RSS_FEEDS,
  SET_RSS_FEED_ADD_ERROR,
  SET_USER_DATA,
  SET_TWEETS,
  SET_VIEWING_ITEM,
  TOGGLE_SHOW_READ,
  TOKEN_CHECK_COMPLETE, DESELECT_ITEM,
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
  selectedItems: {},
  showRead: false,
  tokenCheckComplete: false,
  tweets: [],
  userData: {},
  viewingItem: null,
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
    case CLEAR_SELECTED:
      return state.set('selectedItems', Map())
    case DESELECT_ITEM:
      let newDeselected = state.getIn(['selectedItems', action.itemType])
      for (let id of action.ids) {
        const index = newDeselected.indexOf(id)
        newDeselected = newDeselected.splice(index, 1)
      }
      return state.setIn(['selectedItems', action.itemType], newDeselected)
    case LOGOUT:
      return initialState.set('tokenCheckComplete', true)
    case SELECT_ITEM:
      let newSelected = state.getIn(['selectedItems', action.itemType])
      if (!newSelected) {
        newSelected = List()
      }
      for (let id of action.ids) {
        newSelected = newSelected.push(id)
      }
      return state.setIn(['selectedItems', action.itemType], newSelected)
    case SET_AUTH_TOKEN:
      return state.set('authToken', action.authToken)
    case SET_ARTICLES:
      return state.set('articles', fromJS(action.articles))
    case SET_EMAILS:
      return state.set('emails', fromJS(action.emails))
    case SET_TWEETS:
      return state.set('tweets', fromJS(action.tweets))
    case SET_EMAIL_PAGE:
      return state.set('emailPage', action.page)
    case SET_INBOX_ITEMS:
      return state.set('inboxItems', fromJS(action.items))
    case SET_INBOX_LOADING:
      return state.set('inboxLoading', action.loading)
    case SET_RSS_FEED:
      return state.setIn(['rssFeeds', action.rssFeed.id], fromJS(action.rssFeed))
    case SET_RSS_FEEDS:
      return state.set('rssFeeds', fromJS(action.rssFeeds))
    case SET_RSS_FEED_ADD_ERROR:
      return state.set('rssFeedAddError', action.error)
    case SET_USER_DATA:
      return state.set('userData', fromJS(action.userData))
    case SET_VIEWING_ITEM:
      return state.set('viewingItem', fromJS(action.item))
    case TOGGLE_SHOW_READ:
      return state.set('showRead', !state.get('showRead'))
    case TOKEN_CHECK_COMPLETE:
      return state.set('tokenCheckComplete', true)
    default:
      return state
  }
}
