import cron from "node-cron";
import stripeService from "../service/StripeService/stripeService";

export class CronService {
  constructor() {
    //  First cron: sync subscriptions every day at midnight
    cron.schedule("0 0 * * *", async () => {
      try {
        await stripeService.syncAllSubscriptions();
        console.log(" Cron job: subscriptions synced");
      } catch (err) {
        console.error(" Cron job failed (sync):", (err as Error).message);
      }
    });

    //  Second cron: send reminders every day at midnight
    cron.schedule("0 0 * * *", async () => {
      try {
        await stripeService.sendReminders();
        console.log(" Cron job: reminders sent");
      } catch (err) {
        console.error(" Cron job failed (reminder):", (err as Error).message);
      }
    });
  }
}

export default new CronService();