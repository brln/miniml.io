import { push } from 'connected-react-router'

import {
  AuthStorageService,
  ApiClient,
} from '../../services/'

import {
  logOut,
  setAuthToken,
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
    const token = getState().getIn(['localState', 'authToken'])
    AuthStorageService.destroyToken()
    dispatch(logOut())
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
  onBoot,
  tryToFetchAuthToken,
}
export default functional
