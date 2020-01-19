import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { combineReducers } from 'redux-immutable'
import { connectRouter } from 'connected-react-router'
import { ConnectedRouter, routerMiddleware } from 'connected-react-router/immutable'
import { createBrowserHistory } from 'history'

import {
  LocalStateReducer,
  SignupLoginReducer
} from "./reducers"


const history = createBrowserHistory()

const createRootReducer = (h) => {
  return combineReducers({
    router: connectRouter(h),
    localState: LocalStateReducer,
    signupLogin: SignupLoginReducer,
  })
}

function configureStore(preloadedState) {
  // So that we can use the redux dev tools: https://github.com/zalmoxisus/redux-devtools-extension
  
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  return createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        thunkMiddleware,
        
      ),
    ),
  )
}

const store = configureStore()

ReactDOM.render(
  (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  ),
  document.getElementById('root')
)
