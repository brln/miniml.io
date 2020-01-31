import { fromJS, List } from 'immutable'

import {
  LOG_FUNCTIONAL_ACTION,
  LOGOUT,
  SET_AUTH_TOKEN,
  SET_EMAILS,
  SET_EMAIL_PAGE,
  TOKEN_CHECK_COMPLETE,
} from '../constants/actions'

export const initialState = fromJS({
  actionLog: List(),
  authToken: null,
  emails: [],
  emailPage: 0,
  tokenCheckComplete: false
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
    case LOGOUT:
      return initialState.set('tokenCheckComplete', true)
    case SET_AUTH_TOKEN:
      return state.set('authToken', action.authToken)
    case SET_EMAILS:
      return state.set('emails', fromJS(action.emails))
    case SET_EMAIL_PAGE:
      return state.set('emailPage', action.page)
    case TOKEN_CHECK_COMPLETE:
      return state.set('tokenCheckComplete', true)
    default:
      return state
  }
}
