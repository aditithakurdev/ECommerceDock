import Category from "../../model/category";
import { ErrorMessages } from "../../utils/enum/errorMessages";

class CategoryService {
  // Create category
  async createCategory(data: { name: string; description?: string }) {
    const category = await Category.create(data);
    return category;
    
  }

  // Get all categories (excluding soft-deleted)
  async getAllCategories() {
    return await Category.findAll({ where: { isDeleted: false } });
  }

  // Get single category by id
 async getCategoryById(id: string) {
    try {
      const category = await Category.findByPk(id);
      if (!category || category.isDeleted) return null;
      return category;
    } catch (err: any) {
      throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCategory(id: string, data: Partial<{ name: string; description: string }>) {
    try {
      const category = await Category.findByPk(id);
      if (!category || category.isDeleted) return null;
      return await category.update(data);
    } catch (err: any) {
      throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCategory(id: string) {
    try {
      const category = await Category.findByPk(id);
      if (!category || category.isDeleted) return null;
      category.isDeleted = true;
      return await category.save();
    } catch (err: any) {
      throw new Error(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }
}

export default new CategoryService();
