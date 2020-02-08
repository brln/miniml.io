import uuidv4 from "uuid/v4"
import moment from "moment"

export function getID () {
  return uuidv4()
}

export function isoDateNow () {
  let now = new Date()
  return now.toISOString()
}


export function between (deliveryTime, offset) {
  const delivery = deliveryTime.split(':')
  const deliveryHour = parseInt(delivery[0])
  const deliveryMinute = parseInt(delivery[1])
  const deliveryMinuteOfDay = (deliveryHour * 60 + deliveryMinute)

  const currentHour = moment().utc().hour()
  const currentMinute = moment().utc().minute()
  const currentMinuteOfDay = (currentHour * 60) + currentMinute

  let deliverTodays = 1
  if (currentMinuteOfDay > deliveryMinuteOfDay) {
    deliverTodays = 0
  }

  const hoursBackToday = (offset + deliverTodays) * 24
  const hoursBackYesterday = (offset + 1 + deliverTodays) * 24
  const today = moment().startOf('day').add(deliveryHour, 'hours').add(deliveryMinute, 'minutes').subtract(hoursBackToday, 'hours')
  const yesterday = moment().startOf('day').add(deliveryHour, 'hours').add(deliveryMinute, 'minutes').subtract(hoursBackYesterday, 'hours')
  return {yesterday, today}
}
