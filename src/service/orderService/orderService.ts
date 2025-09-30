import Order from "../../model/order";
import { ErrorMessages } from "../../utils/enum/errorMessages";
import WebSocketService from "../../utils/webSocket/webSocket"

class OrderService {
    // Create a new user
    async createOrder(orderData: {
    userId: string;
    productId: string;
    totalAmt: number;
    currency: string;
    status: string;
    isDeleted: boolean;
    stripePaymentIntentId: string;
    stripeCustomerId: string;
    paymentMethod: string;
  }) {
    try {
      const order = await Order.create(orderData); 
      console.log("Order created:", order);

      // 🔔 Send and log notification
      await WebSocketService.sendNotification(`notifications:${order.userId}`, {
        title: "Order Created",
        body: `Your order #${order.id} has been placed successfully.`,
        userId: order.userId,
      });

    } catch (err: any) {
      console.error("Error creating order:", err.message || err);
      throw new Error("INTERNAL_SERVER_ERROR");
    }
  }


    async getUserOrders(userId: number) {
        try {
            return await Order.findAll({ where: { userId } });
        } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
      }
    }

    // Get all orders (admin only)
    async getAllOrders() {
        try {
            return await Order.findAll();
        } catch (err: any) {
            console.error("Error fetching user by ID:", err.message || err);
            throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
        }
    }
}

export default new OrderService();