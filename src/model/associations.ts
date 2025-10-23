import Category from "./category";
import Product from "./product";

//assciation table between product and category 
export const setupAssociations = () => {
  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
};
