// src/controllers/paymentController.ts
import { Request, Response } from "express";
import paymentService from "../../service/paymentService/payment.service";

class PaymentController{
  async purchaseProduct(req: Request, res: Response) {
    try {
      const { stripeToken, userId, productId, qty, baseAmount } = req.body;

      // Mock user info (normally from DB/auth)
      const user = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        stripeCustomerId: undefined, // load from DB if exists
      };

      const totalAmount = baseAmount * qty;

      const result = await paymentService.chargeCustomer(
        user,
        totalAmount,
        "usd",
        stripeToken,
        `Purchase of product ${productId} (qty: ${qty})`
      );

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new PaymentController();