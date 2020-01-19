import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import uuidv4 from 'uuid/v4'

import { configGet, TOP_SECRET_JWT_TOKEN } from "./config"

export const unixTimeNow = () => {
  return Math.floor(new Date().getTime())
}



export function makeToken (username) {
  return jwt.sign({
      username,
      createdAt: unixTimeNow(),
    },
    configGet(TOP_SECRET_JWT_TOKEN)
  )
}

export function randU32Sync() {
  return (crypto.randomBytes(4).readUInt32BE(0, true) - 2147483651).toString()
}
