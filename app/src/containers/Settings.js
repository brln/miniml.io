import React, { PureComponent } from 'react'
import {connect} from "react-redux"
import moment from 'moment'

import functional from '../actions/functional'
import { MainBox } from "../components/Shared/MainBox"
import TimezonePicker from '../vendor/react-timezone-picker'
import styled from "styled-components"


const SavedIndicator = styled.div`
  background-color: grey;
  text-align: center;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
`

class Settings extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      newFeed: '',
      deliveryTimeSaved: false,
    }
    this.submitNewFeed = this.submitNewFeed.bind(this)
    this.updateDeliveryTime = this.updateDeliveryTime.bind(this)
    this.updateDeliveryTimezone = this.updateDeliveryTimezone.bind(this)
    this.updateNewFeed = this.updateNewFeed.bind(this)
  }

  componentDidMount () {
    this.props.dispatch(functional.getRssFeeds())
    this.props.dispatch(functional.getUserData())
  }

  updateNewFeed (e) {
    this.setState({
      newFeed: e.target.value
    })
  }

  updateDeliveryTime (e) {
    this.props.dispatch(functional.updateUserData({
      deliveryTime: e.target.value
    })).then(() => {
      this.setState({
        deliveryTimeSaved: true
      })
    })
    setTimeout(() => {
      this.setState({
        deliveryTimeSaved: false
      })
    }, 2000)
  }

  updateDeliveryTimezone (e) {
    this.props.dispatch(functional.updateUserData({
      deliveryTimezone: e.target.value
    })).then(() => {
      this.setState({
        deliveryTimeSaved: true
      })
    })
    setTimeout(() => {
      this.setState({
        deliveryTimeSaved: false
      })
    }, 2000)
  }

  submitNewFeed () {
    this.props.dispatch(functional.submitRssFeed(this.state.newFeed))
  }

  hourOptions () {
    let options = Array(24).fill().map((_, i) => {
      return <option value={i}>{i === 0 || i === 12 ? '12' : i % 12} {i < 12 ? 'am' : 'pm'}</option>
    })
    options.unshift(<option value={null} />)
    return options
  }

  render () {
    return (
      <>
        { this.state.deliveryTimeSaved ? <SavedIndicator>Saved</SavedIndicator> : null }
        <MainBox>
          <div>
            <h1>Email</h1>
            <h3>{this.props.userData.get('username')}@miniml.io</h3>

            <h1>RSS Feeds</h1>
            { this.props.rssFeedAddError ? <div>{this.props.rssFeedAddError}</div> : null}
            <div>Add Feed: </div>
            <div>
              <input type="text" value={this.state.newFeed} onChange={this.updateNewFeed}/>
              <button onClick={this.submitNewFeed}>Add</button>
            </div>

            <ul>
              { this.props.rssFeeds.valueSeq().map(feed => {
                return <li>{feed.get('title')}: {feed.get('description')}</li>
              })}
            </ul>
          </div>

          <div>
            <h1>Delivery Time</h1>
            <select value={this.props.userData.get('deliveryTime')} onChange={this.updateDeliveryTime}>
              { this.hourOptions() }
            </select>
            <TimezonePicker
              value={this.props.userData.get('deliveryTimezone')}
              onChange={this.updateDeliveryTimezone}
            />

          </div>

        </MainBox>
      </>
    )
  }
}

function mapStateToProps (state) {
  return {
    rssFeedAddError: state.getIn(['localState', 'rssFeedAddError']),
    rssFeeds: state.getIn(['localState', 'rssFeeds']),
    userData: state.getIn(['localState', 'userData']),
  }
}

export default connect(mapStateToProps)(Settings)
