import aws from 'aws-sdk'
import {
  configGet,
  EMAIL_QUEUE_URL,
} from "../config"
import EmailParser from './EmailParser'
import EmailSaver from './EmailSaver'
import { UserDoesNotExistError } from "../errors"

let singleton = null

export default class SqsService {
  static factory () {
    if (singleton) {
      return singleton
    } else {
      singleton = new SqsService()
      return singleton
    }
  }

  constructor () {
    aws.config.update({region: 'us-west-2'})
    this.sqs = new aws.SQS()
    this.queueURL = configGet(EMAIL_QUEUE_URL)
  }

  deleteMessage (ReceiptHandle) {
    const deleteParams = {
      QueueUrl: this.queueURL,
      ReceiptHandle,
    }
    return new Promise((res, rej) => {
      this.sqs.deleteMessage(deleteParams, (err, data) => {
        if (err) {
          rej(err)
        } else {
          res()
        }
      })
    })
  }

  receiveMessages () {
    let params = {
      QueueUrl: this.queueURL,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 10,
      VisibilityTimeout: 0,
    }

    const pollQueue = () => {
      this.sqs.receiveMessage(params, (err, data) => {
        if (err) {
          console.log(err, err.stack)
        } else if (data.Messages) {
          EmailParser.parseMessage(data.Messages[0]).then(messageData => {
            return EmailSaver.saveEmail(messageData)
          }).then(() => {
            return this.deleteMessage(data.Messages[0].ReceiptHandle)
          }).then(() => {
            pollQueue()
          }).catch(e => {
            if (e instanceof UserDoesNotExistError) {
              this.deleteMessage(data.Messages[0].ReceiptHandle).then(() => {
                pollQueue()
              })
            } else {
              pollQueue()
            }
          })
        } else {
          pollQueue()
        }
      })
    }
    pollQueue()
  }


  sendMessage (message) {
    if (!this.queueURL) {
      throw "Queue doesn't exist yet, hang on a second."
    }
    if (!(message instanceof Object)) {
      throw "Pass me an object not a string."
    }

    let params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: this.queueURL,
    }

    return new Promise((res, rej) => {
      this.sqs.sendMessage(params, (err, data) => {
        if (err) {
          rej(err)
        } else {
          res(data)
        }
      })
    })
  }

  createQueue (QueueName) {
    let params = {
      QueueName,
      Attributes: {}
    }
    return new Promise((res, rej) => {
      this.sqs.createQueue(params, (err, data) => {
        if (err) {
          rej(err)
        } else {
          res(data.QueueUrl)
        }
      })
    })
  }

  purgeQueue () {
    let params = { QueueUrl: this.queueURL }
    return new Promise((res, rej) => {
      this.sqs.purgeQueue(params, (err, data) => {
        if (err) {
          rej(err)
        } else {
          res(data)
        }
      })
    })
  }
}
