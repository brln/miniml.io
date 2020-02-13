import jwt from "jsonwebtoken"
import { AuthenticationError } from './errors'

import {configGet, TOP_SECRET_JWT_TOKEN} from "./config"

function authContext({req, res}) {
  const authHeader = req.headers.authorization
  let decoded = undefined
  if (authHeader) {
    let token = authHeader.split('Bearer ')[1]
    try {
      decoded = jwt.verify(token, configGet(TOP_SECRET_JWT_TOKEN))
    } catch (e) {
      throw new AuthenticationError('Invalid Token')
    }

    if (!token || !decoded || !decoded.createdAt) {
      throw new AuthenticationError('Invalid Authorization Header')
    }
  } else {
    throw new AuthenticationError('No Auth Header')
  }

  return {
    username: decoded.username,
  }
}

export default function endpointAuth(req, res, next) {
  try {
    const context = authContext({req, res})
    res.locals.username = context.username
    next()
  } catch (e) {
    console.log(e)
    if (e instanceof AuthenticationError) {
      res.status(401).send(e.toString())
    } else {
      next(e)
    }
  }
}
