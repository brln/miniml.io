import React, { PureComponent } from 'react'
import {connect} from "react-redux"
import {
  Switch,
  Route,
} from "react-router"
import { Link } from 'react-router-dom'

import functional from '../actions/functional'
import LogoutButton from '../components/Main/LogoutButton'
import Messages from './Messages'
import Email from './Email'

class Main extends PureComponent {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
  }

  logout () {
    this.props.dispatch(functional.doLogout())
  }

  render () {
    return (
      <div>
        <LogoutButton logout={this.logout} />

        <Switch>
          <Route path="/messages/email/:id" component={Email} />
          <Route path="/messages" component={Messages} />
          <Route>
            <div>
              <Link to="/messages">
                <h1>Messages</h1>
              </Link>
            </div>
          </Route>
        </Switch>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const localState = state.get('localState')
  return {
    authToken: localState.get('authToken'),
  }
}

export default connect(mapStateToProps)(Main)
