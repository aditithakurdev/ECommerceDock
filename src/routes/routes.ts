import { Router } from 'express';
import userRouter from '../routes/user';
import orderRouter from '../routes/order';
import productRouter from '../routes/product';
import categoryRouter from '../routes/category';
import InventoryController from '../routes/inventory';

const router = Router();

router.use('/users', userRouter);
router.use('/orders', orderRouter);
router.use('/products', productRouter);
router.use('/categories', categoryRouter); 
router.use('/inventory', InventoryController)

export default router;
