import React, { PureComponent } from 'react'
import { connect } from "react-redux"
import {
  Switch,
  Route,
  Redirect,
} from "react-router"

import './App.css'
import Main from './containers/Main'
import SignupLogin from './containers/SignupLogin'
import functional from "./actions/functional"

class App extends PureComponent {
  componentDidMount () {
    this.props.dispatch(functional.onBoot())
  }

  render () {
    if (this.props.tokenCheckComplete) {
      return (
        <Switch>
          <Route path="/login">
            <SignupLogin />
          </Route>
          <Route>
            { !this.props.authToken ? <Redirect to="/login" /> : <Main /> }
          </Route>
        </Switch>
      )
    } else {
      return 'Loading'
    }
  }
}

function mapStateToProps (state) {
  const localState = state.get('localState')
  return {
    authToken: localState.get('authToken'),
    tokenCheckComplete: localState.get('tokenCheckComplete'),
  }
}

export default connect(mapStateToProps)(App)
