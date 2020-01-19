export const ADMIN_PASSWORD = 'ADMIN_PASSWORD'
export const LOGGING_TYPE = 'LOGGING_TYPE'
export const ENV = 'ENV'
export const HOST = 'HOST'
export const SQS_ENDPOINT = 'SQS_ENDPOINT'
export const TOP_SECRET_JWT_TOKEN = 'TOP_SECRET_JWT_TOKEN'

const defaults = {
  [ADMIN_PASSWORD]: 'some strong admin password',
  [LOGGING_TYPE]: 'dev',
  [ENV]: 'local',
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
