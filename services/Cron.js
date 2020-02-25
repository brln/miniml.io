import { configGet, IS_LEADER } from "../config"
import cron from "node-cron"

export default class CronService {
  static startCron(toRun, everyNMinutes) {
    if (configGet(IS_LEADER)) {
      const everyMinutes = `*/${everyNMinutes} * * * *`
      cron.schedule(everyMinutes, toRun, {})
    }
  }
}
