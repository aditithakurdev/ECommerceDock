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
  console.log("⏰ Running subscription reminder job...");

  try {
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    // Fetch subscriptions expiring within the next 3 days
   const subs = await UserSubscription.findAll({
  where: {
    status: "active",
    endDate: {
      [Op.between]: [today, threeDaysLater],
    },
  },
});

for (const sub of subs) {
  const user = await User.findByPk(sub.userId, {
    attributes: ["id", "firstName", "lastName", "email"],
  });

  if (user) {
    console.log(user.email);
    await emailService.sendReminderEmail(user.email, {
      name: `${user.firstName} ${user.lastName || ""}`,
      plan: sub.planName,
      endDate: sub.endDate,
    });
  }
}


  } catch (err) {
    console.error(" Error in reminder job:", (err as Error).message);
  }
});


});