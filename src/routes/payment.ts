import { Router } from "express";
import { stripeWebhook } from "./webhook";
import paymentController from "../controller/paymentController/paymentController";

const router = Router();

router.post("/create-session", paymentController.createCheckoutSession);

// ⚠️ Webhook must use express.raw()
router.post(
  "/webhook",
  require("express").raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
