import { Map } from 'immutable'

import {
  LOGIN_VIEW,
  LOGOUT,
  SET_USERNAME,
  SET_LOGIN_ERROR,
  SET_LOGIN_PASSWORD,
  SET_SIGNUP_LOGIN_VIEW,
  SET_SIGNUP_PASSWORD,
} from '../constants/actions'

export const initialState = Map({
  currentView: LOGIN_VIEW,
  username: '',
  error: '',
  loginPassword: '',
  signupPassword: {
    1: '',
    2: '',
  }
})

export default function SignupLoginReducer(state=initialState, action) {
  switch (action.type) {
    case LOGOUT:
      return initialState
    case SET_USERNAME:
      return state.set('username', action.username)
    case SET_LOGIN_ERROR:
      return state.set('error', action.error)
    case SET_LOGIN_PASSWORD:
      return state.set('loginPassword', action.loginPassword)
    case SET_SIGNUP_LOGIN_VIEW:
      return state.set('currentView', action.newView)
    case SET_SIGNUP_PASSWORD:
      return state.setIn(['signupPassword', action.whichOne], action.value)
    default:
      return state
  }
}
