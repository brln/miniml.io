import uuidv4 from "uuid/v4"

export function getID () {
  return uuidv4()
}

export function isoDateNow () {
  let now = new Date()
  return now.toISOString()
}
