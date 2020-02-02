import { fromJS } from 'immutable'
import { push } from 'connected-react-router'

import {
  AuthStorageService,
  ApiClient,
} from '../../services/'

import {
  logOut,
  setAuthToken,
  setEmails,
  setLoginError,
  tokenCheckComplete,
} from '../../actions/standard'

function doSignup () {
  return (dispatch, getState) => {
    const apiClient = new ApiClient()
    apiClient.post('/api/account/signup', {
      username: getState().getIn(['signupLogin', 'username']),
      password: getState().getIn(['signupLogin', 'signupPassword', 1]),
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
      const byID = {[email.id]: email}
      dispatch(setEmails(byID))
    })
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

function bulkUpdateSelectedEmails (newValues) {
  return (dispatch, getState) => {
    const emailIDs = getState().getIn(['localState', 'selectedEmails'])
    if (emailIDs.count() > 0) {
      const token = getState().getIn(['localState', 'authToken'])
      const apiClient = new ApiClient(token)
      return apiClient.post(`/api/email`, {ids: emailIDs, updates: newValues}).then(emails => {
        let currentEmails = getState().getIn(['localState', 'emails'])
        for (let email of emails) {
          currentEmails = currentEmails.set(email.id, fromJS(email))
        }
        dispatch(setEmails(currentEmails))
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
  doLogin,
  doLogout,
  doSignup,
  getEmail,
  getEmails,
  onBoot,
  toggleEmailRead,
  tryToFetchAuthToken,
}
export default functional
