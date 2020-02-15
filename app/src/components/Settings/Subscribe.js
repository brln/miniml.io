import React, { PureComponent } from 'react'

import { MainBox } from "../Shared/MainBox"
import functional from "../../actions/functional"
import moment from "moment"


export default class Subscribe extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      stripeScriptLoaded: false
    }

  }

  loadScript(src) {
    return new Promise(function(resolve, reject){
      let script = document.createElement('script')
      script.src = src
      script.addEventListener('load', function () {
        resolve()
      })
      script.addEventListener('error', function (e) {
        reject(e)
      })
      document.body.appendChild(script)
    })
  }

  componentDidMount () {
    this.loadScript('https://js.stripe.com/v3/').then(() => {
      this.setState({
        stripeScriptLoaded: true
      })
    })
  }

  render () {
    let body
    if (this.state.stripeScriptLoaded && this.props.userData) {
      if (this.props.userData.get('paid')) {
        body = <h4>You are a paid subscriber.</h4>
      } else {
        body = (
          <>
            <h4>Your trial expires { moment(this.props.userData.get('trialExpires')).format('LLL')}</h4>
            <button onClick={this.props.startSubscription}>Click here to subscribe</button>
          </>
        )
      }
    } else {
      body = <div>Loading Stripe...</div>
    }
    return (
      <>
        <h1>Subscription</h1>
        { body }
      </>
    )
  }
}
