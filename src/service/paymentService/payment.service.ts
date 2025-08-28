// src/services/PaymentService.ts

import stripe from "../../config/stripe";

interface Product {
  name: string;
  price: number;
}

class PaymentService {
  async createCheckoutSession(product: Product) {
    return await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: product.name },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3005/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3005/cancel",
    });
  }
}

export default new PaymentService();
