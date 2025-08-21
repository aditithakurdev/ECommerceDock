// import userRouter from "./user";
// import orderRouter from "./order";
// import productRouter from "./product";
// import categoryRouter from "./category";

// export { userRouter, orderRouter, productRouter, categoryRouter };


import { Router } from 'express';
import userRouter from '../routes/user';
import orderRouter from '../routes/order';
import productRouter from '../routes/product';
import categoryRouter from '../routes/category';

const router = Router();

router.use('/users', userRouter);
router.use('/orders', orderRouter);
router.use('/products', productRouter);
router.use('/categories', categoryRouter); 

export default router;
