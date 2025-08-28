import { Router } from 'express';
import userRouter from '../routes/user';
import orderRouter from '../routes/order';
import productRouter from '../routes/product';
import categoryRouter from '../routes/category';
import inventoryRouter from '../routes/inventory';
import paymentRouter from '../routes/payment'

const router = Router();

router.use('/users', userRouter);
router.use('/orders', orderRouter);
router.use('/products', productRouter);
router.use('/categories', categoryRouter); 
router.use('/inventory', inventoryRouter)
router.use("/payment", paymentRouter);

export default router;
