export const DB_DIALECT = 'DB_DIALECT'
export const EMAIL_QUEUE_URL = 'EMAIL_QUEUE_URL'
export const LOGGING_TYPE = 'LOGGING_TYPE'
export const ENV = 'ENV'
export const HOST = 'HOST'
export const IS_LEADER = 'IS_LEADER'
export const TOP_SECRET_JWT_TOKEN = 'TOP_SECRET_JWT_TOKEN'

const defaults = {
  [LOGGING_TYPE]: 'dev',
  [DB_DIALECT]: 'mysql',
  [ENV]: 'local',
  [EMAIL_QUEUE_URL]: 'https://sqs.us-west-2.amazonaws.com/777588127715/miniml-email',
  [HOST]: 'http://localhost:3000',
  [IS_LEADER]: true,
  [TOP_SECRET_JWT_TOKEN]: 'some super top secret token',
}

export function configGet (envVar) {
  let found = process.env[envVar]
  if (!found) {
    found = defaults[envVar]
  }
  return found
}
