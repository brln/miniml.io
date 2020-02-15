import express from 'express'
import Stripe from 'stripe'
import bodyParser from 'body-parser'

import endpointAuth from '../auth'
import {
  configGet,
  HOST,
  STRIPE_ENDPOINT_SECRET,
  STRIPE_SECRET_KEY,
  STRIPE_ANNUAL_SUBSCRIPTION_ID,
} from "../config"
import db from "../models"

const router = express.Router()

const stripe = new Stripe(configGet(STRIPE_SECRET_KEY))

router.post('/', bodyParser.json(), endpointAuth, (req, res, next) => {
  const username = res.locals.username
  let user
  let session
  return db.User.findByPk(username).then(_user => {
    user = _user
    return stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      subscription_data: {
        items: [{
          plan: configGet(STRIPE_ANNUAL_SUBSCRIPTION_ID),
        }],
      },
      success_url: `${configGet(HOST)}/settings`,
      cancel_url: `${configGet(HOST)}/settings`,
    })
  }).then(_session => {
    session = _session
    user.subscriptionStripeSessionID = session.id
    console.log(user)
    return user.save()
  }).then(() => {
    res.json({
      sessionID: session.id
    })
  }).catch(e => {
    console.log(e)
    next(e)
  })
})

router.post('/success', bodyParser.raw({type: 'application/json'}), (req, res, next) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, configGet(STRIPE_ENDPOINT_SECRET))
  } catch (err) {
    console.log(err)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  let preresp = Promise.resolve()
  if (event.type === 'checkout.session.completed') {
    const sessionID = event.data.object.id
    preresp = db.User.findOne({where: {subscriptionStripeSessionID: sessionID}}).then(user => {
      user.paid = true
      return user.save()
    })
  }

  preresp.then(() => {
    res.json({received: true})
  })
})

router.post('/cancel', (req, res, next) => {
  console.log(req)
  res.json({})
})

module.exports = router
