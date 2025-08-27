import { Op } from "sequelize";
import Product from "../../model/product";
import Category from "../../model/category";

class ProductService {
   async createProduct(data: { name: string; categoryId: string; description?: string; price?: number; stock?: number }) {
    try {
      const product = await Product.create({
        name: data.name,
        categoryId: data.categoryId,   // directly use from payload
        description: data.description ?? null,
        price: data.price ?? 0,
        stock: data.stock ?? 0,
      });
      return product;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

 async getAllProducts(query: any) {
  const { name, page = 1, limit = 10 } = query;

  const offset = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (name) {
    where.name = { [Op.like]: `%${name}%` };
  }

  const { rows, count } = await Product.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Category,
        as: "category", 
        attributes: ["id", "name"], 
      },
    ],
  });

  return {
    data: rows,
    total: count,
    page: Number(page),
    pageSize: Number(limit),
    totalPages: Math.ceil(count / Number(limit)),
  };
}
  async getProductById(id: string) {
    try {
      return await Product.findByPk(id);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateProduct(id: string, data: any) {
    try {
      const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.update(data);
    } catch (error: any) {
      throw new Error(error.message);
    }
    
  }

  async deleteProduct(id: string) {
  try {
    const product = await Product.findByPk(id);
    if (!product) return null;

    // Soft delete: just update the isDeleted flag
    product.isDeleted = true;
    await product.save();

    return product;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

}

export default new ProductService();