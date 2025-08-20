import Product from "../../model/product";

class ProductService {
    async createProduct(data: any) {
    return await Product.create(data);
  }

  async getAllProducts() {
    return await Product.findAll();
  }

  async getProductById(id: string) {
    return await Product.findByPk(id);
  }

  async updateProduct(id: string, data: any) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.update(data);
  }

  async deleteProduct(id: string) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return product;
  }
}

export default new ProductService();