import {
  LOG_FUNCTIONAL_ACTION,
  LOGOUT,
  SET_AUTH_TOKEN,
  SET_EMAILS,
  SET_EMAIL_PAGE,
  SET_LOGIN_ERROR,
  SET_LOGIN_PASSWORD,
  SET_SIGNUP_LOGIN_VIEW,
  SET_SIGNUP_PASSWORD,
  SET_USERNAME,
  TOKEN_CHECK_COMPLETE,
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

export function setEmails (emails) {
  return {
    type: SET_EMAILS,
    emails
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
export function tokenCheckComplete () {
  return {
    type: TOKEN_CHECK_COMPLETE
  }
}

