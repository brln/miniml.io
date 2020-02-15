export const DB_DIALECT = 'DB_DIALECT'
export const EMAIL_QUEUE_URL = 'EMAIL_QUEUE_URL'
export const LOGGING_TYPE = 'LOGGING_TYPE'
export const ENV = 'ENV'
export const HOST = 'HOST'
export const IS_LEADER = 'IS_LEADER'
export const STRIPE_ENDPOINT_SECRET = 'STRIPE_ENDPOINT_SECRET'
export const STRIPE_SECRET_KEY = 'STRIPE_SECRET_KEY'
export const STRIPE_ANNUAL_SUBSCRIPTION_ID = 'STRIPE_ANNUAL_SUBSCRIPTION_ID'
export const TOP_SECRET_JWT_TOKEN = 'TOP_SECRET_JWT_TOKEN'

const defaults = {
  [LOGGING_TYPE]: 'dev',
  [DB_DIALECT]: 'mysql',
  [ENV]: 'local',
  [EMAIL_QUEUE_URL]: 'https://sqs.us-west-2.amazonaws.com/777588127715/miniml-email',
  [HOST]: 'https://56fa04a5.ngrok.io',
  [IS_LEADER]: true,
  [STRIPE_ENDPOINT_SECRET]: 'whsec_O4DwFqdKI6zuq7zR3JtKIomJVFCOSymH',
  [STRIPE_SECRET_KEY]: 'sk_test_GNcAjtaZyOsTzizA1xjC8k5Z00x4Bl7BeY',
  [STRIPE_ANNUAL_SUBSCRIPTION_ID]: 'plan_GjZEWVd6MrL7cB',
  [TOP_SECRET_JWT_TOKEN]: 'some super top secret token',
}

export function configGet (envVar) {
  let found = process.env[envVar]
  if (!found) {
    found = defaults[envVar]
  }
  return found
}
