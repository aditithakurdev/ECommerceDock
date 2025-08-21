import Category from "../../model/category";

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
  async getCategoryById(id: number) {
    return await Category.findOne({ where: { id, isDeleted: false } });
  }

  // Update category
  async updateCategory(id: number, data: { name?: string; description?: string }) {
    const category = await Category.findByPk(id);
    if (!category || category.isDeleted) return null;
    await category.update(data);
    return category;
  }

  // Soft delete category
  async deleteCategory(id: number) {
    const category = await Category.findByPk(id);
    if (!category || category.isDeleted) return null;
    category.isDeleted = true;
    await category.save();
    return category;
  }
}

export default new CategoryService();
