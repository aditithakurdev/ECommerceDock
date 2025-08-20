import { Op } from "sequelize";
import Product from "../../model/product";

class ProductService {
    async createProduct(data: any) {
    try {
      return await Product.create(data);
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
      await product.destroy();
      return product;

    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default new ProductService();