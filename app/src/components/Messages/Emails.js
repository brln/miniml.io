import React from 'react'

import EmailRow from './EmailRow'

export default class Emails extends React.Component {
  render () {
    return (
      <>
        <h1>Emails</h1>
        {
          this.props.emails.map(email => {
            return (
              <EmailRow email={email}/>
            )
          })
        }
      </>
    )
  }
}
