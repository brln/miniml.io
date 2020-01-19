import jwt from "jsonwebtoken"
import { AuthenticationError } from "apollo-server-express"

import {configGet, TOP_SECRET_JWT_TOKEN} from "./config"
import db from "./models"

export function graphqlAuth({req, res}) {
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
    accountID: decoded.accountID,
    db,
    userID: decoded.userID,
  }
}

export function endpointAuth(req, res, next) {
  try {
    const context = graphqlAuth({req, res})
    res.locals.accountID = context.accountID
    res.locals.userID = context.userID
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
