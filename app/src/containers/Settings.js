import React, { PureComponent } from 'react'
import {connect} from "react-redux"
import functional from '../actions/functional'
import Emails from '../components/Messages/Emails'
import styled from "styled-components"
import {clearSelectedEmails, deselectEmails, selectEmails, setEmailPage} from '../actions/standard'

const MainBox = styled.div`
  top: 1em;
  left: 1em;
  background: #FFFFFF;
  max-width: 600px;
  display: flex;
  flex-direction: column;
`

class Settings extends PureComponent {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <MainBox>
        Settings
      </MainBox>
    )
  }
}

function mapStateToProps (state) {
  return {}
}

export default connect(mapStateToProps)(Settings)
