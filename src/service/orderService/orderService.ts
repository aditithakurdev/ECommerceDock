import Order from "../../model/order";
import { ErrorMessages } from "../../utils/enum/errorMessages";

class OrderService {
    // Create a new user
    async createOrder(data: { totalAmt: number; status: string; userId: string }) {
        try {
            // Destructure data
            const { totalAmt, status, userId } = data;

            // Create order
            const order = await Order.create({
                ...data,
            });
            console.log("Order created:", order.toJSON());
        } catch (err: any) {
        console.error("Error fetching user by ID:", err.message || err);
        throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
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