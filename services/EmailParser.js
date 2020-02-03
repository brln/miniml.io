import { simpleParser } from 'mailparser'
import { base64Decode } from "../helpers"

export default class EmailParser {
  static parseMessage (message) {
    const encodedContent = JSON.parse(message.Body).content
    const emailContent = base64Decode(encodedContent)
    return new Promise((res, rej) => {
      simpleParser(emailContent, {}, (err, parsed) => {
        if (err) {
          rej(err)
        } else {
          res({
            id: message.MessageId,
            fromAddress: parsed.from.value[0].address,
            fromName: parsed.from.value[0].name,
            replyToAddress:  parsed.replyTo.value[0].address,
            toAddress: parsed.to.value[0].address,
            subject: parsed.subject,
            bodyHTML: parsed.html,
            read: false,
            date: new Date(parsed.date),
            archived: false,
          })
        }
      })
    })

  }
}
