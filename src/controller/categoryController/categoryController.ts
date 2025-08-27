import { Request, Response } from 'express';
import categoryService from '../../service/categoryService/categoryService';
import { ErrorMessages } from '../../utils/enum/errorMessages';
import { ResponseMessages } from '../../utils/enum/responseMessages';
class CategoryController {
  // Create a new category
  async createCategory(req: Request, res: Response) {
    try {
      const category = await categoryService.createCategory(req.body);
       return res.status(201).json({ success: true,data:category });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get all categories
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get category by ID
  async getCategoryById(req: Request, res: Response) {
    try {
      const {id} = req.params;
      const category = await categoryService.getCategoryById(id);;
      if (!category) return res.status(404).json({ message: ErrorMessages.CATEGORY_NOT_FOUND});
      res.status(200).json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update category
  async updateCategory(req: Request, res: Response) {
    try {
       const {id} = req.params;
      const category = await categoryService.updateCategory(id, req.body);;
      if (!category) return res.status(404).json({ message: ErrorMessages.CATEGORY_NOT_FOUND});
      res.status(200).json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Soft delete category
  async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await categoryService.deleteCategory(id);
      if (!category) return res.status(404).json({ message: ErrorMessages.CATEGORY_NOT_FOUND });
      res.status(200).json({ message: ResponseMessages.CATEGORY_DELETED });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new CategoryController();
