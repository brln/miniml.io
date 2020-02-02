import { fromJS, List } from 'immutable'

import {
  CLEAR_SELECTED_EMAILS,
  DESELECT_EMAIL,
  LOG_FUNCTIONAL_ACTION,
  LOGOUT,
  SELECT_EMAIL,
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
  selectedEmails: [],
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
    case CLEAR_SELECTED_EMAILS:
      return state.set('selectedEmails', List())
    case DESELECT_EMAIL:
      let newDeselected = state.get('selectedEmails')
      for (let id of action.ids) {
        const index = state.get('selectedEmails').indexOf(id)
        newDeselected = newDeselected.splice(index, 1)
      }
      return state.set('selectedEmails', newDeselected)
    case LOGOUT:
      return initialState.set('tokenCheckComplete', true)
    case SELECT_EMAIL:
      let newSelected = state.get('selectedEmails')
      for (let id of action.ids) {
        newSelected = newSelected.push(id)
      }
      console.log(newSelected.toJSON())
      return state.set('selectedEmails', newSelected)
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
