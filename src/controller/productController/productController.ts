import { Request, Response } from "express";
import productService from "../../service/productService/productService";
import { ErrorMessages } from "../../utils/enum/errorMessages";
import { ResponseMessages } from "../../utils/enum/responseMessages";

class ProductController {
    // Create a new Product
  async createProduct(req: Request, res: Response) {
    try {
      const result = await productService.createProduct(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  }

  async getAllProducts(req: Request, res: Response) {
  try {
      const result = await productService.getAllProducts(req.query);
      res.json(result);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  };

  async getProductById(req: Request, res: Response) {
    try {
      const result = await productService.getProductById(req.params.id);
      if (!result) return res.status(404).json({ message: ErrorMessages.PRODUCT_NOT_FOUND });
      res.json(result);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  }
  async updateProduct(req: Request, res: Response) {
    try {
      const result = await productService.updateProduct(req.params.id, req.body);
      if (!result) return res.status(404).json({ message: ErrorMessages.PRODUCT_NOT_FOUND });
      res.json(result);
   } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  };

  async deleteProduct(req: Request, res: Response) {
     try {
      const result = await productService.deleteProduct(req.params.id);
      if (!result) return res.status(404).json({ message: ErrorMessages.PRODUCT_NOT_FOUND });
      res.json({ message: ResponseMessages.PRODUCT_DELETED });
   } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  };
}
    
export default new ProductController();
