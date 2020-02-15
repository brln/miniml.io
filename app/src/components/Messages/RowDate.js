import React from 'react'
import moment from "moment"

const RowDate = (props) => {
  const rowDate = moment(props.date)
  if (rowDate.day() === moment().day()) {
    return <span>{rowDate.format('h:mm a')}</span>
  } else {
    return (
      <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div>{moment(props.date).format("h:mm a")}</div>
        <div>{moment(props.date).format("MMM D")}</div>
      </span>
    )
  }

}

export default RowDate
