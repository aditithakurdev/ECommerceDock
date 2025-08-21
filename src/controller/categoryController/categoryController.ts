import { Request, Response } from 'express';
import categoryService from '../../service/categoryService/categoryService';
class CategoryController {
  // Create a new category
  async createCategory(req: Request, res: Response) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json(category);
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
      const category = await categoryService.getCategoryById(Number(req.params.id));
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.status(200).json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update category
  async updateCategory(req: Request, res: Response) {
    try {
      const category = await categoryService.updateCategory(Number(req.params.id), req.body);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.status(200).json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Soft delete category
  async deleteCategory(req: Request, res: Response) {
    try {
      const category = await categoryService.deleteCategory(Number(req.params.id));
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new CategoryController();
