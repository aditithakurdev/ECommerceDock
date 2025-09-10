import cron from "node-cron";
import Stripe  from "stripe";
import { User, UserSubscription } from "../model/index";
import { UserSubscriptionEnum } from "../utils/enum/userSubscriptionEnum";
import { StripeController } from "../controller";
import stripeService from "../service/StripeService/stripeService";
import emailService from "../service/email/emailService";
import { Op } from "sequelize";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20" as any,
});

cron.schedule("0 0 * * *", async () => {
  try {
    await stripeService.syncAllSubscriptions(); 
    console.log(" Cron job: subscriptions synced");
  } catch (err) {
    console.error(" Cron job failed:", (err as Error).message);
  }

    // Run every day at midnight
 cron.schedule("0 0 * * *", async () => {
  try {
    await stripeService.sendReminders();
  } catch (err) {
    console.error(" Cron job failed (reminder):", (err as Error).message);
  }
});


});