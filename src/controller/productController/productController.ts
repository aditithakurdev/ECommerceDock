import { Request, Response } from "express";
import productService from "../../service/productService/productService";
import { ErrorMessages } from "../../utils/enum/errorMessages";
import { ResponseMessages } from "../../utils/enum/responseMessages";
import { StatusCodeEnum } from "../../utils/enum/ststusCodeEnum";



class ProductController {
    // Create a new Product
   async createProduct(req: Request, res: Response) {
    try {
      const product = await productService.createProduct(req.body);
        res.status(StatusCodeEnum.OK).json({
            message:ResponseMessages.PRODUCT_CREATED,
            data: product
        });
   } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      if (!product) return res.status(404).json({ message: ErrorMessages.PRODUCT_NOT_FOUND});
      res.json(product);
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
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
      if (!product) return res.status(404).json({ message: ErrorMessages.PRODUCT_NOT_FOUND});
      res.json(product);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.deleteProduct(id);
      if (!product) return res.status(404).json({ message: ErrorMessages.PRODUCT_NOT_FOUND});
      res.json({ message: ResponseMessages.PPRODUCT_DELETED });
   } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        message:ErrorMessages.INTERNAL_SERVER_ERROR,
        error: err.message
      });
    }
  }


}
    
export default new ProductController();
