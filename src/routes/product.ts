import { Router } from "express";
import productController from "../controller/productController/productController";

const router = Router();

router.post("/create", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
