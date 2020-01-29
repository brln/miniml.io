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

function getEmails () {
  return (dispatch, getState) => {
    const token = getState().getIn(['localState', 'authToken'])
    const apiClient = new ApiClient(token)
    apiClient.get('/api/email').then(emails => {
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
    apiClient.get(`/api/email/${id}`).then(emails => {
      const byID = emails.reduce((accum, email) => {
        accum[email.id] = email
        return accum
      }, {})
      dispatch(setEmails(byID))
    })
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
  doLogin,
  doLogout,
  doSignup,
  getEmail,
  getEmails,
  onBoot,
  tryToFetchAuthToken,
}
export default functional
