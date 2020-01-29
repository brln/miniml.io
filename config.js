export const ADMIN_PASSWORD = 'ADMIN_PASSWORD'
export const EMAIL_QUEUE_URL = 'EMAIL_QUEUE_URL'
export const LOGGING_TYPE = 'LOGGING_TYPE'
export const ENV = 'ENV'
export const HOST = 'HOST'
export const TOP_SECRET_JWT_TOKEN = 'TOP_SECRET_JWT_TOKEN'

const defaults = {
  [ADMIN_PASSWORD]: 'some strong admin password',
  [LOGGING_TYPE]: 'dev',
  [ENV]: 'local',
  [EMAIL_QUEUE_URL]: 'https://sqs.us-west-2.amazonaws.com/777588127715/miniml-email',
  [HOST]: 'http://localhost:3000',
  [TOP_SECRET_JWT_TOKEN]: 'some super top secret token',
}

export function configGet (envVar) {
  let found = process.env[envVar]
  if (!found) {
    found = defaults[envVar]
  }
  return found
}
