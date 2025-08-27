import Category from "./category";
import Product from "./product";


export const setupAssociations = () => {
  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
};
