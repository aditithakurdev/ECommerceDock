import { Router } from "express";
import productController from "../controller/productController/productController";

const productRouter = Router();

productRouter.post("/create", productController.createProduct);
productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getProductById);
productRouter.patch("/:id", productController.updateProduct);
productRouter.delete("/:id", productController.deleteProduct);

export default productRouter;
