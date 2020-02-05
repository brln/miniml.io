import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import Login from '../components/SignupLogin/Login'
import Signup from '../components/SignupLogin/Signup'
import {
  setLoginError,
  setLoginPassword,
  setSignupLoginView,
  setSignupPassword,
  setUsername,
} from '../actions/standard'
import functional from '../actions/functional'
import { SIGNUP_VIEW, LOGIN_VIEW } from "../constants/actions"
import { toCamelCase } from "../helpers"

class SignupLoginContainer extends PureComponent  {
  constructor (props) {
    super(props)

    this.changeUsername = this.changeUsername.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.changeSignupPassword = this.changeSignupPassword.bind(this)
    this.checkForSubmit = this.checkForSubmit.bind(this)
    this.doLogin = this.doLogin.bind(this)
    this.doSignup = this.doSignup.bind(this)
    this.setView = this.setView.bind(this)
  }

  changeUsername (e) {
    const newID = toCamelCase(e.target.value)
    this.props.dispatch(setUsername(newID))
  }

  changePassword (e) {
    console.log(e)
    this.props.dispatch(setLoginPassword(e.target.value))
  }

  changeSignupPassword (whichOne) {
    return (e) => {
      this.props.dispatch(setSignupPassword(e.target.value, whichOne))
    }
  }

  setView (newView) {
    return () => {
      this.props.dispatch(setSignupLoginView(newView))
    }
  }

  checkForSubmit (type) {
    return (e) => {
      if (e.keyCode === 13 && type === 'login') {
        this.doLogin()
      } else if (e.keyCode == 13 && type === 'signup') {
        this.doSignup()
      }
    }
  }

  doLogin () {
    if (this.props.username && this.props.password) {
      this.props.dispatch(functional.doLogin())
    }
  }

  doSignup () {
    if (this.props.password1) {
      if (this.props.password1 === this.props.password2) {
        this.props.dispatch(functional.doSignup())
      } else {
        this.props.dispatch(setLoginError("The passwords don't match."))
      }
    } else {
      this.props.dispatch(setLoginError('You must enter a password.'))
    }
  }

  render() {
    if (this.props.currentView === LOGIN_VIEW) {
      return (
        <Login
          changeUsername={this.changeUsername}
          changePassword={this.changePassword}
          checkForSubmit={this.checkForSubmit}
          doLogin={this.doLogin}
          error={this.props.error}
          password={this.props.password}
          setView={this.setView}
          username={this.props.username}
        />
      )
    } else if (this.props.currentView === SIGNUP_VIEW) {
      return (
        <Signup
          accountName={this.props.accountName}
          changeUsername={this.changeUsername}
          changeEmail={this.changeEmail}
          changeSignupPassword={this.changeSignupPassword}
          checkForSubmit={this.checkForSubmit}
          doSignup={this.doSignup}
          error={this.props.error}
          password1={this.props.password1}
          password2={this.props.password2}
          setView={this.setView}
          username={this.props.username}
        />
      )
    } else {
      throw Error(`View not found "${this.props.currentView}"`)
    }
  }
}

function mapStateToProps (state) {
  const signupLoginState = state.get('signupLogin')
  return {
    currentView: signupLoginState.get('currentView'),
    username: signupLoginState.get('username'),
    error: signupLoginState.get('error'),
    password: signupLoginState.get('loginPassword'),
    password1: signupLoginState.getIn(['signupPassword', 1]),
    password2: signupLoginState.getIn(['signupPassword', 2]),
  }
}

export default connect(mapStateToProps)(SignupLoginContainer)
