import React, { PureComponent } from 'react'
import {connect} from "react-redux"
import {
  Redirect,
  Route,
  Switch,
} from "react-router"
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'

import functional from '../actions/functional'
import Messages from './Messages'
import Settings from './Settings'
import Email from './Email'
import styled from "styled-components"
import AccountButton from "../components/Main/AccountButton"
import RssArticle from './RssArticle'

const Header = styled.div`
  border: 1px solid black;
  background: black;
  height: 3em;
  color: white;
  display: flex;
  align-items: center;
  padding-left: 1em;
  justify-content: space-between;
`

const Logo = styled.div``

const StyledLink = styled(Link)`
    text-decoration: none;
    color: white;
`


class Main extends PureComponent {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.showSettings = this.showSettings.bind(this)
  }

  logout () {
    this.props.dispatch(functional.doLogout())
  }

  showSettings () {
    this.props.dispatch(push('/settings'))
  }

  render () {
    return (
      <div>
        <Header>
          <Logo><StyledLink to={"/messages"}>miniml.io</StyledLink></Logo>
          <AccountButton
            logout={this.logout}
            showSettings={this.showSettings}
          />
        </Header>
        <Switch>
          <Route path="/messages/articles/:id" component={RssArticle} />
          <Route path="/messages/emails/:id" component={Email} />
          <Route path="/messages" component={Messages} />
          <Route path="/settings" component={Settings} />

          <Redirect to="/messages" />
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
