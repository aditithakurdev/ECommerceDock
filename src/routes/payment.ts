import { Router } from "express";
import { stripeWebhook } from "./webhook"
import PaymentController  from "../controller/paymentController/paymentController";

const router = Router();
router.post("/purchase", PaymentController.purchaseProduct);

// Webhook must use express.raw()
router.post(
  "/webhook",
  require("express").raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
