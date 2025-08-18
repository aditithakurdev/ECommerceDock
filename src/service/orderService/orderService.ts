import Order from "../../model/order";
import { ErrorMessages } from "../../utils/enum/errorMessages";

class OrderService {
    // Create a new user
    async createOrder(data: { totalAmt: number; status: string; userId:string }) {
        try {
            // Destructure data
            const { totalAmt,  status, userId } = data;        

            // Create order
            const order = await Order.create({
                ...data,
            });
            console.log("Order created:", order.toJSON());
            return order;
        } catch (err: any) {
            console.error("Error creating order:", err.message || err);
            throw err;
        }
    }
}

export default new OrderService();